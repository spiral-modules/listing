<extends:spiral:element/>

<block:body>
    <?php #compile
    /**
     * @var \Spiral\Listing\Listing $__listing__
     */
    $this->runtimeVariable('__listing__', '${listing}');

    /**
     * First of all we have to collect every defined cell element to built list of table headers
     * and elements.
     */
    $__gridHeaders__ = [];
    $__gridColumns__ = [];

    //Collecting headers and columns
    ob_start(); ?>${context}<?php ob_get_clean(); #compile
    ?>
    <?php
    $__selector__ = $__listing__->getSelector();
    $__serializer__ = new \Spiral\Listing\ListingSerializer($__listing__, $__selector__);
    ?>
    <block:table>
        <table class="table ${class} js-sf-listing stripped" id="<?= $__serializer__->getID() ?>"
               data-config="<?= htmlentities(json_encode($__serializer__), ENT_QUOTES, 'UTF-8') ?>"
               node:attributes>
            <thead>
            <tr>
                <?php #compile
                echo join("\n", $__gridHeaders__);
                ?>
            </tr>
            </thead>
            <tbody>
            <?php $__has__rows__ = false; ?>
            <?php #compile
            echo '<?php foreach ($__selector__ as $${as|item}) { ?>';
            echo "<tr>\n";
            echo join("\n", $__gridColumns__);
            echo "</tr>\n";
            echo '<?php $__has__rows__ = true;} ?>';
            ?>
            <?php if (!$__has__rows__) { ?>
                <tr>
                    <td class="${empty-class|center-align}" colspan="<?= count($__gridHeaders__) #compile ?>">
                        ${empty|No results to be displayed}
                    </td>
                </tr>
            <?php } ?>
            </tbody>
        </table>
    </block:table>
</block:body>