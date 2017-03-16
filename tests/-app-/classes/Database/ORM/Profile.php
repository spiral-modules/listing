<?php
/**
 * Spiral Framework, SpiralScout LLC.
 *
 * @package   spiralFramework
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2011
 */

namespace TestApplication\Database\ORM;

use Spiral\ORM\Record;

/**
 * Class User
 *
 * @package TestApplication\Database
 *
 * @property int    $id
 * @property int    $age
 * @property string $hobby
 */
class Profile extends Record
{
    const HOBBY_SPORTS  = 'sports';
    const HOBBY_READING = 'reading';

    const HOBBIES = [self::HOBBY_SPORTS, self::HOBBY_READING];

    const SCHEMA = [
        'id'   => 'primary',
        'age'   => 'int',
        'hobby' => 'enum(sports,reading)',
    ];

    const SECURED = [];
}