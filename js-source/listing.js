"use strict";
import sf from "sf-core";

const Listing = function (sf, node, options) {
    this._construct(sf, node, options);
};


Listing.prototype = sf.createModulePrototype();

Listing.prototype.name = "listing";

Listing.prototype._construct = function (sf, node, options) {
    this.init(sf, node, options);

    if (options) {
        // extend default options
        this.options = Object.assign(this.options, options);
    }

    this.listingId = node.id;

    this.els = {
        node: node,
        sorters: node.querySelectorAll('[data-sorter]'),
        form: document.querySelector(`[data-listing-id="${this.listingId}"]`) || false
    };
    window.form = this.els.form; // TODO: Why?

    this.searchRegexp = new RegExp(this.options.config.namespace + '\\[filters\\]\\[\\d+\\]', "i");

    this.updateControls();
    this.addEventListeners();

    // Few shortcuts for syntax sugar purposes
    this._config = this.options.config;
    this._namespace = this._config.namespace;
    this._orderQuery = this._namespace + '[order]';
    this._sortByQuery = this._namespace + '[sortBy]';
    this._limitQuery = this._namespace + '[limit]';
    this._pageQuery = this._namespace + '[page]';
    this._filtersQuery = this._namespace + '[filters]';
    this._valuesQuery = this._namespace + '[values]';
};

Listing.prototype.optionsToGrab =
{
    /**
     *  Pass data in JSON-encoded format <b>Default: false</b>
     */
    config: {
        value: false,
        domAttr: "data-config",
        processor: function (node, val) {
            if (!val) return false;
            if (typeof val == "string") {
                try {
                    val = JSON.parse(val);
                } catch (e) {
                    console.error("Listing config JSON.parse error: ", e);
                }
            }
            return val;
        }
    },
    iconASC: {
        value: '<i class="toolkit-icon-sort-up"></i>',
        domAttr: "data-icon-asc"
    },
    iconDESC: {
        value: '<i class="toolkit-icon-sort-down"></i>',
        domAttr: "data-icon-asc"
    },
    iconSorter: {
        value: '<i class="toolkit-icon-down"></i>',
        domAttr: "data-icon-sorter"
    },
    pagination: {
        value: true,
        domAttr: "data-pagination",
        processor: function (node, val) {
            if (typeof val === "boolean") return val;

            val = (val !== void 0 && val !== null) ? val.toLowerCase() : '';
            if (val === 'false') {
                val = false;
            } else if (val === 'true') {
                val = true;
            } else {
                val = this.value;
            }
            return val;
        }
    },
    paginationPages: {
        value: 7,
        domAttr: "data-pagination-pages"
    },
    paginationWrapperClass: {
        value: 'pagination js-sf-listing-pagination row center-align',
        domAttr: "data-pagination-wrapper"
    },
    paginationPageClass: {
        value: 'waves-effect',
        domAttr: "data-pagination-page-class"
    },
    paginationActiveClass: {
        value: 'active',
        domAttr: "data-pagination-active-class"
    },
    paginationDisabledClass: {
        value: 'disabled',
        domAttr: "data-pagination-disabled-class"
    },
    paginationPrevContent: {
        value: '<i class="toolkit-icon-left"></i>',
        domAttr: "data-pagination-prev"
    },
    paginationNextContent: {
        value: '<i class="toolkit-icon-right"></i>',
        domAttr: "data-pagination-next"
    },
    paginationFirstContent: {
        value: '<i class="toolkit-icon-left stacked"></i><i class="toolkit-icon-left stacked"></i>',
        domAttr: "data-pagination-first"
    },
    paginationLastContent: {
        value: '<i class="toolkit-icon-right stacked"></i><i class="toolkit-icon-right stacked"></i>',
        domAttr: "data-pagination-last"
    },
    limits: {
        value: true,
        domAttr: "data-limits",
        processor: function (node, val) {
            if (typeof val === "boolean") return val;

            val = (val !== void 0 && val !== null) ? val.toLowerCase() : '';
            if (val === 'false') {
                val = false;
            } else if (val === 'true') {
                val = true;
            } else {
                val = this.value;
            }
            return val;
        }
    },
    limitsWrapperClass: {
        value: 'js-sf-listing-limits right input-field item-form col s2',
        domAttr: "data-limits-wrapper"
    },
    limitsLabel: {
        value: '<span class="label">Show: </span>',
        domAttr: "data-limits-label"
    }
};

