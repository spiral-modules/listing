<?php
/**
 * Spiral Framework, SpiralScout LLC.
 *
 * @package   spiralFramework
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2011
 */

namespace TestApplication\Database\ODM;

use Spiral\ODM\Document;

/**
 * Class User
 *
 * @package TestApplication\Database
 *
 * @property int     $_id
 * @property string  $first_name
 * @property string  $last_name
 * @property string  $gender
 * @property Profile $profile
 */
class User extends Document
{
    const GENDER_MALE   = 'male';
    const GENDER_FEMALE = 'female';

    const GENDERS = [self::GENDER_MALE, self::GENDER_FEMALE];

    const SCHEMA = [
        '_id'        => 'MongoId',
        'first_name' => 'string',
        'last_name'  => 'string',
        'gender'     => 'string',
        'profile'    => Profile::class,
    ];

    const SECURED = [];
}