<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Valentin, Anton Titov (Wolfy-J)
 */
namespace Spiral\Listing;


use Spiral\Listing\Exceptions\SorterException;
use Spiral\ODM\Entities\DocumentSelector;
use Spiral\ORM\Entities\RecordSelector;

/**
 * Performs selector sorting.
 */
interface SorterInterface
{
    /**
     * Sorting directions.
     */
    const ASC  = 1;
    const DESC = -1;

    /**
     * Apply sorting to a given selector
     *
     * @param RecordSelector|DocumentSelector $selector
     * @return RecordSelector|DocumentSelector Must return altered listing.
     * @throws SorterException
     */
    public function apply($selector);
}