/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _sf = __webpack_require__(162);

	var _sf2 = _interopRequireDefault(_sf);

	var _listing = __webpack_require__(163);

	var _listing2 = _interopRequireDefault(_listing);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(164); //resolved by webpack's "externals"


	_sf2.default.instancesController.registerInstanceType(_listing2.default, "js-sf-listing");
	module.exports = _listing2.default; // ES6 default export will not expose us as global

/***/ },

/***/ 162:
/***/ function(module, exports) {

	module.exports = sf;

/***/ },

/***/ 163:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _sf = __webpack_require__(162);

	var _sf2 = _interopRequireDefault(_sf);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//resolved by webpack's "externals"

	var Listing = function Listing(sf, node, options) {
	    this._construct(sf, node, options);
	};

	Listing.prototype = _sf2.default.createModulePrototype();

	Listing.prototype.name = "listing";

	Listing.prototype._construct = function (sf, node, options) {
	    this.restoreParams();

	    this.init(sf, node, options);

	    if (options) {
	        //if we pass options extend all options by passed options
	        this.options = Object.assign(this.options, options);
	    }

	    this.listingID = node.id;

	    this.els = {
	        node: node,
	        sorters: node.querySelectorAll('[data-sorter]'),
	        form: document.querySelector('[data-listing-id="' + this.listingID + '"]') || false,
	        reset: document.querySelector('.sf-listing-reset')
	    };
	    window.form = this.els.form;

	    this.searchRegexp = new RegExp(this.options.config.namespace + '\\[filters\\]\\[\\d+\\]', "i");

	    this.updateControls();

	    this.addEventListeners();
	};

	Listing.prototype.optionsToGrab = {
	    /**
	     *  Pass data in JSON-encoded format <b>Default: false</b>
	     */
	    config: {
	        value: false,
	        domAttr: "data-config",
	        processor: function processor(node, val) {
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
	        "processor": function processor(node, val) {
	            if (typeof val === "boolean") return val;

	            val = val !== void 0 && val !== null ? val.toLowerCase() : '';
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
	        "processor": function processor(node, val) {
	            if (typeof val === "boolean") return val;

	            val = val !== void 0 && val !== null ? val.toLowerCase() : '';
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

	    if (this.options.pagination) this.generatePagination();
	    if (this.options.limits) {
	        this.els.limits = {
	            wrapper: document.createElement('div'),
	            select: document.createElement('select')
	        };
	        for (var i = 0; i < this.options.config.pagination.limits.length; i++) {
	            var option = document.createElement("option");
	            option.value = this.options.config.pagination.limits[i];
	            option.text = this.options.config.pagination.limits[i];
	            option.selected = this.options.config.pagination.limits[i] === this.options.config.pagination.limit;
	            this.els.limits.select.appendChild(option);
	        }
	        this.els.limits.wrapper.setAttribute("class", this.options.limitsWrapperClass);

	        this.els.limits.wrapper.innerHTML = this.options.limitsLabel;
	        this.els.limits.wrapper.appendChild(this.els.limits.select);
	        this.els.node.parentNode.appendChild(this.els.limits.wrapper, this.els.node);
	        if (this.options.pagination) this.els.limits.wrapper.classList.add('stacked-right');
	        if (jQuery && typeof jQuery(this.els.limits.select).material_select === "function") {
	            //just to make it work with materialize
	            jQuery(this.els.limits.select).material_select(this.performLimits.bind(this));
	        }
	    }

	    //fill values
	    if (this.els.form) {
	        var that = this;
	        [].forEach.call(this.els.form.querySelectorAll('input, select'), function (input) {
	            if (that.options.config.filters && that.options.config.filters[input.name]) input.value = that.options.config.filters[input.name];
	        });
	    }

	    for (var _i = 0; _i < this.els.sorters.length; ++_i) {
	        //add asc-desc icon
	        if (this.els.sorters[_i].dataset.sorter === this.options.config.sorting.sorter) {
	            this.els.sorters[_i].innerHTML += this.options.config.sorting.direction === "asc" ? this.options.iconASC : this.options.iconDESC;
	        } else {
	            this.els.sorters[_i].innerHTML += this.options.iconSorter;
	        }
	    }
	};

	Listing.prototype.generatePagination = function () {
	    var that = this,
	        pageCounter = 1,
	        lastLeft = this.options.config.pagination.page,
	        lastRight = this.options.config.pagination.page;

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
	        currentPage: this.options.config.pagination.page,
	        nextPages: []
	    };

	    while (pageCounter < this.options.paginationPages) {
	        if (lastLeft - 1 >= 1) {
	            lastLeft--;
	            this.pagination.prevPages.unshift(lastLeft);
	            pageCounter++;
	        }
	        if (lastRight + 1 <= this.options.config.pagination.countPages) {
	            lastRight++;
	            this.pagination.nextPages.push(lastRight);
	            pageCounter++;
	        }
	        if (lastLeft - 1 < 1 && lastRight + 1 > this.options.config.pagination.countPages) break;
	    }

	    this.els.pagination.wrapper.setAttribute("class", this.options.paginationWrapperClass);

	    this.els.pagination.firstPage.setAttribute("class", this.options.config.pagination.previousPage ? this.options.paginationPageClass : this.options.paginationDisabledClass);
	    this.els.pagination.firstPage.innerHTML = '<a>' + this.options.paginationFirstContent + '</a>';
	    this.els.pagination.firstPage.dataset.page = 1;

	    this.els.pagination.lastPage.setAttribute("class", this.options.config.pagination.nextPage ? this.options.paginationPageClass : this.options.paginationDisabledClass);
	    this.els.pagination.lastPage.innerHTML = '<a>' + this.options.paginationLastContent + '</a>';
	    this.els.pagination.lastPage.dataset.page = this.options.config.pagination.countPages;

	    this.els.pagination.prevPage.setAttribute("class", this.options.config.pagination.previousPage ? this.options.paginationPageClass : this.options.paginationDisabledClass);
	    this.els.pagination.prevPage.innerHTML = '<a>' + this.options.paginationPrevContent + '</a>';
	    this.els.pagination.prevPage.dataset.page = this.pagination.currentPage - 1;

	    this.els.pagination.nextPage.setAttribute("class", this.options.config.pagination.nextPage ? this.options.paginationPageClass : this.options.paginationDisabledClass);
	    this.els.pagination.nextPage.innerHTML = '<a>' + this.options.paginationNextContent + '</a>';
	    this.els.pagination.nextPage.dataset.page = this.pagination.currentPage + 1;

	    this.els.pagination.wrapper.appendChild(this.els.pagination.firstPage);
	    this.els.pagination.wrapper.appendChild(this.els.pagination.prevPage);
	    this.pagination.prevPages.concat(this.pagination.currentPage, this.pagination.nextPages).forEach(function (val) {
	        that.els.pagination.page.dataset.page = val;
	        that.els.pagination.page.innerHTML = '<a>' + val + '</a>';
	        that.els.pagination.page.setAttribute("class", val === that.pagination.currentPage ? that.options.paginationActiveClass : that.options.paginationPageClass);
	        that.els.pagination.wrapper.appendChild(that.els.pagination.page.cloneNode(true));
	    });
	    this.els.pagination.wrapper.appendChild(this.els.pagination.nextPage);
	    this.els.pagination.wrapper.appendChild(this.els.pagination.lastPage);

	    this.els.node.parentNode.insertBefore(this.els.pagination.wrapper, this.els.node.nextSibling);
	    this.els.pagination.activePages = this.els.pagination.wrapper.querySelectorAll('.' + this.options.paginationPageClass);
	};

	Listing.prototype.performSorting = function (sorter) {

	    this.searchQuery = this.getQueryParams();
	    this.searchQuery[this.options.config.namespace + '[sortBy]'] = sorter.dataset.sorter;

	    //click on active sorter changes direction, otherwise direction will be asc
	    if (this.options.config.sorting.sorter === sorter.dataset.sorter) {
	        this.searchQuery[this.options.config.namespace + '[order]'] = this.searchQuery[this.options.config.namespace + '[order]'] === 'asc' || !this.searchQuery[this.options.config.namespace + '[order]'] ? 'desc' : 'asc';
	    } else {
	        this.searchQuery[this.options.config.namespace + '[order]'] = 'asc';
	    }
	    this.searchQuery[this.options.config.namespace + '[sortBy]'] = sorter.dataset.sorter;
	    this.updateListing();
	};

	Listing.prototype.performFilters = function (e) {
	    if (e.target.tagName && e.target.tagName === "INPUT" && (e.which ? e.which : e.keyCode) !== 13) return;
	    this.searchQuery = this.getQueryParams();
	    if (e.target.value) {
	        if (typeof this.options.config.filters[e.target.name] === "undefined") {
	            this.searchQuery[this.options.config.namespace + '[filters][' + this.newFilterIndex() + ']'] = e.target.name;
	        }
	        this.searchQuery[this.options.config.namespace + '[values][' + e.target.name + ']'] = e.target.value;
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

	    delete this.searchQuery[this.options.config.namespace + '[values][' + e.target.name + ']'];
	};

	/**
	 * Update filters' indexes to go in order without gaps. Expl: namespace[filter][2] => namespace[filter][0]
	 */
	Listing.prototype.compactFilterIndexes = function () {
	    var filtersObj = {},
	        i = 0;

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
	    var i = 0,
	        index = null;

	    while (!index) {
	        if (this.searchQuery[this.options.config.namespace + '[filters][' + i + ']']) {
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
	        this.searchQuery[this.options.config.namespace + '[page]'] = pageNode.dataset.page;
	    }

	    this.updateListing();
	};

	Listing.prototype.performLimits = function () {

	    this.searchQuery = this.getQueryParams();
	    if (+this.els.limits.select.value === this.options.config.pagination.limits[0]) {
	        delete this.searchQuery[this.options.config.namespace + '[limit]'];
	    } else {
	        this.searchQuery[this.options.config.namespace + '[limit]'] = this.els.limits.select.value;
	    }

	    this.updateListing();
	};

	Listing.prototype.clearPagination = function () {

	    delete this.searchQuery[this.options.config.namespace + '[page]'];
	};

	Listing.prototype.getQueryParams = function (str) {

	    return str || document.location.search ? (str || document.location.search).replace(/(^\?)/, '').split("&").map(function (n) {
	        return n = n.split("="), this[n[0]] = n[1], this;
	    }.bind({}))[0] : {};
	};

	Listing.prototype.stringifyObject = function (obj) {

	    if (Object.getOwnPropertyNames(obj).length === 0) return "";

	    var query = "?";

	    for (var key in obj) {
	        if (obj.hasOwnProperty(key)) {
	            query += key + '=' + obj[key] + "&";
	        }
	    }

	    return query.slice(0, -1);
	};

	Listing.prototype.updateListing = function () {
	    this.storeParams();
	    location.search = this.stringifyObject(this.searchQuery);
	};

	Listing.prototype.storeParams = function () {
	    var currentStore = JSON.parse(localStorage.getItem('spiral-listing') || '{}'),
	        currentListing = {};

	    currentListing[location.pathname] = this.stringifyObject(this.searchQuery);

	    Object.assign(currentStore, currentListing);
	    localStorage.setItem('spiral-listing', JSON.stringify(currentStore));
	};

	Listing.prototype.restoreParams = function () {
	    if (location.search) return;

	    var currentStore = JSON.parse(localStorage.getItem('spiral-listing') || '{}');
	    if (currentStore[location.pathname]) location.search = currentStore[location.pathname];
	};

	Listing.prototype.resetParams = function () {
	    var currentStore = JSON.parse(localStorage.getItem('spiral-listing') || '{}'),
	        currentListing = {};
	    if (currentStore[location.pathname]) delete currentStore[location.pathname];
	    localStorage.setItem('spiral-listing', JSON.stringify(currentStore));
	    location.search = "";
	};

	Listing.prototype.addEventListeners = function () {
	    var that = this;

	    this._performSorting = function (e) {
	        that.performSorting(e.target);
	    };
	    this._performFilters = function (e) {
	        that.performFilters(e);
	    };
	    this._performPagination = function (e) {
	        that.performPagination(e.target);
	    };
	    this._performLimits = function () {
	        that.performLimits();
	    };

	    this._resetParams = function () {
	        that.resetParams();
	    };

	    if (this.els.sorters) {
	        for (var i = 0; i < this.els.sorters.length; ++i) {
	            this.els.sorters[i].addEventListener('click', that._performSorting);
	        }
	    }

	    if (this.els.reset) {
	        this.els.reset.addEventListener('click', that._resetParams);
	    }

	    if (this.els.pagination && this.els.pagination.activePages) {
	        for (var _i2 = 0; _i2 < this.els.pagination.activePages.length; ++_i2) {
	            this.els.pagination.activePages[_i2].addEventListener('click', that._performPagination);
	        }
	    }

	    if (this.els.form) {

	        [].forEach.call(this.els.form.querySelectorAll('select'), function (el) {
	            el.addEventListener('change', that._performFilters);
	            if (jQuery && typeof jQuery('select').material_select === "function") jQuery(el).on('change', that._performFilters); //just to make it work with materialize
	        });

	        [].forEach.call(this.els.form.querySelectorAll('input:not(.js-sf-autocomplete)'), function (el) {
	            el.addEventListener('keydown', that._performFilters);
	        });

	        [].forEach.call(this.els.form.querySelectorAll('input.js-sf-autocomplete'), function (el) {
	            var autocomplete = _sf2.default.getInstance('autocomplete', el);
	            autocomplete.retrieveValueByKey();
	            if (!autocomplete || !autocomplete.events) return;

	            autocomplete.events.on("select", function (instance) {
	                var autocompleteData = {
	                    target: {
	                        name: instance.els.hidden.name,
	                        value: instance.els.hidden.value
	                    }
	                };
	                that._performFilters(autocompleteData);
	            });
	            autocomplete.events.on("clear", function (instance) {
	                var autocompleteData = {
	                    target: {
	                        name: instance.els.hidden.name,
	                        value: ""
	                    }
	                };
	                that._performFilters(autocompleteData);
	            });
	        });
	    }

	    if (this.els.limits) {
	        this.els.limits.select.addEventListener('change', that._performLimits);
	    }
	};

	Listing.prototype.removeEventListeners = function () {
	    var that = this;

	    if (this.els.sorters) {
	        for (var i = 0; i < this.els.sorters.length; ++i) {
	            this.els.sorters[i].removeEventListeners('click', that._performSorting);
	        }
	    }

	    if (this.els.pagination && this.els.pagination.activePages) {
	        for (var _i3 = 0; _i3 < this.els.pagination.activePages.length; ++_i3) {
	            this.els.pagination.activePages[_i3].removeEventListener('click', that._performPagination);
	        }
	    }

	    if (this.els.limits) {
	        this.els.limits.select.removeEventListener('change', that._performLimits);
	    }

	    if (this.els.form) {

	        [].forEach.call(this.els.form.querySelectorAll('select'), function (el) {
	            el.removeEventListeners('change', that._performFilters);
	        });

	        [].forEach.call(this.els.form.querySelectorAll('input'), function (el) {
	            el.removeEventListeners('keydown', that._performFilters);
	        });
	    }
	};

	Listing.prototype.die = function () {
	    this.removeEventListeners();
	    delete this;
	};

	module.exports = Listing;

/***/ },

/***/ 164:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(165);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(167)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js?minimize!./../../../node_modules/less-loader/index.js!./listing.less", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js?minimize!./../../../node_modules/less-loader/index.js!./listing.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 165:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(166)();
	// imports


	// module
	exports.push([module.id, ".js-sf-listing [data-sorter]{cursor:pointer;white-space:nowrap}.js-sf-listing [data-sorter] i{pointer-events:none}.js-sf-listing [data-sorter]:hover{background-color:#f2f2f2}.js-sf-listing-search i{position:absolute;line-height:38px;left:17px}.js-sf-listing-search input{padding-left:30px}.js-sf-listing-pagination li:first-child{border:none}.js-sf-listing-pagination li a{pointer-events:none}.js-sf-listing-pagination li i{font-size:.65rem}.js-sf-listing-pagination li i.stacked:before{margin:-.25em}.js-sf-listing-limits.stacked-right{margin-bottom:-50px;bottom:70px}.js-sf-listing-limits .label{position:absolute;left:-45px;line-height:38px}.listing-form .item-state-search .btn-icon{top:3px}.listing-form .btn-icon{height:100%;bottom:0;top:0}.listing-form .btn-icon:focus{background-color:transparent}", ""]);

	// exports


/***/ },

/***/ 166:
/***/ function(module, exports) {

	"use strict";

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function () {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ },

/***/ 167:
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }

/******/ });