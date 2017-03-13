<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Spiral\Listing\Traits;

use Spiral\Listing\Exceptions\InvalidSelectorException;
use Spiral\ODM\Entities\DocumentSelector;
use Spiral\ORM\Entities\RecordSelector;
use Spiral\Pagination\PaginatorAwareInterface;

trait SelectorValidationTrait
{
    /**
     * @param PaginatorAwareInterface|RecordSelector|DocumentSelector $selector
     *
     * @throws InvalidSelectorException
     */
    protected function validateSelector(PaginatorAwareInterface $selector)
    {
        if (!$selector instanceof RecordSelector && !$selector instanceof DocumentSelector) {
            throw new InvalidSelectorException(
                "Only instance of Record/Document selectors are allowed, '"
                . get_class($selector) . "'"
            );
        }
    }
}