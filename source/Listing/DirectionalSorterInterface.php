<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Valentin, Anton Titov (Wolfy-J)
 */

namespace Spiral\Listing;

use Spiral\Listing\Exceptions\SorterException;

interface DirectionalSorterInterface extends SorterInterface
{
    /**
     * Get sorter direction if any
     *
     * @return int
     */
    public function getDirection();

    /**
     * Create version of sorter with new direction
     *
     * @param int $direction
     * @return self
     * @throws SorterException
     */
    public function withDirection($direction);
}