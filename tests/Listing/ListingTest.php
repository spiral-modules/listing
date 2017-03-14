<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Dmitry Mironov
 */

namespace Spiral\Tests\Listing;


use Faker;
use Spiral\Http\Request\InputInterface;
use Spiral\Listing\Filters\SearchFilter;
use Spiral\Listing\Filters\ValueFilter;
use Spiral\Listing\InputState;
use Spiral\Listing\Listing;
use Spiral\Listing\ListingSerializer;
use Spiral\Listing\Sorters\BinarySorter;
use Spiral\Listing\StaticState;
use Spiral\Tests\BaseTest;
use TestApplication\Database\Sources\UserSource;
use TestApplication\Database\User;

class ListingTest extends BaseTest
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
            $this->source
                ->create([
                    'first_name' => $faker->firstName,
                    'last_name'  => $faker->lastName,
                    'gender'     => $faker->randomElement(User::GENDERS),
                ])
                ->save();
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

        $listingItems = $listing->getSelector()->fetchAll();
        $dbItems = $this->source->find($selector['where'])
            ->offset($selector['offset'])->limit($selector['limit'])
            ->fetchAll();

        $this->assertSame($dbItems, $listingItems);
    }

    public function provider()
    {
        return [

            'no input' => [
                ['namespace' => '', 'data' => []],
                ['page' => 1, 'limit' => 25, 'namespace' => 'users'],
                ['where' => [], 'offset' => 0, 'limit' => 25],
            ],

            'custom page' => [
                [
                    'namespace' => self::LISTING_NAMESPACE,
                    'data'      => [
                        InputState::PAGE => 3,
                    ],
                ],
                ['page' => 3, 'limit' => 25, 'namespace' => self::LISTING_NAMESPACE],
                ['where' => [], 'offset' => 50, 'limit' => 25],
            ],

            'males third page' => [
                [
                    'namespace' => self::LISTING_NAMESPACE,
                    'data' => [
                        InputState::PAGE => 3,
                        InputState::FILTERS => ['gender'],
                        InputState::FILTER_VALUES => ['gender' => 'male'],
                    ],
                ],
                ['page' => 3, 'limit' => 25, 'namespace' => self::LISTING_NAMESPACE],
                ['where' => ['gender' => 'male'], 'offset' => 50, 'limit' => 25],
            ],
        ];
    }

    private function createListing(InputInterface $input): Listing
    {
        $state = new InputState($input);
        $selector = $this->source->find();
        $listing = new Listing($selector, $state);

        $listing->addSorter('id', new BinarySorter('id'));
        $listing->addSorter('first_name', new BinarySorter('first_name'));
        $listing->addSorter('last_name', new BinarySorter('last_name'));
        $listing->addSorter('gender', new BinarySorter('gender'));

        $listing->addFilter('gender', new ValueFilter('gender'));
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