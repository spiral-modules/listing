<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Valentin, Anton Titov (Wolfy-J)
 */
namespace Spiral\Listing;


use Spiral\Listing\Exceptions\InvalidSelectorException;
use Spiral\Listing\Exceptions\ListingException;
use Spiral\Listing\Exceptions\SorterException;
use Spiral\Listing\Traits\SelectorValidationTrait;
use Spiral\ODM\Entities\DocumentSelector;
use Spiral\ORM\Entities\RecordSelector;
use Spiral\Pagination\CountingPaginator;
use Spiral\Pagination\PaginableInterface;

class Listing implements \IteratorAggregate
{
    use SelectorValidationTrait;

    /**
     * @var RecordSelector|DocumentSelector
     */
    private $selector = null;

    /**
     * List of added filters.
     *
     * @var FilterInterface[]
     */
    private $filters = [];

    /**
     * List of added sorters.
     *
     * @var SorterInterface[]
     */
    private $sorters = [];

    /**
     * Available selection limits
     *
     * @var array
     */
    private $limits = [25, 50, 100];

    /**
     * Stores current listing state.
     *
     * @var StateInterface|null
     */
    private $state = null;

    /**
     * Default state to be used if primary state is not active
     *
     * @var StateInterface|null
     */
    private $defaultState = null;

    /**
     * @param RecordSelector|DocumentSelector|PaginableInterface $selector
     * @param StateInterface                                     $state
     *
     * @throws InvalidSelectorException
     */
    public function __construct(PaginableInterface $selector = null, StateInterface $state = null)
    {
        if (!empty($selector)) {
            $this->validateSelector($selector);
            $this->selector = $selector;
        }

        if (!empty($state)) {
            $this->setState($state);
        }
    }

    /**
     * Set active listing selector.
     *
     * @param RecordSelector|DocumentSelector|PaginableInterface $selector
     *
     * @return $this
     *
     * @throws InvalidSelectorException
     */
    public function setSelector(PaginableInterface $selector)
    {
        $this->validateSelector($selector);
        $this->selector = $selector;

        return $this;
    }

    /**
     * Get configured listing selector
     *
     * @return DocumentSelector|RecordSelector
     *
     * @throws ListingException
     */
    public function getSelector()
    {
        if (empty($this->selector)) {
            throw new ListingException("No selector were associated with listing instance");
        }

        return $this->configureSelector(clone $this->selector);
    }

    /**
     * @return DocumentSelector|RecordSelector
     *
     * @throws ListingException
     */
    public function getIterator()
    {
        return $this->getSelector();
    }

    /**
     * State responsible for listing settings management.
     *
     * @param StateInterface $state
     * @return $this
     */
    public function setState(StateInterface $state)
    {
        $this->state = clone $state;

        return $this;
    }

    /**
     * Listing state.
     *
     * @return StateInterface
     */
    public function getState()
    {
        return $this->state;
    }

    /**
     * Default state to be used if no active state can be found
     *
     * @param StateInterface $state
     * @return $this
     */
    public function setDefaultState(StateInterface $state)
    {
        $this->defaultState = clone $state;

        return $this;
    }

    /**
     * Default state, if any were set.
     *
     * @return null|StateInterface
     */
    public function getDefaultState()
    {
        return $this->defaultState;
    }

    /**
     * Active listing state (with fallback to default state)
     *
     * @return StateInterface
     * @throws ListingException
     */
    public function activeState()
    {
        if (!empty($this->state) && $this->state->isActive()) {
            return $this->getState();
        }

        if (!empty($this->defaultState) && $this->defaultState->isActive()) {
            //Falling back to default state
            return $this->getDefaultState();
        }

        if (empty($this->defaultState) && !empty($this->state)) {
            //No default state, so we have to use state anyway
            return $this->getState();
        }

        throw new ListingException("Unable to get active state, no active states are set");
    }

    /**
     * @return string
     */
    public function getNamespace()
    {
        return $this->state->getNamespace();
    }

