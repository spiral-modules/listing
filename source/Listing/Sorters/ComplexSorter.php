<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */

namespace Spiral\Listing\Sorters;

use Spiral\Listing\DirectionalSorterInterface;
use Spiral\Listing\Exceptions\SorterException;
use Spiral\Listing\SorterInterface;

class ComplexSorter implements DirectionalSorterInterface
{
    /**
     * @var int
     */
    private $direction = self::ASC;

    /**
     * @var SorterInterface
     */
    private $ascSorter = null;

    /**
     * @var SorterInterface
     */
    private $descSorter = null;

    /**
     * @param SorterInterface $ascSorter
     * @param SorterInterface $descSorter
     */
    public function __construct(SorterInterface $ascSorter, SorterInterface $descSorter)
    {
        $this->ascSorter = $ascSorter;
        $this->descSorter = $descSorter;
    }

    /**
     * {@inheritdoc}
     */
    public function apply($selector)
    {
        if ($this->direction == self::ASC) {
            return $this->ascSorter->apply($selector);
        }

        return $this->descSorter->apply($selector);
    }

    /**
     * Get sorter direction if any
     *
     * @return int
     */
    public function getDirection()
    {
        return $this->direction;
    }

    /**
     * {@inheritdoc}
     */
    public function withDirection($direction)
    {
        if (!in_array($direction, [self::ASC, self::DESC])) {
            throw new SorterException("Invalid sorting direction '{$direction}'");
        }

        $sorter = clone $this;
        $sorter->direction = $direction;

        return $sorter;
    }
}