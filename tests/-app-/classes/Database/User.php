<?php
/**
 * Spiral Framework, SpiralScout LLC.
 *
 * @package   spiralFramework
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2011
 */

namespace TestApplication\Database;

use Spiral\Auth\PasswordAwareInterface;
use Spiral\ORM\Record;

/**
 * Class User
 *
 * @package TestApplication\Database
 *
 * @property int    $id
 * @property string $first_name
 * @property string $last_name
 * @property string $gender
 */
class User extends Record
{
    const GENDER_MALE   = 'male';
    const GENDER_FEMALE = 'female';

    const GENDERS = [self::GENDER_MALE, self::GENDER_FEMALE];

    const SCHEMA = [
        'id'         => 'primary',
        'first_name' => 'string',
        'last_name'  => 'string',
        'gender'     => 'enum(male,female)',
    ];

    const SECURED = [];
}