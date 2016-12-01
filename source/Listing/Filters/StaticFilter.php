<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Valentin, Anton Titov (Wolfy-J)
 */

namespace Spiral\Listing\Filters;

use Spiral\Listing\Dependency;
use Spiral\Listing\FilterInterface;

/**
 * Valueless filter. Works both for ORM and ODM selectors.
 */
class StaticFilter extends AbstractFilter implements FilterInterface
{
    /**
     * @var array
     */
    private $whereClause = [];

    /**
     * @param array                   $whereClause
     * @param Dependency|Dependency[] $dependencies
     */
    public function __construct(array $whereClause, $dependencies = [])
    {
        parent::__construct($dependencies);
        $this->whereClause = $whereClause;
    }

    /**
     * {@inheritdoc}
     */
    public function isApplicable($value)
    {
        return true;
    }

    /**
     * {@inheritdoc}
     */
    public function withValue($value)
    {
        return clone $this;
    }

    /**
     * {@inheritdoc}
     */
    public function getValue()
    {
        return null;
    }

    /**
     * {@inheritdoc}
     */
    protected function whereClause($selector)
    {
        /*
         * This is static filter, we are allowed to do so.
         */
        return $this->whereClause;
    }
}