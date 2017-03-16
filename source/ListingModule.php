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
        $registrator->configure('tokenizer', 'directories', 'spiral/listing', [
            "directory('libraries') . 'spiral/listing',",
        ]);

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
            __DIR__ . '/../resources/scripts/',
            $directories->directory('public') . 'resources/scripts',
            PublisherInterface::OVERWRITE
        );
    }
}