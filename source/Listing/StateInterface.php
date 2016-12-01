<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */

namespace Spiral\Listing;

/**
 * State interface required to represent every filter setting and name related to a specific filter.
 */
interface StateInterface
{
    /**
     * State must declared to listing if it's active, when state is not active listing is allowed
     * to use default state.
     *
     * @return bool
     */
    public function isActive();

    /**
     * Isolate state using given namespace.
     *
     * @param string $namespace
     * @return self
     */
    public function withNamespace($namespace);

    /**
     * Get active state namespace.
     *
     * @return string
     */
    public function getNamespace();

    /**
     * Name of every activated filter
     *
     * @return array
     */
    public function activeFilters();

    /**
     * Get value by filter name
     *
     * @param string $filter
     * @param mixed  $default
     * @return mixed
     */
    public function getValue($filter, $default = null);

    /**
     * Name of active sorter
     *
     * @return string|null
     */
    public function activeSorter();

    /**
     * Direction of active sorter
     *
     * @return int
     */
    public function sortDirection();

    /**
     * Current page number
     *
     * @return int
     */
    public function getPage();

    /**
     * Get user specified limit setting
     *
     * @return int
     */
    public function getLimit();
}