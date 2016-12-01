<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Dmitry Mironov <superparabolic@gmail.com>
 */

namespace Spiral;


use Spiral\Core\DirectoriesInterface;
use Spiral\Modules\ModuleInterface;
use Spiral\Modules\PublisherInterface;
use Spiral\Modules\RegistratorInterface;

/**
 * Class ListingModule
 *
 * @package Spiral
 */
class ListingModule implements ModuleInterface
{
    /**
     * @inheritDoc
     */
    public function register(RegistratorInterface $registrator)
    {
        $registrator->configure('views', 'namespaces.spiral', 'spiral/listing', [
            "directory('libraries') . 'spiral/listing/source/views/',",
        ]);
    }

    /**
     * @inheritDoc
     */
    public function publish(PublisherInterface $publisher, DirectoriesInterface $directories)
    {
        $publisher->publishDirectory(
            __DIR__ . '/../resources',                        //js, css
            $directories->directory('public') . 'resources',  //Expected directory in webroot
            PublisherInterface::OVERWRITE                     //We can safely overwrite resources
        );
    }
}