!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("sf-core")):"function"==typeof define&&define.amd?define("sf-listing",["sf-core"],e):"object"==typeof exports?exports["sf-listing"]=e(require("sf-core")):t["sf-listing"]=e(t.sf)}(this,function(t){return function(t){function e(s){if(i[s])return i[s].exports;var a=i[s]={i:s,l:!1,exports:{}};return t[s].call(a.exports,a,a.exports,e),a.l=!0,a.exports}var i={};return e.m=t,e.c=i,e.i=function(t){return t},e.d=function(t,i,s){e.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:s})},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/",e(e.s=8)}([function(e,i){e.exports=t},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=i(0),a=function(t){return t&&t.__esModule?t:{default:t}}(s),n=function(t,e,i){this._construct(t,e,i)};n.prototype=a.default.createModulePrototype(),n.prototype.name="listing",n.prototype._construct=function(t,e,i){this.init(t,e,i),i&&(this.options=Object.assign(this.options,i)),this._config=this.options.config,this._namespace=this._config.namespace,this._orderQuery=this._namespace+"[order]",this._sortByQuery=this._namespace+"[sortBy]",this._limitQuery=this._namespace+"[limit]",this._pageQuery=this._namespace+"[page]",this._filtersQuery=this._namespace+"[filters]",this._valuesQuery=this._namespace+"[values]",this.listingId=e.id,this.els={node:e,sorters:e.querySelectorAll("[data-sorter]"),form:document.querySelector('[data-listing-id="'+this.listingId+'"]')||!1},window.form=this.els.form,this.searchRegexp=new RegExp(this.options.config.namespace+"\\[filters\\]\\[\\d+\\]","i"),this.updateControls(),this.addEventListeners()},n.prototype.optionsToGrab={config:{value:!1,domAttr:"data-config",processor:function(t,e){if(!e)return!1;if("string"==typeof e)try{e=JSON.parse(e)}catch(t){console.error("Listing config JSON.parse error: ",t)}return e}},iconASC:{value:'<i class="sf-listing-icon-sort-asc"></i>',domAttr:"data-icon-asc"},iconDESC:{value:'<i class="sf-listing-icon-sort-desc"></i>',domAttr:"data-icon-desc"},iconSorter:{value:'<i class="sf-listing-icon-sort"></i>',domAttr:"data-icon-sorter"},pagination:{value:!0,domAttr:"data-pagination",processor:function(t,e){return"boolean"==typeof e?e:(e=void 0!==e&&null!==e?e.toLowerCase():"",e="false"!==e&&("true"===e||this.value))}},paginationPages:{value:7,domAttr:"data-pagination-pages"},paginationWrapperClass:{value:"pagination js-sf-listing-pagination row center-align",domAttr:"data-pagination-wrapper"},paginationPageClass:{value:"waves-effect",domAttr:"data-pagination-page-class"},paginationActiveClass:{value:"active",domAttr:"data-pagination-active-class"},paginationDisabledClass:{value:"disabled",domAttr:"data-pagination-disabled-class"},paginationPrevContent:{value:'<i class="toolkit-icon-left"></i>',domAttr:"data-pagination-prev"},paginationNextContent:{value:'<i class="toolkit-icon-right"></i>',domAttr:"data-pagination-next"},paginationFirstContent:{value:'<i class="toolkit-icon-left stacked"></i><i class="toolkit-icon-left stacked"></i>',domAttr:"data-pagination-first"},paginationLastContent:{value:'<i class="toolkit-icon-right stacked"></i><i class="toolkit-icon-right stacked"></i>',domAttr:"data-pagination-last"},limits:{value:!0,domAttr:"data-limits",processor:function(t,e){return"boolean"==typeof e?e:(e=void 0!==e&&null!==e?e.toLowerCase():"",e="false"!==e&&("true"===e||this.value))}},limitsWrapperClass:{value:"js-sf-listing-limits right input-field item-form col s2",domAttr:"data-limits-wrapper"},limitsLabel:{value:'<span class="label">Show: </span>',domAttr:"data-limits-label"}},n.prototype.updateControls=function(){var t=this;if(this.options.pagination&&this.generatePagination(),this.options.limits){this.els.limits={wrapper:document.createElement("div"),select:document.createElement("select")};for(var e=0;e<this._config.pagination.limits.length;e++){var i=document.createElement("option");i.value=this._config.pagination.limits[e],i.text=this._config.pagination.limits[e],i.selected=this._config.pagination.limits[e]===this._config.pagination.limit,this.els.limits.select.appendChild(i)}this.els.limits.wrapper.setAttribute("class",this.options.limitsWrapperClass),this.els.limits.wrapper.innerHTML=this.options.limitsLabel,this.els.limits.wrapper.appendChild(this.els.limits.select),this.els.node.parentNode.appendChild(this.els.limits.wrapper,this.els.node),this.options.pagination&&this.els.limits.wrapper.classList.add("stacked-right"),window.jQuery&&"function"==typeof window.jQuery(this.els.limits.select).material_select&&window.jQuery(this.els.limits.select).material_select(this.performLimits.bind(this))}this.els.form&&[].forEach.call(this.els.form.querySelectorAll("input, select"),function(e){t._config.filters&&t._config.filters[e.name]&&(e.value=t._config.filters[e.name])});for(var s=0;s<this.els.sorters.length;++s)this.els.sorters[s].dataset.sorter===this._config.sorting.sorter?this.els.sorters[s].innerHTML+="asc"===this._config.sorting.direction?this.options.iconASC:this.options.iconDESC:this.els.sorters[s].innerHTML+=this.options.iconSorter},n.prototype.generatePagination=function(){var t=this,e=1,i=this._config.pagination.page,s=this._config.pagination.page;for(this.els.pagination={wrapper:document.createElement("ul"),firstPage:document.createElement("li"),prevPage:document.createElement("li"),page:document.createElement("li"),nextPage:document.createElement("li"),lastPage:document.createElement("li")},this.pagination={prevPages:[],currentPage:this._config.pagination.page,nextPages:[]};e<this.options.paginationPages&&(i-1>=1&&(i--,this.pagination.prevPages.unshift(i),e++),s+1<=this._config.pagination.countPages&&(s++,this.pagination.nextPages.push(s),e++),!(i-1<1&&s+1>this._config.pagination.countPages)););this.els.pagination.wrapper.setAttribute("class",this.options.paginationWrapperClass),this.els.pagination.firstPage.setAttribute("class",this._config.pagination.firstPage?this.options.paginationPageClass:this.options.paginationDisabledClass),this.els.pagination.firstPage.innerHTML="<a>"+this.options.paginationFirstContent+"</a>",this.els.pagination.firstPage.dataset.page=1,this.els.pagination.lastPage.setAttribute("class",this._config.pagination.nextPage?this.options.paginationPageClass:this.options.paginationDisabledClass),this.els.pagination.lastPage.innerHTML="<a>"+this.options.paginationLastContent+"</a>",this.els.pagination.lastPage.dataset.page=this._config.pagination.countPages,this.els.pagination.prevPage.setAttribute("class",this._config.pagination.previousPage?this.options.paginationPageClass:this.options.paginationDisabledClass),this.els.pagination.prevPage.innerHTML="<a>"+this.options.paginationPrevContent+"</a>",this.els.pagination.prevPage.dataset.page=this.pagination.currentPage-1,this.els.pagination.nextPage.setAttribute("class",this._config.pagination.nextPage?this.options.paginationPageClass:this.options.paginationDisabledClass),this.els.pagination.nextPage.innerHTML="<a>"+this.options.paginationNextContent+"</a>",this.els.pagination.nextPage.dataset.page=this.pagination.currentPage+1,this.els.pagination.wrapper.appendChild(this.els.pagination.firstPage),this.els.pagination.wrapper.appendChild(this.els.pagination.prevPage),this.pagination.prevPages.concat(this.pagination.currentPage,this.pagination.nextPages).forEach(function(e){t.els.pagination.page.dataset.page=e,t.els.pagination.page.innerHTML="<a>"+e+"</a>",t.els.pagination.page.setAttribute("class",e===t.pagination.currentPage?t.options.paginationActiveClass:t.options.paginationPageClass),t.els.pagination.wrapper.appendChild(t.els.pagination.page.cloneNode(!0))}),this.els.pagination.wrapper.appendChild(this.els.pagination.nextPage),this.els.pagination.wrapper.appendChild(this.els.pagination.lastPage),this.els.node.parentNode.insertBefore(this.els.pagination.wrapper,this.els.node.nextSibling),this.els.pagination.activePages=this.els.pagination.wrapper.querySelectorAll("."+this.options.paginationPageClass)},n.prototype.performSorting=function(t){this.searchQuery=this.getQueryParams(),this.searchQuery[this._sortByQuery]=t.dataset.sorter,this._config.sorting.sorter===t.dataset.sorter?this.searchQuery[this._orderQuery]="asc"!==this.searchQuery[this._orderQuery]&&this.searchQuery[this._orderQuery]?"asc":"desc":this.searchQuery[this._orderQuery]="asc",this.searchQuery[this._sortByQuery]=t.dataset.sorter,this.updateListing()},n.prototype.performFilters=function(t){t.target.tagName&&"INPUT"===t.target.tagName&&13!==(t.which?t.which:t.keyCode)||(this.searchQuery=this.getQueryParams(),t.target.value?(this._config.filters[t.target.name]||(this.searchQuery[this._filtersQuery+"["+this.newFilterIndex()+"]"]=t.target.name),this.searchQuery[this._valuesQuery+"["+t.target.name+"]"]=t.target.value):this.clearFilter(t),this.compactFilterIndexes(),this.clearPagination(),this.updateListing())},n.prototype.clearFilter=function(t){this.searchQuery=this.getQueryParams();for(var e in this.searchQuery)if(this.searchQuery.hasOwnProperty(e)&&this.searchRegexp.test(e)&&this.searchQuery[e]===t.target.name){delete this.searchQuery[e];break}delete this.searchQuery[this._valuesQuery+"["+t.target.name+"]"]},n.prototype.compactFilterIndexes=function(){var t={},e=0;for(var i in this.searchQuery)this.searchQuery.hasOwnProperty(i)&&this.searchRegexp.test(i)&&(t[i]=this.searchQuery[i],delete this.searchQuery[i]);for(i in t)t.hasOwnProperty(i)&&(this.searchQuery[i.substr(0,i.lastIndexOf("[")+1)+e+i.substr(i.lastIndexOf("]"))]=t[i],e++)},n.prototype.newFilterIndex=function(){for(var t=0,e=null;!e;){if(!this.searchQuery[this._filtersQuery+"["+t+"]"]){e=t;break}t++}return e},n.prototype.performPagination=function(t){this.searchQuery=this.getQueryParams(),1==+t.dataset.page?this.clearPagination():this.searchQuery[this._pageQuery]=t.dataset.page,this.updateListing()},n.prototype.performLimits=function(){this.searchQuery=this.getQueryParams(),+this.els.limits.select.value===this._config.pagination.limits[0]?delete this.searchQuery[this._limitQuery]:this.searchQuery[this._limitQuery]=this.els.limits.select.value,this.updateListing()},n.prototype.clearPagination=function(){delete this.searchQuery[this._pageQuery]},n.prototype.getQueryParams=function(t){return t||document.location.search?(t||document.location.search).replace(/(^\?)/,"").split("&").map(function(t){return t=t.split("="),this[t[0]]=decodeURIComponent(t[1]),this}.bind({}))[0]:{}},n.prototype.stringifyObject=function(t){if(0===Object.getOwnPropertyNames(t).length)return"";var e="?";for(var i in t)t.hasOwnProperty(i)&&(e+=i+"="+encodeURIComponent(t[i])+"&");return e.slice(0,-1)},n.prototype.updateListing=function(){location.search=this.stringifyObject(this.searchQuery)},n.prototype.addEventListeners=function(){var t=this;if(this._performSorting=function(e){return t.performSorting(e.target)},this._performFilters=function(e){return t.performFilters(e)},this._performPagination=function(e){return t.performPagination(e.target)},this._performLimits=function(){return t.performLimits()},this.els.sorters)for(var e=0;e<this.els.sorters.length;++e)this.els.sorters[e].addEventListener("click",this._performSorting);if(this.els.pagination&&this.els.pagination.activePages)for(var i=0;i<this.els.pagination.activePages.length;++i)this.els.pagination.activePages[i].addEventListener("click",this._performPagination);this.els.form&&([].forEach.call(this.els.form.querySelectorAll("select"),function(e){e.addEventListener("change",t._performFilters),window.jQuery&&"function"==typeof window.jQuery("select").material_select&&window.jQuery(e).on("change",t._performFilters)}),[].forEach.call(this.els.form.querySelectorAll("input:not(.js-sf-autocomplete)"),function(e){e.addEventListener("keydown",t._performFilters)}),[].forEach.call(this.els.form.querySelectorAll("input.js-sf-autocomplete"),function(e){var i=a.default.getInstance("autocomplete",e);i.retrieveValueByKey(),i&&i.events&&(i.events.on("select",function(e){var i={target:{name:e.els.hidden.name,value:e.els.hidden.value}};t._performFilters(i)}),i.events.on("clear",function(e){var i={target:{name:e.els.hidden.name,value:""}};t._performFilters(i)}))})),this.els.limits&&this.els.limits.select.addEventListener("change",this._performLimits)},n.prototype.removeEventListeners=function(){var t=this;if(this.els.sorters)for(var e=0;e<this.els.sorters.length;++e)this.els.sorters[e].removeEventListeners("click",this._performSorting);if(this.els.pagination&&this.els.pagination.activePages)for(var i=0;i<this.els.pagination.activePages.length;++i)this.els.pagination.activePages[i].removeEventListener("click",this._performPagination);this.els.limits&&this.els.limits.select.removeEventListener("change",this._performLimits),this.els.form&&([].forEach.call(this.els.form.querySelectorAll("select"),function(e){e.removeEventListeners("change",t._performFilters)}),[].forEach.call(this.els.form.querySelectorAll("input"),function(e){e.removeEventListeners("keydown",t._performFilters)}))},n.prototype.die=function(){this.removeEventListeners()},e.default=n},function(t,e,i){"use strict";var s=i(0),a=i(1).default;s.registerInstanceType(a,"js-sf-listing"),t.exports=a},,,,,,function(t,e,i){t.exports=i(2)}])});
//# sourceMappingURL=sf.listing.nostyles.js.map