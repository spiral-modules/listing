<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Valentin, Anton Titov (Wolfy-J)
 */

namespace Spiral\Listing;

/**
 * Specifies required relations to be loaded for a listing sorter or filter (ORM only)
 */
final class Dependency
{
    /**
     * @var
     */
    private $relation;

    /**
     * @var array
     */
    private $options;

    /**
     * Constructing.
     *
     * @param string $relation
     * @param array  $options
     */
    public function __construct($relation, array $options = [])
    {
        $this->relation = $relation;
        $this->options = $options;
    }

    /**
     * Get relation to be loaded
     *
     * @return mixed
     */
    public function getRelation()
    {
        return $this->relation;
    }

    /**
     * Get options for pre-loaded relation
     *
     * @return array
     */
    public function getOptions()
    {
        return $this->options;
    }
}