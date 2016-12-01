<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Spiral\Listing;


use Spiral\Listing\Exceptions\InvalidSelectorException;
use Spiral\Listing\Traits\SelectorValidationTrait;
use Spiral\ODM\Entities\DocumentSelector;
use Spiral\ORM\Entities\RecordSelector;
use Spiral\Pagination\PaginableInterface;
use Spiral\Pagination\PaginatorInterface;
use Spiral\Pagination\PredictableInterface;

/**
 * Packs listing state into array form.
 */
class ListingSerializer implements \JsonSerializable
{
    use SelectorValidationTrait;

    /**
     * @var Listing
     */
    private $listing = null;

    /**
     * @var PaginableInterface|RecordSelector|DocumentSelector
     */
    private $selector = null;

    /**
     * @param Listing                                            $listing
     * @param PaginableInterface|RecordSelector|DocumentSelector $selector
     *
     * @throws InvalidSelectorException
     */
    public function __construct(Listing $listing, PaginableInterface $selector)
    {
        $this->validateSelector($selector);

        $this->listing = $listing;
        $this->selector = $selector;
    }

    /**
     * Unique id associated with listing.
     *
     * @return string
     */
    public function getID()
    {
        return md5(spl_object_hash($this->listing));
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'namespace'  => $this->listing->getNamespace(),
            'sorting'    => $this->packSorting(),
            'filters'    => $this->packFilters(),
            'pagination' => $this->packPagination()
        ];
    }

    /**
     * @return array
     */
    public function jsonSerialize()
    {
        return $this->toArray();
    }

    /**
     * @param Listing $listing
     * @return string
     */
    public static function listingID(Listing $listing)
    {
        return md5(spl_object_hash($listing));
    }

    /**
     * @return array
     */
    protected function packSorting()
    {
        $packed = [
            'sorter' => $this->listing->getSorter(),
        ];

        $sorter = $this->listing->activeSorter();
        if ($sorter instanceof DirectionalSorterInterface) {
            $packed['direction'] = $sorter->getDirection() == SorterInterface::ASC ? 'asc' : 'desc';
        }

        return $packed;
    }

    /**
     * @return array
     */
    protected function packFilters()
    {
        $packed = [];
        foreach ($this->listing->activeFilters() as $name => $filter) {
            $packed[$name] = $filter->getValue();
        }

        return $packed;
    }

    /**
     * @return array
     */
    protected function packPagination()
    {
        /**
         * @var PaginatorInterface $paginator
         */
        $paginator = $this->selector->getPaginator();

        if ($paginator instanceof PredictableInterface) {
            $this->selector->getIterator();

            return [
                'page'         => $paginator->getPage(),

                //Total items
                'total'        => $paginator->count(),

                //Pages around
                'countPages'   => $paginator->countPages(),
                'nextPage'     => $paginator->nextPage(),
                'previousPage' => $paginator->previousPage(),

                //Limitations
                'limit'        => $paginator->getLimit(),
                'limits'       => $this->listing->getLimits()
            ];
        } else {
            return [
                'page'   => $paginator->getPage(),
                'limit'  => $paginator->getLimit(),
                'limits' => $this->listing->getLimits()
            ];
        }
    }
}