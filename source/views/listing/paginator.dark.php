<block:body>
    <?php
    /**
     * Making sure that we are inside listing scope.
     */
    if (!isset($__listing__) || !$__listing__ instanceof \Spiral\Listing\Listing) {
        throw new \Spiral\Listing\Exceptions\ListingException(
            "Unable to render listing element, no listing context"
        );
    }

    $__paginator__ = $__listing__->getSelector()->getPaginator();
    ?>
    <button class="waves-effect waves-light btn ${color} prev" page-number="<?= $__paginator__->previousPage() ?>">
        [[Prev]]
    </button>

    <input type="number" name="page" value="<?= $__paginator__->getPage() ?>"/>
    of <?= $__paginator__->countPages() ?>

    <button class="waves-effect waves-light btn ${color} next" page-number="<?= $__paginator__->nextPage() ?>">
        [[Next]]
    </button>
</block:body>