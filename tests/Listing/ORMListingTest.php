<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Dmitry Mironov
 */

namespace Spiral\Tests\Listing;


use Faker;
use Spiral\Database\Builders\SelectQuery;
use Spiral\Http\Request\InputInterface;
use Spiral\Listing\Dependency;
use Spiral\Listing\Filters\SearchFilter;
use Spiral\Listing\Filters\ValueFilter;
use Spiral\Listing\InputState;
use Spiral\Listing\Listing;
use Spiral\Listing\ListingSerializer;
use Spiral\Listing\Sorters\BinarySorter;
use Spiral\Listing\StaticState;
use Spiral\Tests\BaseTest;
use TestApplication\Database\ORM\Profile;
use TestApplication\Database\ORM\Sources\UserSource;
use TestApplication\Database\ORM\User;

class ORMListingTest extends BaseTest
{
    const FAKER_SEED        = 6610;
    const LISTING_NAMESPACE = 'users';

    /**
     * @var UserSource
     */
    private $source;

    public function setUp()
    {
        parent::setUp();

        $this->source = $this->container->get(UserSource::class);
        $faker = Faker\Factory::create();
        $faker->seed(self::FAKER_SEED);

        for ($i = 0; $i < 500; $i++) {
            $user = $this->source->create([
                'first_name' => $faker->firstName,
                'last_name'  => $faker->lastName,
                'gender'     => $faker->randomElement(User::GENDERS),
            ]);

            $user->profile->setFields([
                'age'   => $faker->randomNumber(),
                'hobby' => $faker->randomElement(Profile::HOBBIES),
            ]);

            $user->save();
        }
    }

    /**
     * @param array $input
     * @param array $state
     * @param array $selector
     *
     * @dataProvider provider
     */
    public function testConcreteListing(array $input, array $state, array $selector)
    {
        $input = $this->createInput($input['namespace'], $input['data']);
        $listing = $this->createListing($input);

        $serializer = new ListingSerializer($listing, $listing->getSelector());
        $configuration = $serializer->toArray();
        $pagination = $configuration['pagination'];

        $this->assertSame($state['page'], $pagination['page']);
        $this->assertSame($state['limit'], $pagination['limit']);
        $this->assertSame($state['namespace'], $configuration['namespace']);

        $listingItems = $listing->getSelector()->fetchData();
        $dbItems = $this->source->find($selector['where'])
            ->load('profile', ['alias' => 'user_profile'])
            ->orderBy($selector['orderBy'])
            ->offset($selector['offset'])->limit($selector['limit'])->fetchData();

        $this->assertSame($dbItems, $listingItems);
    }

    public function provider()
    {
        return [

            'no input' => [
                ['namespace' => '', 'data' => []],
                ['page' => 1, 'limit' => 25, 'namespace' => 'users'],
                [
                    'where'   => [],
                    'offset'  => 0,
                    'limit'   => 25,
                    'orderBy' => ['user.id' => SelectQuery::SORT_ASC],
                ],
            ],

            'custom page' => [
                [
                    'namespace' => self::LISTING_NAMESPACE,
                    'data'      => [
                        InputState::PAGE => 3,
                    ],
                ],
                ['page' => 3, 'limit' => 25, 'namespace' => self::LISTING_NAMESPACE],
                [
                    'where'   => [],
                    'offset'  => 50,
                    'limit'   => 25,
                    'orderBy' => ['user.id' => SelectQuery::SORT_ASC],
                ],
            ],

            'males third page' => [
                [
                    'namespace' => self::LISTING_NAMESPACE,
                    'data'      => [
                        InputState::PAGE          => 3,
                        InputState::FILTERS       => ['gender'],
                        InputState::FILTER_VALUES => ['gender' => User::GENDER_MALE],
                    ],
                ],
                ['page' => 3, 'limit' => 25, 'namespace' => self::LISTING_NAMESPACE],
                [
                    'where'   => ['gender' => User::GENDER_MALE],
                    'offset'  => 50,
                    'limit'   => 25,
                    'orderBy' => ['user.id' => SelectQuery::SORT_ASC],
                ],
            ],

            'sort by dependency' => [
                [
                    'namespace' => self::LISTING_NAMESPACE,
                    'data'      => [
                        InputState::PAGE      => 3,
                        InputState::SORTER    => 'hobby',
                        InputState::DIRECTION => -1,
                    ],
                ],
                ['page' => 3, 'limit' => 25, 'namespace' => self::LISTING_NAMESPACE],
                [
                    'where'   => [],
                    'offset'  => 50,
                    'limit'   => 25,
                    'orderBy' => ['user_profile.hobby' => SelectQuery::SORT_DESC],
                ],
            ],

            'filter by dependency' => [
                [
                    'namespace' => self::LISTING_NAMESPACE,
                    'data'      => [
                        InputState::PAGE          => 3,
                        InputState::FILTERS       => ['hobby'],
                        InputState::FILTER_VALUES => ['hobby' => Profile::HOBBY_SPORTS],
                    ],
                ],
                ['page' => 3, 'limit' => 25, 'namespace' => self::LISTING_NAMESPACE],
                [
                    'where'   => ['user_profile.hobby' => Profile::HOBBY_SPORTS],
                    'offset'  => 50,
                    'limit'   => 25,
                    'orderBy' => ['user.id' => SelectQuery::SORT_ASC],
                ],
            ],
        ];
    }

    private function createListing(InputInterface $input): Listing
    {
        $state = new InputState($input);
        $selector = $this->source->find()->load('profile');
        $listing = new Listing($selector, $state);

        $profile = new Dependency('profile');

        $listing->addSorter('id', new BinarySorter('user.id'));
        $listing->addSorter('first_name', new BinarySorter('first_name'));
        $listing->addSorter('last_name', new BinarySorter('last_name'));
        $listing->addSorter('gender', new BinarySorter('gender'));
        $listing->addSorter('hobby', new BinarySorter('user_profile.hobby', $profile));

        $listing->addFilter('gender', new ValueFilter('gender'));
        $listing->addFilter('hobby', new ValueFilter('user_profile.hobby', ValueFilter::TYPE_STRING,
            $profile));

        $listing->addFilter('search', new SearchFilter([
            'first_name' => SearchFilter::LIKE_STRING,
            'last_name'  => SearchFilter::LIKE_STRING,
        ]));

        $defaultState = new StaticState('id');
        $listing->setDefaultState($defaultState);
        $listing->setNamespace(self::LISTING_NAMESPACE);

        return $listing;
    }

    private function createInput(string $namespace, array $input = []): InputInterface
    {
        return new class($namespace, $input) implements InputInterface
        {
            private $input = [];

            public function __construct($namespace, array $input)
            {
                $this->input = [
                    'query' => [
                        $namespace => $input
                    ],
                ];
            }

            public function getValue(string $source, string $name = null)
            {
                $input = $this->input[$source] ?? [];

                if (empty($name)) {
                    return $input;
                }

                foreach (explode('.', $name) as $part) {
                    if (empty($input[$part])) {
                        return null;
                    }

                    $input = $input[$part];
                }

                return $input;
            }

            public function withPrefix(string $prefix): InputInterface
            {
                throw new \RuntimeException('Not implemented');
            }
        };
    }
}