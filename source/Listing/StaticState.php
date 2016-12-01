<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Spiral\Listing;

/**
 * Manually set state. Can be used to define default settings for listing as default state.
 */
class StaticState implements StateInterface
{
    /**
     * Static state does not have namespace by default.
     *
     * @var string
     */
    private $namespace = '';

    /**
     * Default sorter.
     *
     * @var string|null
     */
    private $sorter = null;

    /**
     * Default sorting direction.
     *
     * @var int
     */
    private $direction = SorterInterface::ASC;

    /**
     * Default limit.
     *
     * @var int
     */
    private $limit = 25;

    /**
     * Default set of filters associated with their values.
     *
     * @var array
     */
    private $filters = [];

    /**
     * @param string $sorter        Default sorter
     * @param array  $filters       Default set of filters in a form [filter => value]
     * @param int    $sortDirection Default sorter direction, ASC by default
     * @param int    $limit         Default limit, 25 by default
     */
    public function __construct(
        $sorter,
        array $filters = [],
        $sortDirection = SorterInterface::ASC,
        $limit = 25
    ) {
        $this->sorter = $sorter;
        $this->direction = $sortDirection;
        $this->filters = $filters;
        $this->limit = $limit;
    }

    /**
     * {@inheritdoc}
     */
    public function isActive()
    {
        //Static state is always active
        return true;
    }

    /**
     * {@inheritdoc}
     */
    public function withNamespace($namespace)
    {
        $state = clone $this;
        $state->namespace = $namespace;

        return $state;
    }

    /**
     * {@inheritdoc}
     */
    public function getNamespace()
    {
        return $this->namespace;
    }

    /**
     * {@inheritdoc}
     */
    public function activeFilters()
    {
        return array_keys($this->filters);
    }

    /**
     * {@inheritdoc}
     */
    public function getValue($filter, $default = null)
    {
        if (array_key_exists($filter, $this->filters)) {
            return $this->filters[$filter];
        }

        return $default;
    }

    /**
     * {@inheritdoc}
     */
    public function activeSorter()
    {
        return $this->sorter;
    }

    /**
     * {@inheritdoc}
     */
    public function sortDirection()
    {
        return $this->direction;
    }

    /**
     * {@inheritdoc}
     */
    public function getPage()
    {
        return 1;
    }

    /**
     * {@inheritdoc}
     */
    public function getLimit()
    {
        return $this->limit;
    }
}