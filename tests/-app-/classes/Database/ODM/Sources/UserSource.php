<?php
/**
 * Spiral Framework, SpiralScout LLC.
 *
 * @package   spiralFramework
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2011
 */

namespace TestApplication\Database\ODM\Sources;

use Spiral\ODM\Entities\DocumentSource;
use TestApplication\Database\ODM\User;

class UserSource extends DocumentSource
{
    const DOCUMENT = User::class;
}