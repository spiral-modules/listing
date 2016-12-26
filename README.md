# Install

Install module and register it:

```
composer install spiral/listing
./spiral register spiral/listing 
```

Add bootloader to ```App.php```:

```php
class App extends Core
{
    /**
     * List of classes and bootloaders to be initiated with your application.
     *
     * Attention, bootloader's bindings are compiled and cached, to reload application cache run
     * command "app:reload".
     *
     * @see \Spiral\Core\Bootloaders\Bootloader
     * @var array
     */
    protected $load = [
        // ...
        \Spiral\Listing\Bootloaders\ListingsBootloader::class,
        // ...
    ];
    // ...
}
```

# Basic usage

Create view:

```php
<dark:use path="spiral:listing/*" prefix="listing:"/>

<?php #compile
/** @var \Database\Account $entity */
?>
<div class="card z-depth-1">
    <div class="card-content">
        <listing:form listing="<?= $listing ?>">
            <div class="row">
                <div class="col s2">
                    <listing:filter>
                        <form:input name="first_name" placeholder="[[First Name]]"/>
                    </listing:filter>
                </div>
                <div class="col s2">
                    <listing:filter>
                        <form:input name="last_name" placeholder="[[Last Name]]"/>
                    </listing:filter>
                </div>
                <div class="col s2">
                    <div class="right-align">
                        <listing:reset/>
                    </div>
                </div>
            </div>
        </listing:form>
    </div>
    <div class="row">
        <div class="col s12">
            <listing:grid listing="<?= $listing ?>" as="entity" color="teal">

                <grid:cell sorter="last_name" label="[[Last Name:]]" value="<?= e($entity->last_name) ?>"/>
                <grid:cell sorter="first_name" label="[[First Name:]]" value="<?= e($entity->first_name) ?>"/>

                <!--Parent specific elements-->
                ${context}

            </listing:grid>
        </div>
    </div>
</div>
```

Create ```Listing``` instance and pass it to view:

```php
public function accountsListing(RecordSelector $selector) : Listing
{
    /** @var Listing $listing */
    $listing = $this->factory->make(Listing::class, [
        'selector' => $selector->distinct(),
    ]);

    $listing->addSorter('first_name', new BinarySorter('account.first_name'));
    $listing->addSorter('last_name', new BinarySorter('account.last_name'));

    $listing->addFilter(
        'first_name',
        new SearchFilter(['account.first_name' => SearchFilter::LIKE_STRING])
    );

    $listing->addFilter(
        'last_name',
        new SearchFilter(['account.last_name' => SearchFilter::LIKE_STRING])
    );

    $defaultState = new StaticState('last_name', [], SorterInterface::ASC);

    $listing
        ->setDefaultState($defaultState->withNamespace('accounts'))
        ->setNamespace('accounts');

    return $listing;
}

public function indexAction(AccountsSource $source) : string
{
    $listing = $this->accounts->accountsListing($source->find());

    return $this->views->render('keeper:accounts/list', [
        'listing' => $listing,
    ]);
}
```
