<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Valentin, Anton Titov (Wolfy-J)
 */
namespace Spiral\Listing;

use Spiral\Listing\Exceptions\FilterException;
use Spiral\ODM\Entities\DocumentSelector;
use Spiral\ORM\Entities\RecordSelector;

/**
 * Performs selector filtering.
 */
interface FilterInterface
{
    /**
     * Apply filter to a given selector
     *
     * @param RecordSelector|DocumentSelector $selector
     * @return RecordSelector|DocumentSelector Must return altered listing.
     */
    public function apply($selector);

    /**
     * If filter value can be applied using provided value (internal validation must be performed)
     *
     * @param $value
     * @return mixed
     */
    public function isApplicable($value);

    /**
     * Set filter value, must return new filter instance
     *
     * @param mixed $value
     * @return self
     * @throws FilterException
     */
    public function withValue($value);

    /**
     * Get active filter value (if any)
     *
     * @return string
     */
    public function getValue();
}