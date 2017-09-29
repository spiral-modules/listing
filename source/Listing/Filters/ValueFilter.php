<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Valentin, Anton Titov (Wolfy-J)
 */
namespace Spiral\Listing\Filters;

use Spiral\Listing\Dependency;
use Spiral\Listing\Exceptions\FilterException;

class ValueFilter extends AbstractFilter
{
    /**
     * Allowed value types
     */
    const TYPE_STRING = 'string';
    const TYPE_INT    = 'int';
    const TYPE_FLOAT  = 'float';
    const TYPE_BOOL   = 'bool';

    /**
     * @var string
     */
    private $expression = '';

    /**
     * Filter type
     *
     * @var string
     */
    private $type = self::TYPE_STRING;

    /**
     * Value to be filtered by
     *
     * @var mixed
     */
    private $value = null;

    /**
     * @param string                  $expression Column, field or expression
     * @param string                  $type       Allowed value type
     * @param Dependency|Dependency[] $dependencies
     */
    public function __construct($expression, $type = self::TYPE_STRING, $dependencies = [])
    {
        parent::__construct($dependencies);

        $this->expression = $expression;
        $this->type = $type;
    }

    /**
     * {@inheritdoc}
     */
    public function isApplicable($value)
    {
        if (!is_scalar($value)) {
            return false;
        }

        switch ($this->type) {
            case self::TYPE_STRING:
                return is_string($value);
            case self::TYPE_INT:
                return is_numeric($value);
            case self::TYPE_FLOAT:
                return is_float($value) || is_numeric($value);
        }

        throw new FilterException("Invalid filter value type \"{$this->type}\"");
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
        $filter->value = $this->normalizeValue($value);

        return $filter;
    }

    /**
     * {@inheritdoc}
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * {@inheritdoc}
     */
    protected function whereClause($selector)
    {
        //Simplest possible form
        return [
            $this->expression => $this->getValue()
        ];
    }

    /**
     * Normalize input value
     *
     * @param mixed $value
     * @return float|int|string
     */
    private function normalizeValue($value)
    {
        switch ($this->type) {
            case self::TYPE_STRING:
                return trim((string)$value);
            case self::TYPE_INT:
                return intval($value);
            case self::TYPE_FLOAT:
                return floatval($value);
        }

        throw new FilterException("Invalid filter value type \"{$this->type}\"");
    }
}
