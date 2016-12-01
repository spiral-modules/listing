<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Valentin, Anton Titov (Wolfy-J)
 */
namespace Spiral\Listing\Filters;

use Spiral\Listing\Exceptions\FilterException;
use Spiral\Listing\FilterInterface;
use Spiral\Listing\Prototypes\DependedModificator;
use Spiral\Listing\Traits\SelectorValidationTrait;
use Spiral\ODM\Entities\DocumentSelector;
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

            return $selector->where(
                $this->whereClause($selector)
            );
        }

        if ($selector instanceof DocumentSelector) {
            return $selector->where(
                $this->whereClause($selector)
            );
        }

        throw new FilterException("Invalid selector instance");
    }

    /**
     * Get where statement for a given selector type
     *
     * @param RecordSelector|DocumentSelector
     * @return array
     */
    abstract protected function whereClause($selector);
}