Listing.prototype.updateControls = function () {
    if (this.options.pagination) {
        this.generatePagination();
    }

    if (this.options.limits) {
        this.els.limits = {
            wrapper: document.createElement('div'),
            select: document.createElement('select')
        };

        for (var i = 0; i < this._config.pagination.limits.length; i++) {
            var option = document.createElement("option");
            option.value = this._config.pagination.limits[i];
            option.text = this._config.pagination.limits[i];
            option.selected = this._config.pagination.limits[i] === this._config.pagination.limit;
            this.els.limits.select.appendChild(option);
        }
        this.els.limits.wrapper.setAttribute("class", this.options.limitsWrapperClass);

        this.els.limits.wrapper.innerHTML = this.options.limitsLabel;
        this.els.limits.wrapper.appendChild(this.els.limits.select);
        this.els.node.parentNode.appendChild(this.els.limits.wrapper, this.els.node);
        if (this.options.pagination) {
            this.els.limits.wrapper.classList.add('stacked-right');
        }

        // Make it work with materialize
        if (window.jQuery && typeof window.jQuery(this.els.limits.select).material_select === "function") {
            window.jQuery(this.els.limits.select).material_select(this.performLimits.bind(this));
        }
    }

    if (this.els.form) {
        // fill form values
        [].forEach.call(this.els.form.querySelectorAll('input, select'), (input)=> {
            if (this._config.filters && this._config.filters[input.name]) {
                input.value = this._config.filters[input.name];
            }
        });
    }

    for (let i = 0; i < this.els.sorters.length; ++i) {
        // add asc & desc icon
        if (this.els.sorters[i].dataset.sorter === this._config.sorting.sorter) {
            this.els.sorters[i].innerHTML += (this._config.sorting.direction === "asc" ? this.options.iconASC : this.options.iconDESC);
        } else {
            this.els.sorters[i].innerHTML += this.options.iconSorter;
        }
    }
};

Listing.prototype.generatePagination = function () {
    let pageCounter = 1;
    let lastLeft = this._config.pagination.page;
    let lastRight = this._config.pagination.page;

    this.els.pagination = {
        wrapper: document.createElement('ul'),
        firstPage: document.createElement('li'),
        prevPage: document.createElement('li'),
        page: document.createElement('li'),
        nextPage: document.createElement('li'),
        lastPage: document.createElement('li')
    };

    this.pagination = {
        prevPages: [],
        currentPage: this._config.pagination.page,
        nextPages: []
    };

    while (pageCounter < this.options.paginationPages) {
        if ((lastLeft - 1) >= 1) {
            lastLeft--;
            this.pagination.prevPages.unshift(lastLeft);
            pageCounter++;
        }
        if ((lastRight + 1) <= this._config.pagination.countPages) {
            lastRight++;
            this.pagination.nextPages.push(lastRight);
            pageCounter++;
        }
        if ((lastLeft - 1) < 1 && (lastRight + 1) > this._config.pagination.countPages) break;
    }

    this.els.pagination.wrapper.setAttribute("class", this.options.paginationWrapperClass);

    this.els.pagination.firstPage.setAttribute("class",
        this._config.pagination.firstPage ? this.options.paginationPageClass : this.options.paginationDisabledClass);
    this.els.pagination.firstPage.innerHTML = '<a>' + this.options.paginationFirstContent + '</a>';
    this.els.pagination.firstPage.dataset.page = 1;

    this.els.pagination.lastPage.setAttribute("class",
        this._config.pagination.nextPage ? this.options.paginationPageClass : this.options.paginationDisabledClass);
    this.els.pagination.lastPage.innerHTML = '<a>' + this.options.paginationLastContent + '</a>';
    this.els.pagination.lastPage.dataset.page = this._config.pagination.countPages;

    this.els.pagination.prevPage.setAttribute("class",
        this._config.pagination.previousPage ? this.options.paginationPageClass : this.options.paginationDisabledClass);
    this.els.pagination.prevPage.innerHTML = '<a>' + this.options.paginationPrevContent + '</a>';
    this.els.pagination.prevPage.dataset.page = this.pagination.currentPage - 1;

    this.els.pagination.nextPage.setAttribute("class",
        this._config.pagination.nextPage ? this.options.paginationPageClass : this.options.paginationDisabledClass);
    this.els.pagination.nextPage.innerHTML = '<a>' + this.options.paginationNextContent + '</a>';
    this.els.pagination.nextPage.dataset.page = this.pagination.currentPage + 1;

    this.els.pagination.wrapper.appendChild(this.els.pagination.firstPage);
    this.els.pagination.wrapper.appendChild(this.els.pagination.prevPage);
    this.pagination.prevPages.concat(this.pagination.currentPage, this.pagination.nextPages).forEach((val)=> {
        this.els.pagination.page.dataset.page = val;
        this.els.pagination.page.innerHTML = '<a>' + val + '</a>';
        this.els.pagination.page.setAttribute("class",
            val === this.pagination.currentPage ? this.options.paginationActiveClass : this.options.paginationPageClass);
        this.els.pagination.wrapper.appendChild(this.els.pagination.page.cloneNode(true));
    });

    this.els.pagination.wrapper.appendChild(this.els.pagination.nextPage);
    this.els.pagination.wrapper.appendChild(this.els.pagination.lastPage);
    this.els.node.parentNode.insertBefore(this.els.pagination.wrapper, this.els.node.nextSibling);
    this.els.pagination.activePages = this.els.pagination.wrapper.querySelectorAll('.' + this.options.paginationPageClass);
};

