<?php
/**
 * Spiral Framework, SpiralScout LLC.
 *
 * @package   spiralFramework
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2011
 */

namespace TestApplication\Database\ODM;

use Spiral\ODM\DocumentEntity;

/**
 * Class User
 *
 * @package TestApplication\Database
 *
 * @property int    $age
 * @property string $hobby
 */
class Profile extends DocumentEntity
{
    const HOBBY_SPORTS  = 'sports';
    const HOBBY_READING = 'reading';

    const HOBBIES = [self::HOBBY_SPORTS, self::HOBBY_READING];

    const SCHEMA = [
        'age'   => 'int',
        'hobby' => 'string',
    ];

    const SECURED = [];
}