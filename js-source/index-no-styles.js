"use strict";
var sf = require('sf-core');
var Listing = require('./listing').default;

sf.registerInstanceType(Listing);

module.exports = Listing; // ES6 default export will not expose us as global
