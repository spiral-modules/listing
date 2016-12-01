<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Spiral\Listing\Bootloaders;

use Spiral\Core\Bootloaders\Bootloader;
use Spiral\Listing\InputState;
use Spiral\Listing\StateInterface;

class ListingsBootloader extends Bootloader
{
    protected $bindings = [
        StateInterface::class => InputState::class,
    ];
}