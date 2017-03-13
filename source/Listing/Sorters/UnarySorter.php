<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Spiral\Listing\Sorters;

use Spiral\Database\Builders\SelectQuery;
use Spiral\Listing\Dependency;
use Spiral\Listing\Exceptions\SorterException;
use Spiral\Listing\Prototypes\DependedModificator;
use Spiral\Listing\SorterInterface;
use Spiral\Listing\Traits\SelectorValidationTrait;
use Spiral\ODM\Entities\DocumentSelector;
use Spiral\ORM\Entities\RecordSelector;

/**
 * Simple sorter with ability to specify sorting fields/columns in array form. Compatible with
 * both ORM and ODM selectors.
 */
class UnarySorter extends DependedModificator implements SorterInterface
{
    use SelectorValidationTrait;

    /**
     * Expression in a form or [column => direction, ...]
     *
     * @var array
     */
    private $sortBy = [];

    /**
     * @param array            $sortBy
     * @param array|Dependency $dependencies
     */
    public function __construct(array $sortBy, $dependencies = [])
    {
        parent::__construct($dependencies);
        $this->sortBy = $sortBy;
    }

    /**
     * {@inheritdoc}
     */
    public function apply($selector)
    {
        $this->validateSelector($selector);

        if ($selector instanceof RecordSelector) {
            $selector = $this->loadDependencies($selector);

            foreach ($this->sortBy as $expression => $direction) {
                $selector = $selector->orderBy(
                    $expression,
                    $direction == self::ASC ? SelectQuery::SORT_ASC : SelectQuery::SORT_DESC
                );
            }

            return $selector;
        }

        if ($selector instanceof DocumentSelector) {
            return $selector->sortBy($this->sortBy);
        }

        throw new SorterException("Invalid selector instance");
    }
}