Listing.prototype.performSorting = function (sorter) {
    this.searchQuery = this.getQueryParams();
    this.searchQuery[this._sortByQuery] = sorter.dataset.sorter;

    // click on active sorter changes direction, otherwise direction will be asc
    if (this._config.sorting.sorter === sorter.dataset.sorter) {
        this.searchQuery[this._orderQuery] =
            ((this.searchQuery[this._orderQuery] === 'asc'
            || !this.searchQuery[this._orderQuery]) ? 'desc' : 'asc');
    } else {
        this.searchQuery[this._orderQuery] = 'asc';
    }

    this.searchQuery[this._sortByQuery] = sorter.dataset.sorter;
    this.updateListing();
};

Listing.prototype.performFilters = function (e) {
    if (e.target.tagName && e.target.tagName === "INPUT" && (e.which ? e.which : e.keyCode) !== 13) return;
    this.searchQuery = this.getQueryParams();

    if (e.target.value) {
        if (!this._config.filters[e.target.name]) {
            this.searchQuery[`${this._filtersQuery}[${this.newFilterIndex()}]`] = e.target.name;
        }
        this.searchQuery[`${this._valuesQuery}[${e.target.name}]`] = e.target.value;
    } else {
        this.clearFilter(e);
    }

    this.compactFilterIndexes();
    this.clearPagination();
    this.updateListing();
};

Listing.prototype.clearFilter = function (e) {
    this.searchQuery = this.getQueryParams();

    for (var key in this.searchQuery) {
        if (this.searchQuery.hasOwnProperty(key) && this.searchRegexp.test(key) && this.searchQuery[key] === e.target.name) {
            delete this.searchQuery[key];
            break;
        }
    }

    delete this.searchQuery[`${this._valuesQuery}[${e.target.name}]`];
};

/**
 * Update filters' indexes to go in order without gaps. Expl: namespace[filter][2] => namespace[filter][0]
 */
Listing.prototype.compactFilterIndexes = function () {
    let filtersObj = {};
    let i = 0;

    for (var key in this.searchQuery) {
        if (this.searchQuery.hasOwnProperty(key) && this.searchRegexp.test(key)) {
            filtersObj[key] = this.searchQuery[key];
            delete this.searchQuery[key];
        }
    }

    for (key in filtersObj) {
        if (filtersObj.hasOwnProperty(key)) {
            this.searchQuery[key.substr(0, key.lastIndexOf('[') + 1) + i + key.substr(key.lastIndexOf(']'))] = filtersObj[key];
            i++;
        }
    }
};

Listing.prototype.newFilterIndex = function () {
    let i = 0;
    let index = null;

    while (!index) {
        if (this.searchQuery[this._filtersQuery + '[' + i + ']']) {
            i++;
        } else {
            index = i;
            break;
        }
    }

    return index;
};

Listing.prototype.performPagination = function (pageNode) {
    this.searchQuery = this.getQueryParams();

    if (+pageNode.dataset.page === 1) {
        this.clearPagination();
    } else {
        this.searchQuery[this._pageQuery] = pageNode.dataset.page;
    }

    this.updateListing();
};

