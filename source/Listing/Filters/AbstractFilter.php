<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Valentin, Anton Titov (Wolfy-J)
 */
namespace Spiral\Listing\Filters;

use Spiral\Listing\FilterInterface;
use Spiral\Listing\Prototypes\DependedModificator;
use Spiral\Listing\Traits\SelectorValidationTrait;
use Spiral\ORM\Entities\RecordSelector;

abstract class AbstractFilter extends DependedModificator implements FilterInterface
{
    use SelectorValidationTrait;

    /**
     * {@inheritdoc}
     */
    public function apply($selector)
    {
        $this->validateSelector($selector);

        if ($selector instanceof RecordSelector) {
            $selector = $this->loadDependencies($selector);

            return $selector->where($this->whereClause($selector));
        }


        return $selector->where($this->whereClause($selector));
    }

    /**
     * Get where statement for a given selector type
     *
     * @param RecordSelector|DocumentSelector
     * @return array
     */
    abstract protected function whereClause($selector);
}