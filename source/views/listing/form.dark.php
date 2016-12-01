<?php #compile
/** @var \Spiral\Listing\Listing $__listing__ */
$this->runtimeVariable('__listing__', '${listing}');
?>
<?php
$__listingID__ = \Spiral\Listing\ListingSerializer::listingID($__listing__);
?>
<div class="listing-form" data-listing-id="<?= $__listingID__ ?>">
    ${context}
</div>