<?php

namespace Spiral\Listing\Filters;

use Spiral\Http\Exceptions\FilterException;
use Spiral\Listing\FilterInterface;
use Spiral\ODM\Entities\DocumentSelector;
use Spiral\ORM\Entities\RecordSelector;

class ComplexFilter implements FilterInterface
{
    /**
     * @var FilterInterface[]
     */
    private $filters = [];

    /**
     * @var string
     */
    private $filter;

    /**
     * ComplexFilter constructor.
     *
     * @param array $filters
     */
    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    /**
     * {@inheritdoc}
     */
    public function isApplicable($value)
    {
        return array_key_exists($value, $this->filters);
    }

    /**
     * {@inheritdoc}
     */
    public function withValue($value)
    {
        $value = trim((string)$value);

        if (!$this->isApplicable($value)) {
            throw new FilterException("Invalid filter value, '" . $value . "' given");
        }

        $filter = clone $this;
        $filter->filter = $value;

        return $filter;
    }

    /**
     * {@inheritdoc}
     */
    public function getValue()
    {
        return strtolower($this->filter);
    }

    /**
     * @param DocumentSelector|RecordSelector $selector
     * @return $this|DocumentSelector|RecordSelector
     */
    public function apply($selector)
    {
        /** @var FilterInterface $filter */
        $filter = $this->filters[$this->filter];

        return $filter->apply($selector);
    }
}
