<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Spiral\Listing\Filters;

use Spiral\Listing\Dependency;
use Spiral\Listing\Exceptions\FilterException;
use Spiral\ODM\Entities\DocumentSelector;
use Spiral\ORM\Entities\RecordSelector;

class SearchFilter extends AbstractFilter
{
    /**
     * Possible search types.
     */
    const LIKE_STRING   = 'like';
    const EQUALS_STRING = 'eString';
    const EQUALS_INT    = 'eInt';
    const EQUALS_FLOAT  = 'eFloat';

    /**
     * Search mapping in a form [field/column => type]
     *
     * @var array
     */
    private $mapping = [];

    /**
     * Search query
     *
     * @var mixed
     */
    private $query = null;

    /**
     * @param array                   $mapping Search mapping in a form of [field => type]
     * @param Dependency|Dependency[] $dependencies
     */
    public function __construct(array $mapping, $dependencies = [])
    {
        parent::__construct($dependencies);

        $this->mapping = $mapping;
    }

    /**
     * {@inheritdoc}
     */
    public function isApplicable($value)
    {
        return !empty($value) && is_string($value);
    }

    /**
     * {@inheritdoc}
     */
    public function withValue($value)
    {
        if (!$this->isApplicable($value)) {
            throw new FilterException("Invalid filtering value, '" . gettype($value) . "' given");
        }

        $filter = clone $this;
        $filter->query = trim((string)$value);

        return $filter;
    }

    /**
     * {@inheritdoc}
     */
    public function getValue()
    {
        return strtolower($this->query);
    }

    /**
     * {@inheritdoc}
     */
    protected function whereClause($selector)
    {
        $whereClause = [];

        foreach ($this->mapping as $expression => $type) {
            switch ($type) {
                case self::LIKE_STRING:
                    $whereClause[] = $this->likeString($expression, $selector);
                    break;

                case self::EQUALS_STRING:
                    $whereClause[] = $this->equalsString($expression, $selector);
                    break;

                case self::EQUALS_INT:
                    $whereClause[] = $this->equalsInteger($expression, $selector);
                    break;

                case self::EQUALS_FLOAT:
                    $whereClause[] = $this->equalsFloat($expression, $selector);
                    break;

                default:
                    throw new FilterException("Invalid filter type, '{$type}' given");
            }
        }

        return $this->summarize($whereClause, $selector);
    }

    /**
     * @param string                          $expression
     * @param RecordSelector|DocumentSelector $selector
     * @return array
     */
    private function likeString($expression, $selector)
    {
        if ($selector instanceof RecordSelector) {
            return [$expression => ['LIKE' => "%{$this->getValue()}%"]];
        }

        if ($selector instanceof DocumentSelector) {
            return [
                $expression => new \MongoRegex('/' . preg_quote($this->getValue()) . '/is')
            ];
        }

        throw new FilterException("Undefined selector type, '" . get_class($selector) . "' given");
    }

    /**
     * @param string                          $expression
     * @param RecordSelector|DocumentSelector $selector
     * @return array
     */
    private function equalsString($expression, $selector)
    {
        return [$expression => (string)$this->getValue()];
    }

    /**
     * @param string                          $expression
     * @param RecordSelector|DocumentSelector $selector
     * @return array
     */
    private function equalsInteger($expression, $selector)
    {
        return [$expression => intval($this->getValue())];
    }

    /**
     * @param string                          $expression
     * @param RecordSelector|DocumentSelector $selector
     * @return array
     */
    private function equalsFloat($expression, $selector)
    {
        return [$expression => floatval($this->getValue())];
    }

    /**
     * Summarize expression array.
     *
     * @param array                           $whereClause
     * @param RecordSelector|DocumentSelector $selector
     * @return array
     */
    private function summarize(array $whereClause, $selector)
    {
        switch (count($whereClause)) {
            case 1:
                return $whereClause[0];

            default:
                if ($selector instanceof RecordSelector) {
                    return ['@OR' => $whereClause];
                }

                if ($selector instanceof DocumentSelector) {
                    return ['$or' => $whereClause];
                }
        }

        return [];
    }
}