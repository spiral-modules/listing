"use strict";
var sf = require('sf-core');
var Listing = require('./listing').default;
requite("./listing.scss");

sf.registerInstanceType(Listing, "js-sf-listing");

module.exports = Listing; // ES6 default export will not expose us as global
