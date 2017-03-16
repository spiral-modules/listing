<?php
/**
 * Spiral Framework, SpiralScout LLC.
 *
 * @package   spiralFramework
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2011
 */

namespace TestApplication\Database\ORM\Sources;

use Spiral\ORM\Entities\RecordSource;
use TestApplication\Database\ORM\User;

class UserSource extends RecordSource
{
    const RECORD = User::class;
}