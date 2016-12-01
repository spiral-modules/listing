<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Spiral\Listing;

use Spiral\Http\Request\InputInterface;
use Spiral\Listing\DirectionalSorterInterface as DirectionalSorter;

/**
 * State depended on input source.
 */
class InputState implements StateInterface
{
    const FILTERS       = 'filters';
    const FILTER_VALUES = 'values';
    const SORTER        = 'sortBy';
    const DIRECTION     = 'order';
    const PAGE          = 'page';
    const LIMIT         = 'limit';

    /**
     * @var string
     */
    private $namespace = '';

    /**
     * @var InputInterface
     */
    private $input = null;

    /**
     * @var string
     */
    private $source = 'query';

    /**
     * @param InputInterface $input
     * @param string         $source
     * @param string         $namespace
     */
    public function __construct(InputInterface $input, $source = 'query', $namespace = '')
    {
        $this->input = $input;
        $this->namespace = $namespace;
    }

    /**
     * @param string $source
     * @return InputState
     */
    public function withSource($source)
    {
        $state = clone $this;
        $state->source = $source;

        return $state;
    }

    /**
     * @return string
     */
    public function getSource()
    {
        return $this->source;
    }

    /**
     * {@inheritdoc}
     */
    public function isActive()
    {
        if (empty($this->source)) {
            return false;
        }

        $input = $this->input->getValue($this->source, "{$this->namespace}");

        return !empty($input);
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
        $filters = $this->input->getValue($this->source, "{$this->namespace}." . self::FILTERS);

        if (empty($filters) || !is_array($filters)) {
            $filters = [];
        }

        return array_values($filters);
    }

    /**
     * {@inheritdoc}
     */
    public function getValue($filter, $default = null)
    {
        $value = $this->input->getValue(
            $this->source,
            "{$this->namespace}." . self::FILTER_VALUES . '.' . $filter
        );

        if (null == $value) {
            return $default;
        }

        return $value;
    }

    /**
     * {@inheritdoc}
     */
    public function activeSorter()
    {
        $sorter = $this->input->getValue($this->source, "{$this->namespace}." . self::SORTER);
        if (empty($sorter)) {
            $sorter = 'id';
        }

        return $sorter;
    }

    /**
     * {@inheritdoc}
     */
    public function sortDirection()
    {
        $direction = $this->input->getValue($this->source, "{$this->namespace}." . self::DIRECTION);

        if (strtolower($direction) == 'desc' || $direction == -1) {
            return DirectionalSorter::DESC;
        }

        return DirectionalSorter::ASC;
    }

    /**
     * {@inheritdoc}
     */
    public function getPage()
    {
        return (int)$this->input->getValue($this->source, "{$this->namespace}." . self::PAGE);
    }

    /**
     * {@inheritdoc}
     */
    public function getLimit()
    {
        return (int)$this->input->getValue($this->source, "{$this->namespace}." . self::LIMIT);
    }
}