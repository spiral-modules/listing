<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Spiral\Listing\Sorters;

use Spiral\Listing\Dependency;

class BinarySorter extends ComplexSorter
{
    /**
     * @param string $expression Expression or column
     * @param array|Dependency  $dependencies
     */
    public function __construct($expression, $dependencies = [])
    {
        parent::__construct(
            new UnarySorter([$expression => self::ASC], $dependencies),
            new UnarySorter([$expression => self::DESC], $dependencies)
        );
    }
}