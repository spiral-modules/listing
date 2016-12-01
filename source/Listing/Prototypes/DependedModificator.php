<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Spiral\Listing\Prototypes;

use Spiral\Listing\Dependency;
use Spiral\Listing\Exceptions\ModificatorException;
use Spiral\ORM\Entities\RecordSelector;

class DependedModificator
{
    /**
     * @var Dependency[]
     */
    private $dependencies = [];

    /**
     * @param Dependency[]|Dependency $dependencies
     * @throws ModificatorException
     */
    public function __construct($dependencies)
    {
        if (empty($dependencies)) {
            $dependencies = [];
        }

        if (!is_array($dependencies)) {
            $dependencies = [$dependencies];
        }

        foreach ($dependencies as $dependency) {
            if (!$dependency instanceof Dependency) {
                throw new ModificatorException(
                    "Invalid dependency specification, instance of Dependency has been expected"
                );
            }

            $this->dependencies[] = $dependency;
        }
    }

    /**
     * @param Dependency $dependency
     * @return self
     */
    public function withDependency(Dependency $dependency)
    {
        $sorter = clone $this;
        $sorter->dependencies[] = $dependency;

        return $sorter;
    }

    /**
     * @return Dependency[]
     */
    public function getDependencies()
    {
        return $this->dependencies;
    }

    /**
     * Apply dependencies for RecordSelector
     *
     * @param RecordSelector $selector
     * @return RecordSelector
     */
    protected function loadDependencies(RecordSelector $selector)
    {
        if (empty($this->dependencies)) {
            return $selector;
        }

        foreach ($this->dependencies as $dependency) {
            $selector = $selector->with(
                $dependency->getRelation(),
                $dependency->getOptions()
            );
        }

        return $selector;
    }
}