    /**
     * Set listing isolation namespace
     *
     * @param string $namespace
     *
     * @return $this
     */
    public function setNamespace($namespace)
    {
        $this->state = $this->state->withNamespace($namespace);

        return $this;
    }

    /**
     * Set allowed pagination limits
     *
     * @param array $limits
     *
     * @return $this
     */
    public function setLimits(array $limits = [])
    {
        if (empty($limits)) {
            throw new ListingException("You must provide at least one limit option");
        }

        $this->limits = array_values($limits);

        return $this;
    }

    /**
     * Available limits.
     *
     * @return array
     */
    public function getLimits()
    {
        return $this->limits;
    }

    /**
     * Modify selector
     *
     * @param PaginableInterface|RecordSelector|DocumentSelector $selector
     *
     * @return RecordSelector|DocumentSelector Modified selector
     *
     * @throws InvalidSelectorException
     */
    public function configureSelector(PaginableInterface $selector)
    {
        if (empty($this->state)) {
            throw new ListingException("Unable to pagination without state being set");
        }

        $this->validateSelector($selector);

        foreach ($this->activeFilters() as $filter) {
            $selector = $filter->apply($selector);
        }

        if (!empty($sorter = $this->activeSorter())) {
            $selector = $sorter->apply($selector);
        }

        //Pagination
        $selector->setPaginator($this->createPaginator());

        return $selector;
    }

    /**
     * Add new selection filter
     *
     * @param string          $name
     * @param FilterInterface $filter
     *
     * @return self
     */
    final public function addFilter($name, FilterInterface $filter)
    {
        $this->filters[$name] = $filter;

        return $this;
    }

    /**
     * List of every associated filter.
     *
     * @return FilterInterface[]
     */
    public function getFilters()
    {
        return $this->filters;
    }

    /**
     * Attach new sorter to listing
     *
     * @param string          $name
     * @param SorterInterface $sorter
     *
     * @return self
     */
    final public function addSorter($name, SorterInterface $sorter)
    {
        $this->sorters[$name] = $sorter;

        return $this;
    }

    /**
     * Every available sorter
     *
     * @return SorterInterface[]
     */
    public function getSorters()
    {
        return $this->sorters;
    }

    /**
     * List of filters to be applied to current selection (named list)
     *
     * @return FilterInterface[]
     *
     * @throws ListingException
     */
    public function activeFilters()
    {
        $state = $this->activeState();

        $result = [];
        foreach ($state->activeFilters() as $name) {
            if (!isset($this->filters[$name])) {
                //No such filter
                continue;
            }

            $filter = $this->filters[$name];
            $value = $state->getValue($name);

            if ($filter->isApplicable($value)) {
                $result[$name] = $filter->withValue($value);
            }
        }

        return $result;
    }

    /**
     * Looking for active sorter name (normalized).
     *
     * @return string|null
     */
    public function getSorter()
    {
        $state = $this->activeState();

        if (!isset($this->sorters[$state->activeSorter()])) {
            //No such sorter
            return null;
        }

        return $state->activeSorter();
    }

    /**
     * Active sorter instance (if any)
     *
     * @return SorterInterface|null
     *
     * @throws SorterException
     */
    public function activeSorter()
    {
        if (empty($sorter = $this->getSorter())) {
            return null;
        }

        $sorter = $this->sorters[$sorter];

        if ($sorter instanceof DirectionalSorterInterface) {
            return $sorter->withDirection($this->activeState()->sortDirection());
        }

        return clone $sorter;
    }

    /**
     * Get paginator associated with current listing
     *
     * @return CountingPaginator
     */
    protected function createPaginator()
    {
        $paginator = new CountingPaginator($this->getLimit());
        $paginator->setPage($this->getPage());

        return $paginator;
    }

    /**
     * Get active pagination limit
     *
     * @return int
     */
    protected function getLimit()
    {
        $limit = $this->activeState()->getLimit();
        if (!in_array($limit, $this->limits)) {
            //We are using lowest limit by default
            return $this->limits[0];
        }

        return $limit;
    }

    /**
     * Get current page.
     *
     * @return int
     */
    protected function getPage()
    {
        return $this->activeState()->getPage();
    }
}