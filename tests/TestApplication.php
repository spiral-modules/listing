<?php
/**
 * spiral
 *
 * @author    Wolfy-J
 */

namespace Spiral\Tests;

use Interop\Container\ContainerInterface;
use Spiral\Auth\Bootloaders\AuthBootloader;
use Spiral\Auth\Sources\UsernameSourceInterface;
use Spiral\Core\Bootloaders\SpiralBindings;
use Spiral\Core\Core;
use Spiral\Http\Routing\ControllersRoute;
use TestApplication\Bootloaders\HttpBootloader;
use TestApplication\Database\Sources\UserSource;

/**
 * @property \Spiral\Core\MemoryInterface             $memory
 * @property \Spiral\Core\ContainerInterface          $container
 * @property \Spiral\Debug\LogsInterface              $logs
 * @property \Spiral\Http\HttpDispatcher              $http
 * @property \Spiral\Console\ConsoleDispatcher        $console
 * @property \Spiral\Files\FilesInterface             $files
 * @property \Spiral\Tokenizer\TokenizerInterface     $tokenizer
 * @property \Spiral\Tokenizer\ClassesInterface       $locator
 * @property \Spiral\Tokenizer\InvocationsInterface   $invocationLocator
 * @property \Spiral\Views\ViewManager                $views
 * @property \Spiral\Translator\Translator            $translator
 * @property \Spiral\Database\DatabaseManager         $dbal
 * @property \Spiral\ORM\ORM                          $orm
 * @property \Spiral\Encrypter\EncrypterInterface     $encrypter
 * @property \Spiral\Database\Entities\Database       $db
 * @property \Spiral\Http\Cookies\CookieQueue         $cookies
 * @property \Spiral\Http\Routing\RouterInterface     $router
 * @property \Spiral\Pagination\PaginatorsInterface   $paginators
 * @property \Psr\Http\Message\ServerRequestInterface $request
 * @property \Spiral\Http\Request\InputManager        $input
 * @property \Spiral\Http\Response\ResponseWrapper    $response
 * @property \Spiral\Http\Routing\RouteInterface      $route
 * @property \Spiral\Security\PermissionsInterface    $permissions
 * @property \Spiral\Security\RulesInterface          $rules
 * @property \Spiral\Security\ActorInterface          $actor
 */
class TestApplication extends Core
{
    const LOAD = [
        SpiralBindings::class,
        HttpBootloader::class
    ];

    protected function bootstrap()
    {
    }

    /**
     * @param ContainerInterface $container
     *
     * @return ContainerInterface|null
     */
    public static function shareContainer(ContainerInterface $container = null)
    {
        return self::staticContainer($container);
    }
}