Listing.prototype.performLimits = function () {
    this.searchQuery = this.getQueryParams();

    if (+this.els.limits.select.value === this._config.pagination.limits[0]) {
        delete this.searchQuery[this._limitQuery];
    } else {
        this.searchQuery[this._limitQuery] = this.els.limits.select.value;
    }

    this.updateListing();
};

Listing.prototype.clearPagination = function () {
    delete this.searchQuery[this._pageQuery];
};

Listing.prototype.getQueryParams = function (str) {
    return (str || document.location.search) ? ((str || document.location.search).replace(/(^\?)/, '').split("&").map(function (n) {
        return n = n.split("="), this[n[0]] = decodeURIComponent(n[1]), this; // TODO: WTF is that?
    }.bind({}))[0]) : {};
};

/**
 * TODO: Should urlencode?
 * Encode object to URL form
 * @param {Object} obj
 * @return {*}
 */
Listing.prototype.stringifyObject = function (obj) {
    if (Object.getOwnPropertyNames(obj).length === 0) return "";

    let query = "?";

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            query += key + '=' + encodeURIComponent(obj[key]) + "&";
        }
    }

    return query.slice(0, -1);
};

Listing.prototype.updateListing = function () {
    location.search = this.stringifyObject(this.searchQuery);
};

Listing.prototype.addEventListeners = function () {
    this._performSorting = (e)=> this.performSorting(e.target);
    this._performFilters = (e)=> this.performFilters(e);
    this._performPagination = (e)=> this.performPagination(e.target);
    this._performLimits = ()=> this.performLimits();

    if (this.els.sorters) {
        for (let i = 0; i < this.els.sorters.length; ++i) {
            this.els.sorters[i].addEventListener('click', this._performSorting);
        }
    }

    if (this.els.pagination && this.els.pagination.activePages) {
        for (let i = 0; i < this.els.pagination.activePages.length; ++i) {
            this.els.pagination.activePages[i].addEventListener('click', this._performPagination);
        }
    }

    if (this.els.form) {
        [].forEach.call(this.els.form.querySelectorAll('select'), (el)=> {
            el.addEventListener('change', this._performFilters);
            // make it work with materialize
            if (window.jQuery && typeof window.jQuery('select').material_select === "function") window.jQuery(el).on('change', this._performFilters);
        });

        [].forEach.call(this.els.form.querySelectorAll('input:not(.js-sf-autocomplete)'), (el)=> {
            el.addEventListener('keydown', this._performFilters);
        });

        [].forEach.call(this.els.form.querySelectorAll('input.js-sf-autocomplete'), (el)=> {
            let autocomplete = sf.getInstance('autocomplete', el);
            autocomplete.retrieveValueByKey();
            if (!autocomplete || !autocomplete.events) return;

            autocomplete.events.on("select", (instance)=> {
                let autocompleteData = {
                    target: {
                        name: instance.els.hidden.name,
                        value: instance.els.hidden.value
                    }
                };
                this._performFilters(autocompleteData);
            });

            autocomplete.events.on("clear", (instance)=> {
                let autocompleteData = {
                    target: {
                        name: instance.els.hidden.name,
                        value: ""
                    }
                };
                this._performFilters(autocompleteData);
            });
        });
    }

    if (this.els.limits) {
        this.els.limits.select.addEventListener('change', this._performLimits);
    }
};

Listing.prototype.removeEventListeners = function () {
    if (this.els.sorters) {
        for (let i = 0; i < this.els.sorters.length; ++i) {
            this.els.sorters[i].removeEventListeners('click', this._performSorting);
        }
    }

    if (this.els.pagination && this.els.pagination.activePages) {
        for (let i = 0; i < this.els.pagination.activePages.length; ++i) {
            this.els.pagination.activePages[i].removeEventListener('click', this._performPagination);
        }
    }

    if (this.els.limits) {
        this.els.limits.select.removeEventListener('change', this._performLimits);
    }

    if (this.els.form) {
        [].forEach.call(this.els.form.querySelectorAll('select'), (el)=> {
            el.removeEventListeners('change', this._performFilters);
        });

        [].forEach.call(this.els.form.querySelectorAll('input'), (el)=> {
            el.removeEventListeners('keydown', this._performFilters);
        });
    }
};


Listing.prototype.die = function () {
    this.removeEventListeners();
    delete this;
};

module.exports = Listing;
