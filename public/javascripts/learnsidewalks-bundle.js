(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["App"] = factory();
	else
		root["App"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _path = __webpack_require__(2);

	var _path2 = _interopRequireDefault(_path);

	// Order matters for L vs. the polylinedecorator modules

	var _mapboxJs = __webpack_require__(7);

	var _mapboxJs2 = _interopRequireDefault(_mapboxJs);

	__webpack_require__(38);

	__webpack_require__(39);

	__webpack_require__(44);

	function App(learn_url, api_url, user) {
	  'use strict';
	  var api = api_url.replace(/\/?$/, '/') + 'v1';
	  var mapinfo = _jquery2['default'].ajax({
	    url: api + '/mapinfo',
	    dataType: 'json'
	  });

	  mapinfo.done(function (mapdata) {
	    _mapboxJs2['default'].mapbox.accessToken = mapdata.token;
	    var map = _mapboxJs2['default'].map('map');

	    var layers = {
	      streets: _mapboxJs2['default'].mapbox.tileLayer('mapbox.streets'),
	      satellite: _mapboxJs2['default'].mapbox.tileLayer('mapbox.streets-satellite')
	    };

	    layers.streets.addTo(map);

	    var layersControl = _mapboxJs2['default'].control.layers(layers, null, {
	      collapsed: false
	    });
	    layersControl.addTo(map);

	    // Add score control
	    var scoreControl = _mapboxJs2['default'].Control.extend({
	      initialize: function initialize(foo, options) {
	        _mapboxJs2['default'].Util.setOptions(this, options);
	      },
	      options: {
	        position: 'bottomleft'
	      },
	      onAdd: function onAdd(map) {
	        this._container = _mapboxJs2['default'].DomUtil.create('div', 'leaflet-score-control leaflet-bar');
	        this._container.innerHTML = 'Added: ';
	        return this._container;
	      },
	      updateScore: function updateScore(score) {
	        this._container.innerHTML = 'Added: ' + score;
	      }
	    });

	    var sControl = new scoreControl();

	    var currentDat = undefined;
	    // this gets the data
	    _jquery2['default'].ajax({
	      type: 'GET',
	      contentType: 'application/json; charset=utf-8',
	      url: '/getdata'
	    }).done(function (data) {
	      // Parse FeatureCollection and username
	      var fc = JSON.parse(data);
	      var score = fc.features[2].properties.score;
	      if (score === undefined) {
	        var _score = 'NA';
	      }

	      // adds to the map the first feature
	      function makePopup(feature, layer) {
	        if (feature.properties && feature.properties.type === 'sw') {
	          var desc = '<p>' + feature.properties.desc + '</p>';
	          var side = '<p>Side: ' + feature.properties.side + '</p';
	          layer.bindPopup(desc + side);
	        }
	      }
	      _mapboxJs2['default'].geoJson(fc.features[2], {
	        onEachFeature: function onEachFeature(feature, layer) {
	          _mapboxJs2['default'].polylineDecorator(layer, {
	            patterns: [{ offset: 0,
	              repeat: 8,
	              symbol: _mapboxJs2['default'].Symbol.dash({
	                pixelSize: 1, pathOptions: {
	                  weight: 6,
	                  opacity: 1,
	                  color: '#0c0'
	                }
	              }) }]
	          }).addTo(map);
	        }
	      });

	      _mapboxJs2['default'].geoJson(fc.features[2], {
	        onEachFeature: function onEachFeature(feature, layer) {
	          _mapboxJs2['default'].polylineDecorator(layer, {
	            patterns: [{ offset: 0,
	              repeat: 8,
	              symbol: _mapboxJs2['default'].Symbol.dash({
	                pixelSize: 1, pathOptions: {
	                  weight: 5,
	                  opacity: 1,
	                  color: '#0f0'
	                }
	              }) }]
	          }).addTo(map);
	        }
	      });

	      _mapboxJs2['default'].geoJson(fc.features[0], {
	        opacity: 1,
	        color: '#cdf',
	        weight: 8,
	        onEachFeature: makePopup
	      }).addTo(map);
	      _mapboxJs2['default'].geoJson(fc.features[0], {
	        opacity: 0.9,
	        weight: 4,
	        onEachFeature: makePopup
	      }).addTo(map);

	      _mapboxJs2['default'].geoJson(fc.features[1], {
	        opacity: 1,
	        color: '#cdf',
	        weight: 8,
	        onEachFeature: makePopup
	      }).addTo(map);
	      _mapboxJs2['default'].geoJson(fc.features[1], {
	        opacity: 0.9,
	        weight: 4,
	        onEachFeature: makePopup
	      }).addTo(map);

	      var LongLat = fc.features[1].geometry.coordinates[1];
	      map.setView([LongLat[1], LongLat[0]], 18);
	      currentDat = fc;

	      // Update score control
	      sControl.addTo(map);
	      sControl.updateScore(score);
	    });

	    function submitResult(learn_url, geojson, classification) {
	      _jquery2['default'].ajax({
	        type: 'POST',
	        contentType: 'application/json; charset=utf-8',
	        url: learn_url + '/submit',
	        data: JSON.stringify({
	          user: user,
	          geojson: geojson,
	          classification: classification
	        })
	      }).done(function () {
	        return location.reload();
	      }).fail(function (e) {
	        return console.log('Error: ' + e);
	      });
	    }

	    (0, _jquery2['default'])('#conn').click(function () {
	      return submitResult(learn_url, currentDat, 1);
	    });

	    (0, _jquery2['default'])('#Noconn').click(function () {
	      return submitResult(learn_url, currentDat, 0);
	    });
	  });
	}

	exports['default'] = App;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jQuery JavaScript Library v2.2.0
	 * http://jquery.com/
	 *
	 * Includes Sizzle.js
	 * http://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2016-01-08T20:02Z
	 */

	(function( global, factory ) {

		if ( typeof module === "object" && typeof module.exports === "object" ) {
			// For CommonJS and CommonJS-like environments where a proper `window`
			// is present, execute the factory and get jQuery.
			// For environments that do not have a `window` with a `document`
			// (such as Node.js), expose a factory as module.exports.
			// This accentuates the need for the creation of a real `window`.
			// e.g. var jQuery = require("jquery")(window);
			// See ticket #14549 for more info.
			module.exports = global.document ?
				factory( global, true ) :
				function( w ) {
					if ( !w.document ) {
						throw new Error( "jQuery requires a window with a document" );
					}
					return factory( w );
				};
		} else {
			factory( global );
		}

	// Pass this if window is not defined yet
	}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

	// Support: Firefox 18+
	// Can't be in strict mode, several libs including ASP.NET trace
	// the stack via arguments.caller.callee and Firefox dies if
	// you try to trace through "use strict" call chains. (#13335)
	//"use strict";
	var arr = [];

	var document = window.document;

	var slice = arr.slice;

	var concat = arr.concat;

	var push = arr.push;

	var indexOf = arr.indexOf;

	var class2type = {};

	var toString = class2type.toString;

	var hasOwn = class2type.hasOwnProperty;

	var support = {};



	var
		version = "2.2.0",

		// Define a local copy of jQuery
		jQuery = function( selector, context ) {

			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init( selector, context );
		},

		// Support: Android<4.1
		// Make sure we trim BOM and NBSP
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

		// Matches dashed string for camelizing
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([\da-z])/gi,

		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		};

	jQuery.fn = jQuery.prototype = {

		// The current version of jQuery being used
		jquery: version,

		constructor: jQuery,

		// Start with an empty selector
		selector: "",

		// The default length of a jQuery object is 0
		length: 0,

		toArray: function() {
			return slice.call( this );
		},

		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function( num ) {
			return num != null ?

				// Return just the one element from the set
				( num < 0 ? this[ num + this.length ] : this[ num ] ) :

				// Return all the elements in a clean array
				slice.call( this );
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function( elems ) {

			// Build a new jQuery matched element set
			var ret = jQuery.merge( this.constructor(), elems );

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
			ret.context = this.context;

			// Return the newly-formed element set
			return ret;
		},

		// Execute a callback for every element in the matched set.
		each: function( callback ) {
			return jQuery.each( this, callback );
		},

		map: function( callback ) {
			return this.pushStack( jQuery.map( this, function( elem, i ) {
				return callback.call( elem, i, elem );
			} ) );
		},

		slice: function() {
			return this.pushStack( slice.apply( this, arguments ) );
		},

		first: function() {
			return this.eq( 0 );
		},

		last: function() {
			return this.eq( -1 );
		},

		eq: function( i ) {
			var len = this.length,
				j = +i + ( i < 0 ? len : 0 );
			return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
		},

		end: function() {
			return this.prevObject || this.constructor();
		},

		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};

	jQuery.extend = jQuery.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[ 0 ] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;

			// Skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}

		for ( ; i < length; i++ ) {

			// Only deal with non-null/undefined values
			if ( ( options = arguments[ i ] ) != null ) {

				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
						( copyIsArray = jQuery.isArray( copy ) ) ) ) {

						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray( src ) ? src : [];

						} else {
							clone = src && jQuery.isPlainObject( src ) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	jQuery.extend( {

		// Unique for each copy of jQuery on the page
		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

		// Assume jQuery is ready without the ready module
		isReady: true,

		error: function( msg ) {
			throw new Error( msg );
		},

		noop: function() {},

		isFunction: function( obj ) {
			return jQuery.type( obj ) === "function";
		},

		isArray: Array.isArray,

		isWindow: function( obj ) {
			return obj != null && obj === obj.window;
		},

		isNumeric: function( obj ) {

			// parseFloat NaNs numeric-cast false positives (null|true|false|"")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			// adding 1 corrects loss of precision from parseFloat (#15100)
			var realStringObj = obj && obj.toString();
			return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
		},

		isPlainObject: function( obj ) {

			// Not plain objects:
			// - Any object or value whose internal [[Class]] property is not "[object Object]"
			// - DOM nodes
			// - window
			if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
				return false;
			}

			if ( obj.constructor &&
					!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}

			// If the function hasn't returned already, we're confident that
			// |obj| is a plain object, created by {} or constructed with new Object
			return true;
		},

		isEmptyObject: function( obj ) {
			var name;
			for ( name in obj ) {
				return false;
			}
			return true;
		},

		type: function( obj ) {
			if ( obj == null ) {
				return obj + "";
			}

			// Support: Android<4.0, iOS<6 (functionish RegExp)
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[ toString.call( obj ) ] || "object" :
				typeof obj;
		},

		// Evaluates a script in a global context
		globalEval: function( code ) {
			var script,
				indirect = eval;

			code = jQuery.trim( code );

			if ( code ) {

				// If the code includes a valid, prologue position
				// strict mode pragma, execute code by injecting a
				// script tag into the document.
				if ( code.indexOf( "use strict" ) === 1 ) {
					script = document.createElement( "script" );
					script.text = code;
					document.head.appendChild( script ).parentNode.removeChild( script );
				} else {

					// Otherwise, avoid the DOM node creation, insertion
					// and removal by using an indirect global eval

					indirect( code );
				}
			}
		},

		// Convert dashed to camelCase; used by the css and data modules
		// Support: IE9-11+
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function( string ) {
			return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
		},

		nodeName: function( elem, name ) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},

		each: function( obj, callback ) {
			var length, i = 0;

			if ( isArrayLike( obj ) ) {
				length = obj.length;
				for ( ; i < length; i++ ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			}

			return obj;
		},

		// Support: Android<4.1
		trim: function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

		// results is for internal usage only
		makeArray: function( arr, results ) {
			var ret = results || [];

			if ( arr != null ) {
				if ( isArrayLike( Object( arr ) ) ) {
					jQuery.merge( ret,
						typeof arr === "string" ?
						[ arr ] : arr
					);
				} else {
					push.call( ret, arr );
				}
			}

			return ret;
		},

		inArray: function( elem, arr, i ) {
			return arr == null ? -1 : indexOf.call( arr, elem, i );
		},

		merge: function( first, second ) {
			var len = +second.length,
				j = 0,
				i = first.length;

			for ( ; j < len; j++ ) {
				first[ i++ ] = second[ j ];
			}

			first.length = i;

			return first;
		},

		grep: function( elems, callback, invert ) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;

			// Go through the array, only saving the items
			// that pass the validator function
			for ( ; i < length; i++ ) {
				callbackInverse = !callback( elems[ i ], i );
				if ( callbackInverse !== callbackExpect ) {
					matches.push( elems[ i ] );
				}
			}

			return matches;
		},

		// arg is for internal usage only
		map: function( elems, callback, arg ) {
			var length, value,
				i = 0,
				ret = [];

			// Go through the array, translating each of the items to their new values
			if ( isArrayLike( elems ) ) {
				length = elems.length;
				for ( ; i < length; i++ ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret.push( value );
					}
				}

			// Go through every key on the object,
			} else {
				for ( i in elems ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret.push( value );
					}
				}
			}

			// Flatten any nested arrays
			return concat.apply( [], ret );
		},

		// A global GUID counter for objects
		guid: 1,

		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function( fn, context ) {
			var tmp, args, proxy;

			if ( typeof context === "string" ) {
				tmp = fn[ context ];
				context = fn;
				fn = tmp;
			}

			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if ( !jQuery.isFunction( fn ) ) {
				return undefined;
			}

			// Simulated bind
			args = slice.call( arguments, 2 );
			proxy = function() {
				return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
			};

			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;

			return proxy;
		},

		now: Date.now,

		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	} );

	// JSHint would error on this code due to the Symbol not being defined in ES5.
	// Defining this global in .jshintrc would create a danger of using the global
	// unguarded in another place, it seems safer to just disable JSHint for these
	// three lines.
	/* jshint ignore: start */
	if ( typeof Symbol === "function" ) {
		jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
	}
	/* jshint ignore: end */

	// Populate the class2type map
	jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );

	function isArrayLike( obj ) {

		// Support: iOS 8.2 (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
			type = jQuery.type( obj );

		if ( type === "function" || jQuery.isWindow( obj ) ) {
			return false;
		}

		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
	}
	var Sizzle =
	/*!
	 * Sizzle CSS Selector Engine v2.2.1
	 * http://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2015-10-17
	 */
	(function( window ) {

	var i,
		support,
		Expr,
		getText,
		isXML,
		tokenize,
		compile,
		select,
		outermostContext,
		sortInput,
		hasDuplicate,

		// Local document vars
		setDocument,
		document,
		docElem,
		documentIsHTML,
		rbuggyQSA,
		rbuggyMatches,
		matches,
		contains,

		// Instance-specific data
		expando = "sizzle" + 1 * new Date(),
		preferredDoc = window.document,
		dirruns = 0,
		done = 0,
		classCache = createCache(),
		tokenCache = createCache(),
		compilerCache = createCache(),
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
			}
			return 0;
		},

		// General-purpose constants
		MAX_NEGATIVE = 1 << 31,

		// Instance methods
		hasOwn = ({}).hasOwnProperty,
		arr = [],
		pop = arr.pop,
		push_native = arr.push,
		push = arr.push,
		slice = arr.slice,
		// Use a stripped-down indexOf as it's faster than native
		// http://jsperf.com/thor-indexof-vs-for/5
		indexOf = function( list, elem ) {
			var i = 0,
				len = list.length;
			for ( ; i < len; i++ ) {
				if ( list[i] === elem ) {
					return i;
				}
			}
			return -1;
		},

		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

		// Regular expressions

		// http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",

		// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
			// Operator (capture 2)
			"*([*^$|!~]?=)" + whitespace +
			// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
			"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
			"*\\]",

		pseudos = ":(" + identifier + ")(?:\\((" +
			// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
			// 1. quoted (capture 3; capture 4 or capture 5)
			"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
			// 2. simple (capture 6)
			"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
			// 3. anything else (capture 2)
			".*" +
			")\\)|)",

		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rwhitespace = new RegExp( whitespace + "+", "g" ),
		rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
		rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

		rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

		rpseudo = new RegExp( pseudos ),
		ridentifier = new RegExp( "^" + identifier + "$" ),

		matchExpr = {
			"ID": new RegExp( "^#(" + identifier + ")" ),
			"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
			"TAG": new RegExp( "^(" + identifier + "|[*])" ),
			"ATTR": new RegExp( "^" + attributes ),
			"PSEUDO": new RegExp( "^" + pseudos ),
			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
				"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
				"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
				whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		},

		rinputs = /^(?:input|select|textarea|button)$/i,
		rheader = /^h\d$/i,

		rnative = /^[^{]+\{\s*\[native \w/,

		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

		rsibling = /[+~]/,
		rescape = /'|\\/g,

		// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
		funescape = function( _, escaped, escapedWhitespace ) {
			var high = "0x" + escaped - 0x10000;
			// NaN means non-codepoint
			// Support: Firefox<24
			// Workaround erroneous numeric interpretation of +"0x"
			return high !== high || escapedWhitespace ?
				escaped :
				high < 0 ?
					// BMP codepoint
					String.fromCharCode( high + 0x10000 ) :
					// Supplemental Plane codepoint (surrogate pair)
					String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
		},

		// Used for iframes
		// See setDocument()
		// Removing the function wrapper causes a "Permission Denied"
		// error in IE
		unloadHandler = function() {
			setDocument();
		};

	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(
			(arr = slice.call( preferredDoc.childNodes )),
			preferredDoc.childNodes
		);
		// Support: Android<4.0
		// Detect silently failing push.apply
		arr[ preferredDoc.childNodes.length ].nodeType;
	} catch ( e ) {
		push = { apply: arr.length ?

			// Leverage slice if possible
			function( target, els ) {
				push_native.apply( target, slice.call(els) );
			} :

			// Support: IE<9
			// Otherwise append directly
			function( target, els ) {
				var j = target.length,
					i = 0;
				// Can't trust NodeList.length
				while ( (target[j++] = els[i++]) ) {}
				target.length = j - 1;
			}
		};
	}

	function Sizzle( selector, context, results, seed ) {
		var m, i, elem, nid, nidselect, match, groups, newSelector,
			newContext = context && context.ownerDocument,

			// nodeType defaults to 9, since context defaults to document
			nodeType = context ? context.nodeType : 9;

		results = results || [];

		// Return early from calls with invalid selector or context
		if ( typeof selector !== "string" || !selector ||
			nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

			return results;
		}

		// Try to shortcut find operations (as opposed to filters) in HTML documents
		if ( !seed ) {

			if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
				setDocument( context );
			}
			context = context || document;

			if ( documentIsHTML ) {

				// If the selector is sufficiently simple, try using a "get*By*" DOM method
				// (excepting DocumentFragment context, where the methods don't exist)
				if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

					// ID selector
					if ( (m = match[1]) ) {

						// Document context
						if ( nodeType === 9 ) {
							if ( (elem = context.getElementById( m )) ) {

								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementById can match elements by name instead of ID
								if ( elem.id === m ) {
									results.push( elem );
									return results;
								}
							} else {
								return results;
							}

						// Element context
						} else {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( newContext && (elem = newContext.getElementById( m )) &&
								contains( context, elem ) &&
								elem.id === m ) {

								results.push( elem );
								return results;
							}
						}

					// Type selector
					} else if ( match[2] ) {
						push.apply( results, context.getElementsByTagName( selector ) );
						return results;

					// Class selector
					} else if ( (m = match[3]) && support.getElementsByClassName &&
						context.getElementsByClassName ) {

						push.apply( results, context.getElementsByClassName( m ) );
						return results;
					}
				}

				// Take advantage of querySelectorAll
				if ( support.qsa &&
					!compilerCache[ selector + " " ] &&
					(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

					if ( nodeType !== 1 ) {
						newContext = context;
						newSelector = selector;

					// qSA looks outside Element context, which is not what we want
					// Thanks to Andrew Dupont for this workaround technique
					// Support: IE <=8
					// Exclude object elements
					} else if ( context.nodeName.toLowerCase() !== "object" ) {

						// Capture the context ID, setting it first if necessary
						if ( (nid = context.getAttribute( "id" )) ) {
							nid = nid.replace( rescape, "\\$&" );
						} else {
							context.setAttribute( "id", (nid = expando) );
						}

						// Prefix every selector in the list
						groups = tokenize( selector );
						i = groups.length;
						nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
						while ( i-- ) {
							groups[i] = nidselect + " " + toSelector( groups[i] );
						}
						newSelector = groups.join( "," );

						// Expand context for sibling selectors
						newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
							context;
					}

					if ( newSelector ) {
						try {
							push.apply( results,
								newContext.querySelectorAll( newSelector )
							);
							return results;
						} catch ( qsaError ) {
						} finally {
							if ( nid === expando ) {
								context.removeAttribute( "id" );
							}
						}
					}
				}
			}
		}

		// All others
		return select( selector.replace( rtrim, "$1" ), context, results, seed );
	}

	/**
	 * Create key-value caches of limited size
	 * @returns {function(string, object)} Returns the Object data after storing it on itself with
	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	 *	deleting the oldest entry
	 */
	function createCache() {
		var keys = [];

		function cache( key, value ) {
			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
			if ( keys.push( key + " " ) > Expr.cacheLength ) {
				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return (cache[ key + " " ] = value);
		}
		return cache;
	}

	/**
	 * Mark a function for special use by Sizzle
	 * @param {Function} fn The function to mark
	 */
	function markFunction( fn ) {
		fn[ expando ] = true;
		return fn;
	}

	/**
	 * Support testing using an element
	 * @param {Function} fn Passed the created div and expects a boolean result
	 */
	function assert( fn ) {
		var div = document.createElement("div");

		try {
			return !!fn( div );
		} catch (e) {
			return false;
		} finally {
			// Remove from its parent by default
			if ( div.parentNode ) {
				div.parentNode.removeChild( div );
			}
			// release memory in IE
			div = null;
		}
	}

	/**
	 * Adds the same handler for all of the specified attrs
	 * @param {String} attrs Pipe-separated list of attributes
	 * @param {Function} handler The method that will be applied
	 */
	function addHandle( attrs, handler ) {
		var arr = attrs.split("|"),
			i = arr.length;

		while ( i-- ) {
			Expr.attrHandle[ arr[i] ] = handler;
		}
	}

	/**
	 * Checks document order of two siblings
	 * @param {Element} a
	 * @param {Element} b
	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
	 */
	function siblingCheck( a, b ) {
		var cur = b && a,
			diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
				( ~b.sourceIndex || MAX_NEGATIVE ) -
				( ~a.sourceIndex || MAX_NEGATIVE );

		// Use IE sourceIndex if available on both nodes
		if ( diff ) {
			return diff;
		}

		// Check if b follows a
		if ( cur ) {
			while ( (cur = cur.nextSibling) ) {
				if ( cur === b ) {
					return -1;
				}
			}
		}

		return a ? 1 : -1;
	}

	/**
	 * Returns a function to use in pseudos for input types
	 * @param {String} type
	 */
	function createInputPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for buttons
	 * @param {String} type
	 */
	function createButtonPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for positionals
	 * @param {Function} fn
	 */
	function createPositionalPseudo( fn ) {
		return markFunction(function( argument ) {
			argument = +argument;
			return markFunction(function( seed, matches ) {
				var j,
					matchIndexes = fn( [], seed.length, argument ),
					i = matchIndexes.length;

				// Match elements found at the specified indexes
				while ( i-- ) {
					if ( seed[ (j = matchIndexes[i]) ] ) {
						seed[j] = !(matches[j] = seed[j]);
					}
				}
			});
		});
	}

	/**
	 * Checks a node for validity as a Sizzle context
	 * @param {Element|Object=} context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
	 */
	function testContext( context ) {
		return context && typeof context.getElementsByTagName !== "undefined" && context;
	}

	// Expose support vars for convenience
	support = Sizzle.support = {};

	/**
	 * Detects XML nodes
	 * @param {Element|Object} elem An element or a document
	 * @returns {Boolean} True iff elem is a non-HTML XML node
	 */
	isXML = Sizzle.isXML = function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = elem && (elem.ownerDocument || elem).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};

	/**
	 * Sets document-related variables once based on the current document
	 * @param {Element|Object} [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */
	setDocument = Sizzle.setDocument = function( node ) {
		var hasCompare, parent,
			doc = node ? node.ownerDocument || node : preferredDoc;

		// Return early if doc is invalid or already selected
		if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
			return document;
		}

		// Update global variables
		document = doc;
		docElem = document.documentElement;
		documentIsHTML = !isXML( document );

		// Support: IE 9-11, Edge
		// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
		if ( (parent = document.defaultView) && parent.top !== parent ) {
			// Support: IE 11
			if ( parent.addEventListener ) {
				parent.addEventListener( "unload", unloadHandler, false );

			// Support: IE 9 - 10 only
			} else if ( parent.attachEvent ) {
				parent.attachEvent( "onunload", unloadHandler );
			}
		}

		/* Attributes
		---------------------------------------------------------------------- */

		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties
		// (excepting IE8 booleans)
		support.attributes = assert(function( div ) {
			div.className = "i";
			return !div.getAttribute("className");
		});

		/* getElement(s)By*
		---------------------------------------------------------------------- */

		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert(function( div ) {
			div.appendChild( document.createComment("") );
			return !div.getElementsByTagName("*").length;
		});

		// Support: IE<9
		support.getElementsByClassName = rnative.test( document.getElementsByClassName );

		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programatically-set names,
		// so use a roundabout getElementsByName test
		support.getById = assert(function( div ) {
			docElem.appendChild( div ).id = expando;
			return !document.getElementsByName || !document.getElementsByName( expando ).length;
		});

		// ID find and filter
		if ( support.getById ) {
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var m = context.getElementById( id );
					return m ? [ m ] : [];
				}
			};
			Expr.filter["ID"] = function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					return elem.getAttribute("id") === attrId;
				};
			};
		} else {
			// Support: IE6/7
			// getElementById is not reliable as a find shortcut
			delete Expr.find["ID"];

			Expr.filter["ID"] =  function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== "undefined" &&
						elem.getAttributeNode("id");
					return node && node.value === attrId;
				};
			};
		}

		// Tag
		Expr.find["TAG"] = support.getElementsByTagName ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== "undefined" ) {
					return context.getElementsByTagName( tag );

				// DocumentFragment nodes don't have gEBTN
				} else if ( support.qsa ) {
					return context.querySelectorAll( tag );
				}
			} :

			function( tag, context ) {
				var elem,
					tmp = [],
					i = 0,
					// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
					results = context.getElementsByTagName( tag );

				// Filter out possible comments
				if ( tag === "*" ) {
					while ( (elem = results[i++]) ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}

					return tmp;
				}
				return results;
			};

		// Class
		Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
			if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
				return context.getElementsByClassName( className );
			}
		};

		/* QSA/matchesSelector
		---------------------------------------------------------------------- */

		// QSA and matchesSelector support

		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];

		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE error
		// See http://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];

		if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert(function( div ) {
				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// http://bugs.jquery.com/ticket/12359
				docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
					"<select id='" + expando + "-\r\\' msallowcapture=''>" +
					"<option selected=''></option></select>";

				// Support: IE8, Opera 11-12.16
				// Nothing should be selected when empty strings follow ^= or $= or *=
				// The test attribute must be unknown in Opera but "safe" for WinRT
				// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
				if ( div.querySelectorAll("[msallowcapture^='']").length ) {
					rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
				}

				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if ( !div.querySelectorAll("[selected]").length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
				}

				// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
				if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
					rbuggyQSA.push("~=");
				}

				// Webkit/Opera - :checked should return selected option elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":checked").length ) {
					rbuggyQSA.push(":checked");
				}

				// Support: Safari 8+, iOS 8+
				// https://bugs.webkit.org/show_bug.cgi?id=136851
				// In-page `selector#id sibing-combinator selector` fails
				if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
					rbuggyQSA.push(".#.+[+~]");
				}
			});

			assert(function( div ) {
				// Support: Windows 8 Native Apps
				// The type and name attributes are restricted during .innerHTML assignment
				var input = document.createElement("input");
				input.setAttribute( "type", "hidden" );
				div.appendChild( input ).setAttribute( "name", "D" );

				// Support: IE8
				// Enforce case-sensitivity of name attribute
				if ( div.querySelectorAll("[name=d]").length ) {
					rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
				}

				// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":enabled").length ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}

				// Opera 10-11 does not throw on post-comma invalid pseudos
				div.querySelectorAll("*,:x");
				rbuggyQSA.push(",.*:");
			});
		}

		if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
			docElem.webkitMatchesSelector ||
			docElem.mozMatchesSelector ||
			docElem.oMatchesSelector ||
			docElem.msMatchesSelector) )) ) {

			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call( div, "div" );

				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( div, "[s!='']:x" );
				rbuggyMatches.push( "!=", pseudos );
			});
		}

		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
		rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

		/* Contains
		---------------------------------------------------------------------- */
		hasCompare = rnative.test( docElem.compareDocumentPosition );

		// Element contains another
		// Purposefully self-exclusive
		// As in, an element does not contain itself
		contains = hasCompare || rnative.test( docElem.contains ) ?
			function( a, b ) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
					bup = b && b.parentNode;
				return a === bup || !!( bup && bup.nodeType === 1 && (
					adown.contains ?
						adown.contains( bup ) :
						a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
				));
			} :
			function( a, b ) {
				if ( b ) {
					while ( (b = b.parentNode) ) {
						if ( b === a ) {
							return true;
						}
					}
				}
				return false;
			};

		/* Sorting
		---------------------------------------------------------------------- */

		// Document order sorting
		sortOrder = hasCompare ?
		function( a, b ) {

			// Flag for duplicate removal
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			// Sort on method existence if only one input has compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if ( compare ) {
				return compare;
			}

			// Calculate position if both inputs belong to the same document
			compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
				a.compareDocumentPosition( b ) :

				// Otherwise we know they are disconnected
				1;

			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		} :
		function( a, b ) {
			// Exit early if the nodes are identical
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			var cur,
				i = 0,
				aup = a.parentNode,
				bup = b.parentNode,
				ap = [ a ],
				bp = [ b ];

			// Parentless nodes are either documents or disconnected
			if ( !aup || !bup ) {
				return a === document ? -1 :
					b === document ? 1 :
					aup ? -1 :
					bup ? 1 :
					sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;

			// If the nodes are siblings, we can do a quick check
			} else if ( aup === bup ) {
				return siblingCheck( a, b );
			}

			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while ( (cur = cur.parentNode) ) {
				ap.unshift( cur );
			}
			cur = b;
			while ( (cur = cur.parentNode) ) {
				bp.unshift( cur );
			}

			// Walk down the tree looking for a discrepancy
			while ( ap[i] === bp[i] ) {
				i++;
			}

			return i ?
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck( ap[i], bp[i] ) :

				// Otherwise nodes in our document sort first
				ap[i] === preferredDoc ? -1 :
				bp[i] === preferredDoc ? 1 :
				0;
		};

		return document;
	};

	Sizzle.matches = function( expr, elements ) {
		return Sizzle( expr, null, null, elements );
	};

	Sizzle.matchesSelector = function( elem, expr ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}

		// Make sure that attribute selectors are quoted
		expr = expr.replace( rattributeQuotes, "='$1']" );

		if ( support.matchesSelector && documentIsHTML &&
			!compilerCache[ expr + " " ] &&
			( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
			( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

			try {
				var ret = matches.call( elem, expr );

				// IE 9's matchesSelector returns false on disconnected nodes
				if ( ret || support.disconnectedMatch ||
						// As well, disconnected nodes are said to be in a document
						// fragment in IE 9
						elem.document && elem.document.nodeType !== 11 ) {
					return ret;
				}
			} catch (e) {}
		}

		return Sizzle( expr, document, null, [ elem ] ).length > 0;
	};

	Sizzle.contains = function( context, elem ) {
		// Set document vars if needed
		if ( ( context.ownerDocument || context ) !== document ) {
			setDocument( context );
		}
		return contains( context, elem );
	};

	Sizzle.attr = function( elem, name ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}

		var fn = Expr.attrHandle[ name.toLowerCase() ],
			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, !documentIsHTML ) :
				undefined;

		return val !== undefined ?
			val :
			support.attributes || !documentIsHTML ?
				elem.getAttribute( name ) :
				(val = elem.getAttributeNode(name)) && val.specified ?
					val.value :
					null;
	};

	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};

	/**
	 * Document sorting and removing duplicates
	 * @param {ArrayLike} results
	 */
	Sizzle.uniqueSort = function( results ) {
		var elem,
			duplicates = [],
			j = 0,
			i = 0;

		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice( 0 );
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			while ( (elem = results[i++]) ) {
				if ( elem === results[ i ] ) {
					j = duplicates.push( i );
				}
			}
			while ( j-- ) {
				results.splice( duplicates[ j ], 1 );
			}
		}

		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;

		return results;
	};

	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	getText = Sizzle.getText = function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {
			// If no nodeType, this is expected to be an array
			while ( (node = elem[i++]) ) {
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes

		return ret;
	};

	Expr = Sizzle.selectors = {

		// Can be adjusted by the user
		cacheLength: 50,

		createPseudo: markFunction,

		match: matchExpr,

		attrHandle: {},

		find: {},

		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},

		preFilter: {
			"ATTR": function( match ) {
				match[1] = match[1].replace( runescape, funescape );

				// Move the given value to match[3] whether quoted or unquoted
				match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

				if ( match[2] === "~=" ) {
					match[3] = " " + match[3] + " ";
				}

				return match.slice( 0, 4 );
			},

			"CHILD": function( match ) {
				/* matches from matchExpr["CHILD"]
					1 type (only|nth|...)
					2 what (child|of-type)
					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					4 xn-component of xn+y argument ([+-]?\d*n|)
					5 sign of xn-component
					6 x of xn-component
					7 sign of y-component
					8 y of y-component
				*/
				match[1] = match[1].toLowerCase();

				if ( match[1].slice( 0, 3 ) === "nth" ) {
					// nth-* requires argument
					if ( !match[3] ) {
						Sizzle.error( match[0] );
					}

					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
					match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

				// other types prohibit arguments
				} else if ( match[3] ) {
					Sizzle.error( match[0] );
				}

				return match;
			},

			"PSEUDO": function( match ) {
				var excess,
					unquoted = !match[6] && match[2];

				if ( matchExpr["CHILD"].test( match[0] ) ) {
					return null;
				}

				// Accept quoted arguments as-is
				if ( match[3] ) {
					match[2] = match[4] || match[5] || "";

				// Strip excess characters from unquoted arguments
				} else if ( unquoted && rpseudo.test( unquoted ) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

					// excess is a negative index
					match[0] = match[0].slice( 0, excess );
					match[2] = unquoted.slice( 0, excess );
				}

				// Return only captures needed by the pseudo filter method (type and argument)
				return match.slice( 0, 3 );
			}
		},

		filter: {

			"TAG": function( nodeNameSelector ) {
				var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
				return nodeNameSelector === "*" ?
					function() { return true; } :
					function( elem ) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
			},

			"CLASS": function( className ) {
				var pattern = classCache[ className + " " ];

				return pattern ||
					(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
					classCache( className, function( elem ) {
						return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
					});
			},

			"ATTR": function( name, operator, check ) {
				return function( elem ) {
					var result = Sizzle.attr( elem, name );

					if ( result == null ) {
						return operator === "!=";
					}
					if ( !operator ) {
						return true;
					}

					result += "";

					return operator === "=" ? result === check :
						operator === "!=" ? result !== check :
						operator === "^=" ? check && result.indexOf( check ) === 0 :
						operator === "*=" ? check && result.indexOf( check ) > -1 :
						operator === "$=" ? check && result.slice( -check.length ) === check :
						operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
						operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
						false;
				};
			},

			"CHILD": function( type, what, argument, first, last ) {
				var simple = type.slice( 0, 3 ) !== "nth",
					forward = type.slice( -4 ) !== "last",
					ofType = what === "of-type";

				return first === 1 && last === 0 ?

					// Shortcut for :nth-*(n)
					function( elem ) {
						return !!elem.parentNode;
					} :

					function( elem, context, xml ) {
						var cache, uniqueCache, outerCache, node, nodeIndex, start,
							dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType,
							diff = false;

						if ( parent ) {

							// :(first|last|only)-(child|of-type)
							if ( simple ) {
								while ( dir ) {
									node = elem;
									while ( (node = node[ dir ]) ) {
										if ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) {

											return false;
										}
									}
									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}

							start = [ forward ? parent.firstChild : parent.lastChild ];

							// non-xml :nth-child(...) stores cache data on `parent`
							if ( forward && useCache ) {

								// Seek `elem` from a previously-cached index

								// ...in a gzip-friendly way
								node = parent;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex && cache[ 2 ];
								node = nodeIndex && parent.childNodes[ nodeIndex ];

								while ( (node = ++nodeIndex && node && node[ dir ] ||

									// Fallback to seeking `elem` from the start
									(diff = nodeIndex = 0) || start.pop()) ) {

									// When found, cache indexes on `parent` and break
									if ( node.nodeType === 1 && ++diff && node === elem ) {
										uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
										break;
									}
								}

							} else {
								// Use previously-cached element index if available
								if ( useCache ) {
									// ...in a gzip-friendly way
									node = elem;
									outerCache = node[ expando ] || (node[ expando ] = {});

									// Support: IE <9 only
									// Defend against cloned attroperties (jQuery gh-1709)
									uniqueCache = outerCache[ node.uniqueID ] ||
										(outerCache[ node.uniqueID ] = {});

									cache = uniqueCache[ type ] || [];
									nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
									diff = nodeIndex;
								}

								// xml :nth-child(...)
								// or :nth-last-child(...) or :nth(-last)?-of-type(...)
								if ( diff === false ) {
									// Use the same loop as above to seek `elem` from the start
									while ( (node = ++nodeIndex && node && node[ dir ] ||
										(diff = nodeIndex = 0) || start.pop()) ) {

										if ( ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) &&
											++diff ) {

											// Cache the index of each encountered element
											if ( useCache ) {
												outerCache = node[ expando ] || (node[ expando ] = {});

												// Support: IE <9 only
												// Defend against cloned attroperties (jQuery gh-1709)
												uniqueCache = outerCache[ node.uniqueID ] ||
													(outerCache[ node.uniqueID ] = {});

												uniqueCache[ type ] = [ dirruns, diff ];
											}

											if ( node === elem ) {
												break;
											}
										}
									}
								}
							}

							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || ( diff % first === 0 && diff / first >= 0 );
						}
					};
			},

			"PSEUDO": function( pseudo, argument ) {
				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
						Sizzle.error( "unsupported pseudo: " + pseudo );

				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if ( fn[ expando ] ) {
					return fn( argument );
				}

				// But maintain support for old signatures
				if ( fn.length > 1 ) {
					args = [ pseudo, pseudo, "", argument ];
					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
						markFunction(function( seed, matches ) {
							var idx,
								matched = fn( seed, argument ),
								i = matched.length;
							while ( i-- ) {
								idx = indexOf( seed, matched[i] );
								seed[ idx ] = !( matches[ idx ] = matched[i] );
							}
						}) :
						function( elem ) {
							return fn( elem, 0, args );
						};
				}

				return fn;
			}
		},

		pseudos: {
			// Potentially complex pseudos
			"not": markFunction(function( selector ) {
				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
					results = [],
					matcher = compile( selector.replace( rtrim, "$1" ) );

				return matcher[ expando ] ?
					markFunction(function( seed, matches, context, xml ) {
						var elem,
							unmatched = matcher( seed, null, xml, [] ),
							i = seed.length;

						// Match elements unmatched by `matcher`
						while ( i-- ) {
							if ( (elem = unmatched[i]) ) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) :
					function( elem, context, xml ) {
						input[0] = elem;
						matcher( input, null, xml, results );
						// Don't keep the element (issue #299)
						input[0] = null;
						return !results.pop();
					};
			}),

			"has": markFunction(function( selector ) {
				return function( elem ) {
					return Sizzle( selector, elem ).length > 0;
				};
			}),

			"contains": markFunction(function( text ) {
				text = text.replace( runescape, funescape );
				return function( elem ) {
					return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
				};
			}),

			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is performed case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction( function( lang ) {
				// lang value must be a valid identifier
				if ( !ridentifier.test(lang || "") ) {
					Sizzle.error( "unsupported lang: " + lang );
				}
				lang = lang.replace( runescape, funescape ).toLowerCase();
				return function( elem ) {
					var elemLang;
					do {
						if ( (elemLang = documentIsHTML ?
							elem.lang :
							elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
						}
					} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
					return false;
				};
			}),

			// Miscellaneous
			"target": function( elem ) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice( 1 ) === elem.id;
			},

			"root": function( elem ) {
				return elem === docElem;
			},

			"focus": function( elem ) {
				return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
			},

			// Boolean properties
			"enabled": function( elem ) {
				return elem.disabled === false;
			},

			"disabled": function( elem ) {
				return elem.disabled === true;
			},

			"checked": function( elem ) {
				// In CSS3, :checked should return both checked and selected elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
			},

			"selected": function( elem ) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}

				return elem.selected === true;
			},

			// Contents
			"empty": function( elem ) {
				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
				//   but not by others (comment: 8; processing instruction: 7; etc.)
				// nodeType < 6 works because attributes (2) do not appear as children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					if ( elem.nodeType < 6 ) {
						return false;
					}
				}
				return true;
			},

			"parent": function( elem ) {
				return !Expr.pseudos["empty"]( elem );
			},

			// Element/input types
			"header": function( elem ) {
				return rheader.test( elem.nodeName );
			},

			"input": function( elem ) {
				return rinputs.test( elem.nodeName );
			},

			"button": function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},

			"text": function( elem ) {
				var attr;
				return elem.nodeName.toLowerCase() === "input" &&
					elem.type === "text" &&

					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
					( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
			},

			// Position-in-collection
			"first": createPositionalPseudo(function() {
				return [ 0 ];
			}),

			"last": createPositionalPseudo(function( matchIndexes, length ) {
				return [ length - 1 ];
			}),

			"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
				return [ argument < 0 ? argument + length : argument ];
			}),

			"even": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 0;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"odd": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 1;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; --i >= 0; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; ++i < length; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			})
		}
	};

	Expr.pseudos["nth"] = Expr.pseudos["eq"];

	// Add button/input type pseudos
	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
		Expr.pseudos[ i ] = createInputPseudo( i );
	}
	for ( i in { submit: true, reset: true } ) {
		Expr.pseudos[ i ] = createButtonPseudo( i );
	}

	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();

	tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
		var matched, match, tokens, type,
			soFar, groups, preFilters,
			cached = tokenCache[ selector + " " ];

		if ( cached ) {
			return parseOnly ? 0 : cached.slice( 0 );
		}

		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;

		while ( soFar ) {

			// Comma and first run
			if ( !matched || (match = rcomma.exec( soFar )) ) {
				if ( match ) {
					// Don't consume trailing commas as valid
					soFar = soFar.slice( match[0].length ) || soFar;
				}
				groups.push( (tokens = []) );
			}

			matched = false;

			// Combinators
			if ( (match = rcombinators.exec( soFar )) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					// Cast descendant combinators to space
					type: match[0].replace( rtrim, " " )
				});
				soFar = soFar.slice( matched.length );
			}

			// Filters
			for ( type in Expr.filter ) {
				if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
					(match = preFilters[ type ]( match ))) ) {
					matched = match.shift();
					tokens.push({
						value: matched,
						type: type,
						matches: match
					});
					soFar = soFar.slice( matched.length );
				}
			}

			if ( !matched ) {
				break;
			}
		}

		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ?
			soFar.length :
			soFar ?
				Sizzle.error( selector ) :
				// Cache the tokens
				tokenCache( selector, groups ).slice( 0 );
	};

	function toSelector( tokens ) {
		var i = 0,
			len = tokens.length,
			selector = "";
		for ( ; i < len; i++ ) {
			selector += tokens[i].value;
		}
		return selector;
	}

	function addCombinator( matcher, combinator, base ) {
		var dir = combinator.dir,
			checkNonElements = base && dir === "parentNode",
			doneName = done++;

		return combinator.first ?
			// Check against closest ancestor/preceding element
			function( elem, context, xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						return matcher( elem, context, xml );
					}
				}
			} :

			// Check against all ancestor/preceding elements
			function( elem, context, xml ) {
				var oldCache, uniqueCache, outerCache,
					newCache = [ dirruns, doneName ];

				// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
				if ( xml ) {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							if ( matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				} else {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							outerCache = elem[ expando ] || (elem[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

							if ( (oldCache = uniqueCache[ dir ]) &&
								oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

								// Assign to newCache so results back-propagate to previous elements
								return (newCache[ 2 ] = oldCache[ 2 ]);
							} else {
								// Reuse newcache so results back-propagate to previous elements
								uniqueCache[ dir ] = newCache;

								// A match means we're done; a fail means we have to keep checking
								if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
									return true;
								}
							}
						}
					}
				}
			};
	}

	function elementMatcher( matchers ) {
		return matchers.length > 1 ?
			function( elem, context, xml ) {
				var i = matchers.length;
				while ( i-- ) {
					if ( !matchers[i]( elem, context, xml ) ) {
						return false;
					}
				}
				return true;
			} :
			matchers[0];
	}

	function multipleContexts( selector, contexts, results ) {
		var i = 0,
			len = contexts.length;
		for ( ; i < len; i++ ) {
			Sizzle( selector, contexts[i], results );
		}
		return results;
	}

	function condense( unmatched, map, filter, context, xml ) {
		var elem,
			newUnmatched = [],
			i = 0,
			len = unmatched.length,
			mapped = map != null;

		for ( ; i < len; i++ ) {
			if ( (elem = unmatched[i]) ) {
				if ( !filter || filter( elem, context, xml ) ) {
					newUnmatched.push( elem );
					if ( mapped ) {
						map.push( i );
					}
				}
			}
		}

		return newUnmatched;
	}

	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
		if ( postFilter && !postFilter[ expando ] ) {
			postFilter = setMatcher( postFilter );
		}
		if ( postFinder && !postFinder[ expando ] ) {
			postFinder = setMatcher( postFinder, postSelector );
		}
		return markFunction(function( seed, results, context, xml ) {
			var temp, i, elem,
				preMap = [],
				postMap = [],
				preexisting = results.length,

				// Get initial elements from seed or context
				elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && ( seed || !selector ) ?
					condense( elems, preMap, preFilter, context, xml ) :
					elems,

				matcherOut = matcher ?
					// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
					postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

						// ...intermediate processing is necessary
						[] :

						// ...otherwise use results directly
						results :
					matcherIn;

			// Find primary matches
			if ( matcher ) {
				matcher( matcherIn, matcherOut, context, xml );
			}

			// Apply postFilter
			if ( postFilter ) {
				temp = condense( matcherOut, postMap );
				postFilter( temp, [], context, xml );

				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while ( i-- ) {
					if ( (elem = temp[i]) ) {
						matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
					}
				}
			}

			if ( seed ) {
				if ( postFinder || preFilter ) {
					if ( postFinder ) {
						// Get the final matcherOut by condensing this intermediate into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while ( i-- ) {
							if ( (elem = matcherOut[i]) ) {
								// Restore matcherIn since elem is not yet a final match
								temp.push( (matcherIn[i] = elem) );
							}
						}
						postFinder( null, (matcherOut = []), temp, xml );
					}

					// Move matched elements from seed to results to keep them synchronized
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) &&
							(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

							seed[temp] = !(results[temp] = elem);
						}
					}
				}

			// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(
					matcherOut === results ?
						matcherOut.splice( preexisting, matcherOut.length ) :
						matcherOut
				);
				if ( postFinder ) {
					postFinder( null, results, matcherOut, xml );
				} else {
					push.apply( results, matcherOut );
				}
			}
		});
	}

	function matcherFromTokens( tokens ) {
		var checkContext, matcher, j,
			len = tokens.length,
			leadingRelative = Expr.relative[ tokens[0].type ],
			implicitRelative = leadingRelative || Expr.relative[" "],
			i = leadingRelative ? 1 : 0,

			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator( function( elem ) {
				return elem === checkContext;
			}, implicitRelative, true ),
			matchAnyContext = addCombinator( function( elem ) {
				return indexOf( checkContext, elem ) > -1;
			}, implicitRelative, true ),
			matchers = [ function( elem, context, xml ) {
				var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					(checkContext = context).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );
				// Avoid hanging onto element (issue #299)
				checkContext = null;
				return ret;
			} ];

		for ( ; i < len; i++ ) {
			if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
				matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
			} else {
				matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

				// Return special upon seeing a positional matcher
				if ( matcher[ expando ] ) {
					// Find the next relative operator (if any) for proper handling
					j = ++i;
					for ( ; j < len; j++ ) {
						if ( Expr.relative[ tokens[j].type ] ) {
							break;
						}
					}
					return setMatcher(
						i > 1 && elementMatcher( matchers ),
						i > 1 && toSelector(
							// If the preceding token was a descendant combinator, insert an implicit any-element `*`
							tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
						).replace( rtrim, "$1" ),
						matcher,
						i < j && matcherFromTokens( tokens.slice( i, j ) ),
						j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
						j < len && toSelector( tokens )
					);
				}
				matchers.push( matcher );
			}
		}

		return elementMatcher( matchers );
	}

	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
		var bySet = setMatchers.length > 0,
			byElement = elementMatchers.length > 0,
			superMatcher = function( seed, context, xml, results, outermost ) {
				var elem, j, matcher,
					matchedCount = 0,
					i = "0",
					unmatched = seed && [],
					setMatched = [],
					contextBackup = outermostContext,
					// We must always have either seed elements or outermost context
					elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
					len = elems.length;

				if ( outermost ) {
					outermostContext = context === document || context || outermost;
				}

				// Add elements passing elementMatchers directly to results
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
				for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
					if ( byElement && elem ) {
						j = 0;
						if ( !context && elem.ownerDocument !== document ) {
							setDocument( elem );
							xml = !documentIsHTML;
						}
						while ( (matcher = elementMatchers[j++]) ) {
							if ( matcher( elem, context || document, xml) ) {
								results.push( elem );
								break;
							}
						}
						if ( outermost ) {
							dirruns = dirrunsUnique;
						}
					}

					// Track unmatched elements for set filters
					if ( bySet ) {
						// They will have gone through all possible matchers
						if ( (elem = !matcher && elem) ) {
							matchedCount--;
						}

						// Lengthen the array for every element, matched or not
						if ( seed ) {
							unmatched.push( elem );
						}
					}
				}

				// `i` is now the count of elements visited above, and adding it to `matchedCount`
				// makes the latter nonnegative.
				matchedCount += i;

				// Apply set filters to unmatched elements
				// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
				// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
				// no element matchers and no seed.
				// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
				// case, which will result in a "00" `matchedCount` that differs from `i` but is also
				// numerically zero.
				if ( bySet && i !== matchedCount ) {
					j = 0;
					while ( (matcher = setMatchers[j++]) ) {
						matcher( unmatched, setMatched, context, xml );
					}

					if ( seed ) {
						// Reintegrate element matches to eliminate the need for sorting
						if ( matchedCount > 0 ) {
							while ( i-- ) {
								if ( !(unmatched[i] || setMatched[i]) ) {
									setMatched[i] = pop.call( results );
								}
							}
						}

						// Discard index placeholder values to get only actual matches
						setMatched = condense( setMatched );
					}

					// Add matches to results
					push.apply( results, setMatched );

					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if ( outermost && !seed && setMatched.length > 0 &&
						( matchedCount + setMatchers.length ) > 1 ) {

						Sizzle.uniqueSort( results );
					}
				}

				// Override manipulation of globals by nested matchers
				if ( outermost ) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}

				return unmatched;
			};

		return bySet ?
			markFunction( superMatcher ) :
			superMatcher;
	}

	compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
		var i,
			setMatchers = [],
			elementMatchers = [],
			cached = compilerCache[ selector + " " ];

		if ( !cached ) {
			// Generate a function of recursive functions that can be used to check each element
			if ( !match ) {
				match = tokenize( selector );
			}
			i = match.length;
			while ( i-- ) {
				cached = matcherFromTokens( match[i] );
				if ( cached[ expando ] ) {
					setMatchers.push( cached );
				} else {
					elementMatchers.push( cached );
				}
			}

			// Cache the compiled function
			cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

			// Save selector and tokenization
			cached.selector = selector;
		}
		return cached;
	};

	/**
	 * A low-level selection function that works with Sizzle's compiled
	 *  selector functions
	 * @param {String|Function} selector A selector or a pre-compiled
	 *  selector function built with Sizzle.compile
	 * @param {Element} context
	 * @param {Array} [results]
	 * @param {Array} [seed] A set of elements to match against
	 */
	select = Sizzle.select = function( selector, context, results, seed ) {
		var i, tokens, token, type, find,
			compiled = typeof selector === "function" && selector,
			match = !seed && tokenize( (selector = compiled.selector || selector) );

		results = results || [];

		// Try to minimize operations if there is only one selector in the list and no seed
		// (the latter of which guarantees us context)
		if ( match.length === 1 ) {

			// Reduce context if the leading compound selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;

				// Precompiled matchers will still verify ancestry, so step up a level
				} else if ( compiled ) {
					context = context.parentNode;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}

		// Compile and execute a filtering function if one is not provided
		// Provide `match` to avoid retokenization if we modified the selector above
		( compiled || compile( selector, match ) )(
			seed,
			context,
			!documentIsHTML,
			results,
			!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
		);
		return results;
	};

	// One-time assignments

	// Sort stability
	support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

	// Support: Chrome 14-35+
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate;

	// Initialize against the default document
	setDocument();

	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function( div1 ) {
		// Should return 1, but returns 4 (following)
		return div1.compareDocumentPosition( document.createElement("div") ) & 1;
	});

	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild.getAttribute("href") === "#" ;
	}) ) {
		addHandle( "type|href|height|width", function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
			}
		});
	}

	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if ( !support.attributes || !assert(function( div ) {
		div.innerHTML = "<input/>";
		div.firstChild.setAttribute( "value", "" );
		return div.firstChild.getAttribute( "value" ) === "";
	}) ) {
		addHandle( "value", function( elem, name, isXML ) {
			if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
				return elem.defaultValue;
			}
		});
	}

	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if ( !assert(function( div ) {
		return div.getAttribute("disabled") == null;
	}) ) {
		addHandle( booleans, function( elem, name, isXML ) {
			var val;
			if ( !isXML ) {
				return elem[ name ] === true ? name.toLowerCase() :
						(val = elem.getAttributeNode( name )) && val.specified ?
						val.value :
					null;
			}
		});
	}

	return Sizzle;

	})( window );



	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;
	jQuery.expr[ ":" ] = jQuery.expr.pseudos;
	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;



	var dir = function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	};


	var siblings = function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	};


	var rneedsContext = jQuery.expr.match.needsContext;

	var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



	var risSimple = /^.[^:#\[\.,]*$/;

	// Implement the identical functionality for filter and not
	function winnow( elements, qualifier, not ) {
		if ( jQuery.isFunction( qualifier ) ) {
			return jQuery.grep( elements, function( elem, i ) {
				/* jshint -W018 */
				return !!qualifier.call( elem, i, elem ) !== not;
			} );

		}

		if ( qualifier.nodeType ) {
			return jQuery.grep( elements, function( elem ) {
				return ( elem === qualifier ) !== not;
			} );

		}

		if ( typeof qualifier === "string" ) {
			if ( risSimple.test( qualifier ) ) {
				return jQuery.filter( qualifier, elements, not );
			}

			qualifier = jQuery.filter( qualifier, elements );
		}

		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	jQuery.filter = function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			} ) );
	};

	jQuery.fn.extend( {
		find: function( selector ) {
			var i,
				len = this.length,
				ret = [],
				self = this;

			if ( typeof selector !== "string" ) {
				return this.pushStack( jQuery( selector ).filter( function() {
					for ( i = 0; i < len; i++ ) {
						if ( jQuery.contains( self[ i ], this ) ) {
							return true;
						}
					}
				} ) );
			}

			for ( i = 0; i < len; i++ ) {
				jQuery.find( selector, self[ i ], ret );
			}

			// Needed because $( selector, context ) becomes $( context ).find( selector )
			ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
			ret.selector = this.selector ? this.selector + " " + selector : selector;
			return ret;
		},
		filter: function( selector ) {
			return this.pushStack( winnow( this, selector || [], false ) );
		},
		not: function( selector ) {
			return this.pushStack( winnow( this, selector || [], true ) );
		},
		is: function( selector ) {
			return !!winnow(
				this,

				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && rneedsContext.test( selector ) ?
					jQuery( selector ) :
					selector || [],
				false
			).length;
		}
	} );


	// Initialize a jQuery object


	// A central reference to the root jQuery(document)
	var rootjQuery,

		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		// Strict HTML recognition (#11290: must start with <)
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

		init = jQuery.fn.init = function( selector, context, root ) {
			var match, elem;

			// HANDLE: $(""), $(null), $(undefined), $(false)
			if ( !selector ) {
				return this;
			}

			// Method init() accepts an alternate rootjQuery
			// so migrate can support jQuery.sub (gh-2101)
			root = root || rootjQuery;

			// Handle HTML strings
			if ( typeof selector === "string" ) {
				if ( selector[ 0 ] === "<" &&
					selector[ selector.length - 1 ] === ">" &&
					selector.length >= 3 ) {

					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [ null, selector, null ];

				} else {
					match = rquickExpr.exec( selector );
				}

				// Match html or make sure no context is specified for #id
				if ( match && ( match[ 1 ] || !context ) ) {

					// HANDLE: $(html) -> $(array)
					if ( match[ 1 ] ) {
						context = context instanceof jQuery ? context[ 0 ] : context;

						// Option to run scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge( this, jQuery.parseHTML(
							match[ 1 ],
							context && context.nodeType ? context.ownerDocument || context : document,
							true
						) );

						// HANDLE: $(html, props)
						if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
							for ( match in context ) {

								// Properties of context are called as methods if possible
								if ( jQuery.isFunction( this[ match ] ) ) {
									this[ match ]( context[ match ] );

								// ...and otherwise set as attributes
								} else {
									this.attr( match, context[ match ] );
								}
							}
						}

						return this;

					// HANDLE: $(#id)
					} else {
						elem = document.getElementById( match[ 2 ] );

						// Support: Blackberry 4.6
						// gEBID returns nodes no longer in the document (#6963)
						if ( elem && elem.parentNode ) {

							// Inject the element directly into the jQuery object
							this.length = 1;
							this[ 0 ] = elem;
						}

						this.context = document;
						this.selector = selector;
						return this;
					}

				// HANDLE: $(expr, $(...))
				} else if ( !context || context.jquery ) {
					return ( context || root ).find( selector );

				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor( context ).find( selector );
				}

			// HANDLE: $(DOMElement)
			} else if ( selector.nodeType ) {
				this.context = this[ 0 ] = selector;
				this.length = 1;
				return this;

			// HANDLE: $(function)
			// Shortcut for document ready
			} else if ( jQuery.isFunction( selector ) ) {
				return root.ready !== undefined ?
					root.ready( selector ) :

					// Execute immediately if ready is not present
					selector( jQuery );
			}

			if ( selector.selector !== undefined ) {
				this.selector = selector.selector;
				this.context = selector.context;
			}

			return jQuery.makeArray( selector, this );
		};

	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;

	// Initialize central reference
	rootjQuery = jQuery( document );


	var rparentsprev = /^(?:parents|prev(?:Until|All))/,

		// Methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};

	jQuery.fn.extend( {
		has: function( target ) {
			var targets = jQuery( target, this ),
				l = targets.length;

			return this.filter( function() {
				var i = 0;
				for ( ; i < l; i++ ) {
					if ( jQuery.contains( this, targets[ i ] ) ) {
						return true;
					}
				}
			} );
		},

		closest: function( selectors, context ) {
			var cur,
				i = 0,
				l = this.length,
				matched = [],
				pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
					jQuery( selectors, context || this.context ) :
					0;

			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( pos ?
						pos.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}

			return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
		},

		// Determine the position of an element within the set
		index: function( elem ) {

			// No argument, return index in parent
			if ( !elem ) {
				return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
			}

			// Index in selector
			if ( typeof elem === "string" ) {
				return indexOf.call( jQuery( elem ), this[ 0 ] );
			}

			// Locate the position of the desired element
			return indexOf.call( this,

				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[ 0 ] : elem
			);
		},

		add: function( selector, context ) {
			return this.pushStack(
				jQuery.uniqueSort(
					jQuery.merge( this.get(), jQuery( selector, context ) )
				)
			);
		},

		addBack: function( selector ) {
			return this.add( selector == null ?
				this.prevObject : this.prevObject.filter( selector )
			);
		}
	} );

	function sibling( cur, dir ) {
		while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
		return cur;
	}

	jQuery.each( {
		parent: function( elem ) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function( elem ) {
			return dir( elem, "parentNode" );
		},
		parentsUntil: function( elem, i, until ) {
			return dir( elem, "parentNode", until );
		},
		next: function( elem ) {
			return sibling( elem, "nextSibling" );
		},
		prev: function( elem ) {
			return sibling( elem, "previousSibling" );
		},
		nextAll: function( elem ) {
			return dir( elem, "nextSibling" );
		},
		prevAll: function( elem ) {
			return dir( elem, "previousSibling" );
		},
		nextUntil: function( elem, i, until ) {
			return dir( elem, "nextSibling", until );
		},
		prevUntil: function( elem, i, until ) {
			return dir( elem, "previousSibling", until );
		},
		siblings: function( elem ) {
			return siblings( ( elem.parentNode || {} ).firstChild, elem );
		},
		children: function( elem ) {
			return siblings( elem.firstChild );
		},
		contents: function( elem ) {
			return elem.contentDocument || jQuery.merge( [], elem.childNodes );
		}
	}, function( name, fn ) {
		jQuery.fn[ name ] = function( until, selector ) {
			var matched = jQuery.map( this, fn, until );

			if ( name.slice( -5 ) !== "Until" ) {
				selector = until;
			}

			if ( selector && typeof selector === "string" ) {
				matched = jQuery.filter( selector, matched );
			}

			if ( this.length > 1 ) {

				// Remove duplicates
				if ( !guaranteedUnique[ name ] ) {
					jQuery.uniqueSort( matched );
				}

				// Reverse order for parents* and prev-derivatives
				if ( rparentsprev.test( name ) ) {
					matched.reverse();
				}
			}

			return this.pushStack( matched );
		};
	} );
	var rnotwhite = ( /\S+/g );



	// Convert String-formatted options into Object-formatted ones
	function createOptions( options ) {
		var object = {};
		jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
			object[ flag ] = true;
		} );
		return object;
	}

	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function( options ) {

		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			createOptions( options ) :
			jQuery.extend( {}, options );

		var // Flag to know if list is currently firing
			firing,

			// Last fire value for non-forgettable lists
			memory,

			// Flag to know if list was already fired
			fired,

			// Flag to prevent firing
			locked,

			// Actual callback list
			list = [],

			// Queue of execution data for repeatable lists
			queue = [],

			// Index of currently firing callback (modified by add/remove as needed)
			firingIndex = -1,

			// Fire callbacks
			fire = function() {

				// Enforce single-firing
				locked = options.once;

				// Execute callbacks for all pending executions,
				// respecting firingIndex overrides and runtime changes
				fired = firing = true;
				for ( ; queue.length; firingIndex = -1 ) {
					memory = queue.shift();
					while ( ++firingIndex < list.length ) {

						// Run callback and check for early termination
						if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
							options.stopOnFalse ) {

							// Jump to end and forget the data so .add doesn't re-fire
							firingIndex = list.length;
							memory = false;
						}
					}
				}

				// Forget the data if we're done with it
				if ( !options.memory ) {
					memory = false;
				}

				firing = false;

				// Clean up if we're done firing for good
				if ( locked ) {

					// Keep an empty list if we have data for future add calls
					if ( memory ) {
						list = [];

					// Otherwise, this object is spent
					} else {
						list = "";
					}
				}
			},

			// Actual Callbacks object
			self = {

				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {

						// If we have memory from a past run, we should fire after adding
						if ( memory && !firing ) {
							firingIndex = list.length - 1;
							queue.push( memory );
						}

						( function add( args ) {
							jQuery.each( args, function( _, arg ) {
								if ( jQuery.isFunction( arg ) ) {
									if ( !options.unique || !self.has( arg ) ) {
										list.push( arg );
									}
								} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

									// Inspect recursively
									add( arg );
								}
							} );
						} )( arguments );

						if ( memory && !firing ) {
							fire();
						}
					}
					return this;
				},

				// Remove a callback from the list
				remove: function() {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );

							// Handle firing indexes
							if ( index <= firingIndex ) {
								firingIndex--;
							}
						}
					} );
					return this;
				},

				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function( fn ) {
					return fn ?
						jQuery.inArray( fn, list ) > -1 :
						list.length > 0;
				},

				// Remove all callbacks from the list
				empty: function() {
					if ( list ) {
						list = [];
					}
					return this;
				},

				// Disable .fire and .add
				// Abort any current/pending executions
				// Clear all callbacks and values
				disable: function() {
					locked = queue = [];
					list = memory = "";
					return this;
				},
				disabled: function() {
					return !list;
				},

				// Disable .fire
				// Also disable .add unless we have memory (since it would have no effect)
				// Abort any pending executions
				lock: function() {
					locked = queue = [];
					if ( !memory ) {
						list = memory = "";
					}
					return this;
				},
				locked: function() {
					return !!locked;
				},

				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					if ( !locked ) {
						args = args || [];
						args = [ context, args.slice ? args.slice() : args ];
						queue.push( args );
						if ( !firing ) {
							fire();
						}
					}
					return this;
				},

				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},

				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};

		return self;
	};


	jQuery.extend( {

		Deferred: function( func ) {
			var tuples = [

					// action, add listener, listener list, final state
					[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
					[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
					[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					always: function() {
						deferred.done( arguments ).fail( arguments );
						return this;
					},
					then: function( /* fnDone, fnFail, fnProgress */ ) {
						var fns = arguments;
						return jQuery.Deferred( function( newDefer ) {
							jQuery.each( tuples, function( i, tuple ) {
								var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

								// deferred[ done | fail | progress ] for forwarding actions to newDefer
								deferred[ tuple[ 1 ] ]( function() {
									var returned = fn && fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.progress( newDefer.notify )
											.done( newDefer.resolve )
											.fail( newDefer.reject );
									} else {
										newDefer[ tuple[ 0 ] + "With" ](
											this === promise ? newDefer.promise() : this,
											fn ? [ returned ] : arguments
										);
									}
								} );
							} );
							fns = null;
						} ).promise();
					},

					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ) {
						return obj != null ? jQuery.extend( obj, promise ) : promise;
					}
				},
				deferred = {};

			// Keep pipe for back-compat
			promise.pipe = promise.then;

			// Add list-specific methods
			jQuery.each( tuples, function( i, tuple ) {
				var list = tuple[ 2 ],
					stateString = tuple[ 3 ];

				// promise[ done | fail | progress ] = list.add
				promise[ tuple[ 1 ] ] = list.add;

				// Handle state
				if ( stateString ) {
					list.add( function() {

						// state = [ resolved | rejected ]
						state = stateString;

					// [ reject_list | resolve_list ].disable; progress_list.lock
					}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
				}

				// deferred[ resolve | reject | notify ]
				deferred[ tuple[ 0 ] ] = function() {
					deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
					return this;
				};
				deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
			} );

			// Make the deferred a promise
			promise.promise( deferred );

			// Call given func if any
			if ( func ) {
				func.call( deferred, deferred );
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		when: function( subordinate /* , ..., subordinateN */ ) {
			var i = 0,
				resolveValues = slice.call( arguments ),
				length = resolveValues.length,

				// the count of uncompleted subordinates
				remaining = length !== 1 ||
					( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

				// the master Deferred.
				// If resolveValues consist of only a single Deferred, just use that.
				deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

				// Update function for both resolve and progress values
				updateFunc = function( i, contexts, values ) {
					return function( value ) {
						contexts[ i ] = this;
						values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
						if ( values === progressValues ) {
							deferred.notifyWith( contexts, values );
						} else if ( !( --remaining ) ) {
							deferred.resolveWith( contexts, values );
						}
					};
				},

				progressValues, progressContexts, resolveContexts;

			// Add listeners to Deferred subordinates; treat others as resolved
			if ( length > 1 ) {
				progressValues = new Array( length );
				progressContexts = new Array( length );
				resolveContexts = new Array( length );
				for ( ; i < length; i++ ) {
					if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
						resolveValues[ i ].promise()
							.progress( updateFunc( i, progressContexts, progressValues ) )
							.done( updateFunc( i, resolveContexts, resolveValues ) )
							.fail( deferred.reject );
					} else {
						--remaining;
					}
				}
			}

			// If we're not waiting on anything, resolve the master
			if ( !remaining ) {
				deferred.resolveWith( resolveContexts, resolveValues );
			}

			return deferred.promise();
		}
	} );


	// The deferred used on DOM ready
	var readyList;

	jQuery.fn.ready = function( fn ) {

		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	};

	jQuery.extend( {

		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,

		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,

		// Hold (or release) the ready event
		holdReady: function( hold ) {
			if ( hold ) {
				jQuery.readyWait++;
			} else {
				jQuery.ready( true );
			}
		},

		// Handle when the DOM is ready
		ready: function( wait ) {

			// Abort if there are pending holds or we're already ready
			if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
				return;
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.triggerHandler ) {
				jQuery( document ).triggerHandler( "ready" );
				jQuery( document ).off( "ready" );
			}
		}
	} );

	/**
	 * The ready event handler and self cleanup method
	 */
	function completed() {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );
		jQuery.ready();
	}

	jQuery.ready.promise = function( obj ) {
		if ( !readyList ) {

			readyList = jQuery.Deferred();

			// Catch cases where $(document).ready() is called
			// after the browser event has already occurred.
			// Support: IE9-10 only
			// Older IE sometimes signals "interactive" too soon
			if ( document.readyState === "complete" ||
				( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

				// Handle it asynchronously to allow scripts the opportunity to delay ready
				window.setTimeout( jQuery.ready );

			} else {

				// Use the handy event callback
				document.addEventListener( "DOMContentLoaded", completed );

				// A fallback to window.onload, that will always work
				window.addEventListener( "load", completed );
			}
		}
		return readyList.promise( obj );
	};

	// Kick off the DOM ready check even if the user does not
	jQuery.ready.promise();




	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			len = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				access( elems, fn, i, key[ i ], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {

				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < len; i++ ) {
					fn(
						elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
					);
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				len ? fn( elems[ 0 ], key ) : emptyGet;
	};
	var acceptData = function( owner ) {

		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		/* jshint -W018 */
		return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
	};




	function Data() {
		this.expando = jQuery.expando + Data.uid++;
	}

	Data.uid = 1;

	Data.prototype = {

		register: function( owner, initial ) {
			var value = initial || {};

			// If it is a node unlikely to be stringify-ed or looped over
			// use plain assignment
			if ( owner.nodeType ) {
				owner[ this.expando ] = value;

			// Otherwise secure it in a non-enumerable, non-writable property
			// configurability must be true to allow the property to be
			// deleted with the delete operator
			} else {
				Object.defineProperty( owner, this.expando, {
					value: value,
					writable: true,
					configurable: true
				} );
			}
			return owner[ this.expando ];
		},
		cache: function( owner ) {

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( !acceptData( owner ) ) {
				return {};
			}

			// Check if the owner object already has a cache
			var value = owner[ this.expando ];

			// If not, create one
			if ( !value ) {
				value = {};

				// We can accept data for non-element nodes in modern browsers,
				// but we should not, see #8335.
				// Always return an empty object.
				if ( acceptData( owner ) ) {

					// If it is a node unlikely to be stringify-ed or looped over
					// use plain assignment
					if ( owner.nodeType ) {
						owner[ this.expando ] = value;

					// Otherwise secure it in a non-enumerable property
					// configurable must be true to allow the property to be
					// deleted when data is removed
					} else {
						Object.defineProperty( owner, this.expando, {
							value: value,
							configurable: true
						} );
					}
				}
			}

			return value;
		},
		set: function( owner, data, value ) {
			var prop,
				cache = this.cache( owner );

			// Handle: [ owner, key, value ] args
			if ( typeof data === "string" ) {
				cache[ data ] = value;

			// Handle: [ owner, { properties } ] args
			} else {

				// Copy the properties one-by-one to the cache object
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
			return cache;
		},
		get: function( owner, key ) {
			return key === undefined ?
				this.cache( owner ) :
				owner[ this.expando ] && owner[ this.expando ][ key ];
		},
		access: function( owner, key, value ) {
			var stored;

			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if ( key === undefined ||
					( ( key && typeof key === "string" ) && value === undefined ) ) {

				stored = this.get( owner, key );

				return stored !== undefined ?
					stored : this.get( owner, jQuery.camelCase( key ) );
			}

			// When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set( owner, key, value );

			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function( owner, key ) {
			var i, name, camel,
				cache = owner[ this.expando ];

			if ( cache === undefined ) {
				return;
			}

			if ( key === undefined ) {
				this.register( owner );

			} else {

				// Support array or space separated string of keys
				if ( jQuery.isArray( key ) ) {

					// If "name" is an array of keys...
					// When data is initially created, via ("key", "val") signature,
					// keys will be converted to camelCase.
					// Since there is no way to tell _how_ a key was added, remove
					// both plain key and camelCase key. #12786
					// This will only penalize the array argument path.
					name = key.concat( key.map( jQuery.camelCase ) );
				} else {
					camel = jQuery.camelCase( key );

					// Try the string as a key before any manipulation
					if ( key in cache ) {
						name = [ key, camel ];
					} else {

						// If a key with the spaces exists, use it.
						// Otherwise, create an array by matching non-whitespace
						name = camel;
						name = name in cache ?
							[ name ] : ( name.match( rnotwhite ) || [] );
					}
				}

				i = name.length;

				while ( i-- ) {
					delete cache[ name[ i ] ];
				}
			}

			// Remove the expando if there's no more data
			if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

				// Support: Chrome <= 35-45+
				// Webkit & Blink performance suffers when deleting properties
				// from DOM nodes, so set to undefined instead
				// https://code.google.com/p/chromium/issues/detail?id=378607
				if ( owner.nodeType ) {
					owner[ this.expando ] = undefined;
				} else {
					delete owner[ this.expando ];
				}
			}
		},
		hasData: function( owner ) {
			var cache = owner[ this.expando ];
			return cache !== undefined && !jQuery.isEmptyObject( cache );
		}
	};
	var dataPriv = new Data();

	var dataUser = new Data();



	//	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /[A-Z]/g;

	function dataAttr( elem, key, data ) {
		var name;

		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if ( data === undefined && elem.nodeType === 1 ) {
			name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
			data = elem.getAttribute( name );

			if ( typeof data === "string" ) {
				try {
					data = data === "true" ? true :
						data === "false" ? false :
						data === "null" ? null :

						// Only convert to a number if it doesn't change the string
						+data + "" === data ? +data :
						rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
				} catch ( e ) {}

				// Make sure we set the data so it isn't changed later
				dataUser.set( elem, key, data );
			} else {
				data = undefined;
			}
		}
		return data;
	}

	jQuery.extend( {
		hasData: function( elem ) {
			return dataUser.hasData( elem ) || dataPriv.hasData( elem );
		},

		data: function( elem, name, data ) {
			return dataUser.access( elem, name, data );
		},

		removeData: function( elem, name ) {
			dataUser.remove( elem, name );
		},

		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to dataPriv methods, these can be deprecated.
		_data: function( elem, name, data ) {
			return dataPriv.access( elem, name, data );
		},

		_removeData: function( elem, name ) {
			dataPriv.remove( elem, name );
		}
	} );

	jQuery.fn.extend( {
		data: function( key, value ) {
			var i, name, data,
				elem = this[ 0 ],
				attrs = elem && elem.attributes;

			// Gets all values
			if ( key === undefined ) {
				if ( this.length ) {
					data = dataUser.get( elem );

					if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
						i = attrs.length;
						while ( i-- ) {

							// Support: IE11+
							// The attrs elements can be null (#14894)
							if ( attrs[ i ] ) {
								name = attrs[ i ].name;
								if ( name.indexOf( "data-" ) === 0 ) {
									name = jQuery.camelCase( name.slice( 5 ) );
									dataAttr( elem, name, data[ name ] );
								}
							}
						}
						dataPriv.set( elem, "hasDataAttrs", true );
					}
				}

				return data;
			}

			// Sets multiple values
			if ( typeof key === "object" ) {
				return this.each( function() {
					dataUser.set( this, key );
				} );
			}

			return access( this, function( value ) {
				var data, camelKey;

				// The calling jQuery object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty jQuery object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if ( elem && value === undefined ) {

					// Attempt to get data from the cache
					// with the key as-is
					data = dataUser.get( elem, key ) ||

						// Try to find dashed key if it exists (gh-2779)
						// This is for 2.2.x only
						dataUser.get( elem, key.replace( rmultiDash, "-$&" ).toLowerCase() );

					if ( data !== undefined ) {
						return data;
					}

					camelKey = jQuery.camelCase( key );

					// Attempt to get data from the cache
					// with the key camelized
					data = dataUser.get( elem, camelKey );
					if ( data !== undefined ) {
						return data;
					}

					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr( elem, camelKey, undefined );
					if ( data !== undefined ) {
						return data;
					}

					// We tried really hard, but the data doesn't exist.
					return;
				}

				// Set the data...
				camelKey = jQuery.camelCase( key );
				this.each( function() {

					// First, attempt to store a copy or reference of any
					// data that might've been store with a camelCased key.
					var data = dataUser.get( this, camelKey );

					// For HTML5 data-* attribute interop, we have to
					// store property names with dashes in a camelCase form.
					// This might not apply to all properties...*
					dataUser.set( this, camelKey, value );

					// *... In the case of properties that might _actually_
					// have dashes, we need to also store a copy of that
					// unchanged property.
					if ( key.indexOf( "-" ) > -1 && data !== undefined ) {
						dataUser.set( this, key, value );
					}
				} );
			}, null, value, arguments.length > 1, null, true );
		},

		removeData: function( key ) {
			return this.each( function() {
				dataUser.remove( this, key );
			} );
		}
	} );


	jQuery.extend( {
		queue: function( elem, type, data ) {
			var queue;

			if ( elem ) {
				type = ( type || "fx" ) + "queue";
				queue = dataPriv.get( elem, type );

				// Speed up dequeue by getting out quickly if this is just a lookup
				if ( data ) {
					if ( !queue || jQuery.isArray( data ) ) {
						queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
					} else {
						queue.push( data );
					}
				}
				return queue || [];
			}
		},

		dequeue: function( elem, type ) {
			type = type || "fx";

			var queue = jQuery.queue( elem, type ),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks( elem, type ),
				next = function() {
					jQuery.dequeue( elem, type );
				};

			// If the fx queue is dequeued, always remove the progress sentinel
			if ( fn === "inprogress" ) {
				fn = queue.shift();
				startLength--;
			}

			if ( fn ) {

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if ( type === "fx" ) {
					queue.unshift( "inprogress" );
				}

				// Clear up the last queue stop function
				delete hooks.stop;
				fn.call( elem, next, hooks );
			}

			if ( !startLength && hooks ) {
				hooks.empty.fire();
			}
		},

		// Not public - generate a queueHooks object, or return the current one
		_queueHooks: function( elem, type ) {
			var key = type + "queueHooks";
			return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
				empty: jQuery.Callbacks( "once memory" ).add( function() {
					dataPriv.remove( elem, [ type + "queue", key ] );
				} )
			} );
		}
	} );

	jQuery.fn.extend( {
		queue: function( type, data ) {
			var setter = 2;

			if ( typeof type !== "string" ) {
				data = type;
				type = "fx";
				setter--;
			}

			if ( arguments.length < setter ) {
				return jQuery.queue( this[ 0 ], type );
			}

			return data === undefined ?
				this :
				this.each( function() {
					var queue = jQuery.queue( this, type, data );

					// Ensure a hooks for this queue
					jQuery._queueHooks( this, type );

					if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
						jQuery.dequeue( this, type );
					}
				} );
		},
		dequeue: function( type ) {
			return this.each( function() {
				jQuery.dequeue( this, type );
			} );
		},
		clearQueue: function( type ) {
			return this.queue( type || "fx", [] );
		},

		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function( type, obj ) {
			var tmp,
				count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function() {
					if ( !( --count ) ) {
						defer.resolveWith( elements, [ elements ] );
					}
				};

			if ( typeof type !== "string" ) {
				obj = type;
				type = undefined;
			}
			type = type || "fx";

			while ( i-- ) {
				tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
				if ( tmp && tmp.empty ) {
					count++;
					tmp.empty.add( resolve );
				}
			}
			resolve();
			return defer.promise( obj );
		}
	} );
	var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

	var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


	var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

	var isHidden = function( elem, el ) {

			// isHidden might be called from jQuery#filter function;
			// in that case, element will be second argument
			elem = el || elem;
			return jQuery.css( elem, "display" ) === "none" ||
				!jQuery.contains( elem.ownerDocument, elem );
		};



	function adjustCSS( elem, prop, valueParts, tween ) {
		var adjusted,
			scale = 1,
			maxIterations = 20,
			currentValue = tween ?
				function() { return tween.cur(); } :
				function() { return jQuery.css( elem, prop, "" ); },
			initial = currentValue(),
			unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

			// Starting value computation is required for potential unit mismatches
			initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
				rcssNum.exec( jQuery.css( elem, prop ) );

		if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

			// Trust units reported by jQuery.css
			unit = unit || initialInUnit[ 3 ];

			// Make sure we update the tween properties later on
			valueParts = valueParts || [];

			// Iteratively approximate from a nonzero starting point
			initialInUnit = +initial || 1;

			do {

				// If previous iteration zeroed out, double until we get *something*.
				// Use string for doubling so we don't accidentally see scale as unchanged below
				scale = scale || ".5";

				// Adjust and apply
				initialInUnit = initialInUnit / scale;
				jQuery.style( elem, prop, initialInUnit + unit );

			// Update scale, tolerating zero or NaN from tween.cur()
			// Break the loop if scale is unchanged or perfect, or if we've just had enough.
			} while (
				scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
			);
		}

		if ( valueParts ) {
			initialInUnit = +initialInUnit || +initial || 0;

			// Apply relative offset (+=/-=) if specified
			adjusted = valueParts[ 1 ] ?
				initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
				+valueParts[ 2 ];
			if ( tween ) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}
	var rcheckableType = ( /^(?:checkbox|radio)$/i );

	var rtagName = ( /<([\w:-]+)/ );

	var rscriptType = ( /^$|\/(?:java|ecma)script/i );



	// We have to close these tags to support XHTML (#13200)
	var wrapMap = {

		// Support: IE9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		// XHTML parsers do not magically insert elements in the
		// same way that tag soup parsers do. So we cannot shorten
		// this by omitting <tbody> or other required elements.
		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

	// Support: IE9
	wrapMap.optgroup = wrapMap.option;

	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;


	function getAll( context, tag ) {

		// Support: IE9-11+
		// Use typeof to avoid zero-argument method invocation on host objects (#15151)
		var ret = typeof context.getElementsByTagName !== "undefined" ?
				context.getElementsByTagName( tag || "*" ) :
				typeof context.querySelectorAll !== "undefined" ?
					context.querySelectorAll( tag || "*" ) :
				[];

		return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
			jQuery.merge( [ context ], ret ) :
			ret;
	}


	// Mark scripts as having already been evaluated
	function setGlobalEval( elems, refElements ) {
		var i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			dataPriv.set(
				elems[ i ],
				"globalEval",
				!refElements || dataPriv.get( refElements[ i ], "globalEval" )
			);
		}
	}


	var rhtml = /<|&#?\w+;/;

	function buildFragment( elems, context, scripts, selection, ignored ) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {

					// Support: Android<4.1, PhantomJS<2
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: Android<4.1, PhantomJS<2
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( ( elem = nodes[ i++ ] ) ) {

			// Skip elements already in the context collection (trac-4087)
			if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
				if ( ignored ) {
					ignored.push( elem );
				}
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( ( elem = tmp[ j++ ] ) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	}


	( function() {
		var fragment = document.createDocumentFragment(),
			div = fragment.appendChild( document.createElement( "div" ) ),
			input = document.createElement( "input" );

		// Support: Android 4.0-4.3, Safari<=5.1
		// Check state lost if the name is set (#11217)
		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (#14901)
		input.setAttribute( "type", "radio" );
		input.setAttribute( "checked", "checked" );
		input.setAttribute( "name", "t" );

		div.appendChild( input );

		// Support: Safari<=5.1, Android<4.2
		// Older WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

		// Support: IE<=11+
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
	} )();


	var
		rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
		rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	// Support: IE9
	// See #13393 for more info
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch ( err ) { }
	}

	function on( elem, types, selector, data, fn, one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {

			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {

				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				on( elem, type, selector, data, types[ type ], one );
			}
			return elem;
		}

		if ( data == null && fn == null ) {

			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {

				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {

				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {

				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};

			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return elem.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		} );
	}

	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {

		global: {},

		add: function( elem, types, handler, data, selector ) {

			var handleObjIn, eventHandle, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.get( elem );

			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if ( !elemData ) {
				return;
			}

			// Caller can pass in an object of custom data in lieu of the handler
			if ( handler.handler ) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			if ( !handler.guid ) {
				handler.guid = jQuery.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			if ( !( events = elemData.events ) ) {
				events = elemData.events = {};
			}
			if ( !( eventHandle = elemData.handle ) ) {
				eventHandle = elemData.handle = function( e ) {

					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
						jQuery.event.dispatch.apply( elem, arguments ) : undefined;
				};
			}

			// Handle multiple events separated by a space
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

				// There *must* be a type, no attaching namespace-only handlers
				if ( !type ) {
					continue;
				}

				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[ type ] || {};

				// If selector defined, determine special event api type, otherwise given type
				type = ( selector ? special.delegateType : special.bindType ) || type;

				// Update special based on newly reset type
				special = jQuery.event.special[ type ] || {};

				// handleObj is passed to all event handlers
				handleObj = jQuery.extend( {
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
					namespace: namespaces.join( "." )
				}, handleObjIn );

				// Init the event handler queue if we're the first
				if ( !( handlers = events[ type ] ) ) {
					handlers = events[ type ] = [];
					handlers.delegateCount = 0;

					// Only use addEventListener if the special events handler returns false
					if ( !special.setup ||
						special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

						if ( elem.addEventListener ) {
							elem.addEventListener( type, eventHandle );
						}
					}
				}

				if ( special.add ) {
					special.add.call( elem, handleObj );

					if ( !handleObj.handler.guid ) {
						handleObj.handler.guid = handler.guid;
					}
				}

				// Add to the element's handler list, delegates in front
				if ( selector ) {
					handlers.splice( handlers.delegateCount++, 0, handleObj );
				} else {
					handlers.push( handleObj );
				}

				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[ type ] = true;
			}

		},

		// Detach an event or set of events from an element
		remove: function( elem, types, handler, selector, mappedTypes ) {

			var j, origCount, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

			if ( !elemData || !( events = elemData.events ) ) {
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

				// Unbind all events (on this namespace, if provided) for the element
				if ( !type ) {
					for ( type in events ) {
						jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
					}
					continue;
				}

				special = jQuery.event.special[ type ] || {};
				type = ( selector ? special.delegateType : special.bindType ) || type;
				handlers = events[ type ] || [];
				tmp = tmp[ 2 ] &&
					new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

				// Remove matching events
				origCount = j = handlers.length;
				while ( j-- ) {
					handleObj = handlers[ j ];

					if ( ( mappedTypes || origType === handleObj.origType ) &&
						( !handler || handler.guid === handleObj.guid ) &&
						( !tmp || tmp.test( handleObj.namespace ) ) &&
						( !selector || selector === handleObj.selector ||
							selector === "**" && handleObj.selector ) ) {
						handlers.splice( j, 1 );

						if ( handleObj.selector ) {
							handlers.delegateCount--;
						}
						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}
				}

				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if ( origCount && !handlers.length ) {
					if ( !special.teardown ||
						special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

						jQuery.removeEvent( elem, type, elemData.handle );
					}

					delete events[ type ];
				}
			}

			// Remove data and the expando if it's no longer used
			if ( jQuery.isEmptyObject( events ) ) {
				dataPriv.remove( elem, "handle events" );
			}
		},

		dispatch: function( event ) {

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( event );

			var i, j, ret, matched, handleObj,
				handlerQueue = [],
				args = slice.call( arguments ),
				handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
				special = jQuery.event.special[ event.type ] || {};

			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[ 0 ] = event;
			event.delegateTarget = this;

			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
				return;
			}

			// Determine handlers
			handlerQueue = jQuery.event.handlers.call( this, event, handlers );

			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
				event.currentTarget = matched.elem;

				j = 0;
				while ( ( handleObj = matched.handlers[ j++ ] ) &&
					!event.isImmediatePropagationStopped() ) {

					// Triggered event must either 1) have no namespace, or 2) have namespace(s)
					// a subset or equal to those in the bound event (both can have no namespace).
					if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

						event.handleObj = handleObj;
						event.data = handleObj.data;

						ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
							handleObj.handler ).apply( matched.elem, args );

						if ( ret !== undefined ) {
							if ( ( event.result = ret ) === false ) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			// Call the postDispatch hook for the mapped type
			if ( special.postDispatch ) {
				special.postDispatch.call( this, event );
			}

			return event.result;
		},

		handlers: function( event, handlers ) {
			var i, matches, sel, handleObj,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;

			// Support (at least): Chrome, IE9
			// Find delegate handlers
			// Black-hole SVG <use> instance trees (#13180)
			//
			// Support: Firefox<=42+
			// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
			if ( delegateCount && cur.nodeType &&
				( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

				for ( ; cur !== this; cur = cur.parentNode || this ) {

					// Don't check non-elements (#13208)
					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
						matches = [];
						for ( i = 0; i < delegateCount; i++ ) {
							handleObj = handlers[ i ];

							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";

							if ( matches[ sel ] === undefined ) {
								matches[ sel ] = handleObj.needsContext ?
									jQuery( sel, this ).index( cur ) > -1 :
									jQuery.find( sel, this, null, [ cur ] ).length;
							}
							if ( matches[ sel ] ) {
								matches.push( handleObj );
							}
						}
						if ( matches.length ) {
							handlerQueue.push( { elem: cur, handlers: matches } );
						}
					}
				}
			}

			// Add the remaining (directly-bound) handlers
			if ( delegateCount < handlers.length ) {
				handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
			}

			return handlerQueue;
		},

		// Includes some event props shared by KeyEvent and MouseEvent
		props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
			"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

		fixHooks: {},

		keyHooks: {
			props: "char charCode key keyCode".split( " " ),
			filter: function( event, original ) {

				// Add which for key events
				if ( event.which == null ) {
					event.which = original.charCode != null ? original.charCode : original.keyCode;
				}

				return event;
			}
		},

		mouseHooks: {
			props: ( "button buttons clientX clientY offsetX offsetY pageX pageY " +
				"screenX screenY toElement" ).split( " " ),
			filter: function( event, original ) {
				var eventDoc, doc, body,
					button = original.button;

				// Calculate pageX/Y if missing and clientX/Y available
				if ( event.pageX == null && original.clientX != null ) {
					eventDoc = event.target.ownerDocument || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;

					event.pageX = original.clientX +
						( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
						( doc && doc.clientLeft || body && body.clientLeft || 0 );
					event.pageY = original.clientY +
						( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
						( doc && doc.clientTop  || body && body.clientTop  || 0 );
				}

				// Add which for click: 1 === left; 2 === middle; 3 === right
				// Note: button is not normalized, so don't use it
				if ( !event.which && button !== undefined ) {
					event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
				}

				return event;
			}
		},

		fix: function( event ) {
			if ( event[ jQuery.expando ] ) {
				return event;
			}

			// Create a writable copy of the event object and normalize some properties
			var i, prop, copy,
				type = event.type,
				originalEvent = event,
				fixHook = this.fixHooks[ type ];

			if ( !fixHook ) {
				this.fixHooks[ type ] = fixHook =
					rmouseEvent.test( type ) ? this.mouseHooks :
					rkeyEvent.test( type ) ? this.keyHooks :
					{};
			}
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

			event = new jQuery.Event( originalEvent );

			i = copy.length;
			while ( i-- ) {
				prop = copy[ i ];
				event[ prop ] = originalEvent[ prop ];
			}

			// Support: Cordova 2.5 (WebKit) (#13255)
			// All events should have a target; Cordova deviceready doesn't
			if ( !event.target ) {
				event.target = document;
			}

			// Support: Safari 6.0+, Chrome<28
			// Target should not be a text node (#504, #13143)
			if ( event.target.nodeType === 3 ) {
				event.target = event.target.parentNode;
			}

			return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
		},

		special: {
			load: {

				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {

				// Fire native event if possible so blur/focus sequence is correct
				trigger: function() {
					if ( this !== safeActiveElement() && this.focus ) {
						this.focus();
						return false;
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function() {
					if ( this === safeActiveElement() && this.blur ) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {

				// For checkbox, fire native event so checked state will be right
				trigger: function() {
					if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
						this.click();
						return false;
					}
				},

				// For cross-browser consistency, don't fire native .click() on links
				_default: function( event ) {
					return jQuery.nodeName( event.target, "a" );
				}
			},

			beforeunload: {
				postDispatch: function( event ) {

					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if ( event.result !== undefined && event.originalEvent ) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		}
	};

	jQuery.removeEvent = function( elem, type, handle ) {

		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	};

	jQuery.Event = function( src, props ) {

		// Allow instantiation without the 'new' keyword
		if ( !( this instanceof jQuery.Event ) ) {
			return new jQuery.Event( src, props );
		}

		// Event object
		if ( src && src.type ) {
			this.originalEvent = src;
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented ||
					src.defaultPrevented === undefined &&

					// Support: Android<4.0
					src.returnValue === false ?
				returnTrue :
				returnFalse;

		// Event type
		} else {
			this.type = src;
		}

		// Put explicitly provided properties onto the event object
		if ( props ) {
			jQuery.extend( this, props );
		}

		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();

		// Mark it as fixed
		this[ jQuery.expando ] = true;
	};

	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,

		preventDefault: function() {
			var e = this.originalEvent;

			this.isDefaultPrevented = returnTrue;

			if ( e ) {
				e.preventDefault();
			}
		},
		stopPropagation: function() {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if ( e ) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;

			this.isImmediatePropagationStopped = returnTrue;

			if ( e ) {
				e.stopImmediatePropagation();
			}

			this.stopPropagation();
		}
	};

	// Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://code.google.com/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each( {
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function( orig, fix ) {
		jQuery.event.special[ orig ] = {
			delegateType: fix,
			bindType: fix,

			handle: function( event ) {
				var ret,
					target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;

				// For mouseenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply( this, arguments );
					event.type = fix;
				}
				return ret;
			}
		};
	} );

	jQuery.fn.extend( {
		on: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn );
		},
		one: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn, 1 );
		},
		off: function( types, selector, fn ) {
			var handleObj, type;
			if ( types && types.preventDefault && types.handleObj ) {

				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery( types.delegateTarget ).off(
					handleObj.namespace ?
						handleObj.origType + "." + handleObj.namespace :
						handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if ( typeof types === "object" ) {

				// ( types-object [, selector] )
				for ( type in types ) {
					this.off( type, selector, types[ type ] );
				}
				return this;
			}
			if ( selector === false || typeof selector === "function" ) {

				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if ( fn === false ) {
				fn = returnFalse;
			}
			return this.each( function() {
				jQuery.event.remove( this, types, fn, selector );
			} );
		}
	} );


	var
		rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

		// Support: IE 10-11, Edge 10240+
		// In IE/Edge using regex groups here causes severe slowdowns.
		// See https://connect.microsoft.com/IE/feedback/details/1736512/
		rnoInnerhtml = /<script|<style|<link/i,

		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rscriptTypeMasked = /^true\/(.*)/,
		rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

	function manipulationTarget( elem, content ) {
		if ( jQuery.nodeName( elem, "table" ) &&
			jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

			return elem.getElementsByTagName( "tbody" )[ 0 ] || elem;
		}

		return elem;
	}

	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript( elem ) {
		elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
		return elem;
	}
	function restoreScript( elem ) {
		var match = rscriptTypeMasked.exec( elem.type );

		if ( match ) {
			elem.type = match[ 1 ];
		} else {
			elem.removeAttribute( "type" );
		}

		return elem;
	}

	function cloneCopyEvent( src, dest ) {
		var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

		if ( dest.nodeType !== 1 ) {
			return;
		}

		// 1. Copy private data: events, handlers, etc.
		if ( dataPriv.hasData( src ) ) {
			pdataOld = dataPriv.access( src );
			pdataCur = dataPriv.set( dest, pdataOld );
			events = pdataOld.events;

			if ( events ) {
				delete pdataCur.handle;
				pdataCur.events = {};

				for ( type in events ) {
					for ( i = 0, l = events[ type ].length; i < l; i++ ) {
						jQuery.event.add( dest, type, events[ type ][ i ] );
					}
				}
			}
		}

		// 2. Copy user data
		if ( dataUser.hasData( src ) ) {
			udataOld = dataUser.access( src );
			udataCur = jQuery.extend( {}, udataOld );

			dataUser.set( dest, udataCur );
		}
	}

	// Fix IE bugs, see support tests
	function fixInput( src, dest ) {
		var nodeName = dest.nodeName.toLowerCase();

		// Fails to persist the checked state of a cloned checkbox or radio button.
		if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
			dest.checked = src.checked;

		// Fails to return the selected option to the default selected state when cloning options
		} else if ( nodeName === "input" || nodeName === "textarea" ) {
			dest.defaultValue = src.defaultValue;
		}
	}

	function domManip( collection, args, callback, ignored ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = collection.length,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return collection.each( function( index ) {
				var self = collection.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				domManip( self, args, callback, ignored );
			} );
		}

		if ( l ) {
			fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			// Require either new content or an interest in ignored elements to invoke the callback
			if ( first || ignored ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item
				// instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {

							// Support: Android<4.1, PhantomJS<2
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( collection[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!dataPriv.access( node, "globalEval" ) &&
							jQuery.contains( doc, node ) ) {

							if ( node.src ) {

								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return collection;
	}

	function remove( elem, selector, keepData ) {
		var node,
			nodes = selector ? jQuery.filter( selector, elem ) : elem,
			i = 0;

		for ( ; ( node = nodes[ i ] ) != null; i++ ) {
			if ( !keepData && node.nodeType === 1 ) {
				jQuery.cleanData( getAll( node ) );
			}

			if ( node.parentNode ) {
				if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
					setGlobalEval( getAll( node, "script" ) );
				}
				node.parentNode.removeChild( node );
			}
		}

		return elem;
	}

	jQuery.extend( {
		htmlPrefilter: function( html ) {
			return html.replace( rxhtmlTag, "<$1></$2>" );
		},

		clone: function( elem, dataAndEvents, deepDataAndEvents ) {
			var i, l, srcElements, destElements,
				clone = elem.cloneNode( true ),
				inPage = jQuery.contains( elem.ownerDocument, elem );

			// Fix IE cloning issues
			if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
					!jQuery.isXMLDoc( elem ) ) {

				// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
				destElements = getAll( clone );
				srcElements = getAll( elem );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					fixInput( srcElements[ i ], destElements[ i ] );
				}
			}

			// Copy the events from the original to the clone
			if ( dataAndEvents ) {
				if ( deepDataAndEvents ) {
					srcElements = srcElements || getAll( elem );
					destElements = destElements || getAll( clone );

					for ( i = 0, l = srcElements.length; i < l; i++ ) {
						cloneCopyEvent( srcElements[ i ], destElements[ i ] );
					}
				} else {
					cloneCopyEvent( elem, clone );
				}
			}

			// Preserve script evaluation history
			destElements = getAll( clone, "script" );
			if ( destElements.length > 0 ) {
				setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
			}

			// Return the cloned set
			return clone;
		},

		cleanData: function( elems ) {
			var data, elem, type,
				special = jQuery.event.special,
				i = 0;

			for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
				if ( acceptData( elem ) ) {
					if ( ( data = elem[ dataPriv.expando ] ) ) {
						if ( data.events ) {
							for ( type in data.events ) {
								if ( special[ type ] ) {
									jQuery.event.remove( elem, type );

								// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent( elem, type, data.handle );
								}
							}
						}

						// Support: Chrome <= 35-45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataPriv.expando ] = undefined;
					}
					if ( elem[ dataUser.expando ] ) {

						// Support: Chrome <= 35-45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataUser.expando ] = undefined;
					}
				}
			}
		}
	} );

	jQuery.fn.extend( {

		// Keep domManip exposed until 3.0 (gh-2225)
		domManip: domManip,

		detach: function( selector ) {
			return remove( this, selector, true );
		},

		remove: function( selector ) {
			return remove( this, selector );
		},

		text: function( value ) {
			return access( this, function( value ) {
				return value === undefined ?
					jQuery.text( this ) :
					this.empty().each( function() {
						if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
							this.textContent = value;
						}
					} );
			}, null, value, arguments.length );
		},

		append: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.appendChild( elem );
				}
			} );
		},

		prepend: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.insertBefore( elem, target.firstChild );
				}
			} );
		},

		before: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this );
				}
			} );
		},

		after: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this.nextSibling );
				}
			} );
		},

		empty: function() {
			var elem,
				i = 0;

			for ( ; ( elem = this[ i ] ) != null; i++ ) {
				if ( elem.nodeType === 1 ) {

					// Prevent memory leaks
					jQuery.cleanData( getAll( elem, false ) );

					// Remove any remaining nodes
					elem.textContent = "";
				}
			}

			return this;
		},

		clone: function( dataAndEvents, deepDataAndEvents ) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

			return this.map( function() {
				return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
			} );
		},

		html: function( value ) {
			return access( this, function( value ) {
				var elem = this[ 0 ] || {},
					i = 0,
					l = this.length;

				if ( value === undefined && elem.nodeType === 1 ) {
					return elem.innerHTML;
				}

				// See if we can take a shortcut and just use innerHTML
				if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
					!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

					value = jQuery.htmlPrefilter( value );

					try {
						for ( ; i < l; i++ ) {
							elem = this[ i ] || {};

							// Remove element nodes and prevent memory leaks
							if ( elem.nodeType === 1 ) {
								jQuery.cleanData( getAll( elem, false ) );
								elem.innerHTML = value;
							}
						}

						elem = 0;

					// If using innerHTML throws an exception, use the fallback method
					} catch ( e ) {}
				}

				if ( elem ) {
					this.empty().append( value );
				}
			}, null, value, arguments.length );
		},

		replaceWith: function() {
			var ignored = [];

			// Make the changes, replacing each non-ignored context element with the new content
			return domManip( this, arguments, function( elem ) {
				var parent = this.parentNode;

				if ( jQuery.inArray( this, ignored ) < 0 ) {
					jQuery.cleanData( getAll( this ) );
					if ( parent ) {
						parent.replaceChild( elem, this );
					}
				}

			// Force callback invocation
			}, ignored );
		}
	} );

	jQuery.each( {
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var elems,
				ret = [],
				insert = jQuery( selector ),
				last = insert.length - 1,
				i = 0;

			for ( ; i <= last; i++ ) {
				elems = i === last ? this : this.clone( true );
				jQuery( insert[ i ] )[ original ]( elems );

				// Support: QtWebKit
				// .get() because push.apply(_, arraylike) throws
				push.apply( ret, elems.get() );
			}

			return this.pushStack( ret );
		};
	} );


	var iframe,
		elemdisplay = {

			// Support: Firefox
			// We have to pre-define these values for FF (#10227)
			HTML: "block",
			BODY: "block"
		};

	/**
	 * Retrieve the actual display of a element
	 * @param {String} name nodeName of the element
	 * @param {Object} doc Document object
	 */

	// Called only from within defaultDisplay
	function actualDisplay( name, doc ) {
		var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

			display = jQuery.css( elem[ 0 ], "display" );

		// We don't have any data stored on the element,
		// so use "detach" method as fast way to get rid of the element
		elem.detach();

		return display;
	}

	/**
	 * Try to determine the default display value of an element
	 * @param {String} nodeName
	 */
	function defaultDisplay( nodeName ) {
		var doc = document,
			display = elemdisplay[ nodeName ];

		if ( !display ) {
			display = actualDisplay( nodeName, doc );

			// If the simple way fails, read from inside an iframe
			if ( display === "none" || !display ) {

				// Use the already-created iframe if possible
				iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
					.appendTo( doc.documentElement );

				// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
				doc = iframe[ 0 ].contentDocument;

				// Support: IE
				doc.write();
				doc.close();

				display = actualDisplay( nodeName, doc );
				iframe.detach();
			}

			// Store the correct default display
			elemdisplay[ nodeName ] = display;
		}

		return display;
	}
	var rmargin = ( /^margin/ );

	var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

	var getStyles = function( elem ) {

			// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
			// IE throws on elements created in popups
			// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
			var view = elem.ownerDocument.defaultView;

			if ( !view.opener ) {
				view = window;
			}

			return view.getComputedStyle( elem );
		};

	var swap = function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	};


	var documentElement = document.documentElement;



	( function() {
		var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
			container = document.createElement( "div" ),
			div = document.createElement( "div" );

		// Finish early in limited (non-browser) environments
		if ( !div.style ) {
			return;
		}

		// Support: IE9-11+
		// Style of cloned element affects source element cloned (#8908)
		div.style.backgroundClip = "content-box";
		div.cloneNode( true ).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";

		container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
			"padding:0;margin-top:1px;position:absolute";
		container.appendChild( div );

		// Executing both pixelPosition & boxSizingReliable tests require only one layout
		// so they're executed at the same time to save the second computation.
		function computeStyleTests() {
			div.style.cssText =

				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;" +
				"position:relative;display:block;" +
				"margin:auto;border:1px;padding:1px;" +
				"top:1%;width:50%";
			div.innerHTML = "";
			documentElement.appendChild( container );

			var divStyle = window.getComputedStyle( div );
			pixelPositionVal = divStyle.top !== "1%";
			reliableMarginLeftVal = divStyle.marginLeft === "2px";
			boxSizingReliableVal = divStyle.width === "4px";

			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = divStyle.marginRight === "4px";

			documentElement.removeChild( container );
		}

		jQuery.extend( support, {
			pixelPosition: function() {

				// This test is executed only once but we still do memoizing
				// since we can use the boxSizingReliable pre-computing.
				// No need to check if the test was already performed, though.
				computeStyleTests();
				return pixelPositionVal;
			},
			boxSizingReliable: function() {
				if ( boxSizingReliableVal == null ) {
					computeStyleTests();
				}
				return boxSizingReliableVal;
			},
			pixelMarginRight: function() {

				// Support: Android 4.0-4.3
				// We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
				// since that compresses better and they're computed together anyway.
				if ( boxSizingReliableVal == null ) {
					computeStyleTests();
				}
				return pixelMarginRightVal;
			},
			reliableMarginLeft: function() {

				// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
				if ( boxSizingReliableVal == null ) {
					computeStyleTests();
				}
				return reliableMarginLeftVal;
			},
			reliableMarginRight: function() {

				// Support: Android 2.3
				// Check if div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container. (#3333)
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// This support function is only executed once so no memoizing is needed.
				var ret,
					marginDiv = div.appendChild( document.createElement( "div" ) );

				// Reset CSS: box-sizing; display; margin; border; padding
				marginDiv.style.cssText = div.style.cssText =

					// Support: Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;box-sizing:content-box;" +
					"display:block;margin:0;border:0;padding:0";
				marginDiv.style.marginRight = marginDiv.style.width = "0";
				div.style.width = "1px";
				documentElement.appendChild( container );

				ret = !parseFloat( window.getComputedStyle( marginDiv ).marginRight );

				documentElement.removeChild( container );
				div.removeChild( marginDiv );

				return ret;
			}
		} );
	} )();


	function curCSS( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// Support: IE9
		// getPropertyValue is only needed for .css('filter') (#12537)
		if ( computed ) {
			ret = computed.getPropertyValue( name ) || computed[ name ];

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Android Browser returns percentage for some values,
			// but width seems to be reliably pixels.
			// This is against the CSSOM draft spec:
			// http://dev.w3.org/csswg/cssom/#resolved-values
			if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret !== undefined ?

			// Support: IE9-11+
			// IE returns zIndex value as an integer.
			ret + "" :
			ret;
	}


	function addGetHookIf( conditionFn, hookFn ) {

		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function() {
				if ( conditionFn() ) {

					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}

				// Hook needed; redefine it so that the support test is not executed again.
				return ( this.get = hookFn ).apply( this, arguments );
			}
		};
	}


	var

		// Swappable if display is none or starts with table
		// except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,

		cssShow = { position: "absolute", visibility: "hidden", display: "block" },
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		},

		cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
		emptyStyle = document.createElement( "div" ).style;

	// Return a css property mapped to a potentially vendor prefixed property
	function vendorPropName( name ) {

		// Shortcut for names that are not vendor prefixed
		if ( name in emptyStyle ) {
			return name;
		}

		// Check for vendor prefixed names
		var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
			i = cssPrefixes.length;

		while ( i-- ) {
			name = cssPrefixes[ i ] + capName;
			if ( name in emptyStyle ) {
				return name;
			}
		}
	}

	function setPositiveNumber( elem, value, subtract ) {

		// Any relative (+/-) values have already been
		// normalized at this point
		var matches = rcssNum.exec( value );
		return matches ?

			// Guard against undefined "subtract", e.g., when used as in cssHooks
			Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
			value;
	}

	function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
		var i = extra === ( isBorderBox ? "border" : "content" ) ?

			// If we already have the right measurement, avoid augmentation
			4 :

			// Otherwise initialize for horizontal or vertical properties
			name === "width" ? 1 : 0,

			val = 0;

		for ( ; i < 4; i += 2 ) {

			// Both box models exclude margin, so add it if we want it
			if ( extra === "margin" ) {
				val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
			}

			if ( isBorderBox ) {

				// border-box includes padding, so remove it if we want content
				if ( extra === "content" ) {
					val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
				}

				// At this point, extra isn't border nor margin, so remove border
				if ( extra !== "margin" ) {
					val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			} else {

				// At this point, extra isn't content, so add padding
				val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

				// At this point, extra isn't content nor padding, so add border
				if ( extra !== "padding" ) {
					val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			}
		}

		return val;
	}

	function getWidthOrHeight( elem, name, extra ) {

		// Start with offset property, which is equivalent to the border-box value
		var valueIsBorderBox = true,
			val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
			styles = getStyles( elem ),
			isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Support: IE11 only
		// In IE 11 fullscreen elements inside of an iframe have
		// 100x too small dimensions (gh-1764).
		if ( document.msFullscreenElement && window.top !== window ) {

			// Support: IE11 only
			// Running getBoundingClientRect on a disconnected node
			// in IE throws an error.
			if ( elem.getClientRects().length ) {
				val = Math.round( elem.getBoundingClientRect()[ name ] * 100 );
			}
		}

		// Some non-html elements return undefined for offsetWidth, so check for null/undefined
		// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
		// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
		if ( val <= 0 || val == null ) {

			// Fall back to computed then uncomputed css if necessary
			val = curCSS( elem, name, styles );
			if ( val < 0 || val == null ) {
				val = elem.style[ name ];
			}

			// Computed unit is not pixels. Stop here and return.
			if ( rnumnonpx.test( val ) ) {
				return val;
			}

			// Check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable elem.style
			valueIsBorderBox = isBorderBox &&
				( support.boxSizingReliable() || val === elem.style[ name ] );

			// Normalize "", auto, and prepare for extra
			val = parseFloat( val ) || 0;
		}

		// Use the active box-sizing model to add/subtract irrelevant styles
		return ( val +
			augmentWidthOrHeight(
				elem,
				name,
				extra || ( isBorderBox ? "border" : "content" ),
				valueIsBorderBox,
				styles
			)
		) + "px";
	}

	function showHide( elements, show ) {
		var display, elem, hidden,
			values = [],
			index = 0,
			length = elements.length;

		for ( ; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}

			values[ index ] = dataPriv.get( elem, "olddisplay" );
			display = elem.style.display;
			if ( show ) {

				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if ( !values[ index ] && display === "none" ) {
					elem.style.display = "";
				}

				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if ( elem.style.display === "" && isHidden( elem ) ) {
					values[ index ] = dataPriv.access(
						elem,
						"olddisplay",
						defaultDisplay( elem.nodeName )
					);
				}
			} else {
				hidden = isHidden( elem );

				if ( display !== "none" || !hidden ) {
					dataPriv.set(
						elem,
						"olddisplay",
						hidden ? display : jQuery.css( elem, "display" )
					);
				}
			}
		}

		// Set the display of most of the elements in a second loop
		// to avoid the constant reflow
		for ( index = 0; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}
			if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
				elem.style.display = show ? values[ index ] || "" : "none";
			}
		}

		return elements;
	}

	jQuery.extend( {

		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function( elem, computed ) {
					if ( computed ) {

						// We should always get a number back from opacity
						var ret = curCSS( elem, "opacity" );
						return ret === "" ? "1" : ret;
					}
				}
			}
		},

		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"animationIterationCount": true,
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},

		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
			"float": "cssFloat"
		},

		// Get and set the style property on a DOM Node
		style: function( elem, name, value, extra ) {

			// Don't set styles on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
				return;
			}

			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = jQuery.camelCase( name ),
				style = elem.style;

			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

			// Gets hook for the prefixed version, then unprefixed version
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

			// Check if we're setting a value
			if ( value !== undefined ) {
				type = typeof value;

				// Convert "+=" or "-=" to relative numbers (#7345)
				if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
					value = adjustCSS( elem, name, ret );

					// Fixes bug #9237
					type = "number";
				}

				// Make sure that null and NaN values aren't set (#7116)
				if ( value == null || value !== value ) {
					return;
				}

				// If a number was passed in, add the unit (except for certain CSS properties)
				if ( type === "number" ) {
					value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
				}

				// Support: IE9-11+
				// background-* props affect original clone's values
				if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
					style[ name ] = "inherit";
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if ( !hooks || !( "set" in hooks ) ||
					( value = hooks.set( elem, value, extra ) ) !== undefined ) {

					style[ name ] = value;
				}

			} else {

				// If a hook was provided get the non-computed value from there
				if ( hooks && "get" in hooks &&
					( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

					return ret;
				}

				// Otherwise just get the value from the style object
				return style[ name ];
			}
		},

		css: function( elem, name, extra, styles ) {
			var val, num, hooks,
				origName = jQuery.camelCase( name );

			// Make sure that we're working with the right name
			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

			// Try prefixed name followed by the unprefixed name
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

			// If a hook was provided get the computed value from there
			if ( hooks && "get" in hooks ) {
				val = hooks.get( elem, true, extra );
			}

			// Otherwise, if a way to get the computed value exists, use that
			if ( val === undefined ) {
				val = curCSS( elem, name, styles );
			}

			// Convert "normal" to computed value
			if ( val === "normal" && name in cssNormalTransform ) {
				val = cssNormalTransform[ name ];
			}

			// Make numeric if forced or a qualifier was provided and val looks numeric
			if ( extra === "" || extra ) {
				num = parseFloat( val );
				return extra === true || isFinite( num ) ? num || 0 : val;
			}
			return val;
		}
	} );

	jQuery.each( [ "height", "width" ], function( i, name ) {
		jQuery.cssHooks[ name ] = {
			get: function( elem, computed, extra ) {
				if ( computed ) {

					// Certain elements can have dimension info if we invisibly show them
					// but it must have a current display style that would benefit
					return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
						elem.offsetWidth === 0 ?
							swap( elem, cssShow, function() {
								return getWidthOrHeight( elem, name, extra );
							} ) :
							getWidthOrHeight( elem, name, extra );
				}
			},

			set: function( elem, value, extra ) {
				var matches,
					styles = extra && getStyles( elem ),
					subtract = extra && augmentWidthOrHeight(
						elem,
						name,
						extra,
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
						styles
					);

				// Convert to pixels if value adjustment is needed
				if ( subtract && ( matches = rcssNum.exec( value ) ) &&
					( matches[ 3 ] || "px" ) !== "px" ) {

					elem.style[ name ] = value;
					value = jQuery.css( elem, name );
				}

				return setPositiveNumber( elem, value, subtract );
			}
		};
	} );

	jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
		function( elem, computed ) {
			if ( computed ) {
				return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} )
					) + "px";
			}
		}
	);

	// Support: Android 2.3
	jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
		function( elem, computed ) {
			if ( computed ) {
				return swap( elem, { "display": "inline-block" },
					curCSS, [ elem, "marginRight" ] );
			}
		}
	);

	// These hooks are used by animate to expand properties
	jQuery.each( {
		margin: "",
		padding: "",
		border: "Width"
	}, function( prefix, suffix ) {
		jQuery.cssHooks[ prefix + suffix ] = {
			expand: function( value ) {
				var i = 0,
					expanded = {},

					// Assumes a single number if not a string
					parts = typeof value === "string" ? value.split( " " ) : [ value ];

				for ( ; i < 4; i++ ) {
					expanded[ prefix + cssExpand[ i ] + suffix ] =
						parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
				}

				return expanded;
			}
		};

		if ( !rmargin.test( prefix ) ) {
			jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
		}
	} );

	jQuery.fn.extend( {
		css: function( name, value ) {
			return access( this, function( elem, name, value ) {
				var styles, len,
					map = {},
					i = 0;

				if ( jQuery.isArray( name ) ) {
					styles = getStyles( elem );
					len = name.length;

					for ( ; i < len; i++ ) {
						map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
					}

					return map;
				}

				return value !== undefined ?
					jQuery.style( elem, name, value ) :
					jQuery.css( elem, name );
			}, name, value, arguments.length > 1 );
		},
		show: function() {
			return showHide( this, true );
		},
		hide: function() {
			return showHide( this );
		},
		toggle: function( state ) {
			if ( typeof state === "boolean" ) {
				return state ? this.show() : this.hide();
			}

			return this.each( function() {
				if ( isHidden( this ) ) {
					jQuery( this ).show();
				} else {
					jQuery( this ).hide();
				}
			} );
		}
	} );


	function Tween( elem, options, prop, end, easing ) {
		return new Tween.prototype.init( elem, options, prop, end, easing );
	}
	jQuery.Tween = Tween;

	Tween.prototype = {
		constructor: Tween,
		init: function( elem, options, prop, end, easing, unit ) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
		},
		cur: function() {
			var hooks = Tween.propHooks[ this.prop ];

			return hooks && hooks.get ?
				hooks.get( this ) :
				Tween.propHooks._default.get( this );
		},
		run: function( percent ) {
			var eased,
				hooks = Tween.propHooks[ this.prop ];

			if ( this.options.duration ) {
				this.pos = eased = jQuery.easing[ this.easing ](
					percent, this.options.duration * percent, 0, 1, this.options.duration
				);
			} else {
				this.pos = eased = percent;
			}
			this.now = ( this.end - this.start ) * eased + this.start;

			if ( this.options.step ) {
				this.options.step.call( this.elem, this.now, this );
			}

			if ( hooks && hooks.set ) {
				hooks.set( this );
			} else {
				Tween.propHooks._default.set( this );
			}
			return this;
		}
	};

	Tween.prototype.init.prototype = Tween.prototype;

	Tween.propHooks = {
		_default: {
			get: function( tween ) {
				var result;

				// Use a property on the element directly when it is not a DOM element,
				// or when there is no matching style property that exists.
				if ( tween.elem.nodeType !== 1 ||
					tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
					return tween.elem[ tween.prop ];
				}

				// Passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails.
				// Simple values such as "10px" are parsed to Float;
				// complex values such as "rotate(1rad)" are returned as-is.
				result = jQuery.css( tween.elem, tween.prop, "" );

				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function( tween ) {

				// Use step hook for back compat.
				// Use cssHook if its there.
				// Use .style if available and use plain properties where available.
				if ( jQuery.fx.step[ tween.prop ] ) {
					jQuery.fx.step[ tween.prop ]( tween );
				} else if ( tween.elem.nodeType === 1 &&
					( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
						jQuery.cssHooks[ tween.prop ] ) ) {
					jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
				} else {
					tween.elem[ tween.prop ] = tween.now;
				}
			}
		}
	};

	// Support: IE9
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function( tween ) {
			if ( tween.elem.nodeType && tween.elem.parentNode ) {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	};

	jQuery.easing = {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return 0.5 - Math.cos( p * Math.PI ) / 2;
		},
		_default: "swing"
	};

	jQuery.fx = Tween.prototype.init;

	// Back Compat <1.8 extension point
	jQuery.fx.step = {};




	var
		fxNow, timerId,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rrun = /queueHooks$/;

	// Animations created synchronously will run synchronously
	function createFxNow() {
		window.setTimeout( function() {
			fxNow = undefined;
		} );
		return ( fxNow = jQuery.now() );
	}

	// Generate parameters to create a standard animation
	function genFx( type, includeWidth ) {
		var which,
			i = 0,
			attrs = { height: type };

		// If we include width, step value is 1 to do all cssExpand values,
		// otherwise step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for ( ; i < 4 ; i += 2 - includeWidth ) {
			which = cssExpand[ i ];
			attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
		}

		if ( includeWidth ) {
			attrs.opacity = attrs.width = type;
		}

		return attrs;
	}

	function createTween( value, prop, animation ) {
		var tween,
			collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

				// We're done with this property
				return tween;
			}
		}
	}

	function defaultPrefilter( elem, props, opts ) {
		/* jshint validthis: true */
		var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
			anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHidden( elem ),
			dataShow = dataPriv.get( elem, "fxshow" );

		// Handle queue: false promises
		if ( !opts.queue ) {
			hooks = jQuery._queueHooks( elem, "fx" );
			if ( hooks.unqueued == null ) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function() {
					if ( !hooks.unqueued ) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;

			anim.always( function() {

				// Ensure the complete handler is called before this completes
				anim.always( function() {
					hooks.unqueued--;
					if ( !jQuery.queue( elem, "fx" ).length ) {
						hooks.empty.fire();
					}
				} );
			} );
		}

		// Height/width overflow pass
		if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {

			// Make sure that nothing sneaks out
			// Record all 3 overflow attributes because IE9-10 do not
			// change the overflow attribute when overflowX and
			// overflowY are set to the same value
			opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

			// Set display property to inline-block for height/width
			// animations on inline elements that are having width/height animated
			display = jQuery.css( elem, "display" );

			// Test default display if display is currently "none"
			checkDisplay = display === "none" ?
				dataPriv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

			if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
				style.display = "inline-block";
			}
		}

		if ( opts.overflow ) {
			style.overflow = "hidden";
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}

		// show/hide pass
		for ( prop in props ) {
			value = props[ prop ];
			if ( rfxtypes.exec( value ) ) {
				delete props[ prop ];
				toggle = toggle || value === "toggle";
				if ( value === ( hidden ? "hide" : "show" ) ) {

					// If there is dataShow left over from a stopped hide or show
					// and we are going to proceed with show, we should pretend to be hidden
					if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
						hidden = true;
					} else {
						continue;
					}
				}
				orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

			// Any non-fx value stops us from restoring the original display value
			} else {
				display = undefined;
			}
		}

		if ( !jQuery.isEmptyObject( orig ) ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", {} );
			}

			// Store state if its toggle - enables .stop().toggle() to "reverse"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}
			if ( hidden ) {
				jQuery( elem ).show();
			} else {
				anim.done( function() {
					jQuery( elem ).hide();
				} );
			}
			anim.done( function() {
				var prop;

				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
			for ( prop in orig ) {
				tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

				if ( !( prop in dataShow ) ) {
					dataShow[ prop ] = tween.start;
					if ( hidden ) {
						tween.end = tween.start;
						tween.start = prop === "width" || prop === "height" ? 1 : 0;
					}
				}
			}

		// If this is a noop like .hide().hide(), restore an overwritten display value
		} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
			style.display = display;
		}
	}

	function propFilter( props, specialEasing ) {
		var index, name, easing, value, hooks;

		// camelCase, specialEasing and expand cssHook pass
		for ( index in props ) {
			name = jQuery.camelCase( index );
			easing = specialEasing[ name ];
			value = props[ index ];
			if ( jQuery.isArray( value ) ) {
				easing = value[ 1 ];
				value = props[ index ] = value[ 0 ];
			}

			if ( index !== name ) {
				props[ name ] = value;
				delete props[ index ];
			}

			hooks = jQuery.cssHooks[ name ];
			if ( hooks && "expand" in hooks ) {
				value = hooks.expand( value );
				delete props[ name ];

				// Not quite $.extend, this won't overwrite existing keys.
				// Reusing 'index' because we have the correct "name"
				for ( index in value ) {
					if ( !( index in props ) ) {
						props[ index ] = value[ index ];
						specialEasing[ index ] = easing;
					}
				}
			} else {
				specialEasing[ name ] = easing;
			}
		}
	}

	function Animation( elem, properties, options ) {
		var result,
			stopped,
			index = 0,
			length = Animation.prefilters.length,
			deferred = jQuery.Deferred().always( function() {

				// Don't match elem in the :animated selector
				delete tick.elem;
			} ),
			tick = function() {
				if ( stopped ) {
					return false;
				}
				var currentTime = fxNow || createFxNow(),
					remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

					// Support: Android 2.3
					// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
					temp = remaining / animation.duration || 0,
					percent = 1 - temp,
					index = 0,
					length = animation.tweens.length;

				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( percent );
				}

				deferred.notifyWith( elem, [ animation, percent, remaining ] );

				if ( percent < 1 && length ) {
					return remaining;
				} else {
					deferred.resolveWith( elem, [ animation ] );
					return false;
				}
			},
			animation = deferred.promise( {
				elem: elem,
				props: jQuery.extend( {}, properties ),
				opts: jQuery.extend( true, {
					specialEasing: {},
					easing: jQuery.easing._default
				}, options ),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function( prop, end ) {
					var tween = jQuery.Tween( elem, animation.opts, prop, end,
							animation.opts.specialEasing[ prop ] || animation.opts.easing );
					animation.tweens.push( tween );
					return tween;
				},
				stop: function( gotoEnd ) {
					var index = 0,

						// If we are going to the end, we want to run all the tweens
						// otherwise we skip this part
						length = gotoEnd ? animation.tweens.length : 0;
					if ( stopped ) {
						return this;
					}
					stopped = true;
					for ( ; index < length ; index++ ) {
						animation.tweens[ index ].run( 1 );
					}

					// Resolve when we played the last frame; otherwise, reject
					if ( gotoEnd ) {
						deferred.notifyWith( elem, [ animation, 1, 0 ] );
						deferred.resolveWith( elem, [ animation, gotoEnd ] );
					} else {
						deferred.rejectWith( elem, [ animation, gotoEnd ] );
					}
					return this;
				}
			} ),
			props = animation.props;

		propFilter( props, animation.opts.specialEasing );

		for ( ; index < length ; index++ ) {
			result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
			if ( result ) {
				if ( jQuery.isFunction( result.stop ) ) {
					jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
						jQuery.proxy( result.stop, result );
				}
				return result;
			}
		}

		jQuery.map( props, createTween, animation );

		if ( jQuery.isFunction( animation.opts.start ) ) {
			animation.opts.start.call( elem, animation );
		}

		jQuery.fx.timer(
			jQuery.extend( tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			} )
		);

		// attach callbacks from options
		return animation.progress( animation.opts.progress )
			.done( animation.opts.done, animation.opts.complete )
			.fail( animation.opts.fail )
			.always( animation.opts.always );
	}

	jQuery.Animation = jQuery.extend( Animation, {
		tweeners: {
			"*": [ function( prop, value ) {
				var tween = this.createTween( prop, value );
				adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
				return tween;
			} ]
		},

		tweener: function( props, callback ) {
			if ( jQuery.isFunction( props ) ) {
				callback = props;
				props = [ "*" ];
			} else {
				props = props.match( rnotwhite );
			}

			var prop,
				index = 0,
				length = props.length;

			for ( ; index < length ; index++ ) {
				prop = props[ index ];
				Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
				Animation.tweeners[ prop ].unshift( callback );
			}
		},

		prefilters: [ defaultPrefilter ],

		prefilter: function( callback, prepend ) {
			if ( prepend ) {
				Animation.prefilters.unshift( callback );
			} else {
				Animation.prefilters.push( callback );
			}
		}
	} );

	jQuery.speed = function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ?
			opt.duration : opt.duration in jQuery.fx.speeds ?
				jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// Normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function() {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			}
		};

		return opt;
	};

	jQuery.fn.extend( {
		fadeTo: function( speed, to, easing, callback ) {

			// Show any hidden elements after setting opacity to 0
			return this.filter( isHidden ).css( "opacity", 0 ).show()

				// Animate to the value specified
				.end().animate( { opacity: to }, speed, easing, callback );
		},
		animate: function( prop, speed, easing, callback ) {
			var empty = jQuery.isEmptyObject( prop ),
				optall = jQuery.speed( speed, easing, callback ),
				doAnimation = function() {

					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation( this, jQuery.extend( {}, prop ), optall );

					// Empty animations, or finishing resolves immediately
					if ( empty || dataPriv.get( this, "finish" ) ) {
						anim.stop( true );
					}
				};
				doAnimation.finish = doAnimation;

			return empty || optall.queue === false ?
				this.each( doAnimation ) :
				this.queue( optall.queue, doAnimation );
		},
		stop: function( type, clearQueue, gotoEnd ) {
			var stopQueue = function( hooks ) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop( gotoEnd );
			};

			if ( typeof type !== "string" ) {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if ( clearQueue && type !== false ) {
				this.queue( type || "fx", [] );
			}

			return this.each( function() {
				var dequeue = true,
					index = type != null && type + "queueHooks",
					timers = jQuery.timers,
					data = dataPriv.get( this );

				if ( index ) {
					if ( data[ index ] && data[ index ].stop ) {
						stopQueue( data[ index ] );
					}
				} else {
					for ( index in data ) {
						if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
							stopQueue( data[ index ] );
						}
					}
				}

				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this &&
						( type == null || timers[ index ].queue === type ) ) {

						timers[ index ].anim.stop( gotoEnd );
						dequeue = false;
						timers.splice( index, 1 );
					}
				}

				// Start the next in the queue if the last step wasn't forced.
				// Timers currently will call their complete callbacks, which
				// will dequeue but only if they were gotoEnd.
				if ( dequeue || !gotoEnd ) {
					jQuery.dequeue( this, type );
				}
			} );
		},
		finish: function( type ) {
			if ( type !== false ) {
				type = type || "fx";
			}
			return this.each( function() {
				var index,
					data = dataPriv.get( this ),
					queue = data[ type + "queue" ],
					hooks = data[ type + "queueHooks" ],
					timers = jQuery.timers,
					length = queue ? queue.length : 0;

				// Enable finishing flag on private data
				data.finish = true;

				// Empty the queue first
				jQuery.queue( this, type, [] );

				if ( hooks && hooks.stop ) {
					hooks.stop.call( this, true );
				}

				// Look for any active animations, and finish them
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
						timers[ index ].anim.stop( true );
						timers.splice( index, 1 );
					}
				}

				// Look for any animations in the old queue and finish them
				for ( index = 0; index < length; index++ ) {
					if ( queue[ index ] && queue[ index ].finish ) {
						queue[ index ].finish.call( this );
					}
				}

				// Turn off finishing flag
				delete data.finish;
			} );
		}
	} );

	jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
		var cssFn = jQuery.fn[ name ];
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return speed == null || typeof speed === "boolean" ?
				cssFn.apply( this, arguments ) :
				this.animate( genFx( name, true ), speed, easing, callback );
		};
	} );

	// Generate shortcuts for custom animations
	jQuery.each( {
		slideDown: genFx( "show" ),
		slideUp: genFx( "hide" ),
		slideToggle: genFx( "toggle" ),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function( name, props ) {
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return this.animate( props, speed, easing, callback );
		};
	} );

	jQuery.timers = [];
	jQuery.fx.tick = function() {
		var timer,
			i = 0,
			timers = jQuery.timers;

		fxNow = jQuery.now();

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];

			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};

	jQuery.fx.timer = function( timer ) {
		jQuery.timers.push( timer );
		if ( timer() ) {
			jQuery.fx.start();
		} else {
			jQuery.timers.pop();
		}
	};

	jQuery.fx.interval = 13;
	jQuery.fx.start = function() {
		if ( !timerId ) {
			timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
		}
	};

	jQuery.fx.stop = function() {
		window.clearInterval( timerId );

		timerId = null;
	};

	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,

		// Default speed
		_default: 400
	};


	// Based off of the plugin by Clint Helfers, with permission.
	// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = window.setTimeout( next, time );
			hooks.stop = function() {
				window.clearTimeout( timeout );
			};
		} );
	};


	( function() {
		var input = document.createElement( "input" ),
			select = document.createElement( "select" ),
			opt = select.appendChild( document.createElement( "option" ) );

		input.type = "checkbox";

		// Support: iOS<=5.1, Android<=4.2+
		// Default value for a checkbox should be "on"
		support.checkOn = input.value !== "";

		// Support: IE<=11+
		// Must access selectedIndex to make default options select
		support.optSelected = opt.selected;

		// Support: Android<=2.3
		// Options inside disabled selects are incorrectly marked as disabled
		select.disabled = true;
		support.optDisabled = !opt.disabled;

		// Support: IE<=11+
		// An input loses its value after becoming a radio
		input = document.createElement( "input" );
		input.value = "t";
		input.type = "radio";
		support.radioValue = input.value === "t";
	} )();


	var boolHook,
		attrHandle = jQuery.expr.attrHandle;

	jQuery.fn.extend( {
		attr: function( name, value ) {
			return access( this, jQuery.attr, name, value, arguments.length > 1 );
		},

		removeAttr: function( name ) {
			return this.each( function() {
				jQuery.removeAttr( this, name );
			} );
		}
	} );

	jQuery.extend( {
		attr: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;

			// Don't get/set attributes on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}

			// Fallback to prop when attributes are not supported
			if ( typeof elem.getAttribute === "undefined" ) {
				return jQuery.prop( elem, name, value );
			}

			// All attributes are lowercase
			// Grab necessary hook if one is defined
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
				name = name.toLowerCase();
				hooks = jQuery.attrHooks[ name ] ||
					( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
			}

			if ( value !== undefined ) {
				if ( value === null ) {
					jQuery.removeAttr( elem, name );
					return;
				}

				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}

				elem.setAttribute( name, value + "" );
				return value;
			}

			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}

			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ? undefined : ret;
		},

		attrHooks: {
			type: {
				set: function( elem, value ) {
					if ( !support.radioValue && value === "radio" &&
						jQuery.nodeName( elem, "input" ) ) {
						var val = elem.value;
						elem.setAttribute( "type", value );
						if ( val ) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		},

		removeAttr: function( elem, value ) {
			var name, propName,
				i = 0,
				attrNames = value && value.match( rnotwhite );

			if ( attrNames && elem.nodeType === 1 ) {
				while ( ( name = attrNames[ i++ ] ) ) {
					propName = jQuery.propFix[ name ] || name;

					// Boolean attributes get special treatment (#10870)
					if ( jQuery.expr.match.bool.test( name ) ) {

						// Set corresponding property to false
						elem[ propName ] = false;
					}

					elem.removeAttribute( name );
				}
			}
		}
	} );

	// Hooks for boolean attributes
	boolHook = {
		set: function( elem, value, name ) {
			if ( value === false ) {

				// Remove boolean attributes when set to false
				jQuery.removeAttr( elem, name );
			} else {
				elem.setAttribute( name, name );
			}
			return name;
		}
	};
	jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
		var getter = attrHandle[ name ] || jQuery.find.attr;

		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		};
	} );




	var rfocusable = /^(?:input|select|textarea|button)$/i,
		rclickable = /^(?:a|area)$/i;

	jQuery.fn.extend( {
		prop: function( name, value ) {
			return access( this, jQuery.prop, name, value, arguments.length > 1 );
		},

		removeProp: function( name ) {
			return this.each( function() {
				delete this[ jQuery.propFix[ name ] || name ];
			} );
		}
	} );

	jQuery.extend( {
		prop: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;

			// Don't get/set properties on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}

			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

				// Fix name and attach hooks
				name = jQuery.propFix[ name ] || name;
				hooks = jQuery.propHooks[ name ];
			}

			if ( value !== undefined ) {
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}

				return ( elem[ name ] = value );
			}

			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}

			return elem[ name ];
		},

		propHooks: {
			tabIndex: {
				get: function( elem ) {

					// elem.tabIndex doesn't always return the
					// correct value when it hasn't been explicitly set
					// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					// Use proper attribute retrieval(#12072)
					var tabindex = jQuery.find.attr( elem, "tabindex" );

					return tabindex ?
						parseInt( tabindex, 10 ) :
						rfocusable.test( elem.nodeName ) ||
							rclickable.test( elem.nodeName ) && elem.href ?
								0 :
								-1;
				}
			}
		},

		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	} );

	if ( !support.optSelected ) {
		jQuery.propHooks.selected = {
			get: function( elem ) {
				var parent = elem.parentNode;
				if ( parent && parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
				return null;
			}
		};
	}

	jQuery.each( [
		"tabIndex",
		"readOnly",
		"maxLength",
		"cellSpacing",
		"cellPadding",
		"rowSpan",
		"colSpan",
		"useMap",
		"frameBorder",
		"contentEditable"
	], function() {
		jQuery.propFix[ this.toLowerCase() ] = this;
	} );




	var rclass = /[\t\r\n\f]/g;

	function getClass( elem ) {
		return elem.getAttribute && elem.getAttribute( "class" ) || "";
	}

	jQuery.fn.extend( {
		addClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;

			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
				} );
			}

			if ( typeof value === "string" && value ) {
				classes = value.match( rnotwhite ) || [];

				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );
					cur = elem.nodeType === 1 &&
						( " " + curValue + " " ).replace( rclass, " " );

					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {
							if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
								cur += clazz + " ";
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim( cur );
						if ( curValue !== finalValue ) {
							elem.setAttribute( "class", finalValue );
						}
					}
				}
			}

			return this;
		},

		removeClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;

			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
				} );
			}

			if ( !arguments.length ) {
				return this.attr( "class", "" );
			}

			if ( typeof value === "string" && value ) {
				classes = value.match( rnotwhite ) || [];

				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );

					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 &&
						( " " + curValue + " " ).replace( rclass, " " );

					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {

							// Remove *all* instances
							while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
								cur = cur.replace( " " + clazz + " ", " " );
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim( cur );
						if ( curValue !== finalValue ) {
							elem.setAttribute( "class", finalValue );
						}
					}
				}
			}

			return this;
		},

		toggleClass: function( value, stateVal ) {
			var type = typeof value;

			if ( typeof stateVal === "boolean" && type === "string" ) {
				return stateVal ? this.addClass( value ) : this.removeClass( value );
			}

			if ( jQuery.isFunction( value ) ) {
				return this.each( function( i ) {
					jQuery( this ).toggleClass(
						value.call( this, i, getClass( this ), stateVal ),
						stateVal
					);
				} );
			}

			return this.each( function() {
				var className, i, self, classNames;

				if ( type === "string" ) {

					// Toggle individual class names
					i = 0;
					self = jQuery( this );
					classNames = value.match( rnotwhite ) || [];

					while ( ( className = classNames[ i++ ] ) ) {

						// Check each className given, space separated list
						if ( self.hasClass( className ) ) {
							self.removeClass( className );
						} else {
							self.addClass( className );
						}
					}

				// Toggle whole class name
				} else if ( value === undefined || type === "boolean" ) {
					className = getClass( this );
					if ( className ) {

						// Store className if set
						dataPriv.set( this, "__className__", className );
					}

					// If the element has a class name or if we're passed `false`,
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					if ( this.setAttribute ) {
						this.setAttribute( "class",
							className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
						);
					}
				}
			} );
		},

		hasClass: function( selector ) {
			var className, elem,
				i = 0;

			className = " " + selector + " ";
			while ( ( elem = this[ i++ ] ) ) {
				if ( elem.nodeType === 1 &&
					( " " + getClass( elem ) + " " ).replace( rclass, " " )
						.indexOf( className ) > -1
				) {
					return true;
				}
			}

			return false;
		}
	} );




	var rreturn = /\r/g;

	jQuery.fn.extend( {
		val: function( value ) {
			var hooks, ret, isFunction,
				elem = this[ 0 ];

			if ( !arguments.length ) {
				if ( elem ) {
					hooks = jQuery.valHooks[ elem.type ] ||
						jQuery.valHooks[ elem.nodeName.toLowerCase() ];

					if ( hooks &&
						"get" in hooks &&
						( ret = hooks.get( elem, "value" ) ) !== undefined
					) {
						return ret;
					}

					ret = elem.value;

					return typeof ret === "string" ?

						// Handle most common string cases
						ret.replace( rreturn, "" ) :

						// Handle cases where value is null/undef or number
						ret == null ? "" : ret;
				}

				return;
			}

			isFunction = jQuery.isFunction( value );

			return this.each( function( i ) {
				var val;

				if ( this.nodeType !== 1 ) {
					return;
				}

				if ( isFunction ) {
					val = value.call( this, i, jQuery( this ).val() );
				} else {
					val = value;
				}

				// Treat null/undefined as ""; convert numbers to string
				if ( val == null ) {
					val = "";

				} else if ( typeof val === "number" ) {
					val += "";

				} else if ( jQuery.isArray( val ) ) {
					val = jQuery.map( val, function( value ) {
						return value == null ? "" : value + "";
					} );
				}

				hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

				// If set returns undefined, fall back to normal setting
				if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
					this.value = val;
				}
			} );
		}
	} );

	jQuery.extend( {
		valHooks: {
			option: {
				get: function( elem ) {

					// Support: IE<11
					// option.value not trimmed (#14858)
					return jQuery.trim( elem.value );
				}
			},
			select: {
				get: function( elem ) {
					var value, option,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one" || index < 0,
						values = one ? null : [],
						max = one ? index + 1 : options.length,
						i = index < 0 ?
							max :
							one ? index : 0;

					// Loop through all the selected options
					for ( ; i < max; i++ ) {
						option = options[ i ];

						// IE8-9 doesn't update selected after form reset (#2551)
						if ( ( option.selected || i === index ) &&

								// Don't return options that are disabled or in a disabled optgroup
								( support.optDisabled ?
									!option.disabled : option.getAttribute( "disabled" ) === null ) &&
								( !option.parentNode.disabled ||
									!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

							// Get the specific value for the option
							value = jQuery( option ).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					return values;
				},

				set: function( elem, value ) {
					var optionSet, option,
						options = elem.options,
						values = jQuery.makeArray( value ),
						i = options.length;

					while ( i-- ) {
						option = options[ i ];
						if ( option.selected =
								jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
						) {
							optionSet = true;
						}
					}

					// Force browsers to behave consistently when non-matching value is set
					if ( !optionSet ) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		}
	} );

	// Radios and checkboxes getter/setter
	jQuery.each( [ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			set: function( elem, value ) {
				if ( jQuery.isArray( value ) ) {
					return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
				}
			}
		};
		if ( !support.checkOn ) {
			jQuery.valHooks[ this ].get = function( elem ) {
				return elem.getAttribute( "value" ) === null ? "on" : elem.value;
			};
		}
	} );




	// Return jQuery for attributes-only inclusion


	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

	jQuery.extend( jQuery.event, {

		trigger: function( event, data, elem, onlyHandlers ) {

			var i, cur, tmp, bubbleType, ontype, handle, special,
				eventPath = [ elem || document ],
				type = hasOwn.call( event, "type" ) ? event.type : event,
				namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

			cur = tmp = elem = elem || document;

			// Don't do events on text and comment nodes
			if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
				return;
			}

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
				return;
			}

			if ( type.indexOf( "." ) > -1 ) {

				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split( "." );
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf( ":" ) < 0 && "on" + type;

			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[ jQuery.expando ] ?
				event :
				new jQuery.Event( type, typeof event === "object" && event );

			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join( "." );
			event.rnamespace = event.namespace ?
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
				null;

			// Clean up the event in case it is being reused
			event.result = undefined;
			if ( !event.target ) {
				event.target = elem;
			}

			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[ event ] :
				jQuery.makeArray( data, [ event ] );

			// Allow special events to draw outside the lines
			special = jQuery.event.special[ type ] || {};
			if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

				bubbleType = special.delegateType || type;
				if ( !rfocusMorph.test( bubbleType + type ) ) {
					cur = cur.parentNode;
				}
				for ( ; cur; cur = cur.parentNode ) {
					eventPath.push( cur );
					tmp = cur;
				}

				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if ( tmp === ( elem.ownerDocument || document ) ) {
					eventPath.push( tmp.defaultView || tmp.parentWindow || window );
				}
			}

			// Fire handlers on the event path
			i = 0;
			while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

				event.type = i > 1 ?
					bubbleType :
					special.bindType || type;

				// jQuery handler
				handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
					dataPriv.get( cur, "handle" );
				if ( handle ) {
					handle.apply( cur, data );
				}

				// Native handler
				handle = ontype && cur[ ontype ];
				if ( handle && handle.apply && acceptData( cur ) ) {
					event.result = handle.apply( cur, data );
					if ( event.result === false ) {
						event.preventDefault();
					}
				}
			}
			event.type = type;

			// If nobody prevented the default action, do it now
			if ( !onlyHandlers && !event.isDefaultPrevented() ) {

				if ( ( !special._default ||
					special._default.apply( eventPath.pop(), data ) === false ) &&
					acceptData( elem ) ) {

					// Call a native DOM method on the target with the same name name as the event.
					// Don't do default actions on window, that's where global variables be (#6170)
					if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ ontype ];

						if ( tmp ) {
							elem[ ontype ] = null;
						}

						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						elem[ type ]();
						jQuery.event.triggered = undefined;

						if ( tmp ) {
							elem[ ontype ] = tmp;
						}
					}
				}
			}

			return event.result;
		},

		// Piggyback on a donor event to simulate a different one
		simulate: function( type, elem, event ) {
			var e = jQuery.extend(
				new jQuery.Event(),
				event,
				{
					type: type,
					isSimulated: true

					// Previously, `originalEvent: {}` was set here, so stopPropagation call
					// would not be triggered on donor event, since in our own
					// jQuery.event.stopPropagation function we had a check for existence of
					// originalEvent.stopPropagation method, so, consequently it would be a noop.
					//
					// But now, this "simulate" function is used only for events
					// for which stopPropagation() is noop, so there is no need for that anymore.
					//
					// For the compat branch though, guard for "click" and "submit"
					// events is still used, but was moved to jQuery.event.stopPropagation function
					// because `originalEvent` should point to the original event for the constancy
					// with other events and for more focused logic
				}
			);

			jQuery.event.trigger( e, null, elem );

			if ( e.isDefaultPrevented() ) {
				event.preventDefault();
			}
		}

	} );

	jQuery.fn.extend( {

		trigger: function( type, data ) {
			return this.each( function() {
				jQuery.event.trigger( type, data, this );
			} );
		},
		triggerHandler: function( type, data ) {
			var elem = this[ 0 ];
			if ( elem ) {
				return jQuery.event.trigger( type, data, elem, true );
			}
		}
	} );


	jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
		function( i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	} );

	jQuery.fn.extend( {
		hover: function( fnOver, fnOut ) {
			return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
		}
	} );




	support.focusin = "onfocusin" in window;


	// Support: Firefox
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome, Safari
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
	if ( !support.focusin ) {
		jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
			};

			jQuery.event.special[ fix ] = {
				setup: function() {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access( doc, fix );

					if ( !attaches ) {
						doc.addEventListener( orig, handler, true );
					}
					dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
				},
				teardown: function() {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access( doc, fix ) - 1;

					if ( !attaches ) {
						doc.removeEventListener( orig, handler, true );
						dataPriv.remove( doc, fix );

					} else {
						dataPriv.access( doc, fix, attaches );
					}
				}
			};
		} );
	}
	var location = window.location;

	var nonce = jQuery.now();

	var rquery = ( /\?/ );



	// Support: Android 2.3
	// Workaround failure to string-cast null input
	jQuery.parseJSON = function( data ) {
		return JSON.parse( data + "" );
	};


	// Cross-browser xml parsing
	jQuery.parseXML = function( data ) {
		var xml;
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE9
		try {
			xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}

		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	};


	var
		rhash = /#.*$/,
		rts = /([?&])_=[^&]*/,
		rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,

		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		prefilters = {},

		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		transports = {},

		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = "*/".concat( "*" ),

		// Anchor tag for parsing the document origin
		originAnchor = document.createElement( "a" );
		originAnchor.href = location.href;

	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports( structure ) {

		// dataTypeExpression is optional and defaults to "*"
		return function( dataTypeExpression, func ) {

			if ( typeof dataTypeExpression !== "string" ) {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			var dataType,
				i = 0,
				dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

			if ( jQuery.isFunction( func ) ) {

				// For each dataType in the dataTypeExpression
				while ( ( dataType = dataTypes[ i++ ] ) ) {

					// Prepend if requested
					if ( dataType[ 0 ] === "+" ) {
						dataType = dataType.slice( 1 ) || "*";
						( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

					// Otherwise append
					} else {
						( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
					}
				}
			}
		};
	}

	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

		var inspected = {},
			seekingTransport = ( structure === transports );

		function inspect( dataType ) {
			var selected;
			inspected[ dataType ] = true;
			jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
				var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
				if ( typeof dataTypeOrTransport === "string" &&
					!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

					options.dataTypes.unshift( dataTypeOrTransport );
					inspect( dataTypeOrTransport );
					return false;
				} else if ( seekingTransport ) {
					return !( selected = dataTypeOrTransport );
				}
			} );
			return selected;
		}

		return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
	}

	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend( target, src ) {
		var key, deep,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};

		for ( key in src ) {
			if ( src[ key ] !== undefined ) {
				( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
			}
		}
		if ( deep ) {
			jQuery.extend( true, target, deep );
		}

		return target;
	}

	/* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses( s, jqXHR, responses ) {

		var ct, type, finalDataType, firstDataType,
			contents = s.contents,
			dataTypes = s.dataTypes;

		// Remove auto dataType and get content-type in the process
		while ( dataTypes[ 0 ] === "*" ) {
			dataTypes.shift();
			if ( ct === undefined ) {
				ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
			}
		}

		// Check if we're dealing with a known content-type
		if ( ct ) {
			for ( type in contents ) {
				if ( contents[ type ] && contents[ type ].test( ct ) ) {
					dataTypes.unshift( type );
					break;
				}
			}
		}

		// Check to see if we have a response for the expected dataType
		if ( dataTypes[ 0 ] in responses ) {
			finalDataType = dataTypes[ 0 ];
		} else {

			// Try convertible dataTypes
			for ( type in responses ) {
				if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
					finalDataType = type;
					break;
				}
				if ( !firstDataType ) {
					firstDataType = type;
				}
			}

			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}

		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if ( finalDataType ) {
			if ( finalDataType !== dataTypes[ 0 ] ) {
				dataTypes.unshift( finalDataType );
			}
			return responses[ finalDataType ];
		}
	}

	/* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */
	function ajaxConvert( s, response, jqXHR, isSuccess ) {
		var conv2, current, conv, tmp, prev,
			converters = {},

			// Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice();

		// Create converters map with lowercased keys
		if ( dataTypes[ 1 ] ) {
			for ( conv in s.converters ) {
				converters[ conv.toLowerCase() ] = s.converters[ conv ];
			}
		}

		current = dataTypes.shift();

		// Convert to each sequential dataType
		while ( current ) {

			if ( s.responseFields[ current ] ) {
				jqXHR[ s.responseFields[ current ] ] = response;
			}

			// Apply the dataFilter if provided
			if ( !prev && isSuccess && s.dataFilter ) {
				response = s.dataFilter( response, s.dataType );
			}

			prev = current;
			current = dataTypes.shift();

			if ( current ) {

			// There's only work to do if current dataType is non-auto
				if ( current === "*" ) {

					current = prev;

				// Convert response if prev dataType is non-auto and differs from current
				} else if ( prev !== "*" && prev !== current ) {

					// Seek a direct converter
					conv = converters[ prev + " " + current ] || converters[ "* " + current ];

					// If none found, seek a pair
					if ( !conv ) {
						for ( conv2 in converters ) {

							// If conv2 outputs current
							tmp = conv2.split( " " );
							if ( tmp[ 1 ] === current ) {

								// If prev can be converted to accepted input
								conv = converters[ prev + " " + tmp[ 0 ] ] ||
									converters[ "* " + tmp[ 0 ] ];
								if ( conv ) {

									// Condense equivalence converters
									if ( conv === true ) {
										conv = converters[ conv2 ];

									// Otherwise, insert the intermediate dataType
									} else if ( converters[ conv2 ] !== true ) {
										current = tmp[ 0 ];
										dataTypes.unshift( tmp[ 1 ] );
									}
									break;
								}
							}
						}
					}

					// Apply converter (if not an equivalence)
					if ( conv !== true ) {

						// Unless errors are allowed to bubble, catch and return them
						if ( conv && s.throws ) {
							response = conv( response );
						} else {
							try {
								response = conv( response );
							} catch ( e ) {
								return {
									state: "parsererror",
									error: conv ? e : "No conversion from " + prev + " to " + current
								};
							}
						}
					}
				}
			}
		}

		return { state: "success", data: response };
	}

	jQuery.extend( {

		// Counter for holding the number of active queries
		active: 0,

		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},

		ajaxSettings: {
			url: location.href,
			type: "GET",
			isLocal: rlocalProtocol.test( location.protocol ),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/

			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},

			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},

			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},

			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {

				// Convert anything to text
				"* text": String,

				// Text to html (true = no transformation)
				"text html": true,

				// Evaluate text as a json expression
				"text json": jQuery.parseJSON,

				// Parse text as xml
				"text xml": jQuery.parseXML
			},

			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},

		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function( target, settings ) {
			return settings ?

				// Building a settings object
				ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

				// Extending ajaxSettings
				ajaxExtend( jQuery.ajaxSettings, target );
		},

		ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
		ajaxTransport: addToPrefiltersOrTransports( transports ),

		// Main method
		ajax: function( url, options ) {

			// If url is an object, simulate pre-1.5 signature
			if ( typeof url === "object" ) {
				options = url;
				url = undefined;
			}

			// Force options to be an object
			options = options || {};

			var transport,

				// URL without anti-cache param
				cacheURL,

				// Response headers
				responseHeadersString,
				responseHeaders,

				// timeout handle
				timeoutTimer,

				// Url cleanup var
				urlAnchor,

				// To know if global events are to be dispatched
				fireGlobals,

				// Loop variable
				i,

				// Create the final options object
				s = jQuery.ajaxSetup( {}, options ),

				// Callbacks context
				callbackContext = s.context || s,

				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context &&
					( callbackContext.nodeType || callbackContext.jquery ) ?
						jQuery( callbackContext ) :
						jQuery.event,

				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks( "once memory" ),

				// Status-dependent callbacks
				statusCode = s.statusCode || {},

				// Headers (they are sent all at once)
				requestHeaders = {},
				requestHeadersNames = {},

				// The jqXHR state
				state = 0,

				// Default abort message
				strAbort = "canceled",

				// Fake xhr
				jqXHR = {
					readyState: 0,

					// Builds headers hashtable if needed
					getResponseHeader: function( key ) {
						var match;
						if ( state === 2 ) {
							if ( !responseHeaders ) {
								responseHeaders = {};
								while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
									responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
								}
							}
							match = responseHeaders[ key.toLowerCase() ];
						}
						return match == null ? null : match;
					},

					// Raw string
					getAllResponseHeaders: function() {
						return state === 2 ? responseHeadersString : null;
					},

					// Caches the header
					setRequestHeader: function( name, value ) {
						var lname = name.toLowerCase();
						if ( !state ) {
							name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
							requestHeaders[ name ] = value;
						}
						return this;
					},

					// Overrides response content-type header
					overrideMimeType: function( type ) {
						if ( !state ) {
							s.mimeType = type;
						}
						return this;
					},

					// Status-dependent callbacks
					statusCode: function( map ) {
						var code;
						if ( map ) {
							if ( state < 2 ) {
								for ( code in map ) {

									// Lazy-add the new callback in a way that preserves old ones
									statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
								}
							} else {

								// Execute the appropriate callbacks
								jqXHR.always( map[ jqXHR.status ] );
							}
						}
						return this;
					},

					// Cancel the request
					abort: function( statusText ) {
						var finalText = statusText || strAbort;
						if ( transport ) {
							transport.abort( finalText );
						}
						done( 0, finalText );
						return this;
					}
				};

			// Attach deferreds
			deferred.promise( jqXHR ).complete = completeDeferred.add;
			jqXHR.success = jqXHR.done;
			jqXHR.error = jqXHR.fail;

			// Remove hash character (#7531: and string promotion)
			// Add protocol if not provided (prefilters might expect it)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ( ( url || s.url || location.href ) + "" ).replace( rhash, "" )
				.replace( rprotocol, location.protocol + "//" );

			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;

			// Extract dataTypes list
			s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

			// A cross-domain request is in order when the origin doesn't match the current origin.
			if ( s.crossDomain == null ) {
				urlAnchor = document.createElement( "a" );

				// Support: IE8-11+
				// IE throws exception if url is malformed, e.g. http://example.com:80x/
				try {
					urlAnchor.href = s.url;

					// Support: IE8-11+
					// Anchor's host property isn't correctly set when s.url is relative
					urlAnchor.href = urlAnchor.href;
					s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
						urlAnchor.protocol + "//" + urlAnchor.host;
				} catch ( e ) {

					// If there is an error parsing the URL, assume it is crossDomain,
					// it can be rejected by the transport if it is invalid
					s.crossDomain = true;
				}
			}

			// Convert data if not already a string
			if ( s.data && s.processData && typeof s.data !== "string" ) {
				s.data = jQuery.param( s.data, s.traditional );
			}

			// Apply prefilters
			inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

			// If request was aborted inside a prefilter, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;

			// Watch for a new set of requests
			if ( fireGlobals && jQuery.active++ === 0 ) {
				jQuery.event.trigger( "ajaxStart" );
			}

			// Uppercase the type
			s.type = s.type.toUpperCase();

			// Determine if request has content
			s.hasContent = !rnoContent.test( s.type );

			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			cacheURL = s.url;

			// More options handling for requests with no content
			if ( !s.hasContent ) {

				// If data is available, append data to url
				if ( s.data ) {
					cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}

				// Add anti-cache in url if needed
				if ( s.cache === false ) {
					s.url = rts.test( cacheURL ) ?

						// If there is already a '_' parameter, set its value
						cacheURL.replace( rts, "$1_=" + nonce++ ) :

						// Otherwise add one to the end
						cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
				}
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
				}
				if ( jQuery.etag[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
				}
			}

			// Set the correct header, if data is being sent
			if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
				jqXHR.setRequestHeader( "Content-Type", s.contentType );
			}

			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
					s.accepts[ s.dataTypes[ 0 ] ] +
						( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
					s.accepts[ "*" ]
			);

			// Check for headers option
			for ( i in s.headers ) {
				jqXHR.setRequestHeader( i, s.headers[ i ] );
			}

			// Allow custom headers/mimetypes and early abort
			if ( s.beforeSend &&
				( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

				// Abort if not done already and return
				return jqXHR.abort();
			}

			// Aborting is no longer a cancellation
			strAbort = "abort";

			// Install callbacks on deferreds
			for ( i in { success: 1, error: 1, complete: 1 } ) {
				jqXHR[ i ]( s[ i ] );
			}

			// Get transport
			transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

			// If no transport, we auto-abort
			if ( !transport ) {
				done( -1, "No Transport" );
			} else {
				jqXHR.readyState = 1;

				// Send global event
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
				}

				// If request was aborted inside ajaxSend, stop there
				if ( state === 2 ) {
					return jqXHR;
				}

				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = window.setTimeout( function() {
						jqXHR.abort( "timeout" );
					}, s.timeout );
				}

				try {
					state = 1;
					transport.send( requestHeaders, done );
				} catch ( e ) {

					// Propagate exception as error if not done
					if ( state < 2 ) {
						done( -1, e );

					// Simply rethrow otherwise
					} else {
						throw e;
					}
				}
			}

			// Callback for when everything is done
			function done( status, nativeStatusText, responses, headers ) {
				var isSuccess, success, error, response, modified,
					statusText = nativeStatusText;

				// Called once
				if ( state === 2 ) {
					return;
				}

				// State is "done" now
				state = 2;

				// Clear timeout if it exists
				if ( timeoutTimer ) {
					window.clearTimeout( timeoutTimer );
				}

				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;

				// Cache response headers
				responseHeadersString = headers || "";

				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;

				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;

				// Get response data
				if ( responses ) {
					response = ajaxHandleResponses( s, jqXHR, responses );
				}

				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert( s, response, jqXHR, isSuccess );

				// If successful, handle type chaining
				if ( isSuccess ) {

					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if ( s.ifModified ) {
						modified = jqXHR.getResponseHeader( "Last-Modified" );
						if ( modified ) {
							jQuery.lastModified[ cacheURL ] = modified;
						}
						modified = jqXHR.getResponseHeader( "etag" );
						if ( modified ) {
							jQuery.etag[ cacheURL ] = modified;
						}
					}

					// if no content
					if ( status === 204 || s.type === "HEAD" ) {
						statusText = "nocontent";

					// if not modified
					} else if ( status === 304 ) {
						statusText = "notmodified";

					// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {

					// Extract error from statusText and normalize for non-aborts
					error = statusText;
					if ( status || !statusText ) {
						statusText = "error";
						if ( status < 0 ) {
							status = 0;
						}
					}
				}

				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = ( nativeStatusText || statusText ) + "";

				// Success/Error
				if ( isSuccess ) {
					deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
				} else {
					deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
				}

				// Status-dependent callbacks
				jqXHR.statusCode( statusCode );
				statusCode = undefined;

				if ( fireGlobals ) {
					globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
						[ jqXHR, s, isSuccess ? success : error ] );
				}

				// Complete
				completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

					// Handle the global AJAX counter
					if ( !( --jQuery.active ) ) {
						jQuery.event.trigger( "ajaxStop" );
					}
				}
			}

			return jqXHR;
		},

		getJSON: function( url, data, callback ) {
			return jQuery.get( url, data, callback, "json" );
		},

		getScript: function( url, callback ) {
			return jQuery.get( url, undefined, callback, "script" );
		}
	} );

	jQuery.each( [ "get", "post" ], function( i, method ) {
		jQuery[ method ] = function( url, data, callback, type ) {

			// Shift arguments if data argument was omitted
			if ( jQuery.isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = undefined;
			}

			// The url can be an options object (which then must have .url)
			return jQuery.ajax( jQuery.extend( {
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject( url ) && url ) );
		};
	} );


	jQuery._evalUrl = function( url ) {
		return jQuery.ajax( {
			url: url,

			// Make this explicit, since user can override this through ajaxSetup (#11264)
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		} );
	};


	jQuery.fn.extend( {
		wrapAll: function( html ) {
			var wrap;

			if ( jQuery.isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapAll( html.call( this, i ) );
				} );
			}

			if ( this[ 0 ] ) {

				// The elements to wrap the target around
				wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

				if ( this[ 0 ].parentNode ) {
					wrap.insertBefore( this[ 0 ] );
				}

				wrap.map( function() {
					var elem = this;

					while ( elem.firstElementChild ) {
						elem = elem.firstElementChild;
					}

					return elem;
				} ).append( this );
			}

			return this;
		},

		wrapInner: function( html ) {
			if ( jQuery.isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapInner( html.call( this, i ) );
				} );
			}

			return this.each( function() {
				var self = jQuery( this ),
					contents = self.contents();

				if ( contents.length ) {
					contents.wrapAll( html );

				} else {
					self.append( html );
				}
			} );
		},

		wrap: function( html ) {
			var isFunction = jQuery.isFunction( html );

			return this.each( function( i ) {
				jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
			} );
		},

		unwrap: function() {
			return this.parent().each( function() {
				if ( !jQuery.nodeName( this, "body" ) ) {
					jQuery( this ).replaceWith( this.childNodes );
				}
			} ).end();
		}
	} );


	jQuery.expr.filters.hidden = function( elem ) {
		return !jQuery.expr.filters.visible( elem );
	};
	jQuery.expr.filters.visible = function( elem ) {

		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		// Use OR instead of AND as the element is not visible if either is true
		// See tickets #10406 and #13132
		return elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;
	};




	var r20 = /%20/g,
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;

	function buildParams( prefix, obj, traditional, add ) {
		var name;

		if ( jQuery.isArray( obj ) ) {

			// Serialize array item.
			jQuery.each( obj, function( i, v ) {
				if ( traditional || rbracket.test( prefix ) ) {

					// Treat each array item as a scalar.
					add( prefix, v );

				} else {

					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(
						prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
						v,
						traditional,
						add
					);
				}
			} );

		} else if ( !traditional && jQuery.type( obj ) === "object" ) {

			// Serialize object item.
			for ( name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}

		} else {

			// Serialize scalar item.
			add( prefix, obj );
		}
	}

	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function( a, traditional ) {
		var prefix,
			s = [],
			add = function( key, value ) {

				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			} );

		} else {

			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	};

	jQuery.fn.extend( {
		serialize: function() {
			return jQuery.param( this.serializeArray() );
		},
		serializeArray: function() {
			return this.map( function() {

				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop( this, "elements" );
				return elements ? jQuery.makeArray( elements ) : this;
			} )
			.filter( function() {
				var type = this.type;

				// Use .is( ":disabled" ) so that fieldset[disabled] works
				return this.name && !jQuery( this ).is( ":disabled" ) &&
					rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
					( this.checked || !rcheckableType.test( type ) );
			} )
			.map( function( i, elem ) {
				var val = jQuery( this ).val();

				return val == null ?
					null :
					jQuery.isArray( val ) ?
						jQuery.map( val, function( val ) {
							return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
						} ) :
						{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			} ).get();
		}
	} );


	jQuery.ajaxSettings.xhr = function() {
		try {
			return new window.XMLHttpRequest();
		} catch ( e ) {}
	};

	var xhrSuccessStatus = {

			// File protocol always yields status code 0, assume 200
			0: 200,

			// Support: IE9
			// #1450: sometimes IE returns 1223 when it should be 204
			1223: 204
		},
		xhrSupported = jQuery.ajaxSettings.xhr();

	support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
	support.ajax = xhrSupported = !!xhrSupported;

	jQuery.ajaxTransport( function( options ) {
		var callback, errorCallback;

		// Cross domain only allowed if supported through XMLHttpRequest
		if ( support.cors || xhrSupported && !options.crossDomain ) {
			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr();

					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {
						xhr.setRequestHeader( i, headers[ i ] );
					}

					// Callback
					callback = function( type ) {
						return function() {
							if ( callback ) {
								callback = errorCallback = xhr.onload =
									xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

								if ( type === "abort" ) {
									xhr.abort();
								} else if ( type === "error" ) {

									// Support: IE9
									// On a manual native abort, IE9 throws
									// errors on any property access that is not readyState
									if ( typeof xhr.status !== "number" ) {
										complete( 0, "error" );
									} else {
										complete(

											// File: protocol always yields status 0; see #8605, #14207
											xhr.status,
											xhr.statusText
										);
									}
								} else {
									complete(
										xhrSuccessStatus[ xhr.status ] || xhr.status,
										xhr.statusText,

										// Support: IE9 only
										// IE9 has no XHR2 but throws on binary (trac-11426)
										// For XHR2 non-text, let the caller handle it (gh-2498)
										( xhr.responseType || "text" ) !== "text"  ||
										typeof xhr.responseText !== "string" ?
											{ binary: xhr.response } :
											{ text: xhr.responseText },
										xhr.getAllResponseHeaders()
									);
								}
							}
						};
					};

					// Listen to events
					xhr.onload = callback();
					errorCallback = xhr.onerror = callback( "error" );

					// Support: IE9
					// Use onreadystatechange to replace onabort
					// to handle uncaught aborts
					if ( xhr.onabort !== undefined ) {
						xhr.onabort = errorCallback;
					} else {
						xhr.onreadystatechange = function() {

							// Check readyState before timeout as it changes
							if ( xhr.readyState === 4 ) {

								// Allow onerror to be called first,
								// but that will not handle a native abort
								// Also, save errorCallback to a variable
								// as xhr.onerror cannot be accessed
								window.setTimeout( function() {
									if ( callback ) {
										errorCallback();
									}
								} );
							}
						};
					}

					// Create the abort callback
					callback = callback( "abort" );

					try {

						// Do send the request (this may raise an exception)
						xhr.send( options.hasContent && options.data || null );
					} catch ( e ) {

						// #14683: Only rethrow if this hasn't been notified as an error yet
						if ( callback ) {
							throw e;
						}
					}
				},

				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );




	// Install script dataType
	jQuery.ajaxSetup( {
		accepts: {
			script: "text/javascript, application/javascript, " +
				"application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function( text ) {
				jQuery.globalEval( text );
				return text;
			}
		}
	} );

	// Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter( "script", function( s ) {
		if ( s.cache === undefined ) {
			s.cache = false;
		}
		if ( s.crossDomain ) {
			s.type = "GET";
		}
	} );

	// Bind script tag hack transport
	jQuery.ajaxTransport( "script", function( s ) {

		// This transport only deals with cross domain requests
		if ( s.crossDomain ) {
			var script, callback;
			return {
				send: function( _, complete ) {
					script = jQuery( "<script>" ).prop( {
						charset: s.scriptCharset,
						src: s.url
					} ).on(
						"load error",
						callback = function( evt ) {
							script.remove();
							callback = null;
							if ( evt ) {
								complete( evt.type === "error" ? 404 : 200, evt.type );
							}
						}
					);

					// Use native DOM manipulation to avoid our domManip AJAX trickery
					document.head.appendChild( script[ 0 ] );
				},
				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );




	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;

	// Default jsonp settings
	jQuery.ajaxSetup( {
		jsonp: "callback",
		jsonpCallback: function() {
			var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
			this[ callback ] = true;
			return callback;
		}
	} );

	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

		var callbackName, overwritten, responseContainer,
			jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
				"url" :
				typeof s.data === "string" &&
					( s.contentType || "" )
						.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
					rjsonp.test( s.data ) && "data"
			);

		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
				s.jsonpCallback() :
				s.jsonpCallback;

			// Insert callback into url or form data
			if ( jsonProp ) {
				s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
			} else if ( s.jsonp !== false ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
			}

			// Use data converter to retrieve json after script execution
			s.converters[ "script json" ] = function() {
				if ( !responseContainer ) {
					jQuery.error( callbackName + " was not called" );
				}
				return responseContainer[ 0 ];
			};

			// Force json dataType
			s.dataTypes[ 0 ] = "json";

			// Install callback
			overwritten = window[ callbackName ];
			window[ callbackName ] = function() {
				responseContainer = arguments;
			};

			// Clean-up function (fires after converters)
			jqXHR.always( function() {

				// If previous value didn't exist - remove it
				if ( overwritten === undefined ) {
					jQuery( window ).removeProp( callbackName );

				// Otherwise restore preexisting value
				} else {
					window[ callbackName ] = overwritten;
				}

				// Save back as free
				if ( s[ callbackName ] ) {

					// Make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;

					// Save the callback name for future use
					oldCallbacks.push( callbackName );
				}

				// Call if it was a function and we have a response
				if ( responseContainer && jQuery.isFunction( overwritten ) ) {
					overwritten( responseContainer[ 0 ] );
				}

				responseContainer = overwritten = undefined;
			} );

			// Delegate to script
			return "script";
		}
	} );




	// Support: Safari 8+
	// In Safari 8 documents created via document.implementation.createHTMLDocument
	// collapse sibling forms: the second one becomes a child of the first one.
	// Because of that, this security measure has to be disabled in Safari 8.
	// https://bugs.webkit.org/show_bug.cgi?id=137337
	support.createHTMLDocument = ( function() {
		var body = document.implementation.createHTMLDocument( "" ).body;
		body.innerHTML = "<form></form><form></form>";
		return body.childNodes.length === 2;
	} )();


	// Argument "data" should be string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		context = context || ( support.createHTMLDocument ?
			document.implementation.createHTMLDocument( "" ) :
			document );

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[ 1 ] ) ];
		}

		parsed = buildFragment( [ data ], context, scripts );

		if ( scripts && scripts.length ) {
			jQuery( scripts ).remove();
		}

		return jQuery.merge( [], parsed.childNodes );
	};


	// Keep a copy of the old load method
	var _load = jQuery.fn.load;

	/**
	 * Load a url into a page
	 */
	jQuery.fn.load = function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );
		}

		var selector, type, response,
			self = this,
			off = url.indexOf( " " );

		if ( off > -1 ) {
			selector = jQuery.trim( url.slice( off ) );
			url = url.slice( 0, off );
		}

		// If it's a function
		if ( jQuery.isFunction( params ) ) {

			// We assume that it's the callback
			callback = params;
			params = undefined;

		// Otherwise, build a param string
		} else if ( params && typeof params === "object" ) {
			type = "POST";
		}

		// If we have elements to modify, make the request
		if ( self.length > 0 ) {
			jQuery.ajax( {
				url: url,

				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			} ).done( function( responseText ) {

				// Save response for use in complete callback
				response = arguments;

				self.html( selector ?

					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

					// Otherwise use the full result
					responseText );

			// If the request succeeds, this function gets "data", "status", "jqXHR"
			// but they are ignored because response was set above.
			// If it fails, this function gets "jqXHR", "status", "error"
			} ).always( callback && function( jqXHR, status ) {
				self.each( function() {
					callback.apply( self, response || [ jqXHR.responseText, status, jqXHR ] );
				} );
			} );
		}

		return this;
	};




	// Attach a bunch of functions for handling common AJAX events
	jQuery.each( [
		"ajaxStart",
		"ajaxStop",
		"ajaxComplete",
		"ajaxError",
		"ajaxSuccess",
		"ajaxSend"
	], function( i, type ) {
		jQuery.fn[ type ] = function( fn ) {
			return this.on( type, fn );
		};
	} );




	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep( jQuery.timers, function( fn ) {
			return elem === fn.elem;
		} ).length;
	};




	/**
	 * Gets a window from an element
	 */
	function getWindow( elem ) {
		return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
	}

	jQuery.offset = {
		setOffset: function( elem, options, i ) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
				position = jQuery.css( elem, "position" ),
				curElem = jQuery( elem ),
				props = {};

			// Set position first, in-case top/left are set even on static elem
			if ( position === "static" ) {
				elem.style.position = "relative";
			}

			curOffset = curElem.offset();
			curCSSTop = jQuery.css( elem, "top" );
			curCSSLeft = jQuery.css( elem, "left" );
			calculatePosition = ( position === "absolute" || position === "fixed" ) &&
				( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

			// Need to be able to calculate position if either
			// top or left is auto and position is either absolute or fixed
			if ( calculatePosition ) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;

			} else {
				curTop = parseFloat( curCSSTop ) || 0;
				curLeft = parseFloat( curCSSLeft ) || 0;
			}

			if ( jQuery.isFunction( options ) ) {

				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
				options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
			}

			if ( options.top != null ) {
				props.top = ( options.top - curOffset.top ) + curTop;
			}
			if ( options.left != null ) {
				props.left = ( options.left - curOffset.left ) + curLeft;
			}

			if ( "using" in options ) {
				options.using.call( elem, props );

			} else {
				curElem.css( props );
			}
		}
	};

	jQuery.fn.extend( {
		offset: function( options ) {
			if ( arguments.length ) {
				return options === undefined ?
					this :
					this.each( function( i ) {
						jQuery.offset.setOffset( this, options, i );
					} );
			}

			var docElem, win,
				elem = this[ 0 ],
				box = { top: 0, left: 0 },
				doc = elem && elem.ownerDocument;

			if ( !doc ) {
				return;
			}

			docElem = doc.documentElement;

			// Make sure it's not a disconnected DOM node
			if ( !jQuery.contains( docElem, elem ) ) {
				return box;
			}

			box = elem.getBoundingClientRect();
			win = getWindow( doc );
			return {
				top: box.top + win.pageYOffset - docElem.clientTop,
				left: box.left + win.pageXOffset - docElem.clientLeft
			};
		},

		position: function() {
			if ( !this[ 0 ] ) {
				return;
			}

			var offsetParent, offset,
				elem = this[ 0 ],
				parentOffset = { top: 0, left: 0 };

			// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
			// because it is its only offset parent
			if ( jQuery.css( elem, "position" ) === "fixed" ) {

				// Assume getBoundingClientRect is there when computed position is fixed
				offset = elem.getBoundingClientRect();

			} else {

				// Get *real* offsetParent
				offsetParent = this.offsetParent();

				// Get correct offsets
				offset = this.offset();
				if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
					parentOffset = offsetParent.offset();
				}

				// Add offsetParent borders
				// Subtract offsetParent scroll positions
				parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ) -
					offsetParent.scrollTop();
				parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true ) -
					offsetParent.scrollLeft();
			}

			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
				left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
			};
		},

		// This method will return documentElement in the following cases:
		// 1) For the element inside the iframe without offsetParent, this method will return
		//    documentElement of the parent window
		// 2) For the hidden or detached element
		// 3) For body or html element, i.e. in case of the html node - it will return itself
		//
		// but those exceptions were never presented as a real life use-cases
		// and might be considered as more preferable results.
		//
		// This logic, however, is not guaranteed and can change at any point in the future
		offsetParent: function() {
			return this.map( function() {
				var offsetParent = this.offsetParent;

				while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
					offsetParent = offsetParent.offsetParent;
				}

				return offsetParent || documentElement;
			} );
		}
	} );

	// Create scrollLeft and scrollTop methods
	jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
		var top = "pageYOffset" === prop;

		jQuery.fn[ method ] = function( val ) {
			return access( this, function( elem, method, val ) {
				var win = getWindow( elem );

				if ( val === undefined ) {
					return win ? win[ prop ] : elem[ method ];
				}

				if ( win ) {
					win.scrollTo(
						!top ? val : win.pageXOffset,
						top ? val : win.pageYOffset
					);

				} else {
					elem[ method ] = val;
				}
			}, method, val, arguments.length );
		};
	} );

	// Support: Safari<7-8+, Chrome<37-44+
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each( [ "top", "left" ], function( i, prop ) {
		jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
			function( elem, computed ) {
				if ( computed ) {
					computed = curCSS( elem, prop );

					// If curCSS returns percentage, fallback to offset
					return rnumnonpx.test( computed ) ?
						jQuery( elem ).position()[ prop ] + "px" :
						computed;
				}
			}
		);
	} );


	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
		jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
			function( defaultExtra, funcName ) {

			// Margin is only for outerHeight, outerWidth
			jQuery.fn[ funcName ] = function( margin, value ) {
				var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
					extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

				return access( this, function( elem, type, value ) {
					var doc;

					if ( jQuery.isWindow( elem ) ) {

						// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
						// isn't a whole lot we can do. See pull request at this URL for discussion:
						// https://github.com/jquery/jquery/pull/764
						return elem.document.documentElement[ "client" + name ];
					}

					// Get document width or height
					if ( elem.nodeType === 9 ) {
						doc = elem.documentElement;

						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(
							elem.body[ "scroll" + name ], doc[ "scroll" + name ],
							elem.body[ "offset" + name ], doc[ "offset" + name ],
							doc[ "client" + name ]
						);
					}

					return value === undefined ?

						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css( elem, type, extra ) :

						// Set width or height on the element
						jQuery.style( elem, type, value, extra );
				}, type, chainable ? margin : undefined, chainable, null );
			};
		} );
	} );


	jQuery.fn.extend( {

		bind: function( types, data, fn ) {
			return this.on( types, null, data, fn );
		},
		unbind: function( types, fn ) {
			return this.off( types, null, fn );
		},

		delegate: function( selector, types, data, fn ) {
			return this.on( types, selector, data, fn );
		},
		undelegate: function( selector, types, fn ) {

			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ?
				this.off( selector, "**" ) :
				this.off( types, selector || "**", fn );
		},
		size: function() {
			return this.length;
		}
	} );

	jQuery.fn.andSelf = jQuery.fn.addBack;




	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.

	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

	if ( true ) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return jQuery;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}



	var

		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,

		// Map over the $ in case of overwrite
		_$ = window.$;

	jQuery.noConflict = function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	};

	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if ( !noGlobal ) {
		window.jQuery = window.$ = jQuery;
	}

	return jQuery;
	}));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';


	var isWindows = process.platform === 'win32';
	var util = __webpack_require__(4);


	// resolves . and .. elements in a path array with directory names there
	// must be no slashes or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  var res = [];
	  for (var i = 0; i < parts.length; i++) {
	    var p = parts[i];

	    // ignore empty parts
	    if (!p || p === '.')
	      continue;

	    if (p === '..') {
	      if (res.length && res[res.length - 1] !== '..') {
	        res.pop();
	      } else if (allowAboveRoot) {
	        res.push('..');
	      }
	    } else {
	      res.push(p);
	    }
	  }

	  return res;
	}

	// returns an array with empty elements removed from either end of the input
	// array or the original array if no elements need to be removed
	function trimArray(arr) {
	  var lastIndex = arr.length - 1;
	  var start = 0;
	  for (; start <= lastIndex; start++) {
	    if (arr[start])
	      break;
	  }

	  var end = lastIndex;
	  for (; end >= 0; end--) {
	    if (arr[end])
	      break;
	  }

	  if (start === 0 && end === lastIndex)
	    return arr;
	  if (start > end)
	    return [];
	  return arr.slice(start, end + 1);
	}

	// Regex to split a windows path into three parts: [*, device, slash,
	// tail] windows-only
	var splitDeviceRe =
	    /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

	// Regex to split the tail part of the above into [*, dir, basename, ext]
	var splitTailRe =
	    /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

	var win32 = {};

	// Function to split a filename into [root, dir, basename, ext]
	function win32SplitPath(filename) {
	  // Separate device+slash from tail
	  var result = splitDeviceRe.exec(filename),
	      device = (result[1] || '') + (result[2] || ''),
	      tail = result[3] || '';
	  // Split the tail into dir, basename and extension
	  var result2 = splitTailRe.exec(tail),
	      dir = result2[1],
	      basename = result2[2],
	      ext = result2[3];
	  return [device, dir, basename, ext];
	}

	function win32StatPath(path) {
	  var result = splitDeviceRe.exec(path),
	      device = result[1] || '',
	      isUnc = !!device && device[1] !== ':';
	  return {
	    device: device,
	    isUnc: isUnc,
	    isAbsolute: isUnc || !!result[2], // UNC paths are always absolute
	    tail: result[3]
	  };
	}

	function normalizeUNCRoot(device) {
	  return '\\\\' + device.replace(/^[\\\/]+/, '').replace(/[\\\/]+/g, '\\');
	}

	// path.resolve([from ...], to)
	win32.resolve = function() {
	  var resolvedDevice = '',
	      resolvedTail = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1; i--) {
	    var path;
	    if (i >= 0) {
	      path = arguments[i];
	    } else if (!resolvedDevice) {
	      path = process.cwd();
	    } else {
	      // Windows has the concept of drive-specific current working
	      // directories. If we've resolved a drive letter but not yet an
	      // absolute path, get cwd for that drive. We're sure the device is not
	      // an unc path at this points, because unc paths are always absolute.
	      path = process.env['=' + resolvedDevice];
	      // Verify that a drive-local cwd was found and that it actually points
	      // to our drive. If not, default to the drive's root.
	      if (!path || path.substr(0, 3).toLowerCase() !==
	          resolvedDevice.toLowerCase() + '\\') {
	        path = resolvedDevice + '\\';
	      }
	    }

	    // Skip empty and invalid entries
	    if (!util.isString(path)) {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    var result = win32StatPath(path),
	        device = result.device,
	        isUnc = result.isUnc,
	        isAbsolute = result.isAbsolute,
	        tail = result.tail;

	    if (device &&
	        resolvedDevice &&
	        device.toLowerCase() !== resolvedDevice.toLowerCase()) {
	      // This path points to another device so it is not applicable
	      continue;
	    }

	    if (!resolvedDevice) {
	      resolvedDevice = device;
	    }
	    if (!resolvedAbsolute) {
	      resolvedTail = tail + '\\' + resolvedTail;
	      resolvedAbsolute = isAbsolute;
	    }

	    if (resolvedDevice && resolvedAbsolute) {
	      break;
	    }
	  }

	  // Convert slashes to backslashes when `resolvedDevice` points to an UNC
	  // root. Also squash multiple slashes into a single one where appropriate.
	  if (isUnc) {
	    resolvedDevice = normalizeUNCRoot(resolvedDevice);
	  }

	  // At this point the path should be resolved to a full absolute path,
	  // but handle relative paths to be safe (might happen when process.cwd()
	  // fails)

	  // Normalize the tail path
	  resolvedTail = normalizeArray(resolvedTail.split(/[\\\/]+/),
	                                !resolvedAbsolute).join('\\');

	  return (resolvedDevice + (resolvedAbsolute ? '\\' : '') + resolvedTail) ||
	         '.';
	};


	win32.normalize = function(path) {
	  var result = win32StatPath(path),
	      device = result.device,
	      isUnc = result.isUnc,
	      isAbsolute = result.isAbsolute,
	      tail = result.tail,
	      trailingSlash = /[\\\/]$/.test(tail);

	  // Normalize the tail path
	  tail = normalizeArray(tail.split(/[\\\/]+/), !isAbsolute).join('\\');

	  if (!tail && !isAbsolute) {
	    tail = '.';
	  }
	  if (tail && trailingSlash) {
	    tail += '\\';
	  }

	  // Convert slashes to backslashes when `device` points to an UNC root.
	  // Also squash multiple slashes into a single one where appropriate.
	  if (isUnc) {
	    device = normalizeUNCRoot(device);
	  }

	  return device + (isAbsolute ? '\\' : '') + tail;
	};


	win32.isAbsolute = function(path) {
	  return win32StatPath(path).isAbsolute;
	};

	win32.join = function() {
	  var paths = [];
	  for (var i = 0; i < arguments.length; i++) {
	    var arg = arguments[i];
	    if (!util.isString(arg)) {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    if (arg) {
	      paths.push(arg);
	    }
	  }

	  var joined = paths.join('\\');

	  // Make sure that the joined path doesn't start with two slashes, because
	  // normalize() will mistake it for an UNC path then.
	  //
	  // This step is skipped when it is very clear that the user actually
	  // intended to point at an UNC path. This is assumed when the first
	  // non-empty string arguments starts with exactly two slashes followed by
	  // at least one more non-slash character.
	  //
	  // Note that for normalize() to treat a path as an UNC path it needs to
	  // have at least 2 components, so we don't filter for that here.
	  // This means that the user can use join to construct UNC paths from
	  // a server name and a share name; for example:
	  //   path.join('//server', 'share') -> '\\\\server\\share\')
	  if (!/^[\\\/]{2}[^\\\/]/.test(paths[0])) {
	    joined = joined.replace(/^[\\\/]{2,}/, '\\');
	  }

	  return win32.normalize(joined);
	};


	// path.relative(from, to)
	// it will solve the relative path from 'from' to 'to', for instance:
	// from = 'C:\\orandea\\test\\aaa'
	// to = 'C:\\orandea\\impl\\bbb'
	// The output of the function should be: '..\\..\\impl\\bbb'
	win32.relative = function(from, to) {
	  from = win32.resolve(from);
	  to = win32.resolve(to);

	  // windows is not case sensitive
	  var lowerFrom = from.toLowerCase();
	  var lowerTo = to.toLowerCase();

	  var toParts = trimArray(to.split('\\'));

	  var lowerFromParts = trimArray(lowerFrom.split('\\'));
	  var lowerToParts = trimArray(lowerTo.split('\\'));

	  var length = Math.min(lowerFromParts.length, lowerToParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (lowerFromParts[i] !== lowerToParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  if (samePartsLength == 0) {
	    return to;
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < lowerFromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('\\');
	};


	win32._makeLong = function(path) {
	  // Note: this will *probably* throw somewhere.
	  if (!util.isString(path))
	    return path;

	  if (!path) {
	    return '';
	  }

	  var resolvedPath = win32.resolve(path);

	  if (/^[a-zA-Z]\:\\/.test(resolvedPath)) {
	    // path is local filesystem path, which needs to be converted
	    // to long UNC path.
	    return '\\\\?\\' + resolvedPath;
	  } else if (/^\\\\[^?.]/.test(resolvedPath)) {
	    // path is network UNC path, which needs to be converted
	    // to long UNC path.
	    return '\\\\?\\UNC\\' + resolvedPath.substring(2);
	  }

	  return path;
	};


	win32.dirname = function(path) {
	  var result = win32SplitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	win32.basename = function(path, ext) {
	  var f = win32SplitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	win32.extname = function(path) {
	  return win32SplitPath(path)[3];
	};


	win32.format = function(pathObject) {
	  if (!util.isObject(pathObject)) {
	    throw new TypeError(
	        "Parameter 'pathObject' must be an object, not " + typeof pathObject
	    );
	  }

	  var root = pathObject.root || '';

	  if (!util.isString(root)) {
	    throw new TypeError(
	        "'pathObject.root' must be a string or undefined, not " +
	        typeof pathObject.root
	    );
	  }

	  var dir = pathObject.dir;
	  var base = pathObject.base || '';
	  if (!dir) {
	    return base;
	  }
	  if (dir[dir.length - 1] === win32.sep) {
	    return dir + base;
	  }
	  return dir + win32.sep + base;
	};


	win32.parse = function(pathString) {
	  if (!util.isString(pathString)) {
	    throw new TypeError(
	        "Parameter 'pathString' must be a string, not " + typeof pathString
	    );
	  }
	  var allParts = win32SplitPath(pathString);
	  if (!allParts || allParts.length !== 4) {
	    throw new TypeError("Invalid path '" + pathString + "'");
	  }
	  return {
	    root: allParts[0],
	    dir: allParts[0] + allParts[1].slice(0, -1),
	    base: allParts[2],
	    ext: allParts[3],
	    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
	  };
	};


	win32.sep = '\\';
	win32.delimiter = ';';


	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var posix = {};


	function posixSplitPath(filename) {
	  return splitPathRe.exec(filename).slice(1);
	}


	// path.resolve([from ...], to)
	// posix version
	posix.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (!util.isString(path)) {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path[0] === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(resolvedPath.split('/'),
	                                !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	posix.normalize = function(path) {
	  var isAbsolute = posix.isAbsolute(path),
	      trailingSlash = path && path[path.length - 1] === '/';

	  // Normalize the path
	  path = normalizeArray(path.split('/'), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	posix.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	posix.join = function() {
	  var path = '';
	  for (var i = 0; i < arguments.length; i++) {
	    var segment = arguments[i];
	    if (!util.isString(segment)) {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    if (segment) {
	      if (!path) {
	        path += segment;
	      } else {
	        path += '/' + segment;
	      }
	    }
	  }
	  return posix.normalize(path);
	};


	// path.relative(from, to)
	// posix version
	posix.relative = function(from, to) {
	  from = posix.resolve(from).substr(1);
	  to = posix.resolve(to).substr(1);

	  var fromParts = trimArray(from.split('/'));
	  var toParts = trimArray(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};


	posix._makeLong = function(path) {
	  return path;
	};


	posix.dirname = function(path) {
	  var result = posixSplitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	posix.basename = function(path, ext) {
	  var f = posixSplitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	posix.extname = function(path) {
	  return posixSplitPath(path)[3];
	};


	posix.format = function(pathObject) {
	  if (!util.isObject(pathObject)) {
	    throw new TypeError(
	        "Parameter 'pathObject' must be an object, not " + typeof pathObject
	    );
	  }

	  var root = pathObject.root || '';

	  if (!util.isString(root)) {
	    throw new TypeError(
	        "'pathObject.root' must be a string or undefined, not " +
	        typeof pathObject.root
	    );
	  }

	  var dir = pathObject.dir ? pathObject.dir + posix.sep : '';
	  var base = pathObject.base || '';
	  return dir + base;
	};


	posix.parse = function(pathString) {
	  if (!util.isString(pathString)) {
	    throw new TypeError(
	        "Parameter 'pathString' must be a string, not " + typeof pathString
	    );
	  }
	  var allParts = posixSplitPath(pathString);
	  if (!allParts || allParts.length !== 4) {
	    throw new TypeError("Invalid path '" + pathString + "'");
	  }
	  allParts[1] = allParts[1] || '';
	  allParts[2] = allParts[2] || '';
	  allParts[3] = allParts[3] || '';

	  return {
	    root: allParts[0],
	    dir: allParts[0] + allParts[1].slice(0, -1),
	    base: allParts[2],
	    ext: allParts[3],
	    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
	  };
	};


	posix.sep = '/';
	posix.delimiter = ':';


	if (isWindows)
	  module.exports = win32;
	else /* posix */
	  module.exports = posix;

	module.exports.posix = posix;
	module.exports.win32 = win32;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 3 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(5);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(6);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(3)))

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var leaflet = __webpack_require__(8);

	__webpack_require__(10);

	module.exports = leaflet;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = window.L = __webpack_require__(9);


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	 Leaflet, a JavaScript library for mobile-friendly interactive maps. http://leafletjs.com
	 (c) 2010-2013, Vladimir Agafonkin
	 (c) 2010-2011, CloudMade
	*/
	(function (window, document, undefined) {
	var oldL = window.L,
	    L = {};

	L.version = '0.7.7';

	// define Leaflet for Node module pattern loaders, including Browserify
	if (typeof module === 'object' && typeof module.exports === 'object') {
		module.exports = L;

	// define Leaflet as an AMD module
	} else if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (L), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}

	// define Leaflet as a global L variable, saving the original L to restore later if needed

	L.noConflict = function () {
		window.L = oldL;
		return this;
	};

	window.L = L;


	/*
	 * L.Util contains various utility functions used throughout Leaflet code.
	 */

	L.Util = {
		extend: function (dest) { // (Object[, Object, ...]) ->
			var sources = Array.prototype.slice.call(arguments, 1),
			    i, j, len, src;

			for (j = 0, len = sources.length; j < len; j++) {
				src = sources[j] || {};
				for (i in src) {
					if (src.hasOwnProperty(i)) {
						dest[i] = src[i];
					}
				}
			}
			return dest;
		},

		bind: function (fn, obj) { // (Function, Object) -> Function
			var args = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null;
			return function () {
				return fn.apply(obj, args || arguments);
			};
		},

		stamp: (function () {
			var lastId = 0,
			    key = '_leaflet_id';
			return function (obj) {
				obj[key] = obj[key] || ++lastId;
				return obj[key];
			};
		}()),

		invokeEach: function (obj, method, context) {
			var i, args;

			if (typeof obj === 'object') {
				args = Array.prototype.slice.call(arguments, 3);

				for (i in obj) {
					method.apply(context, [i, obj[i]].concat(args));
				}
				return true;
			}

			return false;
		},

		limitExecByInterval: function (fn, time, context) {
			var lock, execOnUnlock;

			return function wrapperFn() {
				var args = arguments;

				if (lock) {
					execOnUnlock = true;
					return;
				}

				lock = true;

				setTimeout(function () {
					lock = false;

					if (execOnUnlock) {
						wrapperFn.apply(context, args);
						execOnUnlock = false;
					}
				}, time);

				fn.apply(context, args);
			};
		},

		falseFn: function () {
			return false;
		},

		formatNum: function (num, digits) {
			var pow = Math.pow(10, digits || 5);
			return Math.round(num * pow) / pow;
		},

		trim: function (str) {
			return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
		},

		splitWords: function (str) {
			return L.Util.trim(str).split(/\s+/);
		},

		setOptions: function (obj, options) {
			obj.options = L.extend({}, obj.options, options);
			return obj.options;
		},

		getParamString: function (obj, existingUrl, uppercase) {
			var params = [];
			for (var i in obj) {
				params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
			}
			return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
		},
		template: function (str, data) {
			return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
				var value = data[key];
				if (value === undefined) {
					throw new Error('No value provided for variable ' + str);
				} else if (typeof value === 'function') {
					value = value(data);
				}
				return value;
			});
		},

		isArray: Array.isArray || function (obj) {
			return (Object.prototype.toString.call(obj) === '[object Array]');
		},

		emptyImageUrl: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
	};

	(function () {

		// inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

		function getPrefixed(name) {
			var i, fn,
			    prefixes = ['webkit', 'moz', 'o', 'ms'];

			for (i = 0; i < prefixes.length && !fn; i++) {
				fn = window[prefixes[i] + name];
			}

			return fn;
		}

		var lastTime = 0;

		function timeoutDefer(fn) {
			var time = +new Date(),
			    timeToCall = Math.max(0, 16 - (time - lastTime));

			lastTime = time + timeToCall;
			return window.setTimeout(fn, timeToCall);
		}

		var requestFn = window.requestAnimationFrame ||
		        getPrefixed('RequestAnimationFrame') || timeoutDefer;

		var cancelFn = window.cancelAnimationFrame ||
		        getPrefixed('CancelAnimationFrame') ||
		        getPrefixed('CancelRequestAnimationFrame') ||
		        function (id) { window.clearTimeout(id); };


		L.Util.requestAnimFrame = function (fn, context, immediate, element) {
			fn = L.bind(fn, context);

			if (immediate && requestFn === timeoutDefer) {
				fn();
			} else {
				return requestFn.call(window, fn, element);
			}
		};

		L.Util.cancelAnimFrame = function (id) {
			if (id) {
				cancelFn.call(window, id);
			}
		};

	}());

	// shortcuts for most used utility functions
	L.extend = L.Util.extend;
	L.bind = L.Util.bind;
	L.stamp = L.Util.stamp;
	L.setOptions = L.Util.setOptions;


	/*
	 * L.Class powers the OOP facilities of the library.
	 * Thanks to John Resig and Dean Edwards for inspiration!
	 */

	L.Class = function () {};

	L.Class.extend = function (props) {

		// extended class with the new prototype
		var NewClass = function () {

			// call the constructor
			if (this.initialize) {
				this.initialize.apply(this, arguments);
			}

			// call all constructor hooks
			if (this._initHooks) {
				this.callInitHooks();
			}
		};

		// instantiate class without calling constructor
		var F = function () {};
		F.prototype = this.prototype;

		var proto = new F();
		proto.constructor = NewClass;

		NewClass.prototype = proto;

		//inherit parent's statics
		for (var i in this) {
			if (this.hasOwnProperty(i) && i !== 'prototype') {
				NewClass[i] = this[i];
			}
		}

		// mix static properties into the class
		if (props.statics) {
			L.extend(NewClass, props.statics);
			delete props.statics;
		}

		// mix includes into the prototype
		if (props.includes) {
			L.Util.extend.apply(null, [proto].concat(props.includes));
			delete props.includes;
		}

		// merge options
		if (props.options && proto.options) {
			props.options = L.extend({}, proto.options, props.options);
		}

		// mix given properties into the prototype
		L.extend(proto, props);

		proto._initHooks = [];

		var parent = this;
		// jshint camelcase: false
		NewClass.__super__ = parent.prototype;

		// add method for calling all hooks
		proto.callInitHooks = function () {

			if (this._initHooksCalled) { return; }

			if (parent.prototype.callInitHooks) {
				parent.prototype.callInitHooks.call(this);
			}

			this._initHooksCalled = true;

			for (var i = 0, len = proto._initHooks.length; i < len; i++) {
				proto._initHooks[i].call(this);
			}
		};

		return NewClass;
	};


	// method for adding properties to prototype
	L.Class.include = function (props) {
		L.extend(this.prototype, props);
	};

	// merge new default options to the Class
	L.Class.mergeOptions = function (options) {
		L.extend(this.prototype.options, options);
	};

	// add a constructor hook
	L.Class.addInitHook = function (fn) { // (Function) || (String, args...)
		var args = Array.prototype.slice.call(arguments, 1);

		var init = typeof fn === 'function' ? fn : function () {
			this[fn].apply(this, args);
		};

		this.prototype._initHooks = this.prototype._initHooks || [];
		this.prototype._initHooks.push(init);
	};


	/*
	 * L.Mixin.Events is used to add custom events functionality to Leaflet classes.
	 */

	var eventsKey = '_leaflet_events';

	L.Mixin = {};

	L.Mixin.Events = {

		addEventListener: function (types, fn, context) { // (String, Function[, Object]) or (Object[, Object])

			// types can be a map of types/handlers
			if (L.Util.invokeEach(types, this.addEventListener, this, fn, context)) { return this; }

			var events = this[eventsKey] = this[eventsKey] || {},
			    contextId = context && context !== this && L.stamp(context),
			    i, len, event, type, indexKey, indexLenKey, typeIndex;

			// types can be a string of space-separated words
			types = L.Util.splitWords(types);

			for (i = 0, len = types.length; i < len; i++) {
				event = {
					action: fn,
					context: context || this
				};
				type = types[i];

				if (contextId) {
					// store listeners of a particular context in a separate hash (if it has an id)
					// gives a major performance boost when removing thousands of map layers

					indexKey = type + '_idx';
					indexLenKey = indexKey + '_len';

					typeIndex = events[indexKey] = events[indexKey] || {};

					if (!typeIndex[contextId]) {
						typeIndex[contextId] = [];

						// keep track of the number of keys in the index to quickly check if it's empty
						events[indexLenKey] = (events[indexLenKey] || 0) + 1;
					}

					typeIndex[contextId].push(event);


				} else {
					events[type] = events[type] || [];
					events[type].push(event);
				}
			}

			return this;
		},

		hasEventListeners: function (type) { // (String) -> Boolean
			var events = this[eventsKey];
			return !!events && ((type in events && events[type].length > 0) ||
			                    (type + '_idx' in events && events[type + '_idx_len'] > 0));
		},

		removeEventListener: function (types, fn, context) { // ([String, Function, Object]) or (Object[, Object])

			if (!this[eventsKey]) {
				return this;
			}

			if (!types) {
				return this.clearAllEventListeners();
			}

			if (L.Util.invokeEach(types, this.removeEventListener, this, fn, context)) { return this; }

			var events = this[eventsKey],
			    contextId = context && context !== this && L.stamp(context),
			    i, len, type, listeners, j, indexKey, indexLenKey, typeIndex, removed;

			types = L.Util.splitWords(types);

			for (i = 0, len = types.length; i < len; i++) {
				type = types[i];
				indexKey = type + '_idx';
				indexLenKey = indexKey + '_len';

				typeIndex = events[indexKey];

				if (!fn) {
					// clear all listeners for a type if function isn't specified
					delete events[type];
					delete events[indexKey];
					delete events[indexLenKey];

				} else {
					listeners = contextId && typeIndex ? typeIndex[contextId] : events[type];

					if (listeners) {
						for (j = listeners.length - 1; j >= 0; j--) {
							if ((listeners[j].action === fn) && (!context || (listeners[j].context === context))) {
								removed = listeners.splice(j, 1);
								// set the old action to a no-op, because it is possible
								// that the listener is being iterated over as part of a dispatch
								removed[0].action = L.Util.falseFn;
							}
						}

						if (context && typeIndex && (listeners.length === 0)) {
							delete typeIndex[contextId];
							events[indexLenKey]--;
						}
					}
				}
			}

			return this;
		},

		clearAllEventListeners: function () {
			delete this[eventsKey];
			return this;
		},

		fireEvent: function (type, data) { // (String[, Object])
			if (!this.hasEventListeners(type)) {
				return this;
			}

			var event = L.Util.extend({}, data, { type: type, target: this });

			var events = this[eventsKey],
			    listeners, i, len, typeIndex, contextId;

			if (events[type]) {
				// make sure adding/removing listeners inside other listeners won't cause infinite loop
				listeners = events[type].slice();

				for (i = 0, len = listeners.length; i < len; i++) {
					listeners[i].action.call(listeners[i].context, event);
				}
			}

			// fire event for the context-indexed listeners as well
			typeIndex = events[type + '_idx'];

			for (contextId in typeIndex) {
				listeners = typeIndex[contextId].slice();

				if (listeners) {
					for (i = 0, len = listeners.length; i < len; i++) {
						listeners[i].action.call(listeners[i].context, event);
					}
				}
			}

			return this;
		},

		addOneTimeEventListener: function (types, fn, context) {

			if (L.Util.invokeEach(types, this.addOneTimeEventListener, this, fn, context)) { return this; }

			var handler = L.bind(function () {
				this
				    .removeEventListener(types, fn, context)
				    .removeEventListener(types, handler, context);
			}, this);

			return this
			    .addEventListener(types, fn, context)
			    .addEventListener(types, handler, context);
		}
	};

	L.Mixin.Events.on = L.Mixin.Events.addEventListener;
	L.Mixin.Events.off = L.Mixin.Events.removeEventListener;
	L.Mixin.Events.once = L.Mixin.Events.addOneTimeEventListener;
	L.Mixin.Events.fire = L.Mixin.Events.fireEvent;


	/*
	 * L.Browser handles different browser and feature detections for internal Leaflet use.
	 */

	(function () {

		var ie = 'ActiveXObject' in window,
			ielt9 = ie && !document.addEventListener,

		    // terrible browser detection to work around Safari / iOS / Android browser bugs
		    ua = navigator.userAgent.toLowerCase(),
		    webkit = ua.indexOf('webkit') !== -1,
		    chrome = ua.indexOf('chrome') !== -1,
		    phantomjs = ua.indexOf('phantom') !== -1,
		    android = ua.indexOf('android') !== -1,
		    android23 = ua.search('android [23]') !== -1,
			gecko = ua.indexOf('gecko') !== -1,

		    mobile = typeof orientation !== undefined + '',
		    msPointer = !window.PointerEvent && window.MSPointerEvent,
			pointer = (window.PointerEvent && window.navigator.pointerEnabled) ||
					  msPointer,
		    retina = ('devicePixelRatio' in window && window.devicePixelRatio > 1) ||
		             ('matchMedia' in window && window.matchMedia('(min-resolution:144dpi)') &&
		              window.matchMedia('(min-resolution:144dpi)').matches),

		    doc = document.documentElement,
		    ie3d = ie && ('transition' in doc.style),
		    webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23,
		    gecko3d = 'MozPerspective' in doc.style,
		    opera3d = 'OTransition' in doc.style,
		    any3d = !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d || opera3d) && !phantomjs;

		var touch = !window.L_NO_TOUCH && !phantomjs && (pointer || 'ontouchstart' in window ||
			(window.DocumentTouch && document instanceof window.DocumentTouch));

		L.Browser = {
			ie: ie,
			ielt9: ielt9,
			webkit: webkit,
			gecko: gecko && !webkit && !window.opera && !ie,

			android: android,
			android23: android23,

			chrome: chrome,

			ie3d: ie3d,
			webkit3d: webkit3d,
			gecko3d: gecko3d,
			opera3d: opera3d,
			any3d: any3d,

			mobile: mobile,
			mobileWebkit: mobile && webkit,
			mobileWebkit3d: mobile && webkit3d,
			mobileOpera: mobile && window.opera,

			touch: touch,
			msPointer: msPointer,
			pointer: pointer,

			retina: retina
		};

	}());


	/*
	 * L.Point represents a point with x and y coordinates.
	 */

	L.Point = function (/*Number*/ x, /*Number*/ y, /*Boolean*/ round) {
		this.x = (round ? Math.round(x) : x);
		this.y = (round ? Math.round(y) : y);
	};

	L.Point.prototype = {

		clone: function () {
			return new L.Point(this.x, this.y);
		},

		// non-destructive, returns a new point
		add: function (point) {
			return this.clone()._add(L.point(point));
		},

		// destructive, used directly for performance in situations where it's safe to modify existing point
		_add: function (point) {
			this.x += point.x;
			this.y += point.y;
			return this;
		},

		subtract: function (point) {
			return this.clone()._subtract(L.point(point));
		},

		_subtract: function (point) {
			this.x -= point.x;
			this.y -= point.y;
			return this;
		},

		divideBy: function (num) {
			return this.clone()._divideBy(num);
		},

		_divideBy: function (num) {
			this.x /= num;
			this.y /= num;
			return this;
		},

		multiplyBy: function (num) {
			return this.clone()._multiplyBy(num);
		},

		_multiplyBy: function (num) {
			this.x *= num;
			this.y *= num;
			return this;
		},

		round: function () {
			return this.clone()._round();
		},

		_round: function () {
			this.x = Math.round(this.x);
			this.y = Math.round(this.y);
			return this;
		},

		floor: function () {
			return this.clone()._floor();
		},

		_floor: function () {
			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);
			return this;
		},

		distanceTo: function (point) {
			point = L.point(point);

			var x = point.x - this.x,
			    y = point.y - this.y;

			return Math.sqrt(x * x + y * y);
		},

		equals: function (point) {
			point = L.point(point);

			return point.x === this.x &&
			       point.y === this.y;
		},

		contains: function (point) {
			point = L.point(point);

			return Math.abs(point.x) <= Math.abs(this.x) &&
			       Math.abs(point.y) <= Math.abs(this.y);
		},

		toString: function () {
			return 'Point(' +
			        L.Util.formatNum(this.x) + ', ' +
			        L.Util.formatNum(this.y) + ')';
		}
	};

	L.point = function (x, y, round) {
		if (x instanceof L.Point) {
			return x;
		}
		if (L.Util.isArray(x)) {
			return new L.Point(x[0], x[1]);
		}
		if (x === undefined || x === null) {
			return x;
		}
		return new L.Point(x, y, round);
	};


	/*
	 * L.Bounds represents a rectangular area on the screen in pixel coordinates.
	 */

	L.Bounds = function (a, b) { //(Point, Point) or Point[]
		if (!a) { return; }

		var points = b ? [a, b] : a;

		for (var i = 0, len = points.length; i < len; i++) {
			this.extend(points[i]);
		}
	};

	L.Bounds.prototype = {
		// extend the bounds to contain the given point
		extend: function (point) { // (Point)
			point = L.point(point);

			if (!this.min && !this.max) {
				this.min = point.clone();
				this.max = point.clone();
			} else {
				this.min.x = Math.min(point.x, this.min.x);
				this.max.x = Math.max(point.x, this.max.x);
				this.min.y = Math.min(point.y, this.min.y);
				this.max.y = Math.max(point.y, this.max.y);
			}
			return this;
		},

		getCenter: function (round) { // (Boolean) -> Point
			return new L.Point(
			        (this.min.x + this.max.x) / 2,
			        (this.min.y + this.max.y) / 2, round);
		},

		getBottomLeft: function () { // -> Point
			return new L.Point(this.min.x, this.max.y);
		},

		getTopRight: function () { // -> Point
			return new L.Point(this.max.x, this.min.y);
		},

		getSize: function () {
			return this.max.subtract(this.min);
		},

		contains: function (obj) { // (Bounds) or (Point) -> Boolean
			var min, max;

			if (typeof obj[0] === 'number' || obj instanceof L.Point) {
				obj = L.point(obj);
			} else {
				obj = L.bounds(obj);
			}

			if (obj instanceof L.Bounds) {
				min = obj.min;
				max = obj.max;
			} else {
				min = max = obj;
			}

			return (min.x >= this.min.x) &&
			       (max.x <= this.max.x) &&
			       (min.y >= this.min.y) &&
			       (max.y <= this.max.y);
		},

		intersects: function (bounds) { // (Bounds) -> Boolean
			bounds = L.bounds(bounds);

			var min = this.min,
			    max = this.max,
			    min2 = bounds.min,
			    max2 = bounds.max,
			    xIntersects = (max2.x >= min.x) && (min2.x <= max.x),
			    yIntersects = (max2.y >= min.y) && (min2.y <= max.y);

			return xIntersects && yIntersects;
		},

		isValid: function () {
			return !!(this.min && this.max);
		}
	};

	L.bounds = function (a, b) { // (Bounds) or (Point, Point) or (Point[])
		if (!a || a instanceof L.Bounds) {
			return a;
		}
		return new L.Bounds(a, b);
	};


	/*
	 * L.Transformation is an utility class to perform simple point transformations through a 2d-matrix.
	 */

	L.Transformation = function (a, b, c, d) {
		this._a = a;
		this._b = b;
		this._c = c;
		this._d = d;
	};

	L.Transformation.prototype = {
		transform: function (point, scale) { // (Point, Number) -> Point
			return this._transform(point.clone(), scale);
		},

		// destructive transform (faster)
		_transform: function (point, scale) {
			scale = scale || 1;
			point.x = scale * (this._a * point.x + this._b);
			point.y = scale * (this._c * point.y + this._d);
			return point;
		},

		untransform: function (point, scale) {
			scale = scale || 1;
			return new L.Point(
			        (point.x / scale - this._b) / this._a,
			        (point.y / scale - this._d) / this._c);
		}
	};


	/*
	 * L.DomUtil contains various utility functions for working with DOM.
	 */

	L.DomUtil = {
		get: function (id) {
			return (typeof id === 'string' ? document.getElementById(id) : id);
		},

		getStyle: function (el, style) {

			var value = el.style[style];

			if (!value && el.currentStyle) {
				value = el.currentStyle[style];
			}

			if ((!value || value === 'auto') && document.defaultView) {
				var css = document.defaultView.getComputedStyle(el, null);
				value = css ? css[style] : null;
			}

			return value === 'auto' ? null : value;
		},

		getViewportOffset: function (element) {

			var top = 0,
			    left = 0,
			    el = element,
			    docBody = document.body,
			    docEl = document.documentElement,
			    pos;

			do {
				top  += el.offsetTop  || 0;
				left += el.offsetLeft || 0;

				//add borders
				top += parseInt(L.DomUtil.getStyle(el, 'borderTopWidth'), 10) || 0;
				left += parseInt(L.DomUtil.getStyle(el, 'borderLeftWidth'), 10) || 0;

				pos = L.DomUtil.getStyle(el, 'position');

				if (el.offsetParent === docBody && pos === 'absolute') { break; }

				if (pos === 'fixed') {
					top  += docBody.scrollTop  || docEl.scrollTop  || 0;
					left += docBody.scrollLeft || docEl.scrollLeft || 0;
					break;
				}

				if (pos === 'relative' && !el.offsetLeft) {
					var width = L.DomUtil.getStyle(el, 'width'),
					    maxWidth = L.DomUtil.getStyle(el, 'max-width'),
					    r = el.getBoundingClientRect();

					if (width !== 'none' || maxWidth !== 'none') {
						left += r.left + el.clientLeft;
					}

					//calculate full y offset since we're breaking out of the loop
					top += r.top + (docBody.scrollTop  || docEl.scrollTop  || 0);

					break;
				}

				el = el.offsetParent;

			} while (el);

			el = element;

			do {
				if (el === docBody) { break; }

				top  -= el.scrollTop  || 0;
				left -= el.scrollLeft || 0;

				el = el.parentNode;
			} while (el);

			return new L.Point(left, top);
		},

		documentIsLtr: function () {
			if (!L.DomUtil._docIsLtrCached) {
				L.DomUtil._docIsLtrCached = true;
				L.DomUtil._docIsLtr = L.DomUtil.getStyle(document.body, 'direction') === 'ltr';
			}
			return L.DomUtil._docIsLtr;
		},

		create: function (tagName, className, container) {

			var el = document.createElement(tagName);
			el.className = className;

			if (container) {
				container.appendChild(el);
			}

			return el;
		},

		hasClass: function (el, name) {
			if (el.classList !== undefined) {
				return el.classList.contains(name);
			}
			var className = L.DomUtil._getClass(el);
			return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
		},

		addClass: function (el, name) {
			if (el.classList !== undefined) {
				var classes = L.Util.splitWords(name);
				for (var i = 0, len = classes.length; i < len; i++) {
					el.classList.add(classes[i]);
				}
			} else if (!L.DomUtil.hasClass(el, name)) {
				var className = L.DomUtil._getClass(el);
				L.DomUtil._setClass(el, (className ? className + ' ' : '') + name);
			}
		},

		removeClass: function (el, name) {
			if (el.classList !== undefined) {
				el.classList.remove(name);
			} else {
				L.DomUtil._setClass(el, L.Util.trim((' ' + L.DomUtil._getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
			}
		},

		_setClass: function (el, name) {
			if (el.className.baseVal === undefined) {
				el.className = name;
			} else {
				// in case of SVG element
				el.className.baseVal = name;
			}
		},

		_getClass: function (el) {
			return el.className.baseVal === undefined ? el.className : el.className.baseVal;
		},

		setOpacity: function (el, value) {

			if ('opacity' in el.style) {
				el.style.opacity = value;

			} else if ('filter' in el.style) {

				var filter = false,
				    filterName = 'DXImageTransform.Microsoft.Alpha';

				// filters collection throws an error if we try to retrieve a filter that doesn't exist
				try {
					filter = el.filters.item(filterName);
				} catch (e) {
					// don't set opacity to 1 if we haven't already set an opacity,
					// it isn't needed and breaks transparent pngs.
					if (value === 1) { return; }
				}

				value = Math.round(value * 100);

				if (filter) {
					filter.Enabled = (value !== 100);
					filter.Opacity = value;
				} else {
					el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
				}
			}
		},

		testProp: function (props) {

			var style = document.documentElement.style;

			for (var i = 0; i < props.length; i++) {
				if (props[i] in style) {
					return props[i];
				}
			}
			return false;
		},

		getTranslateString: function (point) {
			// on WebKit browsers (Chrome/Safari/iOS Safari/Android) using translate3d instead of translate
			// makes animation smoother as it ensures HW accel is used. Firefox 13 doesn't care
			// (same speed either way), Opera 12 doesn't support translate3d

			var is3d = L.Browser.webkit3d,
			    open = 'translate' + (is3d ? '3d' : '') + '(',
			    close = (is3d ? ',0' : '') + ')';

			return open + point.x + 'px,' + point.y + 'px' + close;
		},

		getScaleString: function (scale, origin) {

			var preTranslateStr = L.DomUtil.getTranslateString(origin.add(origin.multiplyBy(-1 * scale))),
			    scaleStr = ' scale(' + scale + ') ';

			return preTranslateStr + scaleStr;
		},

		setPosition: function (el, point, disable3D) { // (HTMLElement, Point[, Boolean])

			// jshint camelcase: false
			el._leaflet_pos = point;

			if (!disable3D && L.Browser.any3d) {
				el.style[L.DomUtil.TRANSFORM] =  L.DomUtil.getTranslateString(point);
			} else {
				el.style.left = point.x + 'px';
				el.style.top = point.y + 'px';
			}
		},

		getPosition: function (el) {
			// this method is only used for elements previously positioned using setPosition,
			// so it's safe to cache the position for performance

			// jshint camelcase: false
			return el._leaflet_pos;
		}
	};


	// prefix style property names

	L.DomUtil.TRANSFORM = L.DomUtil.testProp(
	        ['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']);

	// webkitTransition comes first because some browser versions that drop vendor prefix don't do
	// the same for the transitionend event, in particular the Android 4.1 stock browser

	L.DomUtil.TRANSITION = L.DomUtil.testProp(
	        ['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);

	L.DomUtil.TRANSITION_END =
	        L.DomUtil.TRANSITION === 'webkitTransition' || L.DomUtil.TRANSITION === 'OTransition' ?
	        L.DomUtil.TRANSITION + 'End' : 'transitionend';

	(function () {
	    if ('onselectstart' in document) {
	        L.extend(L.DomUtil, {
	            disableTextSelection: function () {
	                L.DomEvent.on(window, 'selectstart', L.DomEvent.preventDefault);
	            },

	            enableTextSelection: function () {
	                L.DomEvent.off(window, 'selectstart', L.DomEvent.preventDefault);
	            }
	        });
	    } else {
	        var userSelectProperty = L.DomUtil.testProp(
	            ['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);

	        L.extend(L.DomUtil, {
	            disableTextSelection: function () {
	                if (userSelectProperty) {
	                    var style = document.documentElement.style;
	                    this._userSelect = style[userSelectProperty];
	                    style[userSelectProperty] = 'none';
	                }
	            },

	            enableTextSelection: function () {
	                if (userSelectProperty) {
	                    document.documentElement.style[userSelectProperty] = this._userSelect;
	                    delete this._userSelect;
	                }
	            }
	        });
	    }

		L.extend(L.DomUtil, {
			disableImageDrag: function () {
				L.DomEvent.on(window, 'dragstart', L.DomEvent.preventDefault);
			},

			enableImageDrag: function () {
				L.DomEvent.off(window, 'dragstart', L.DomEvent.preventDefault);
			}
		});
	})();


	/*
	 * L.LatLng represents a geographical point with latitude and longitude coordinates.
	 */

	L.LatLng = function (lat, lng, alt) { // (Number, Number, Number)
		lat = parseFloat(lat);
		lng = parseFloat(lng);

		if (isNaN(lat) || isNaN(lng)) {
			throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
		}

		this.lat = lat;
		this.lng = lng;

		if (alt !== undefined) {
			this.alt = parseFloat(alt);
		}
	};

	L.extend(L.LatLng, {
		DEG_TO_RAD: Math.PI / 180,
		RAD_TO_DEG: 180 / Math.PI,
		MAX_MARGIN: 1.0E-9 // max margin of error for the "equals" check
	});

	L.LatLng.prototype = {
		equals: function (obj) { // (LatLng) -> Boolean
			if (!obj) { return false; }

			obj = L.latLng(obj);

			var margin = Math.max(
			        Math.abs(this.lat - obj.lat),
			        Math.abs(this.lng - obj.lng));

			return margin <= L.LatLng.MAX_MARGIN;
		},

		toString: function (precision) { // (Number) -> String
			return 'LatLng(' +
			        L.Util.formatNum(this.lat, precision) + ', ' +
			        L.Util.formatNum(this.lng, precision) + ')';
		},

		// Haversine distance formula, see http://en.wikipedia.org/wiki/Haversine_formula
		// TODO move to projection code, LatLng shouldn't know about Earth
		distanceTo: function (other) { // (LatLng) -> Number
			other = L.latLng(other);

			var R = 6378137, // earth radius in meters
			    d2r = L.LatLng.DEG_TO_RAD,
			    dLat = (other.lat - this.lat) * d2r,
			    dLon = (other.lng - this.lng) * d2r,
			    lat1 = this.lat * d2r,
			    lat2 = other.lat * d2r,
			    sin1 = Math.sin(dLat / 2),
			    sin2 = Math.sin(dLon / 2);

			var a = sin1 * sin1 + sin2 * sin2 * Math.cos(lat1) * Math.cos(lat2);

			return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		},

		wrap: function (a, b) { // (Number, Number) -> LatLng
			var lng = this.lng;

			a = a || -180;
			b = b ||  180;

			lng = (lng + b) % (b - a) + (lng < a || lng === b ? b : a);

			return new L.LatLng(this.lat, lng);
		}
	};

	L.latLng = function (a, b) { // (LatLng) or ([Number, Number]) or (Number, Number)
		if (a instanceof L.LatLng) {
			return a;
		}
		if (L.Util.isArray(a)) {
			if (typeof a[0] === 'number' || typeof a[0] === 'string') {
				return new L.LatLng(a[0], a[1], a[2]);
			} else {
				return null;
			}
		}
		if (a === undefined || a === null) {
			return a;
		}
		if (typeof a === 'object' && 'lat' in a) {
			return new L.LatLng(a.lat, 'lng' in a ? a.lng : a.lon);
		}
		if (b === undefined) {
			return null;
		}
		return new L.LatLng(a, b);
	};



	/*
	 * L.LatLngBounds represents a rectangular area on the map in geographical coordinates.
	 */

	L.LatLngBounds = function (southWest, northEast) { // (LatLng, LatLng) or (LatLng[])
		if (!southWest) { return; }

		var latlngs = northEast ? [southWest, northEast] : southWest;

		for (var i = 0, len = latlngs.length; i < len; i++) {
			this.extend(latlngs[i]);
		}
	};

	L.LatLngBounds.prototype = {
		// extend the bounds to contain the given point or bounds
		extend: function (obj) { // (LatLng) or (LatLngBounds)
			if (!obj) { return this; }

			var latLng = L.latLng(obj);
			if (latLng !== null) {
				obj = latLng;
			} else {
				obj = L.latLngBounds(obj);
			}

			if (obj instanceof L.LatLng) {
				if (!this._southWest && !this._northEast) {
					this._southWest = new L.LatLng(obj.lat, obj.lng);
					this._northEast = new L.LatLng(obj.lat, obj.lng);
				} else {
					this._southWest.lat = Math.min(obj.lat, this._southWest.lat);
					this._southWest.lng = Math.min(obj.lng, this._southWest.lng);

					this._northEast.lat = Math.max(obj.lat, this._northEast.lat);
					this._northEast.lng = Math.max(obj.lng, this._northEast.lng);
				}
			} else if (obj instanceof L.LatLngBounds) {
				this.extend(obj._southWest);
				this.extend(obj._northEast);
			}
			return this;
		},

		// extend the bounds by a percentage
		pad: function (bufferRatio) { // (Number) -> LatLngBounds
			var sw = this._southWest,
			    ne = this._northEast,
			    heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
			    widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

			return new L.LatLngBounds(
			        new L.LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
			        new L.LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
		},

		getCenter: function () { // -> LatLng
			return new L.LatLng(
			        (this._southWest.lat + this._northEast.lat) / 2,
			        (this._southWest.lng + this._northEast.lng) / 2);
		},

		getSouthWest: function () {
			return this._southWest;
		},

		getNorthEast: function () {
			return this._northEast;
		},

		getNorthWest: function () {
			return new L.LatLng(this.getNorth(), this.getWest());
		},

		getSouthEast: function () {
			return new L.LatLng(this.getSouth(), this.getEast());
		},

		getWest: function () {
			return this._southWest.lng;
		},

		getSouth: function () {
			return this._southWest.lat;
		},

		getEast: function () {
			return this._northEast.lng;
		},

		getNorth: function () {
			return this._northEast.lat;
		},

		contains: function (obj) { // (LatLngBounds) or (LatLng) -> Boolean
			if (typeof obj[0] === 'number' || obj instanceof L.LatLng) {
				obj = L.latLng(obj);
			} else {
				obj = L.latLngBounds(obj);
			}

			var sw = this._southWest,
			    ne = this._northEast,
			    sw2, ne2;

			if (obj instanceof L.LatLngBounds) {
				sw2 = obj.getSouthWest();
				ne2 = obj.getNorthEast();
			} else {
				sw2 = ne2 = obj;
			}

			return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
			       (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
		},

		intersects: function (bounds) { // (LatLngBounds)
			bounds = L.latLngBounds(bounds);

			var sw = this._southWest,
			    ne = this._northEast,
			    sw2 = bounds.getSouthWest(),
			    ne2 = bounds.getNorthEast(),

			    latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
			    lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

			return latIntersects && lngIntersects;
		},

		toBBoxString: function () {
			return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
		},

		equals: function (bounds) { // (LatLngBounds)
			if (!bounds) { return false; }

			bounds = L.latLngBounds(bounds);

			return this._southWest.equals(bounds.getSouthWest()) &&
			       this._northEast.equals(bounds.getNorthEast());
		},

		isValid: function () {
			return !!(this._southWest && this._northEast);
		}
	};

	//TODO International date line?

	L.latLngBounds = function (a, b) { // (LatLngBounds) or (LatLng, LatLng)
		if (!a || a instanceof L.LatLngBounds) {
			return a;
		}
		return new L.LatLngBounds(a, b);
	};


	/*
	 * L.Projection contains various geographical projections used by CRS classes.
	 */

	L.Projection = {};


	/*
	 * Spherical Mercator is the most popular map projection, used by EPSG:3857 CRS used by default.
	 */

	L.Projection.SphericalMercator = {
		MAX_LATITUDE: 85.0511287798,

		project: function (latlng) { // (LatLng) -> Point
			var d = L.LatLng.DEG_TO_RAD,
			    max = this.MAX_LATITUDE,
			    lat = Math.max(Math.min(max, latlng.lat), -max),
			    x = latlng.lng * d,
			    y = lat * d;

			y = Math.log(Math.tan((Math.PI / 4) + (y / 2)));

			return new L.Point(x, y);
		},

		unproject: function (point) { // (Point, Boolean) -> LatLng
			var d = L.LatLng.RAD_TO_DEG,
			    lng = point.x * d,
			    lat = (2 * Math.atan(Math.exp(point.y)) - (Math.PI / 2)) * d;

			return new L.LatLng(lat, lng);
		}
	};


	/*
	 * Simple equirectangular (Plate Carree) projection, used by CRS like EPSG:4326 and Simple.
	 */

	L.Projection.LonLat = {
		project: function (latlng) {
			return new L.Point(latlng.lng, latlng.lat);
		},

		unproject: function (point) {
			return new L.LatLng(point.y, point.x);
		}
	};


	/*
	 * L.CRS is a base object for all defined CRS (Coordinate Reference Systems) in Leaflet.
	 */

	L.CRS = {
		latLngToPoint: function (latlng, zoom) { // (LatLng, Number) -> Point
			var projectedPoint = this.projection.project(latlng),
			    scale = this.scale(zoom);

			return this.transformation._transform(projectedPoint, scale);
		},

		pointToLatLng: function (point, zoom) { // (Point, Number[, Boolean]) -> LatLng
			var scale = this.scale(zoom),
			    untransformedPoint = this.transformation.untransform(point, scale);

			return this.projection.unproject(untransformedPoint);
		},

		project: function (latlng) {
			return this.projection.project(latlng);
		},

		scale: function (zoom) {
			return 256 * Math.pow(2, zoom);
		},

		getSize: function (zoom) {
			var s = this.scale(zoom);
			return L.point(s, s);
		}
	};


	/*
	 * A simple CRS that can be used for flat non-Earth maps like panoramas or game maps.
	 */

	L.CRS.Simple = L.extend({}, L.CRS, {
		projection: L.Projection.LonLat,
		transformation: new L.Transformation(1, 0, -1, 0),

		scale: function (zoom) {
			return Math.pow(2, zoom);
		}
	});


	/*
	 * L.CRS.EPSG3857 (Spherical Mercator) is the most common CRS for web mapping
	 * and is used by Leaflet by default.
	 */

	L.CRS.EPSG3857 = L.extend({}, L.CRS, {
		code: 'EPSG:3857',

		projection: L.Projection.SphericalMercator,
		transformation: new L.Transformation(0.5 / Math.PI, 0.5, -0.5 / Math.PI, 0.5),

		project: function (latlng) { // (LatLng) -> Point
			var projectedPoint = this.projection.project(latlng),
			    earthRadius = 6378137;
			return projectedPoint.multiplyBy(earthRadius);
		}
	});

	L.CRS.EPSG900913 = L.extend({}, L.CRS.EPSG3857, {
		code: 'EPSG:900913'
	});


	/*
	 * L.CRS.EPSG4326 is a CRS popular among advanced GIS specialists.
	 */

	L.CRS.EPSG4326 = L.extend({}, L.CRS, {
		code: 'EPSG:4326',

		projection: L.Projection.LonLat,
		transformation: new L.Transformation(1 / 360, 0.5, -1 / 360, 0.5)
	});


	/*
	 * L.Map is the central class of the API - it is used to create a map.
	 */

	L.Map = L.Class.extend({

		includes: L.Mixin.Events,

		options: {
			crs: L.CRS.EPSG3857,

			/*
			center: LatLng,
			zoom: Number,
			layers: Array,
			*/

			fadeAnimation: L.DomUtil.TRANSITION && !L.Browser.android23,
			trackResize: true,
			markerZoomAnimation: L.DomUtil.TRANSITION && L.Browser.any3d
		},

		initialize: function (id, options) { // (HTMLElement or String, Object)
			options = L.setOptions(this, options);


			this._initContainer(id);
			this._initLayout();

			// hack for https://github.com/Leaflet/Leaflet/issues/1980
			this._onResize = L.bind(this._onResize, this);

			this._initEvents();

			if (options.maxBounds) {
				this.setMaxBounds(options.maxBounds);
			}

			if (options.center && options.zoom !== undefined) {
				this.setView(L.latLng(options.center), options.zoom, {reset: true});
			}

			this._handlers = [];

			this._layers = {};
			this._zoomBoundLayers = {};
			this._tileLayersNum = 0;

			this.callInitHooks();

			this._addLayers(options.layers);
		},


		// public methods that modify map state

		// replaced by animation-powered implementation in Map.PanAnimation.js
		setView: function (center, zoom) {
			zoom = zoom === undefined ? this.getZoom() : zoom;
			this._resetView(L.latLng(center), this._limitZoom(zoom));
			return this;
		},

		setZoom: function (zoom, options) {
			if (!this._loaded) {
				this._zoom = this._limitZoom(zoom);
				return this;
			}
			return this.setView(this.getCenter(), zoom, {zoom: options});
		},

		zoomIn: function (delta, options) {
			return this.setZoom(this._zoom + (delta || 1), options);
		},

		zoomOut: function (delta, options) {
			return this.setZoom(this._zoom - (delta || 1), options);
		},

		setZoomAround: function (latlng, zoom, options) {
			var scale = this.getZoomScale(zoom),
			    viewHalf = this.getSize().divideBy(2),
			    containerPoint = latlng instanceof L.Point ? latlng : this.latLngToContainerPoint(latlng),

			    centerOffset = containerPoint.subtract(viewHalf).multiplyBy(1 - 1 / scale),
			    newCenter = this.containerPointToLatLng(viewHalf.add(centerOffset));

			return this.setView(newCenter, zoom, {zoom: options});
		},

		fitBounds: function (bounds, options) {

			options = options || {};
			bounds = bounds.getBounds ? bounds.getBounds() : L.latLngBounds(bounds);

			var paddingTL = L.point(options.paddingTopLeft || options.padding || [0, 0]),
			    paddingBR = L.point(options.paddingBottomRight || options.padding || [0, 0]),

			    zoom = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR));

			zoom = (options.maxZoom) ? Math.min(options.maxZoom, zoom) : zoom;

			var paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),

			    swPoint = this.project(bounds.getSouthWest(), zoom),
			    nePoint = this.project(bounds.getNorthEast(), zoom),
			    center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom);

			return this.setView(center, zoom, options);
		},

		fitWorld: function (options) {
			return this.fitBounds([[-90, -180], [90, 180]], options);
		},

		panTo: function (center, options) { // (LatLng)
			return this.setView(center, this._zoom, {pan: options});
		},

		panBy: function (offset) { // (Point)
			// replaced with animated panBy in Map.PanAnimation.js
			this.fire('movestart');

			this._rawPanBy(L.point(offset));

			this.fire('move');
			return this.fire('moveend');
		},

		setMaxBounds: function (bounds) {
			bounds = L.latLngBounds(bounds);

			this.options.maxBounds = bounds;

			if (!bounds) {
				return this.off('moveend', this._panInsideMaxBounds, this);
			}

			if (this._loaded) {
				this._panInsideMaxBounds();
			}

			return this.on('moveend', this._panInsideMaxBounds, this);
		},

		panInsideBounds: function (bounds, options) {
			var center = this.getCenter(),
				newCenter = this._limitCenter(center, this._zoom, bounds);

			if (center.equals(newCenter)) { return this; }

			return this.panTo(newCenter, options);
		},

		addLayer: function (layer) {
			// TODO method is too big, refactor

			var id = L.stamp(layer);

			if (this._layers[id]) { return this; }

			this._layers[id] = layer;

			// TODO getMaxZoom, getMinZoom in ILayer (instead of options)
			if (layer.options && (!isNaN(layer.options.maxZoom) || !isNaN(layer.options.minZoom))) {
				this._zoomBoundLayers[id] = layer;
				this._updateZoomLevels();
			}

			// TODO looks ugly, refactor!!!
			if (this.options.zoomAnimation && L.TileLayer && (layer instanceof L.TileLayer)) {
				this._tileLayersNum++;
				this._tileLayersToLoad++;
				layer.on('load', this._onTileLayerLoad, this);
			}

			if (this._loaded) {
				this._layerAdd(layer);
			}

			return this;
		},

		removeLayer: function (layer) {
			var id = L.stamp(layer);

			if (!this._layers[id]) { return this; }

			if (this._loaded) {
				layer.onRemove(this);
			}

			delete this._layers[id];

			if (this._loaded) {
				this.fire('layerremove', {layer: layer});
			}

			if (this._zoomBoundLayers[id]) {
				delete this._zoomBoundLayers[id];
				this._updateZoomLevels();
			}

			// TODO looks ugly, refactor
			if (this.options.zoomAnimation && L.TileLayer && (layer instanceof L.TileLayer)) {
				this._tileLayersNum--;
				this._tileLayersToLoad--;
				layer.off('load', this._onTileLayerLoad, this);
			}

			return this;
		},

		hasLayer: function (layer) {
			if (!layer) { return false; }

			return (L.stamp(layer) in this._layers);
		},

		eachLayer: function (method, context) {
			for (var i in this._layers) {
				method.call(context, this._layers[i]);
			}
			return this;
		},

		invalidateSize: function (options) {
			if (!this._loaded) { return this; }

			options = L.extend({
				animate: false,
				pan: true
			}, options === true ? {animate: true} : options);

			var oldSize = this.getSize();
			this._sizeChanged = true;
			this._initialCenter = null;

			var newSize = this.getSize(),
			    oldCenter = oldSize.divideBy(2).round(),
			    newCenter = newSize.divideBy(2).round(),
			    offset = oldCenter.subtract(newCenter);

			if (!offset.x && !offset.y) { return this; }

			if (options.animate && options.pan) {
				this.panBy(offset);

			} else {
				if (options.pan) {
					this._rawPanBy(offset);
				}

				this.fire('move');

				if (options.debounceMoveend) {
					clearTimeout(this._sizeTimer);
					this._sizeTimer = setTimeout(L.bind(this.fire, this, 'moveend'), 200);
				} else {
					this.fire('moveend');
				}
			}

			return this.fire('resize', {
				oldSize: oldSize,
				newSize: newSize
			});
		},

		// TODO handler.addTo
		addHandler: function (name, HandlerClass) {
			if (!HandlerClass) { return this; }

			var handler = this[name] = new HandlerClass(this);

			this._handlers.push(handler);

			if (this.options[name]) {
				handler.enable();
			}

			return this;
		},

		remove: function () {
			if (this._loaded) {
				this.fire('unload');
			}

			this._initEvents('off');

			try {
				// throws error in IE6-8
				delete this._container._leaflet;
			} catch (e) {
				this._container._leaflet = undefined;
			}

			this._clearPanes();
			if (this._clearControlPos) {
				this._clearControlPos();
			}

			this._clearHandlers();

			return this;
		},


		// public methods for getting map state

		getCenter: function () { // (Boolean) -> LatLng
			this._checkIfLoaded();

			if (this._initialCenter && !this._moved()) {
				return this._initialCenter;
			}
			return this.layerPointToLatLng(this._getCenterLayerPoint());
		},

		getZoom: function () {
			return this._zoom;
		},

		getBounds: function () {
			var bounds = this.getPixelBounds(),
			    sw = this.unproject(bounds.getBottomLeft()),
			    ne = this.unproject(bounds.getTopRight());

			return new L.LatLngBounds(sw, ne);
		},

		getMinZoom: function () {
			return this.options.minZoom === undefined ?
				(this._layersMinZoom === undefined ? 0 : this._layersMinZoom) :
				this.options.minZoom;
		},

		getMaxZoom: function () {
			return this.options.maxZoom === undefined ?
				(this._layersMaxZoom === undefined ? Infinity : this._layersMaxZoom) :
				this.options.maxZoom;
		},

		getBoundsZoom: function (bounds, inside, padding) { // (LatLngBounds[, Boolean, Point]) -> Number
			bounds = L.latLngBounds(bounds);

			var zoom = this.getMinZoom() - (inside ? 1 : 0),
			    maxZoom = this.getMaxZoom(),
			    size = this.getSize(),

			    nw = bounds.getNorthWest(),
			    se = bounds.getSouthEast(),

			    zoomNotFound = true,
			    boundsSize;

			padding = L.point(padding || [0, 0]);

			do {
				zoom++;
				boundsSize = this.project(se, zoom).subtract(this.project(nw, zoom)).add(padding);
				zoomNotFound = !inside ? size.contains(boundsSize) : boundsSize.x < size.x || boundsSize.y < size.y;

			} while (zoomNotFound && zoom <= maxZoom);

			if (zoomNotFound && inside) {
				return null;
			}

			return inside ? zoom : zoom - 1;
		},

		getSize: function () {
			if (!this._size || this._sizeChanged) {
				this._size = new L.Point(
					this._container.clientWidth,
					this._container.clientHeight);

				this._sizeChanged = false;
			}
			return this._size.clone();
		},

		getPixelBounds: function () {
			var topLeftPoint = this._getTopLeftPoint();
			return new L.Bounds(topLeftPoint, topLeftPoint.add(this.getSize()));
		},

		getPixelOrigin: function () {
			this._checkIfLoaded();
			return this._initialTopLeftPoint;
		},

		getPanes: function () {
			return this._panes;
		},

		getContainer: function () {
			return this._container;
		},


		// TODO replace with universal implementation after refactoring projections

		getZoomScale: function (toZoom) {
			var crs = this.options.crs;
			return crs.scale(toZoom) / crs.scale(this._zoom);
		},

		getScaleZoom: function (scale) {
			return this._zoom + (Math.log(scale) / Math.LN2);
		},


		// conversion methods

		project: function (latlng, zoom) { // (LatLng[, Number]) -> Point
			zoom = zoom === undefined ? this._zoom : zoom;
			return this.options.crs.latLngToPoint(L.latLng(latlng), zoom);
		},

		unproject: function (point, zoom) { // (Point[, Number]) -> LatLng
			zoom = zoom === undefined ? this._zoom : zoom;
			return this.options.crs.pointToLatLng(L.point(point), zoom);
		},

		layerPointToLatLng: function (point) { // (Point)
			var projectedPoint = L.point(point).add(this.getPixelOrigin());
			return this.unproject(projectedPoint);
		},

		latLngToLayerPoint: function (latlng) { // (LatLng)
			var projectedPoint = this.project(L.latLng(latlng))._round();
			return projectedPoint._subtract(this.getPixelOrigin());
		},

		containerPointToLayerPoint: function (point) { // (Point)
			return L.point(point).subtract(this._getMapPanePos());
		},

		layerPointToContainerPoint: function (point) { // (Point)
			return L.point(point).add(this._getMapPanePos());
		},

		containerPointToLatLng: function (point) {
			var layerPoint = this.containerPointToLayerPoint(L.point(point));
			return this.layerPointToLatLng(layerPoint);
		},

		latLngToContainerPoint: function (latlng) {
			return this.layerPointToContainerPoint(this.latLngToLayerPoint(L.latLng(latlng)));
		},

		mouseEventToContainerPoint: function (e) { // (MouseEvent)
			return L.DomEvent.getMousePosition(e, this._container);
		},

		mouseEventToLayerPoint: function (e) { // (MouseEvent)
			return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
		},

		mouseEventToLatLng: function (e) { // (MouseEvent)
			return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
		},


		// map initialization methods

		_initContainer: function (id) {
			var container = this._container = L.DomUtil.get(id);

			if (!container) {
				throw new Error('Map container not found.');
			} else if (container._leaflet) {
				throw new Error('Map container is already initialized.');
			}

			container._leaflet = true;
		},

		_initLayout: function () {
			var container = this._container;

			L.DomUtil.addClass(container, 'leaflet-container' +
				(L.Browser.touch ? ' leaflet-touch' : '') +
				(L.Browser.retina ? ' leaflet-retina' : '') +
				(L.Browser.ielt9 ? ' leaflet-oldie' : '') +
				(this.options.fadeAnimation ? ' leaflet-fade-anim' : ''));

			var position = L.DomUtil.getStyle(container, 'position');

			if (position !== 'absolute' && position !== 'relative' && position !== 'fixed') {
				container.style.position = 'relative';
			}

			this._initPanes();

			if (this._initControlPos) {
				this._initControlPos();
			}
		},

		_initPanes: function () {
			var panes = this._panes = {};

			this._mapPane = panes.mapPane = this._createPane('leaflet-map-pane', this._container);

			this._tilePane = panes.tilePane = this._createPane('leaflet-tile-pane', this._mapPane);
			panes.objectsPane = this._createPane('leaflet-objects-pane', this._mapPane);
			panes.shadowPane = this._createPane('leaflet-shadow-pane');
			panes.overlayPane = this._createPane('leaflet-overlay-pane');
			panes.markerPane = this._createPane('leaflet-marker-pane');
			panes.popupPane = this._createPane('leaflet-popup-pane');

			var zoomHide = ' leaflet-zoom-hide';

			if (!this.options.markerZoomAnimation) {
				L.DomUtil.addClass(panes.markerPane, zoomHide);
				L.DomUtil.addClass(panes.shadowPane, zoomHide);
				L.DomUtil.addClass(panes.popupPane, zoomHide);
			}
		},

		_createPane: function (className, container) {
			return L.DomUtil.create('div', className, container || this._panes.objectsPane);
		},

		_clearPanes: function () {
			this._container.removeChild(this._mapPane);
		},

		_addLayers: function (layers) {
			layers = layers ? (L.Util.isArray(layers) ? layers : [layers]) : [];

			for (var i = 0, len = layers.length; i < len; i++) {
				this.addLayer(layers[i]);
			}
		},


		// private methods that modify map state

		_resetView: function (center, zoom, preserveMapOffset, afterZoomAnim) {

			var zoomChanged = (this._zoom !== zoom);

			if (!afterZoomAnim) {
				this.fire('movestart');

				if (zoomChanged) {
					this.fire('zoomstart');
				}
			}

			this._zoom = zoom;
			this._initialCenter = center;

			this._initialTopLeftPoint = this._getNewTopLeftPoint(center);

			if (!preserveMapOffset) {
				L.DomUtil.setPosition(this._mapPane, new L.Point(0, 0));
			} else {
				this._initialTopLeftPoint._add(this._getMapPanePos());
			}

			this._tileLayersToLoad = this._tileLayersNum;

			var loading = !this._loaded;
			this._loaded = true;

			this.fire('viewreset', {hard: !preserveMapOffset});

			if (loading) {
				this.fire('load');
				this.eachLayer(this._layerAdd, this);
			}

			this.fire('move');

			if (zoomChanged || afterZoomAnim) {
				this.fire('zoomend');
			}

			this.fire('moveend', {hard: !preserveMapOffset});
		},

		_rawPanBy: function (offset) {
			L.DomUtil.setPosition(this._mapPane, this._getMapPanePos().subtract(offset));
		},

		_getZoomSpan: function () {
			return this.getMaxZoom() - this.getMinZoom();
		},

		_updateZoomLevels: function () {
			var i,
				minZoom = Infinity,
				maxZoom = -Infinity,
				oldZoomSpan = this._getZoomSpan();

			for (i in this._zoomBoundLayers) {
				var layer = this._zoomBoundLayers[i];
				if (!isNaN(layer.options.minZoom)) {
					minZoom = Math.min(minZoom, layer.options.minZoom);
				}
				if (!isNaN(layer.options.maxZoom)) {
					maxZoom = Math.max(maxZoom, layer.options.maxZoom);
				}
			}

			if (i === undefined) { // we have no tilelayers
				this._layersMaxZoom = this._layersMinZoom = undefined;
			} else {
				this._layersMaxZoom = maxZoom;
				this._layersMinZoom = minZoom;
			}

			if (oldZoomSpan !== this._getZoomSpan()) {
				this.fire('zoomlevelschange');
			}
		},

		_panInsideMaxBounds: function () {
			this.panInsideBounds(this.options.maxBounds);
		},

		_checkIfLoaded: function () {
			if (!this._loaded) {
				throw new Error('Set map center and zoom first.');
			}
		},

		// map events

		_initEvents: function (onOff) {
			if (!L.DomEvent) { return; }

			onOff = onOff || 'on';

			L.DomEvent[onOff](this._container, 'click', this._onMouseClick, this);

			var events = ['dblclick', 'mousedown', 'mouseup', 'mouseenter',
			              'mouseleave', 'mousemove', 'contextmenu'],
			    i, len;

			for (i = 0, len = events.length; i < len; i++) {
				L.DomEvent[onOff](this._container, events[i], this._fireMouseEvent, this);
			}

			if (this.options.trackResize) {
				L.DomEvent[onOff](window, 'resize', this._onResize, this);
			}
		},

		_onResize: function () {
			L.Util.cancelAnimFrame(this._resizeRequest);
			this._resizeRequest = L.Util.requestAnimFrame(
			        function () { this.invalidateSize({debounceMoveend: true}); }, this, false, this._container);
		},

		_onMouseClick: function (e) {
			if (!this._loaded || (!e._simulated &&
			        ((this.dragging && this.dragging.moved()) ||
			         (this.boxZoom  && this.boxZoom.moved()))) ||
			            L.DomEvent._skipped(e)) { return; }

			this.fire('preclick');
			this._fireMouseEvent(e);
		},

		_fireMouseEvent: function (e) {
			if (!this._loaded || L.DomEvent._skipped(e)) { return; }

			var type = e.type;

			type = (type === 'mouseenter' ? 'mouseover' : (type === 'mouseleave' ? 'mouseout' : type));

			if (!this.hasEventListeners(type)) { return; }

			if (type === 'contextmenu') {
				L.DomEvent.preventDefault(e);
			}

			var containerPoint = this.mouseEventToContainerPoint(e),
			    layerPoint = this.containerPointToLayerPoint(containerPoint),
			    latlng = this.layerPointToLatLng(layerPoint);

			this.fire(type, {
				latlng: latlng,
				layerPoint: layerPoint,
				containerPoint: containerPoint,
				originalEvent: e
			});
		},

		_onTileLayerLoad: function () {
			this._tileLayersToLoad--;
			if (this._tileLayersNum && !this._tileLayersToLoad) {
				this.fire('tilelayersload');
			}
		},

		_clearHandlers: function () {
			for (var i = 0, len = this._handlers.length; i < len; i++) {
				this._handlers[i].disable();
			}
		},

		whenReady: function (callback, context) {
			if (this._loaded) {
				callback.call(context || this, this);
			} else {
				this.on('load', callback, context);
			}
			return this;
		},

		_layerAdd: function (layer) {
			layer.onAdd(this);
			this.fire('layeradd', {layer: layer});
		},


		// private methods for getting map state

		_getMapPanePos: function () {
			return L.DomUtil.getPosition(this._mapPane);
		},

		_moved: function () {
			var pos = this._getMapPanePos();
			return pos && !pos.equals([0, 0]);
		},

		_getTopLeftPoint: function () {
			return this.getPixelOrigin().subtract(this._getMapPanePos());
		},

		_getNewTopLeftPoint: function (center, zoom) {
			var viewHalf = this.getSize()._divideBy(2);
			// TODO round on display, not calculation to increase precision?
			return this.project(center, zoom)._subtract(viewHalf)._round();
		},

		_latLngToNewLayerPoint: function (latlng, newZoom, newCenter) {
			var topLeft = this._getNewTopLeftPoint(newCenter, newZoom).add(this._getMapPanePos());
			return this.project(latlng, newZoom)._subtract(topLeft);
		},

		// layer point of the current center
		_getCenterLayerPoint: function () {
			return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
		},

		// offset of the specified place to the current center in pixels
		_getCenterOffset: function (latlng) {
			return this.latLngToLayerPoint(latlng).subtract(this._getCenterLayerPoint());
		},

		// adjust center for view to get inside bounds
		_limitCenter: function (center, zoom, bounds) {

			if (!bounds) { return center; }

			var centerPoint = this.project(center, zoom),
			    viewHalf = this.getSize().divideBy(2),
			    viewBounds = new L.Bounds(centerPoint.subtract(viewHalf), centerPoint.add(viewHalf)),
			    offset = this._getBoundsOffset(viewBounds, bounds, zoom);

			return this.unproject(centerPoint.add(offset), zoom);
		},

		// adjust offset for view to get inside bounds
		_limitOffset: function (offset, bounds) {
			if (!bounds) { return offset; }

			var viewBounds = this.getPixelBounds(),
			    newBounds = new L.Bounds(viewBounds.min.add(offset), viewBounds.max.add(offset));

			return offset.add(this._getBoundsOffset(newBounds, bounds));
		},

		// returns offset needed for pxBounds to get inside maxBounds at a specified zoom
		_getBoundsOffset: function (pxBounds, maxBounds, zoom) {
			var nwOffset = this.project(maxBounds.getNorthWest(), zoom).subtract(pxBounds.min),
			    seOffset = this.project(maxBounds.getSouthEast(), zoom).subtract(pxBounds.max),

			    dx = this._rebound(nwOffset.x, -seOffset.x),
			    dy = this._rebound(nwOffset.y, -seOffset.y);

			return new L.Point(dx, dy);
		},

		_rebound: function (left, right) {
			return left + right > 0 ?
				Math.round(left - right) / 2 :
				Math.max(0, Math.ceil(left)) - Math.max(0, Math.floor(right));
		},

		_limitZoom: function (zoom) {
			var min = this.getMinZoom(),
			    max = this.getMaxZoom();

			return Math.max(min, Math.min(max, zoom));
		}
	});

	L.map = function (id, options) {
		return new L.Map(id, options);
	};


	/*
	 * Mercator projection that takes into account that the Earth is not a perfect sphere.
	 * Less popular than spherical mercator; used by projections like EPSG:3395.
	 */

	L.Projection.Mercator = {
		MAX_LATITUDE: 85.0840591556,

		R_MINOR: 6356752.314245179,
		R_MAJOR: 6378137,

		project: function (latlng) { // (LatLng) -> Point
			var d = L.LatLng.DEG_TO_RAD,
			    max = this.MAX_LATITUDE,
			    lat = Math.max(Math.min(max, latlng.lat), -max),
			    r = this.R_MAJOR,
			    r2 = this.R_MINOR,
			    x = latlng.lng * d * r,
			    y = lat * d,
			    tmp = r2 / r,
			    eccent = Math.sqrt(1.0 - tmp * tmp),
			    con = eccent * Math.sin(y);

			con = Math.pow((1 - con) / (1 + con), eccent * 0.5);

			var ts = Math.tan(0.5 * ((Math.PI * 0.5) - y)) / con;
			y = -r * Math.log(ts);

			return new L.Point(x, y);
		},

		unproject: function (point) { // (Point, Boolean) -> LatLng
			var d = L.LatLng.RAD_TO_DEG,
			    r = this.R_MAJOR,
			    r2 = this.R_MINOR,
			    lng = point.x * d / r,
			    tmp = r2 / r,
			    eccent = Math.sqrt(1 - (tmp * tmp)),
			    ts = Math.exp(- point.y / r),
			    phi = (Math.PI / 2) - 2 * Math.atan(ts),
			    numIter = 15,
			    tol = 1e-7,
			    i = numIter,
			    dphi = 0.1,
			    con;

			while ((Math.abs(dphi) > tol) && (--i > 0)) {
				con = eccent * Math.sin(phi);
				dphi = (Math.PI / 2) - 2 * Math.atan(ts *
				            Math.pow((1.0 - con) / (1.0 + con), 0.5 * eccent)) - phi;
				phi += dphi;
			}

			return new L.LatLng(phi * d, lng);
		}
	};



	L.CRS.EPSG3395 = L.extend({}, L.CRS, {
		code: 'EPSG:3395',

		projection: L.Projection.Mercator,

		transformation: (function () {
			var m = L.Projection.Mercator,
			    r = m.R_MAJOR,
			    scale = 0.5 / (Math.PI * r);

			return new L.Transformation(scale, 0.5, -scale, 0.5);
		}())
	});


	/*
	 * L.TileLayer is used for standard xyz-numbered tile layers.
	 */

	L.TileLayer = L.Class.extend({
		includes: L.Mixin.Events,

		options: {
			minZoom: 0,
			maxZoom: 18,
			tileSize: 256,
			subdomains: 'abc',
			errorTileUrl: '',
			attribution: '',
			zoomOffset: 0,
			opacity: 1,
			/*
			maxNativeZoom: null,
			zIndex: null,
			tms: false,
			continuousWorld: false,
			noWrap: false,
			zoomReverse: false,
			detectRetina: false,
			reuseTiles: false,
			bounds: false,
			*/
			unloadInvisibleTiles: L.Browser.mobile,
			updateWhenIdle: L.Browser.mobile
		},

		initialize: function (url, options) {
			options = L.setOptions(this, options);

			// detecting retina displays, adjusting tileSize and zoom levels
			if (options.detectRetina && L.Browser.retina && options.maxZoom > 0) {

				options.tileSize = Math.floor(options.tileSize / 2);
				options.zoomOffset++;

				if (options.minZoom > 0) {
					options.minZoom--;
				}
				this.options.maxZoom--;
			}

			if (options.bounds) {
				options.bounds = L.latLngBounds(options.bounds);
			}

			this._url = url;

			var subdomains = this.options.subdomains;

			if (typeof subdomains === 'string') {
				this.options.subdomains = subdomains.split('');
			}
		},

		onAdd: function (map) {
			this._map = map;
			this._animated = map._zoomAnimated;

			// create a container div for tiles
			this._initContainer();

			// set up events
			map.on({
				'viewreset': this._reset,
				'moveend': this._update
			}, this);

			if (this._animated) {
				map.on({
					'zoomanim': this._animateZoom,
					'zoomend': this._endZoomAnim
				}, this);
			}

			if (!this.options.updateWhenIdle) {
				this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this);
				map.on('move', this._limitedUpdate, this);
			}

			this._reset();
			this._update();
		},

		addTo: function (map) {
			map.addLayer(this);
			return this;
		},

		onRemove: function (map) {
			this._container.parentNode.removeChild(this._container);

			map.off({
				'viewreset': this._reset,
				'moveend': this._update
			}, this);

			if (this._animated) {
				map.off({
					'zoomanim': this._animateZoom,
					'zoomend': this._endZoomAnim
				}, this);
			}

			if (!this.options.updateWhenIdle) {
				map.off('move', this._limitedUpdate, this);
			}

			this._container = null;
			this._map = null;
		},

		bringToFront: function () {
			var pane = this._map._panes.tilePane;

			if (this._container) {
				pane.appendChild(this._container);
				this._setAutoZIndex(pane, Math.max);
			}

			return this;
		},

		bringToBack: function () {
			var pane = this._map._panes.tilePane;

			if (this._container) {
				pane.insertBefore(this._container, pane.firstChild);
				this._setAutoZIndex(pane, Math.min);
			}

			return this;
		},

		getAttribution: function () {
			return this.options.attribution;
		},

		getContainer: function () {
			return this._container;
		},

		setOpacity: function (opacity) {
			this.options.opacity = opacity;

			if (this._map) {
				this._updateOpacity();
			}

			return this;
		},

		setZIndex: function (zIndex) {
			this.options.zIndex = zIndex;
			this._updateZIndex();

			return this;
		},

		setUrl: function (url, noRedraw) {
			this._url = url;

			if (!noRedraw) {
				this.redraw();
			}

			return this;
		},

		redraw: function () {
			if (this._map) {
				this._reset({hard: true});
				this._update();
			}
			return this;
		},

		_updateZIndex: function () {
			if (this._container && this.options.zIndex !== undefined) {
				this._container.style.zIndex = this.options.zIndex;
			}
		},

		_setAutoZIndex: function (pane, compare) {

			var layers = pane.children,
			    edgeZIndex = -compare(Infinity, -Infinity), // -Infinity for max, Infinity for min
			    zIndex, i, len;

			for (i = 0, len = layers.length; i < len; i++) {

				if (layers[i] !== this._container) {
					zIndex = parseInt(layers[i].style.zIndex, 10);

					if (!isNaN(zIndex)) {
						edgeZIndex = compare(edgeZIndex, zIndex);
					}
				}
			}

			this.options.zIndex = this._container.style.zIndex =
			        (isFinite(edgeZIndex) ? edgeZIndex : 0) + compare(1, -1);
		},

		_updateOpacity: function () {
			var i,
			    tiles = this._tiles;

			if (L.Browser.ielt9) {
				for (i in tiles) {
					L.DomUtil.setOpacity(tiles[i], this.options.opacity);
				}
			} else {
				L.DomUtil.setOpacity(this._container, this.options.opacity);
			}
		},

		_initContainer: function () {
			var tilePane = this._map._panes.tilePane;

			if (!this._container) {
				this._container = L.DomUtil.create('div', 'leaflet-layer');

				this._updateZIndex();

				if (this._animated) {
					var className = 'leaflet-tile-container';

					this._bgBuffer = L.DomUtil.create('div', className, this._container);
					this._tileContainer = L.DomUtil.create('div', className, this._container);

				} else {
					this._tileContainer = this._container;
				}

				tilePane.appendChild(this._container);

				if (this.options.opacity < 1) {
					this._updateOpacity();
				}
			}
		},

		_reset: function (e) {
			for (var key in this._tiles) {
				this.fire('tileunload', {tile: this._tiles[key]});
			}

			this._tiles = {};
			this._tilesToLoad = 0;

			if (this.options.reuseTiles) {
				this._unusedTiles = [];
			}

			this._tileContainer.innerHTML = '';

			if (this._animated && e && e.hard) {
				this._clearBgBuffer();
			}

			this._initContainer();
		},

		_getTileSize: function () {
			var map = this._map,
			    zoom = map.getZoom() + this.options.zoomOffset,
			    zoomN = this.options.maxNativeZoom,
			    tileSize = this.options.tileSize;

			if (zoomN && zoom > zoomN) {
				tileSize = Math.round(map.getZoomScale(zoom) / map.getZoomScale(zoomN) * tileSize);
			}

			return tileSize;
		},

		_update: function () {

			if (!this._map) { return; }

			var map = this._map,
			    bounds = map.getPixelBounds(),
			    zoom = map.getZoom(),
			    tileSize = this._getTileSize();

			if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
				return;
			}

			var tileBounds = L.bounds(
			        bounds.min.divideBy(tileSize)._floor(),
			        bounds.max.divideBy(tileSize)._floor());

			this._addTilesFromCenterOut(tileBounds);

			if (this.options.unloadInvisibleTiles || this.options.reuseTiles) {
				this._removeOtherTiles(tileBounds);
			}
		},

		_addTilesFromCenterOut: function (bounds) {
			var queue = [],
			    center = bounds.getCenter();

			var j, i, point;

			for (j = bounds.min.y; j <= bounds.max.y; j++) {
				for (i = bounds.min.x; i <= bounds.max.x; i++) {
					point = new L.Point(i, j);

					if (this._tileShouldBeLoaded(point)) {
						queue.push(point);
					}
				}
			}

			var tilesToLoad = queue.length;

			if (tilesToLoad === 0) { return; }

			// load tiles in order of their distance to center
			queue.sort(function (a, b) {
				return a.distanceTo(center) - b.distanceTo(center);
			});

			var fragment = document.createDocumentFragment();

			// if its the first batch of tiles to load
			if (!this._tilesToLoad) {
				this.fire('loading');
			}

			this._tilesToLoad += tilesToLoad;

			for (i = 0; i < tilesToLoad; i++) {
				this._addTile(queue[i], fragment);
			}

			this._tileContainer.appendChild(fragment);
		},

		_tileShouldBeLoaded: function (tilePoint) {
			if ((tilePoint.x + ':' + tilePoint.y) in this._tiles) {
				return false; // already loaded
			}

			var options = this.options;

			if (!options.continuousWorld) {
				var limit = this._getWrapTileNum();

				// don't load if exceeds world bounds
				if ((options.noWrap && (tilePoint.x < 0 || tilePoint.x >= limit.x)) ||
					tilePoint.y < 0 || tilePoint.y >= limit.y) { return false; }
			}

			if (options.bounds) {
				var tileSize = this._getTileSize(),
				    nwPoint = tilePoint.multiplyBy(tileSize),
				    sePoint = nwPoint.add([tileSize, tileSize]),
				    nw = this._map.unproject(nwPoint),
				    se = this._map.unproject(sePoint);

				// TODO temporary hack, will be removed after refactoring projections
				// https://github.com/Leaflet/Leaflet/issues/1618
				if (!options.continuousWorld && !options.noWrap) {
					nw = nw.wrap();
					se = se.wrap();
				}

				if (!options.bounds.intersects([nw, se])) { return false; }
			}

			return true;
		},

		_removeOtherTiles: function (bounds) {
			var kArr, x, y, key;

			for (key in this._tiles) {
				kArr = key.split(':');
				x = parseInt(kArr[0], 10);
				y = parseInt(kArr[1], 10);

				// remove tile if it's out of bounds
				if (x < bounds.min.x || x > bounds.max.x || y < bounds.min.y || y > bounds.max.y) {
					this._removeTile(key);
				}
			}
		},

		_removeTile: function (key) {
			var tile = this._tiles[key];

			this.fire('tileunload', {tile: tile, url: tile.src});

			if (this.options.reuseTiles) {
				L.DomUtil.removeClass(tile, 'leaflet-tile-loaded');
				this._unusedTiles.push(tile);

			} else if (tile.parentNode === this._tileContainer) {
				this._tileContainer.removeChild(tile);
			}

			// for https://github.com/CloudMade/Leaflet/issues/137
			if (!L.Browser.android) {
				tile.onload = null;
				tile.src = L.Util.emptyImageUrl;
			}

			delete this._tiles[key];
		},

		_addTile: function (tilePoint, container) {
			var tilePos = this._getTilePos(tilePoint);

			// get unused tile - or create a new tile
			var tile = this._getTile();

			/*
			Chrome 20 layouts much faster with top/left (verify with timeline, frames)
			Android 4 browser has display issues with top/left and requires transform instead
			(other browsers don't currently care) - see debug/hacks/jitter.html for an example
			*/
			L.DomUtil.setPosition(tile, tilePos, L.Browser.chrome);

			this._tiles[tilePoint.x + ':' + tilePoint.y] = tile;

			this._loadTile(tile, tilePoint);

			if (tile.parentNode !== this._tileContainer) {
				container.appendChild(tile);
			}
		},

		_getZoomForUrl: function () {

			var options = this.options,
			    zoom = this._map.getZoom();

			if (options.zoomReverse) {
				zoom = options.maxZoom - zoom;
			}

			zoom += options.zoomOffset;

			return options.maxNativeZoom ? Math.min(zoom, options.maxNativeZoom) : zoom;
		},

		_getTilePos: function (tilePoint) {
			var origin = this._map.getPixelOrigin(),
			    tileSize = this._getTileSize();

			return tilePoint.multiplyBy(tileSize).subtract(origin);
		},

		// image-specific code (override to implement e.g. Canvas or SVG tile layer)

		getTileUrl: function (tilePoint) {
			return L.Util.template(this._url, L.extend({
				s: this._getSubdomain(tilePoint),
				z: tilePoint.z,
				x: tilePoint.x,
				y: tilePoint.y
			}, this.options));
		},

		_getWrapTileNum: function () {
			var crs = this._map.options.crs,
			    size = crs.getSize(this._map.getZoom());
			return size.divideBy(this._getTileSize())._floor();
		},

		_adjustTilePoint: function (tilePoint) {

			var limit = this._getWrapTileNum();

			// wrap tile coordinates
			if (!this.options.continuousWorld && !this.options.noWrap) {
				tilePoint.x = ((tilePoint.x % limit.x) + limit.x) % limit.x;
			}

			if (this.options.tms) {
				tilePoint.y = limit.y - tilePoint.y - 1;
			}

			tilePoint.z = this._getZoomForUrl();
		},

		_getSubdomain: function (tilePoint) {
			var index = Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
			return this.options.subdomains[index];
		},

		_getTile: function () {
			if (this.options.reuseTiles && this._unusedTiles.length > 0) {
				var tile = this._unusedTiles.pop();
				this._resetTile(tile);
				return tile;
			}
			return this._createTile();
		},

		// Override if data stored on a tile needs to be cleaned up before reuse
		_resetTile: function (/*tile*/) {},

		_createTile: function () {
			var tile = L.DomUtil.create('img', 'leaflet-tile');
			tile.style.width = tile.style.height = this._getTileSize() + 'px';
			tile.galleryimg = 'no';

			tile.onselectstart = tile.onmousemove = L.Util.falseFn;

			if (L.Browser.ielt9 && this.options.opacity !== undefined) {
				L.DomUtil.setOpacity(tile, this.options.opacity);
			}
			// without this hack, tiles disappear after zoom on Chrome for Android
			// https://github.com/Leaflet/Leaflet/issues/2078
			if (L.Browser.mobileWebkit3d) {
				tile.style.WebkitBackfaceVisibility = 'hidden';
			}
			return tile;
		},

		_loadTile: function (tile, tilePoint) {
			tile._layer  = this;
			tile.onload  = this._tileOnLoad;
			tile.onerror = this._tileOnError;

			this._adjustTilePoint(tilePoint);
			tile.src     = this.getTileUrl(tilePoint);

			this.fire('tileloadstart', {
				tile: tile,
				url: tile.src
			});
		},

		_tileLoaded: function () {
			this._tilesToLoad--;

			if (this._animated) {
				L.DomUtil.addClass(this._tileContainer, 'leaflet-zoom-animated');
			}

			if (!this._tilesToLoad) {
				this.fire('load');

				if (this._animated) {
					// clear scaled tiles after all new tiles are loaded (for performance)
					clearTimeout(this._clearBgBufferTimer);
					this._clearBgBufferTimer = setTimeout(L.bind(this._clearBgBuffer, this), 500);
				}
			}
		},

		_tileOnLoad: function () {
			var layer = this._layer;

			//Only if we are loading an actual image
			if (this.src !== L.Util.emptyImageUrl) {
				L.DomUtil.addClass(this, 'leaflet-tile-loaded');

				layer.fire('tileload', {
					tile: this,
					url: this.src
				});
			}

			layer._tileLoaded();
		},

		_tileOnError: function () {
			var layer = this._layer;

			layer.fire('tileerror', {
				tile: this,
				url: this.src
			});

			var newUrl = layer.options.errorTileUrl;
			if (newUrl) {
				this.src = newUrl;
			}

			layer._tileLoaded();
		}
	});

	L.tileLayer = function (url, options) {
		return new L.TileLayer(url, options);
	};


	/*
	 * L.TileLayer.WMS is used for putting WMS tile layers on the map.
	 */

	L.TileLayer.WMS = L.TileLayer.extend({

		defaultWmsParams: {
			service: 'WMS',
			request: 'GetMap',
			version: '1.1.1',
			layers: '',
			styles: '',
			format: 'image/jpeg',
			transparent: false
		},

		initialize: function (url, options) { // (String, Object)

			this._url = url;

			var wmsParams = L.extend({}, this.defaultWmsParams),
			    tileSize = options.tileSize || this.options.tileSize;

			if (options.detectRetina && L.Browser.retina) {
				wmsParams.width = wmsParams.height = tileSize * 2;
			} else {
				wmsParams.width = wmsParams.height = tileSize;
			}

			for (var i in options) {
				// all keys that are not TileLayer options go to WMS params
				if (!this.options.hasOwnProperty(i) && i !== 'crs') {
					wmsParams[i] = options[i];
				}
			}

			this.wmsParams = wmsParams;

			L.setOptions(this, options);
		},

		onAdd: function (map) {

			this._crs = this.options.crs || map.options.crs;

			this._wmsVersion = parseFloat(this.wmsParams.version);

			var projectionKey = this._wmsVersion >= 1.3 ? 'crs' : 'srs';
			this.wmsParams[projectionKey] = this._crs.code;

			L.TileLayer.prototype.onAdd.call(this, map);
		},

		getTileUrl: function (tilePoint) { // (Point, Number) -> String

			var map = this._map,
			    tileSize = this.options.tileSize,

			    nwPoint = tilePoint.multiplyBy(tileSize),
			    sePoint = nwPoint.add([tileSize, tileSize]),

			    nw = this._crs.project(map.unproject(nwPoint, tilePoint.z)),
			    se = this._crs.project(map.unproject(sePoint, tilePoint.z)),
			    bbox = this._wmsVersion >= 1.3 && this._crs === L.CRS.EPSG4326 ?
			        [se.y, nw.x, nw.y, se.x].join(',') :
			        [nw.x, se.y, se.x, nw.y].join(','),

			    url = L.Util.template(this._url, {s: this._getSubdomain(tilePoint)});

			return url + L.Util.getParamString(this.wmsParams, url, true) + '&BBOX=' + bbox;
		},

		setParams: function (params, noRedraw) {

			L.extend(this.wmsParams, params);

			if (!noRedraw) {
				this.redraw();
			}

			return this;
		}
	});

	L.tileLayer.wms = function (url, options) {
		return new L.TileLayer.WMS(url, options);
	};


	/*
	 * L.TileLayer.Canvas is a class that you can use as a base for creating
	 * dynamically drawn Canvas-based tile layers.
	 */

	L.TileLayer.Canvas = L.TileLayer.extend({
		options: {
			async: false
		},

		initialize: function (options) {
			L.setOptions(this, options);
		},

		redraw: function () {
			if (this._map) {
				this._reset({hard: true});
				this._update();
			}

			for (var i in this._tiles) {
				this._redrawTile(this._tiles[i]);
			}
			return this;
		},

		_redrawTile: function (tile) {
			this.drawTile(tile, tile._tilePoint, this._map._zoom);
		},

		_createTile: function () {
			var tile = L.DomUtil.create('canvas', 'leaflet-tile');
			tile.width = tile.height = this.options.tileSize;
			tile.onselectstart = tile.onmousemove = L.Util.falseFn;
			return tile;
		},

		_loadTile: function (tile, tilePoint) {
			tile._layer = this;
			tile._tilePoint = tilePoint;

			this._redrawTile(tile);

			if (!this.options.async) {
				this.tileDrawn(tile);
			}
		},

		drawTile: function (/*tile, tilePoint*/) {
			// override with rendering code
		},

		tileDrawn: function (tile) {
			this._tileOnLoad.call(tile);
		}
	});


	L.tileLayer.canvas = function (options) {
		return new L.TileLayer.Canvas(options);
	};


	/*
	 * L.ImageOverlay is used to overlay images over the map (to specific geographical bounds).
	 */

	L.ImageOverlay = L.Class.extend({
		includes: L.Mixin.Events,

		options: {
			opacity: 1
		},

		initialize: function (url, bounds, options) { // (String, LatLngBounds, Object)
			this._url = url;
			this._bounds = L.latLngBounds(bounds);

			L.setOptions(this, options);
		},

		onAdd: function (map) {
			this._map = map;

			if (!this._image) {
				this._initImage();
			}

			map._panes.overlayPane.appendChild(this._image);

			map.on('viewreset', this._reset, this);

			if (map.options.zoomAnimation && L.Browser.any3d) {
				map.on('zoomanim', this._animateZoom, this);
			}

			this._reset();
		},

		onRemove: function (map) {
			map.getPanes().overlayPane.removeChild(this._image);

			map.off('viewreset', this._reset, this);

			if (map.options.zoomAnimation) {
				map.off('zoomanim', this._animateZoom, this);
			}
		},

		addTo: function (map) {
			map.addLayer(this);
			return this;
		},

		setOpacity: function (opacity) {
			this.options.opacity = opacity;
			this._updateOpacity();
			return this;
		},

		// TODO remove bringToFront/bringToBack duplication from TileLayer/Path
		bringToFront: function () {
			if (this._image) {
				this._map._panes.overlayPane.appendChild(this._image);
			}
			return this;
		},

		bringToBack: function () {
			var pane = this._map._panes.overlayPane;
			if (this._image) {
				pane.insertBefore(this._image, pane.firstChild);
			}
			return this;
		},

		setUrl: function (url) {
			this._url = url;
			this._image.src = this._url;
		},

		getAttribution: function () {
			return this.options.attribution;
		},

		_initImage: function () {
			this._image = L.DomUtil.create('img', 'leaflet-image-layer');

			if (this._map.options.zoomAnimation && L.Browser.any3d) {
				L.DomUtil.addClass(this._image, 'leaflet-zoom-animated');
			} else {
				L.DomUtil.addClass(this._image, 'leaflet-zoom-hide');
			}

			this._updateOpacity();

			//TODO createImage util method to remove duplication
			L.extend(this._image, {
				galleryimg: 'no',
				onselectstart: L.Util.falseFn,
				onmousemove: L.Util.falseFn,
				onload: L.bind(this._onImageLoad, this),
				src: this._url
			});
		},

		_animateZoom: function (e) {
			var map = this._map,
			    image = this._image,
			    scale = map.getZoomScale(e.zoom),
			    nw = this._bounds.getNorthWest(),
			    se = this._bounds.getSouthEast(),

			    topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center),
			    size = map._latLngToNewLayerPoint(se, e.zoom, e.center)._subtract(topLeft),
			    origin = topLeft._add(size._multiplyBy((1 / 2) * (1 - 1 / scale)));

			image.style[L.DomUtil.TRANSFORM] =
			        L.DomUtil.getTranslateString(origin) + ' scale(' + scale + ') ';
		},

		_reset: function () {
			var image   = this._image,
			    topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
			    size = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft);

			L.DomUtil.setPosition(image, topLeft);

			image.style.width  = size.x + 'px';
			image.style.height = size.y + 'px';
		},

		_onImageLoad: function () {
			this.fire('load');
		},

		_updateOpacity: function () {
			L.DomUtil.setOpacity(this._image, this.options.opacity);
		}
	});

	L.imageOverlay = function (url, bounds, options) {
		return new L.ImageOverlay(url, bounds, options);
	};


	/*
	 * L.Icon is an image-based icon class that you can use with L.Marker for custom markers.
	 */

	L.Icon = L.Class.extend({
		options: {
			/*
			iconUrl: (String) (required)
			iconRetinaUrl: (String) (optional, used for retina devices if detected)
			iconSize: (Point) (can be set through CSS)
			iconAnchor: (Point) (centered by default, can be set in CSS with negative margins)
			popupAnchor: (Point) (if not specified, popup opens in the anchor point)
			shadowUrl: (String) (no shadow by default)
			shadowRetinaUrl: (String) (optional, used for retina devices if detected)
			shadowSize: (Point)
			shadowAnchor: (Point)
			*/
			className: ''
		},

		initialize: function (options) {
			L.setOptions(this, options);
		},

		createIcon: function (oldIcon) {
			return this._createIcon('icon', oldIcon);
		},

		createShadow: function (oldIcon) {
			return this._createIcon('shadow', oldIcon);
		},

		_createIcon: function (name, oldIcon) {
			var src = this._getIconUrl(name);

			if (!src) {
				if (name === 'icon') {
					throw new Error('iconUrl not set in Icon options (see the docs).');
				}
				return null;
			}

			var img;
			if (!oldIcon || oldIcon.tagName !== 'IMG') {
				img = this._createImg(src);
			} else {
				img = this._createImg(src, oldIcon);
			}
			this._setIconStyles(img, name);

			return img;
		},

		_setIconStyles: function (img, name) {
			var options = this.options,
			    size = L.point(options[name + 'Size']),
			    anchor;

			if (name === 'shadow') {
				anchor = L.point(options.shadowAnchor || options.iconAnchor);
			} else {
				anchor = L.point(options.iconAnchor);
			}

			if (!anchor && size) {
				anchor = size.divideBy(2, true);
			}

			img.className = 'leaflet-marker-' + name + ' ' + options.className;

			if (anchor) {
				img.style.marginLeft = (-anchor.x) + 'px';
				img.style.marginTop  = (-anchor.y) + 'px';
			}

			if (size) {
				img.style.width  = size.x + 'px';
				img.style.height = size.y + 'px';
			}
		},

		_createImg: function (src, el) {
			el = el || document.createElement('img');
			el.src = src;
			return el;
		},

		_getIconUrl: function (name) {
			if (L.Browser.retina && this.options[name + 'RetinaUrl']) {
				return this.options[name + 'RetinaUrl'];
			}
			return this.options[name + 'Url'];
		}
	});

	L.icon = function (options) {
		return new L.Icon(options);
	};


	/*
	 * L.Icon.Default is the blue marker icon used by default in Leaflet.
	 */

	L.Icon.Default = L.Icon.extend({

		options: {
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],

			shadowSize: [41, 41]
		},

		_getIconUrl: function (name) {
			var key = name + 'Url';

			if (this.options[key]) {
				return this.options[key];
			}

			if (L.Browser.retina && name === 'icon') {
				name += '-2x';
			}

			var path = L.Icon.Default.imagePath;

			if (!path) {
				throw new Error('Couldn\'t autodetect L.Icon.Default.imagePath, set it manually.');
			}

			return path + '/marker-' + name + '.png';
		}
	});

	L.Icon.Default.imagePath = (function () {
		var scripts = document.getElementsByTagName('script'),
		    leafletRe = /[\/^]leaflet[\-\._]?([\w\-\._]*)\.js\??/;

		var i, len, src, matches, path;

		for (i = 0, len = scripts.length; i < len; i++) {
			src = scripts[i].src;
			matches = src.match(leafletRe);

			if (matches) {
				path = src.split(leafletRe)[0];
				return (path ? path + '/' : '') + 'images';
			}
		}
	}());


	/*
	 * L.Marker is used to display clickable/draggable icons on the map.
	 */

	L.Marker = L.Class.extend({

		includes: L.Mixin.Events,

		options: {
			icon: new L.Icon.Default(),
			title: '',
			alt: '',
			clickable: true,
			draggable: false,
			keyboard: true,
			zIndexOffset: 0,
			opacity: 1,
			riseOnHover: false,
			riseOffset: 250
		},

		initialize: function (latlng, options) {
			L.setOptions(this, options);
			this._latlng = L.latLng(latlng);
		},

		onAdd: function (map) {
			this._map = map;

			map.on('viewreset', this.update, this);

			this._initIcon();
			this.update();
			this.fire('add');

			if (map.options.zoomAnimation && map.options.markerZoomAnimation) {
				map.on('zoomanim', this._animateZoom, this);
			}
		},

		addTo: function (map) {
			map.addLayer(this);
			return this;
		},

		onRemove: function (map) {
			if (this.dragging) {
				this.dragging.disable();
			}

			this._removeIcon();
			this._removeShadow();

			this.fire('remove');

			map.off({
				'viewreset': this.update,
				'zoomanim': this._animateZoom
			}, this);

			this._map = null;
		},

		getLatLng: function () {
			return this._latlng;
		},

		setLatLng: function (latlng) {
			this._latlng = L.latLng(latlng);

			this.update();

			return this.fire('move', { latlng: this._latlng });
		},

		setZIndexOffset: function (offset) {
			this.options.zIndexOffset = offset;
			this.update();

			return this;
		},

		setIcon: function (icon) {

			this.options.icon = icon;

			if (this._map) {
				this._initIcon();
				this.update();
			}

			if (this._popup) {
				this.bindPopup(this._popup);
			}

			return this;
		},

		update: function () {
			if (this._icon) {
				this._setPos(this._map.latLngToLayerPoint(this._latlng).round());
			}
			return this;
		},

		_initIcon: function () {
			var options = this.options,
			    map = this._map,
			    animation = (map.options.zoomAnimation && map.options.markerZoomAnimation),
			    classToAdd = animation ? 'leaflet-zoom-animated' : 'leaflet-zoom-hide';

			var icon = options.icon.createIcon(this._icon),
				addIcon = false;

			// if we're not reusing the icon, remove the old one and init new one
			if (icon !== this._icon) {
				if (this._icon) {
					this._removeIcon();
				}
				addIcon = true;

				if (options.title) {
					icon.title = options.title;
				}

				if (options.alt) {
					icon.alt = options.alt;
				}
			}

			L.DomUtil.addClass(icon, classToAdd);

			if (options.keyboard) {
				icon.tabIndex = '0';
			}

			this._icon = icon;

			this._initInteraction();

			if (options.riseOnHover) {
				L.DomEvent
					.on(icon, 'mouseover', this._bringToFront, this)
					.on(icon, 'mouseout', this._resetZIndex, this);
			}

			var newShadow = options.icon.createShadow(this._shadow),
				addShadow = false;

			if (newShadow !== this._shadow) {
				this._removeShadow();
				addShadow = true;
			}

			if (newShadow) {
				L.DomUtil.addClass(newShadow, classToAdd);
			}
			this._shadow = newShadow;


			if (options.opacity < 1) {
				this._updateOpacity();
			}


			var panes = this._map._panes;

			if (addIcon) {
				panes.markerPane.appendChild(this._icon);
			}

			if (newShadow && addShadow) {
				panes.shadowPane.appendChild(this._shadow);
			}
		},

		_removeIcon: function () {
			if (this.options.riseOnHover) {
				L.DomEvent
				    .off(this._icon, 'mouseover', this._bringToFront)
				    .off(this._icon, 'mouseout', this._resetZIndex);
			}

			this._map._panes.markerPane.removeChild(this._icon);

			this._icon = null;
		},

		_removeShadow: function () {
			if (this._shadow) {
				this._map._panes.shadowPane.removeChild(this._shadow);
			}
			this._shadow = null;
		},

		_setPos: function (pos) {
			L.DomUtil.setPosition(this._icon, pos);

			if (this._shadow) {
				L.DomUtil.setPosition(this._shadow, pos);
			}

			this._zIndex = pos.y + this.options.zIndexOffset;

			this._resetZIndex();
		},

		_updateZIndex: function (offset) {
			this._icon.style.zIndex = this._zIndex + offset;
		},

		_animateZoom: function (opt) {
			var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();

			this._setPos(pos);
		},

		_initInteraction: function () {

			if (!this.options.clickable) { return; }

			// TODO refactor into something shared with Map/Path/etc. to DRY it up

			var icon = this._icon,
			    events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu'];

			L.DomUtil.addClass(icon, 'leaflet-clickable');
			L.DomEvent.on(icon, 'click', this._onMouseClick, this);
			L.DomEvent.on(icon, 'keypress', this._onKeyPress, this);

			for (var i = 0; i < events.length; i++) {
				L.DomEvent.on(icon, events[i], this._fireMouseEvent, this);
			}

			if (L.Handler.MarkerDrag) {
				this.dragging = new L.Handler.MarkerDrag(this);

				if (this.options.draggable) {
					this.dragging.enable();
				}
			}
		},

		_onMouseClick: function (e) {
			var wasDragged = this.dragging && this.dragging.moved();

			if (this.hasEventListeners(e.type) || wasDragged) {
				L.DomEvent.stopPropagation(e);
			}

			if (wasDragged) { return; }

			if ((!this.dragging || !this.dragging._enabled) && this._map.dragging && this._map.dragging.moved()) { return; }

			this.fire(e.type, {
				originalEvent: e,
				latlng: this._latlng
			});
		},

		_onKeyPress: function (e) {
			if (e.keyCode === 13) {
				this.fire('click', {
					originalEvent: e,
					latlng: this._latlng
				});
			}
		},

		_fireMouseEvent: function (e) {

			this.fire(e.type, {
				originalEvent: e,
				latlng: this._latlng
			});

			// TODO proper custom event propagation
			// this line will always be called if marker is in a FeatureGroup
			if (e.type === 'contextmenu' && this.hasEventListeners(e.type)) {
				L.DomEvent.preventDefault(e);
			}
			if (e.type !== 'mousedown') {
				L.DomEvent.stopPropagation(e);
			} else {
				L.DomEvent.preventDefault(e);
			}
		},

		setOpacity: function (opacity) {
			this.options.opacity = opacity;
			if (this._map) {
				this._updateOpacity();
			}

			return this;
		},

		_updateOpacity: function () {
			L.DomUtil.setOpacity(this._icon, this.options.opacity);
			if (this._shadow) {
				L.DomUtil.setOpacity(this._shadow, this.options.opacity);
			}
		},

		_bringToFront: function () {
			this._updateZIndex(this.options.riseOffset);
		},

		_resetZIndex: function () {
			this._updateZIndex(0);
		}
	});

	L.marker = function (latlng, options) {
		return new L.Marker(latlng, options);
	};


	/*
	 * L.DivIcon is a lightweight HTML-based icon class (as opposed to the image-based L.Icon)
	 * to use with L.Marker.
	 */

	L.DivIcon = L.Icon.extend({
		options: {
			iconSize: [12, 12], // also can be set through CSS
			/*
			iconAnchor: (Point)
			popupAnchor: (Point)
			html: (String)
			bgPos: (Point)
			*/
			className: 'leaflet-div-icon',
			html: false
		},

		createIcon: function (oldIcon) {
			var div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
			    options = this.options;

			if (options.html !== false) {
				div.innerHTML = options.html;
			} else {
				div.innerHTML = '';
			}

			if (options.bgPos) {
				div.style.backgroundPosition =
				        (-options.bgPos.x) + 'px ' + (-options.bgPos.y) + 'px';
			}

			this._setIconStyles(div, 'icon');
			return div;
		},

		createShadow: function () {
			return null;
		}
	});

	L.divIcon = function (options) {
		return new L.DivIcon(options);
	};


	/*
	 * L.Popup is used for displaying popups on the map.
	 */

	L.Map.mergeOptions({
		closePopupOnClick: true
	});

	L.Popup = L.Class.extend({
		includes: L.Mixin.Events,

		options: {
			minWidth: 50,
			maxWidth: 300,
			// maxHeight: null,
			autoPan: true,
			closeButton: true,
			offset: [0, 7],
			autoPanPadding: [5, 5],
			// autoPanPaddingTopLeft: null,
			// autoPanPaddingBottomRight: null,
			keepInView: false,
			className: '',
			zoomAnimation: true
		},

		initialize: function (options, source) {
			L.setOptions(this, options);

			this._source = source;
			this._animated = L.Browser.any3d && this.options.zoomAnimation;
			this._isOpen = false;
		},

		onAdd: function (map) {
			this._map = map;

			if (!this._container) {
				this._initLayout();
			}

			var animFade = map.options.fadeAnimation;

			if (animFade) {
				L.DomUtil.setOpacity(this._container, 0);
			}
			map._panes.popupPane.appendChild(this._container);

			map.on(this._getEvents(), this);

			this.update();

			if (animFade) {
				L.DomUtil.setOpacity(this._container, 1);
			}

			this.fire('open');

			map.fire('popupopen', {popup: this});

			if (this._source) {
				this._source.fire('popupopen', {popup: this});
			}
		},

		addTo: function (map) {
			map.addLayer(this);
			return this;
		},

		openOn: function (map) {
			map.openPopup(this);
			return this;
		},

		onRemove: function (map) {
			map._panes.popupPane.removeChild(this._container);

			L.Util.falseFn(this._container.offsetWidth); // force reflow

			map.off(this._getEvents(), this);

			if (map.options.fadeAnimation) {
				L.DomUtil.setOpacity(this._container, 0);
			}

			this._map = null;

			this.fire('close');

			map.fire('popupclose', {popup: this});

			if (this._source) {
				this._source.fire('popupclose', {popup: this});
			}
		},

		getLatLng: function () {
			return this._latlng;
		},

		setLatLng: function (latlng) {
			this._latlng = L.latLng(latlng);
			if (this._map) {
				this._updatePosition();
				this._adjustPan();
			}
			return this;
		},

		getContent: function () {
			return this._content;
		},

		setContent: function (content) {
			this._content = content;
			this.update();
			return this;
		},

		update: function () {
			if (!this._map) { return; }

			this._container.style.visibility = 'hidden';

			this._updateContent();
			this._updateLayout();
			this._updatePosition();

			this._container.style.visibility = '';

			this._adjustPan();
		},

		_getEvents: function () {
			var events = {
				viewreset: this._updatePosition
			};

			if (this._animated) {
				events.zoomanim = this._zoomAnimation;
			}
			if ('closeOnClick' in this.options ? this.options.closeOnClick : this._map.options.closePopupOnClick) {
				events.preclick = this._close;
			}
			if (this.options.keepInView) {
				events.moveend = this._adjustPan;
			}

			return events;
		},

		_close: function () {
			if (this._map) {
				this._map.closePopup(this);
			}
		},

		_initLayout: function () {
			var prefix = 'leaflet-popup',
				containerClass = prefix + ' ' + this.options.className + ' leaflet-zoom-' +
				        (this._animated ? 'animated' : 'hide'),
				container = this._container = L.DomUtil.create('div', containerClass),
				closeButton;

			if (this.options.closeButton) {
				closeButton = this._closeButton =
				        L.DomUtil.create('a', prefix + '-close-button', container);
				closeButton.href = '#close';
				closeButton.innerHTML = '&#215;';
				L.DomEvent.disableClickPropagation(closeButton);

				L.DomEvent.on(closeButton, 'click', this._onCloseButtonClick, this);
			}

			var wrapper = this._wrapper =
			        L.DomUtil.create('div', prefix + '-content-wrapper', container);
			L.DomEvent.disableClickPropagation(wrapper);

			this._contentNode = L.DomUtil.create('div', prefix + '-content', wrapper);

			L.DomEvent.disableScrollPropagation(this._contentNode);
			L.DomEvent.on(wrapper, 'contextmenu', L.DomEvent.stopPropagation);

			this._tipContainer = L.DomUtil.create('div', prefix + '-tip-container', container);
			this._tip = L.DomUtil.create('div', prefix + '-tip', this._tipContainer);
		},

		_updateContent: function () {
			if (!this._content) { return; }

			if (typeof this._content === 'string') {
				this._contentNode.innerHTML = this._content;
			} else {
				while (this._contentNode.hasChildNodes()) {
					this._contentNode.removeChild(this._contentNode.firstChild);
				}
				this._contentNode.appendChild(this._content);
			}
			this.fire('contentupdate');
		},

		_updateLayout: function () {
			var container = this._contentNode,
			    style = container.style;

			style.width = '';
			style.whiteSpace = 'nowrap';

			var width = container.offsetWidth;
			width = Math.min(width, this.options.maxWidth);
			width = Math.max(width, this.options.minWidth);

			style.width = (width + 1) + 'px';
			style.whiteSpace = '';

			style.height = '';

			var height = container.offsetHeight,
			    maxHeight = this.options.maxHeight,
			    scrolledClass = 'leaflet-popup-scrolled';

			if (maxHeight && height > maxHeight) {
				style.height = maxHeight + 'px';
				L.DomUtil.addClass(container, scrolledClass);
			} else {
				L.DomUtil.removeClass(container, scrolledClass);
			}

			this._containerWidth = this._container.offsetWidth;
		},

		_updatePosition: function () {
			if (!this._map) { return; }

			var pos = this._map.latLngToLayerPoint(this._latlng),
			    animated = this._animated,
			    offset = L.point(this.options.offset);

			if (animated) {
				L.DomUtil.setPosition(this._container, pos);
			}

			this._containerBottom = -offset.y - (animated ? 0 : pos.y);
			this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x + (animated ? 0 : pos.x);

			// bottom position the popup in case the height of the popup changes (images loading etc)
			this._container.style.bottom = this._containerBottom + 'px';
			this._container.style.left = this._containerLeft + 'px';
		},

		_zoomAnimation: function (opt) {
			var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center);

			L.DomUtil.setPosition(this._container, pos);
		},

		_adjustPan: function () {
			if (!this.options.autoPan) { return; }

			var map = this._map,
			    containerHeight = this._container.offsetHeight,
			    containerWidth = this._containerWidth,

			    layerPos = new L.Point(this._containerLeft, -containerHeight - this._containerBottom);

			if (this._animated) {
				layerPos._add(L.DomUtil.getPosition(this._container));
			}

			var containerPos = map.layerPointToContainerPoint(layerPos),
			    padding = L.point(this.options.autoPanPadding),
			    paddingTL = L.point(this.options.autoPanPaddingTopLeft || padding),
			    paddingBR = L.point(this.options.autoPanPaddingBottomRight || padding),
			    size = map.getSize(),
			    dx = 0,
			    dy = 0;

			if (containerPos.x + containerWidth + paddingBR.x > size.x) { // right
				dx = containerPos.x + containerWidth - size.x + paddingBR.x;
			}
			if (containerPos.x - dx - paddingTL.x < 0) { // left
				dx = containerPos.x - paddingTL.x;
			}
			if (containerPos.y + containerHeight + paddingBR.y > size.y) { // bottom
				dy = containerPos.y + containerHeight - size.y + paddingBR.y;
			}
			if (containerPos.y - dy - paddingTL.y < 0) { // top
				dy = containerPos.y - paddingTL.y;
			}

			if (dx || dy) {
				map
				    .fire('autopanstart')
				    .panBy([dx, dy]);
			}
		},

		_onCloseButtonClick: function (e) {
			this._close();
			L.DomEvent.stop(e);
		}
	});

	L.popup = function (options, source) {
		return new L.Popup(options, source);
	};


	L.Map.include({
		openPopup: function (popup, latlng, options) { // (Popup) or (String || HTMLElement, LatLng[, Object])
			this.closePopup();

			if (!(popup instanceof L.Popup)) {
				var content = popup;

				popup = new L.Popup(options)
				    .setLatLng(latlng)
				    .setContent(content);
			}
			popup._isOpen = true;

			this._popup = popup;
			return this.addLayer(popup);
		},

		closePopup: function (popup) {
			if (!popup || popup === this._popup) {
				popup = this._popup;
				this._popup = null;
			}
			if (popup) {
				this.removeLayer(popup);
				popup._isOpen = false;
			}
			return this;
		}
	});


	/*
	 * Popup extension to L.Marker, adding popup-related methods.
	 */

	L.Marker.include({
		openPopup: function () {
			if (this._popup && this._map && !this._map.hasLayer(this._popup)) {
				this._popup.setLatLng(this._latlng);
				this._map.openPopup(this._popup);
			}

			return this;
		},

		closePopup: function () {
			if (this._popup) {
				this._popup._close();
			}
			return this;
		},

		togglePopup: function () {
			if (this._popup) {
				if (this._popup._isOpen) {
					this.closePopup();
				} else {
					this.openPopup();
				}
			}
			return this;
		},

		bindPopup: function (content, options) {
			var anchor = L.point(this.options.icon.options.popupAnchor || [0, 0]);

			anchor = anchor.add(L.Popup.prototype.options.offset);

			if (options && options.offset) {
				anchor = anchor.add(options.offset);
			}

			options = L.extend({offset: anchor}, options);

			if (!this._popupHandlersAdded) {
				this
				    .on('click', this.togglePopup, this)
				    .on('remove', this.closePopup, this)
				    .on('move', this._movePopup, this);
				this._popupHandlersAdded = true;
			}

			if (content instanceof L.Popup) {
				L.setOptions(content, options);
				this._popup = content;
				content._source = this;
			} else {
				this._popup = new L.Popup(options, this)
					.setContent(content);
			}

			return this;
		},

		setPopupContent: function (content) {
			if (this._popup) {
				this._popup.setContent(content);
			}
			return this;
		},

		unbindPopup: function () {
			if (this._popup) {
				this._popup = null;
				this
				    .off('click', this.togglePopup, this)
				    .off('remove', this.closePopup, this)
				    .off('move', this._movePopup, this);
				this._popupHandlersAdded = false;
			}
			return this;
		},

		getPopup: function () {
			return this._popup;
		},

		_movePopup: function (e) {
			this._popup.setLatLng(e.latlng);
		}
	});


	/*
	 * L.LayerGroup is a class to combine several layers into one so that
	 * you can manipulate the group (e.g. add/remove it) as one layer.
	 */

	L.LayerGroup = L.Class.extend({
		initialize: function (layers) {
			this._layers = {};

			var i, len;

			if (layers) {
				for (i = 0, len = layers.length; i < len; i++) {
					this.addLayer(layers[i]);
				}
			}
		},

		addLayer: function (layer) {
			var id = this.getLayerId(layer);

			this._layers[id] = layer;

			if (this._map) {
				this._map.addLayer(layer);
			}

			return this;
		},

		removeLayer: function (layer) {
			var id = layer in this._layers ? layer : this.getLayerId(layer);

			if (this._map && this._layers[id]) {
				this._map.removeLayer(this._layers[id]);
			}

			delete this._layers[id];

			return this;
		},

		hasLayer: function (layer) {
			if (!layer) { return false; }

			return (layer in this._layers || this.getLayerId(layer) in this._layers);
		},

		clearLayers: function () {
			this.eachLayer(this.removeLayer, this);
			return this;
		},

		invoke: function (methodName) {
			var args = Array.prototype.slice.call(arguments, 1),
			    i, layer;

			for (i in this._layers) {
				layer = this._layers[i];

				if (layer[methodName]) {
					layer[methodName].apply(layer, args);
				}
			}

			return this;
		},

		onAdd: function (map) {
			this._map = map;
			this.eachLayer(map.addLayer, map);
		},

		onRemove: function (map) {
			this.eachLayer(map.removeLayer, map);
			this._map = null;
		},

		addTo: function (map) {
			map.addLayer(this);
			return this;
		},

		eachLayer: function (method, context) {
			for (var i in this._layers) {
				method.call(context, this._layers[i]);
			}
			return this;
		},

		getLayer: function (id) {
			return this._layers[id];
		},

		getLayers: function () {
			var layers = [];

			for (var i in this._layers) {
				layers.push(this._layers[i]);
			}
			return layers;
		},

		setZIndex: function (zIndex) {
			return this.invoke('setZIndex', zIndex);
		},

		getLayerId: function (layer) {
			return L.stamp(layer);
		}
	});

	L.layerGroup = function (layers) {
		return new L.LayerGroup(layers);
	};


	/*
	 * L.FeatureGroup extends L.LayerGroup by introducing mouse events and additional methods
	 * shared between a group of interactive layers (like vectors or markers).
	 */

	L.FeatureGroup = L.LayerGroup.extend({
		includes: L.Mixin.Events,

		statics: {
			EVENTS: 'click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose'
		},

		addLayer: function (layer) {
			if (this.hasLayer(layer)) {
				return this;
			}

			if ('on' in layer) {
				layer.on(L.FeatureGroup.EVENTS, this._propagateEvent, this);
			}

			L.LayerGroup.prototype.addLayer.call(this, layer);

			if (this._popupContent && layer.bindPopup) {
				layer.bindPopup(this._popupContent, this._popupOptions);
			}

			return this.fire('layeradd', {layer: layer});
		},

		removeLayer: function (layer) {
			if (!this.hasLayer(layer)) {
				return this;
			}
			if (layer in this._layers) {
				layer = this._layers[layer];
			}

			if ('off' in layer) {
				layer.off(L.FeatureGroup.EVENTS, this._propagateEvent, this);
			}

			L.LayerGroup.prototype.removeLayer.call(this, layer);

			if (this._popupContent) {
				this.invoke('unbindPopup');
			}

			return this.fire('layerremove', {layer: layer});
		},

		bindPopup: function (content, options) {
			this._popupContent = content;
			this._popupOptions = options;
			return this.invoke('bindPopup', content, options);
		},

		openPopup: function (latlng) {
			// open popup on the first layer
			for (var id in this._layers) {
				this._layers[id].openPopup(latlng);
				break;
			}
			return this;
		},

		setStyle: function (style) {
			return this.invoke('setStyle', style);
		},

		bringToFront: function () {
			return this.invoke('bringToFront');
		},

		bringToBack: function () {
			return this.invoke('bringToBack');
		},

		getBounds: function () {
			var bounds = new L.LatLngBounds();

			this.eachLayer(function (layer) {
				bounds.extend(layer instanceof L.Marker ? layer.getLatLng() : layer.getBounds());
			});

			return bounds;
		},

		_propagateEvent: function (e) {
			e = L.extend({
				layer: e.target,
				target: this
			}, e);
			this.fire(e.type, e);
		}
	});

	L.featureGroup = function (layers) {
		return new L.FeatureGroup(layers);
	};


	/*
	 * L.Path is a base class for rendering vector paths on a map. Inherited by Polyline, Circle, etc.
	 */

	L.Path = L.Class.extend({
		includes: [L.Mixin.Events],

		statics: {
			// how much to extend the clip area around the map view
			// (relative to its size, e.g. 0.5 is half the screen in each direction)
			// set it so that SVG element doesn't exceed 1280px (vectors flicker on dragend if it is)
			CLIP_PADDING: (function () {
				var max = L.Browser.mobile ? 1280 : 2000,
				    target = (max / Math.max(window.outerWidth, window.outerHeight) - 1) / 2;
				return Math.max(0, Math.min(0.5, target));
			})()
		},

		options: {
			stroke: true,
			color: '#0033ff',
			dashArray: null,
			lineCap: null,
			lineJoin: null,
			weight: 5,
			opacity: 0.5,

			fill: false,
			fillColor: null, //same as color by default
			fillOpacity: 0.2,

			clickable: true
		},

		initialize: function (options) {
			L.setOptions(this, options);
		},

		onAdd: function (map) {
			this._map = map;

			if (!this._container) {
				this._initElements();
				this._initEvents();
			}

			this.projectLatlngs();
			this._updatePath();

			if (this._container) {
				this._map._pathRoot.appendChild(this._container);
			}

			this.fire('add');

			map.on({
				'viewreset': this.projectLatlngs,
				'moveend': this._updatePath
			}, this);
		},

		addTo: function (map) {
			map.addLayer(this);
			return this;
		},

		onRemove: function (map) {
			map._pathRoot.removeChild(this._container);

			// Need to fire remove event before we set _map to null as the event hooks might need the object
			this.fire('remove');
			this._map = null;

			if (L.Browser.vml) {
				this._container = null;
				this._stroke = null;
				this._fill = null;
			}

			map.off({
				'viewreset': this.projectLatlngs,
				'moveend': this._updatePath
			}, this);
		},

		projectLatlngs: function () {
			// do all projection stuff here
		},

		setStyle: function (style) {
			L.setOptions(this, style);

			if (this._container) {
				this._updateStyle();
			}

			return this;
		},

		redraw: function () {
			if (this._map) {
				this.projectLatlngs();
				this._updatePath();
			}
			return this;
		}
	});

	L.Map.include({
		_updatePathViewport: function () {
			var p = L.Path.CLIP_PADDING,
			    size = this.getSize(),
			    panePos = L.DomUtil.getPosition(this._mapPane),
			    min = panePos.multiplyBy(-1)._subtract(size.multiplyBy(p)._round()),
			    max = min.add(size.multiplyBy(1 + p * 2)._round());

			this._pathViewport = new L.Bounds(min, max);
		}
	});


	/*
	 * Extends L.Path with SVG-specific rendering code.
	 */

	L.Path.SVG_NS = 'http://www.w3.org/2000/svg';

	L.Browser.svg = !!(document.createElementNS && document.createElementNS(L.Path.SVG_NS, 'svg').createSVGRect);

	L.Path = L.Path.extend({
		statics: {
			SVG: L.Browser.svg
		},

		bringToFront: function () {
			var root = this._map._pathRoot,
			    path = this._container;

			if (path && root.lastChild !== path) {
				root.appendChild(path);
			}
			return this;
		},

		bringToBack: function () {
			var root = this._map._pathRoot,
			    path = this._container,
			    first = root.firstChild;

			if (path && first !== path) {
				root.insertBefore(path, first);
			}
			return this;
		},

		getPathString: function () {
			// form path string here
		},

		_createElement: function (name) {
			return document.createElementNS(L.Path.SVG_NS, name);
		},

		_initElements: function () {
			this._map._initPathRoot();
			this._initPath();
			this._initStyle();
		},

		_initPath: function () {
			this._container = this._createElement('g');

			this._path = this._createElement('path');

			if (this.options.className) {
				L.DomUtil.addClass(this._path, this.options.className);
			}

			this._container.appendChild(this._path);
		},

		_initStyle: function () {
			if (this.options.stroke) {
				this._path.setAttribute('stroke-linejoin', 'round');
				this._path.setAttribute('stroke-linecap', 'round');
			}
			if (this.options.fill) {
				this._path.setAttribute('fill-rule', 'evenodd');
			}
			if (this.options.pointerEvents) {
				this._path.setAttribute('pointer-events', this.options.pointerEvents);
			}
			if (!this.options.clickable && !this.options.pointerEvents) {
				this._path.setAttribute('pointer-events', 'none');
			}
			this._updateStyle();
		},

		_updateStyle: function () {
			if (this.options.stroke) {
				this._path.setAttribute('stroke', this.options.color);
				this._path.setAttribute('stroke-opacity', this.options.opacity);
				this._path.setAttribute('stroke-width', this.options.weight);
				if (this.options.dashArray) {
					this._path.setAttribute('stroke-dasharray', this.options.dashArray);
				} else {
					this._path.removeAttribute('stroke-dasharray');
				}
				if (this.options.lineCap) {
					this._path.setAttribute('stroke-linecap', this.options.lineCap);
				}
				if (this.options.lineJoin) {
					this._path.setAttribute('stroke-linejoin', this.options.lineJoin);
				}
			} else {
				this._path.setAttribute('stroke', 'none');
			}
			if (this.options.fill) {
				this._path.setAttribute('fill', this.options.fillColor || this.options.color);
				this._path.setAttribute('fill-opacity', this.options.fillOpacity);
			} else {
				this._path.setAttribute('fill', 'none');
			}
		},

		_updatePath: function () {
			var str = this.getPathString();
			if (!str) {
				// fix webkit empty string parsing bug
				str = 'M0 0';
			}
			this._path.setAttribute('d', str);
		},

		// TODO remove duplication with L.Map
		_initEvents: function () {
			if (this.options.clickable) {
				if (L.Browser.svg || !L.Browser.vml) {
					L.DomUtil.addClass(this._path, 'leaflet-clickable');
				}

				L.DomEvent.on(this._container, 'click', this._onMouseClick, this);

				var events = ['dblclick', 'mousedown', 'mouseover',
				              'mouseout', 'mousemove', 'contextmenu'];
				for (var i = 0; i < events.length; i++) {
					L.DomEvent.on(this._container, events[i], this._fireMouseEvent, this);
				}
			}
		},

		_onMouseClick: function (e) {
			if (this._map.dragging && this._map.dragging.moved()) { return; }

			this._fireMouseEvent(e);
		},

		_fireMouseEvent: function (e) {
			if (!this._map || !this.hasEventListeners(e.type)) { return; }

			var map = this._map,
			    containerPoint = map.mouseEventToContainerPoint(e),
			    layerPoint = map.containerPointToLayerPoint(containerPoint),
			    latlng = map.layerPointToLatLng(layerPoint);

			this.fire(e.type, {
				latlng: latlng,
				layerPoint: layerPoint,
				containerPoint: containerPoint,
				originalEvent: e
			});

			if (e.type === 'contextmenu') {
				L.DomEvent.preventDefault(e);
			}
			if (e.type !== 'mousemove') {
				L.DomEvent.stopPropagation(e);
			}
		}
	});

	L.Map.include({
		_initPathRoot: function () {
			if (!this._pathRoot) {
				this._pathRoot = L.Path.prototype._createElement('svg');
				this._panes.overlayPane.appendChild(this._pathRoot);

				if (this.options.zoomAnimation && L.Browser.any3d) {
					L.DomUtil.addClass(this._pathRoot, 'leaflet-zoom-animated');

					this.on({
						'zoomanim': this._animatePathZoom,
						'zoomend': this._endPathZoom
					});
				} else {
					L.DomUtil.addClass(this._pathRoot, 'leaflet-zoom-hide');
				}

				this.on('moveend', this._updateSvgViewport);
				this._updateSvgViewport();
			}
		},

		_animatePathZoom: function (e) {
			var scale = this.getZoomScale(e.zoom),
			    offset = this._getCenterOffset(e.center)._multiplyBy(-scale)._add(this._pathViewport.min);

			this._pathRoot.style[L.DomUtil.TRANSFORM] =
			        L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ') ';

			this._pathZooming = true;
		},

		_endPathZoom: function () {
			this._pathZooming = false;
		},

		_updateSvgViewport: function () {

			if (this._pathZooming) {
				// Do not update SVGs while a zoom animation is going on otherwise the animation will break.
				// When the zoom animation ends we will be updated again anyway
				// This fixes the case where you do a momentum move and zoom while the move is still ongoing.
				return;
			}

			this._updatePathViewport();

			var vp = this._pathViewport,
			    min = vp.min,
			    max = vp.max,
			    width = max.x - min.x,
			    height = max.y - min.y,
			    root = this._pathRoot,
			    pane = this._panes.overlayPane;

			// Hack to make flicker on drag end on mobile webkit less irritating
			if (L.Browser.mobileWebkit) {
				pane.removeChild(root);
			}

			L.DomUtil.setPosition(root, min);
			root.setAttribute('width', width);
			root.setAttribute('height', height);
			root.setAttribute('viewBox', [min.x, min.y, width, height].join(' '));

			if (L.Browser.mobileWebkit) {
				pane.appendChild(root);
			}
		}
	});


	/*
	 * Popup extension to L.Path (polylines, polygons, circles), adding popup-related methods.
	 */

	L.Path.include({

		bindPopup: function (content, options) {

			if (content instanceof L.Popup) {
				this._popup = content;
			} else {
				if (!this._popup || options) {
					this._popup = new L.Popup(options, this);
				}
				this._popup.setContent(content);
			}

			if (!this._popupHandlersAdded) {
				this
				    .on('click', this._openPopup, this)
				    .on('remove', this.closePopup, this);

				this._popupHandlersAdded = true;
			}

			return this;
		},

		unbindPopup: function () {
			if (this._popup) {
				this._popup = null;
				this
				    .off('click', this._openPopup)
				    .off('remove', this.closePopup);

				this._popupHandlersAdded = false;
			}
			return this;
		},

		openPopup: function (latlng) {

			if (this._popup) {
				// open the popup from one of the path's points if not specified
				latlng = latlng || this._latlng ||
				         this._latlngs[Math.floor(this._latlngs.length / 2)];

				this._openPopup({latlng: latlng});
			}

			return this;
		},

		closePopup: function () {
			if (this._popup) {
				this._popup._close();
			}
			return this;
		},

		_openPopup: function (e) {
			this._popup.setLatLng(e.latlng);
			this._map.openPopup(this._popup);
		}
	});


	/*
	 * Vector rendering for IE6-8 through VML.
	 * Thanks to Dmitry Baranovsky and his Raphael library for inspiration!
	 */

	L.Browser.vml = !L.Browser.svg && (function () {
		try {
			var div = document.createElement('div');
			div.innerHTML = '<v:shape adj="1"/>';

			var shape = div.firstChild;
			shape.style.behavior = 'url(#default#VML)';

			return shape && (typeof shape.adj === 'object');

		} catch (e) {
			return false;
		}
	}());

	L.Path = L.Browser.svg || !L.Browser.vml ? L.Path : L.Path.extend({
		statics: {
			VML: true,
			CLIP_PADDING: 0.02
		},

		_createElement: (function () {
			try {
				document.namespaces.add('lvml', 'urn:schemas-microsoft-com:vml');
				return function (name) {
					return document.createElement('<lvml:' + name + ' class="lvml">');
				};
			} catch (e) {
				return function (name) {
					return document.createElement(
					        '<' + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
				};
			}
		}()),

		_initPath: function () {
			var container = this._container = this._createElement('shape');

			L.DomUtil.addClass(container, 'leaflet-vml-shape' +
				(this.options.className ? ' ' + this.options.className : ''));

			if (this.options.clickable) {
				L.DomUtil.addClass(container, 'leaflet-clickable');
			}

			container.coordsize = '1 1';

			this._path = this._createElement('path');
			container.appendChild(this._path);

			this._map._pathRoot.appendChild(container);
		},

		_initStyle: function () {
			this._updateStyle();
		},

		_updateStyle: function () {
			var stroke = this._stroke,
			    fill = this._fill,
			    options = this.options,
			    container = this._container;

			container.stroked = options.stroke;
			container.filled = options.fill;

			if (options.stroke) {
				if (!stroke) {
					stroke = this._stroke = this._createElement('stroke');
					stroke.endcap = 'round';
					container.appendChild(stroke);
				}
				stroke.weight = options.weight + 'px';
				stroke.color = options.color;
				stroke.opacity = options.opacity;

				if (options.dashArray) {
					stroke.dashStyle = L.Util.isArray(options.dashArray) ?
					    options.dashArray.join(' ') :
					    options.dashArray.replace(/( *, *)/g, ' ');
				} else {
					stroke.dashStyle = '';
				}
				if (options.lineCap) {
					stroke.endcap = options.lineCap.replace('butt', 'flat');
				}
				if (options.lineJoin) {
					stroke.joinstyle = options.lineJoin;
				}

			} else if (stroke) {
				container.removeChild(stroke);
				this._stroke = null;
			}

			if (options.fill) {
				if (!fill) {
					fill = this._fill = this._createElement('fill');
					container.appendChild(fill);
				}
				fill.color = options.fillColor || options.color;
				fill.opacity = options.fillOpacity;

			} else if (fill) {
				container.removeChild(fill);
				this._fill = null;
			}
		},

		_updatePath: function () {
			var style = this._container.style;

			style.display = 'none';
			this._path.v = this.getPathString() + ' '; // the space fixes IE empty path string bug
			style.display = '';
		}
	});

	L.Map.include(L.Browser.svg || !L.Browser.vml ? {} : {
		_initPathRoot: function () {
			if (this._pathRoot) { return; }

			var root = this._pathRoot = document.createElement('div');
			root.className = 'leaflet-vml-container';
			this._panes.overlayPane.appendChild(root);

			this.on('moveend', this._updatePathViewport);
			this._updatePathViewport();
		}
	});


	/*
	 * Vector rendering for all browsers that support canvas.
	 */

	L.Browser.canvas = (function () {
		return !!document.createElement('canvas').getContext;
	}());

	L.Path = (L.Path.SVG && !window.L_PREFER_CANVAS) || !L.Browser.canvas ? L.Path : L.Path.extend({
		statics: {
			//CLIP_PADDING: 0.02, // not sure if there's a need to set it to a small value
			CANVAS: true,
			SVG: false
		},

		redraw: function () {
			if (this._map) {
				this.projectLatlngs();
				this._requestUpdate();
			}
			return this;
		},

		setStyle: function (style) {
			L.setOptions(this, style);

			if (this._map) {
				this._updateStyle();
				this._requestUpdate();
			}
			return this;
		},

		onRemove: function (map) {
			map
			    .off('viewreset', this.projectLatlngs, this)
			    .off('moveend', this._updatePath, this);

			if (this.options.clickable) {
				this._map.off('click', this._onClick, this);
				this._map.off('mousemove', this._onMouseMove, this);
			}

			this._requestUpdate();
			
			this.fire('remove');
			this._map = null;
		},

		_requestUpdate: function () {
			if (this._map && !L.Path._updateRequest) {
				L.Path._updateRequest = L.Util.requestAnimFrame(this._fireMapMoveEnd, this._map);
			}
		},

		_fireMapMoveEnd: function () {
			L.Path._updateRequest = null;
			this.fire('moveend');
		},

		_initElements: function () {
			this._map._initPathRoot();
			this._ctx = this._map._canvasCtx;
		},

		_updateStyle: function () {
			var options = this.options;

			if (options.stroke) {
				this._ctx.lineWidth = options.weight;
				this._ctx.strokeStyle = options.color;
			}
			if (options.fill) {
				this._ctx.fillStyle = options.fillColor || options.color;
			}

			if (options.lineCap) {
				this._ctx.lineCap = options.lineCap;
			}
			if (options.lineJoin) {
				this._ctx.lineJoin = options.lineJoin;
			}
		},

		_drawPath: function () {
			var i, j, len, len2, point, drawMethod;

			this._ctx.beginPath();

			for (i = 0, len = this._parts.length; i < len; i++) {
				for (j = 0, len2 = this._parts[i].length; j < len2; j++) {
					point = this._parts[i][j];
					drawMethod = (j === 0 ? 'move' : 'line') + 'To';

					this._ctx[drawMethod](point.x, point.y);
				}
				// TODO refactor ugly hack
				if (this instanceof L.Polygon) {
					this._ctx.closePath();
				}
			}
		},

		_checkIfEmpty: function () {
			return !this._parts.length;
		},

		_updatePath: function () {
			if (this._checkIfEmpty()) { return; }

			var ctx = this._ctx,
			    options = this.options;

			this._drawPath();
			ctx.save();
			this._updateStyle();

			if (options.fill) {
				ctx.globalAlpha = options.fillOpacity;
				ctx.fill(options.fillRule || 'evenodd');
			}

			if (options.stroke) {
				ctx.globalAlpha = options.opacity;
				ctx.stroke();
			}

			ctx.restore();

			// TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
		},

		_initEvents: function () {
			if (this.options.clickable) {
				this._map.on('mousemove', this._onMouseMove, this);
				this._map.on('click dblclick contextmenu', this._fireMouseEvent, this);
			}
		},

		_fireMouseEvent: function (e) {
			if (this._containsPoint(e.layerPoint)) {
				this.fire(e.type, e);
			}
		},

		_onMouseMove: function (e) {
			if (!this._map || this._map._animatingZoom) { return; }

			// TODO don't do on each move
			if (this._containsPoint(e.layerPoint)) {
				this._ctx.canvas.style.cursor = 'pointer';
				this._mouseInside = true;
				this.fire('mouseover', e);

			} else if (this._mouseInside) {
				this._ctx.canvas.style.cursor = '';
				this._mouseInside = false;
				this.fire('mouseout', e);
			}
		}
	});

	L.Map.include((L.Path.SVG && !window.L_PREFER_CANVAS) || !L.Browser.canvas ? {} : {
		_initPathRoot: function () {
			var root = this._pathRoot,
			    ctx;

			if (!root) {
				root = this._pathRoot = document.createElement('canvas');
				root.style.position = 'absolute';
				ctx = this._canvasCtx = root.getContext('2d');

				ctx.lineCap = 'round';
				ctx.lineJoin = 'round';

				this._panes.overlayPane.appendChild(root);

				if (this.options.zoomAnimation) {
					this._pathRoot.className = 'leaflet-zoom-animated';
					this.on('zoomanim', this._animatePathZoom);
					this.on('zoomend', this._endPathZoom);
				}
				this.on('moveend', this._updateCanvasViewport);
				this._updateCanvasViewport();
			}
		},

		_updateCanvasViewport: function () {
			// don't redraw while zooming. See _updateSvgViewport for more details
			if (this._pathZooming) { return; }
			this._updatePathViewport();

			var vp = this._pathViewport,
			    min = vp.min,
			    size = vp.max.subtract(min),
			    root = this._pathRoot;

			//TODO check if this works properly on mobile webkit
			L.DomUtil.setPosition(root, min);
			root.width = size.x;
			root.height = size.y;
			root.getContext('2d').translate(-min.x, -min.y);
		}
	});


	/*
	 * L.LineUtil contains different utility functions for line segments
	 * and polylines (clipping, simplification, distances, etc.)
	 */

	/*jshint bitwise:false */ // allow bitwise operations for this file

	L.LineUtil = {

		// Simplify polyline with vertex reduction and Douglas-Peucker simplification.
		// Improves rendering performance dramatically by lessening the number of points to draw.

		simplify: function (/*Point[]*/ points, /*Number*/ tolerance) {
			if (!tolerance || !points.length) {
				return points.slice();
			}

			var sqTolerance = tolerance * tolerance;

			// stage 1: vertex reduction
			points = this._reducePoints(points, sqTolerance);

			// stage 2: Douglas-Peucker simplification
			points = this._simplifyDP(points, sqTolerance);

			return points;
		},

		// distance from a point to a segment between two points
		pointToSegmentDistance:  function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
			return Math.sqrt(this._sqClosestPointOnSegment(p, p1, p2, true));
		},

		closestPointOnSegment: function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
			return this._sqClosestPointOnSegment(p, p1, p2);
		},

		// Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
		_simplifyDP: function (points, sqTolerance) {

			var len = points.length,
			    ArrayConstructor = typeof Uint8Array !== undefined + '' ? Uint8Array : Array,
			    markers = new ArrayConstructor(len);

			markers[0] = markers[len - 1] = 1;

			this._simplifyDPStep(points, markers, sqTolerance, 0, len - 1);

			var i,
			    newPoints = [];

			for (i = 0; i < len; i++) {
				if (markers[i]) {
					newPoints.push(points[i]);
				}
			}

			return newPoints;
		},

		_simplifyDPStep: function (points, markers, sqTolerance, first, last) {

			var maxSqDist = 0,
			    index, i, sqDist;

			for (i = first + 1; i <= last - 1; i++) {
				sqDist = this._sqClosestPointOnSegment(points[i], points[first], points[last], true);

				if (sqDist > maxSqDist) {
					index = i;
					maxSqDist = sqDist;
				}
			}

			if (maxSqDist > sqTolerance) {
				markers[index] = 1;

				this._simplifyDPStep(points, markers, sqTolerance, first, index);
				this._simplifyDPStep(points, markers, sqTolerance, index, last);
			}
		},

		// reduce points that are too close to each other to a single point
		_reducePoints: function (points, sqTolerance) {
			var reducedPoints = [points[0]];

			for (var i = 1, prev = 0, len = points.length; i < len; i++) {
				if (this._sqDist(points[i], points[prev]) > sqTolerance) {
					reducedPoints.push(points[i]);
					prev = i;
				}
			}
			if (prev < len - 1) {
				reducedPoints.push(points[len - 1]);
			}
			return reducedPoints;
		},

		// Cohen-Sutherland line clipping algorithm.
		// Used to avoid rendering parts of a polyline that are not currently visible.

		clipSegment: function (a, b, bounds, useLastCode) {
			var codeA = useLastCode ? this._lastCode : this._getBitCode(a, bounds),
			    codeB = this._getBitCode(b, bounds),

			    codeOut, p, newCode;

			// save 2nd code to avoid calculating it on the next segment
			this._lastCode = codeB;

			while (true) {
				// if a,b is inside the clip window (trivial accept)
				if (!(codeA | codeB)) {
					return [a, b];
				// if a,b is outside the clip window (trivial reject)
				} else if (codeA & codeB) {
					return false;
				// other cases
				} else {
					codeOut = codeA || codeB;
					p = this._getEdgeIntersection(a, b, codeOut, bounds);
					newCode = this._getBitCode(p, bounds);

					if (codeOut === codeA) {
						a = p;
						codeA = newCode;
					} else {
						b = p;
						codeB = newCode;
					}
				}
			}
		},

		_getEdgeIntersection: function (a, b, code, bounds) {
			var dx = b.x - a.x,
			    dy = b.y - a.y,
			    min = bounds.min,
			    max = bounds.max;

			if (code & 8) { // top
				return new L.Point(a.x + dx * (max.y - a.y) / dy, max.y);
			} else if (code & 4) { // bottom
				return new L.Point(a.x + dx * (min.y - a.y) / dy, min.y);
			} else if (code & 2) { // right
				return new L.Point(max.x, a.y + dy * (max.x - a.x) / dx);
			} else if (code & 1) { // left
				return new L.Point(min.x, a.y + dy * (min.x - a.x) / dx);
			}
		},

		_getBitCode: function (/*Point*/ p, bounds) {
			var code = 0;

			if (p.x < bounds.min.x) { // left
				code |= 1;
			} else if (p.x > bounds.max.x) { // right
				code |= 2;
			}
			if (p.y < bounds.min.y) { // bottom
				code |= 4;
			} else if (p.y > bounds.max.y) { // top
				code |= 8;
			}

			return code;
		},

		// square distance (to avoid unnecessary Math.sqrt calls)
		_sqDist: function (p1, p2) {
			var dx = p2.x - p1.x,
			    dy = p2.y - p1.y;
			return dx * dx + dy * dy;
		},

		// return closest point on segment or distance to that point
		_sqClosestPointOnSegment: function (p, p1, p2, sqDist) {
			var x = p1.x,
			    y = p1.y,
			    dx = p2.x - x,
			    dy = p2.y - y,
			    dot = dx * dx + dy * dy,
			    t;

			if (dot > 0) {
				t = ((p.x - x) * dx + (p.y - y) * dy) / dot;

				if (t > 1) {
					x = p2.x;
					y = p2.y;
				} else if (t > 0) {
					x += dx * t;
					y += dy * t;
				}
			}

			dx = p.x - x;
			dy = p.y - y;

			return sqDist ? dx * dx + dy * dy : new L.Point(x, y);
		}
	};


	/*
	 * L.Polyline is used to display polylines on a map.
	 */

	L.Polyline = L.Path.extend({
		initialize: function (latlngs, options) {
			L.Path.prototype.initialize.call(this, options);

			this._latlngs = this._convertLatLngs(latlngs);
		},

		options: {
			// how much to simplify the polyline on each zoom level
			// more = better performance and smoother look, less = more accurate
			smoothFactor: 1.0,
			noClip: false
		},

		projectLatlngs: function () {
			this._originalPoints = [];

			for (var i = 0, len = this._latlngs.length; i < len; i++) {
				this._originalPoints[i] = this._map.latLngToLayerPoint(this._latlngs[i]);
			}
		},

		getPathString: function () {
			for (var i = 0, len = this._parts.length, str = ''; i < len; i++) {
				str += this._getPathPartStr(this._parts[i]);
			}
			return str;
		},

		getLatLngs: function () {
			return this._latlngs;
		},

		setLatLngs: function (latlngs) {
			this._latlngs = this._convertLatLngs(latlngs);
			return this.redraw();
		},

		addLatLng: function (latlng) {
			this._latlngs.push(L.latLng(latlng));
			return this.redraw();
		},

		spliceLatLngs: function () { // (Number index, Number howMany)
			var removed = [].splice.apply(this._latlngs, arguments);
			this._convertLatLngs(this._latlngs, true);
			this.redraw();
			return removed;
		},

		closestLayerPoint: function (p) {
			var minDistance = Infinity, parts = this._parts, p1, p2, minPoint = null;

			for (var j = 0, jLen = parts.length; j < jLen; j++) {
				var points = parts[j];
				for (var i = 1, len = points.length; i < len; i++) {
					p1 = points[i - 1];
					p2 = points[i];
					var sqDist = L.LineUtil._sqClosestPointOnSegment(p, p1, p2, true);
					if (sqDist < minDistance) {
						minDistance = sqDist;
						minPoint = L.LineUtil._sqClosestPointOnSegment(p, p1, p2);
					}
				}
			}
			if (minPoint) {
				minPoint.distance = Math.sqrt(minDistance);
			}
			return minPoint;
		},

		getBounds: function () {
			return new L.LatLngBounds(this.getLatLngs());
		},

		_convertLatLngs: function (latlngs, overwrite) {
			var i, len, target = overwrite ? latlngs : [];

			for (i = 0, len = latlngs.length; i < len; i++) {
				if (L.Util.isArray(latlngs[i]) && typeof latlngs[i][0] !== 'number') {
					return;
				}
				target[i] = L.latLng(latlngs[i]);
			}
			return target;
		},

		_initEvents: function () {
			L.Path.prototype._initEvents.call(this);
		},

		_getPathPartStr: function (points) {
			var round = L.Path.VML;

			for (var j = 0, len2 = points.length, str = '', p; j < len2; j++) {
				p = points[j];
				if (round) {
					p._round();
				}
				str += (j ? 'L' : 'M') + p.x + ' ' + p.y;
			}
			return str;
		},

		_clipPoints: function () {
			var points = this._originalPoints,
			    len = points.length,
			    i, k, segment;

			if (this.options.noClip) {
				this._parts = [points];
				return;
			}

			this._parts = [];

			var parts = this._parts,
			    vp = this._map._pathViewport,
			    lu = L.LineUtil;

			for (i = 0, k = 0; i < len - 1; i++) {
				segment = lu.clipSegment(points[i], points[i + 1], vp, i);
				if (!segment) {
					continue;
				}

				parts[k] = parts[k] || [];
				parts[k].push(segment[0]);

				// if segment goes out of screen, or it's the last one, it's the end of the line part
				if ((segment[1] !== points[i + 1]) || (i === len - 2)) {
					parts[k].push(segment[1]);
					k++;
				}
			}
		},

		// simplify each clipped part of the polyline
		_simplifyPoints: function () {
			var parts = this._parts,
			    lu = L.LineUtil;

			for (var i = 0, len = parts.length; i < len; i++) {
				parts[i] = lu.simplify(parts[i], this.options.smoothFactor);
			}
		},

		_updatePath: function () {
			if (!this._map) { return; }

			this._clipPoints();
			this._simplifyPoints();

			L.Path.prototype._updatePath.call(this);
		}
	});

	L.polyline = function (latlngs, options) {
		return new L.Polyline(latlngs, options);
	};


	/*
	 * L.PolyUtil contains utility functions for polygons (clipping, etc.).
	 */

	/*jshint bitwise:false */ // allow bitwise operations here

	L.PolyUtil = {};

	/*
	 * Sutherland-Hodgeman polygon clipping algorithm.
	 * Used to avoid rendering parts of a polygon that are not currently visible.
	 */
	L.PolyUtil.clipPolygon = function (points, bounds) {
		var clippedPoints,
		    edges = [1, 4, 2, 8],
		    i, j, k,
		    a, b,
		    len, edge, p,
		    lu = L.LineUtil;

		for (i = 0, len = points.length; i < len; i++) {
			points[i]._code = lu._getBitCode(points[i], bounds);
		}

		// for each edge (left, bottom, right, top)
		for (k = 0; k < 4; k++) {
			edge = edges[k];
			clippedPoints = [];

			for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
				a = points[i];
				b = points[j];

				// if a is inside the clip window
				if (!(a._code & edge)) {
					// if b is outside the clip window (a->b goes out of screen)
					if (b._code & edge) {
						p = lu._getEdgeIntersection(b, a, edge, bounds);
						p._code = lu._getBitCode(p, bounds);
						clippedPoints.push(p);
					}
					clippedPoints.push(a);

				// else if b is inside the clip window (a->b enters the screen)
				} else if (!(b._code & edge)) {
					p = lu._getEdgeIntersection(b, a, edge, bounds);
					p._code = lu._getBitCode(p, bounds);
					clippedPoints.push(p);
				}
			}
			points = clippedPoints;
		}

		return points;
	};


	/*
	 * L.Polygon is used to display polygons on a map.
	 */

	L.Polygon = L.Polyline.extend({
		options: {
			fill: true
		},

		initialize: function (latlngs, options) {
			L.Polyline.prototype.initialize.call(this, latlngs, options);
			this._initWithHoles(latlngs);
		},

		_initWithHoles: function (latlngs) {
			var i, len, hole;
			if (latlngs && L.Util.isArray(latlngs[0]) && (typeof latlngs[0][0] !== 'number')) {
				this._latlngs = this._convertLatLngs(latlngs[0]);
				this._holes = latlngs.slice(1);

				for (i = 0, len = this._holes.length; i < len; i++) {
					hole = this._holes[i] = this._convertLatLngs(this._holes[i]);
					if (hole[0].equals(hole[hole.length - 1])) {
						hole.pop();
					}
				}
			}

			// filter out last point if its equal to the first one
			latlngs = this._latlngs;

			if (latlngs.length >= 2 && latlngs[0].equals(latlngs[latlngs.length - 1])) {
				latlngs.pop();
			}
		},

		projectLatlngs: function () {
			L.Polyline.prototype.projectLatlngs.call(this);

			// project polygon holes points
			// TODO move this logic to Polyline to get rid of duplication
			this._holePoints = [];

			if (!this._holes) { return; }

			var i, j, len, len2;

			for (i = 0, len = this._holes.length; i < len; i++) {
				this._holePoints[i] = [];

				for (j = 0, len2 = this._holes[i].length; j < len2; j++) {
					this._holePoints[i][j] = this._map.latLngToLayerPoint(this._holes[i][j]);
				}
			}
		},

		setLatLngs: function (latlngs) {
			if (latlngs && L.Util.isArray(latlngs[0]) && (typeof latlngs[0][0] !== 'number')) {
				this._initWithHoles(latlngs);
				return this.redraw();
			} else {
				return L.Polyline.prototype.setLatLngs.call(this, latlngs);
			}
		},

		_clipPoints: function () {
			var points = this._originalPoints,
			    newParts = [];

			this._parts = [points].concat(this._holePoints);

			if (this.options.noClip) { return; }

			for (var i = 0, len = this._parts.length; i < len; i++) {
				var clipped = L.PolyUtil.clipPolygon(this._parts[i], this._map._pathViewport);
				if (clipped.length) {
					newParts.push(clipped);
				}
			}

			this._parts = newParts;
		},

		_getPathPartStr: function (points) {
			var str = L.Polyline.prototype._getPathPartStr.call(this, points);
			return str + (L.Browser.svg ? 'z' : 'x');
		}
	});

	L.polygon = function (latlngs, options) {
		return new L.Polygon(latlngs, options);
	};


	/*
	 * Contains L.MultiPolyline and L.MultiPolygon layers.
	 */

	(function () {
		function createMulti(Klass) {

			return L.FeatureGroup.extend({

				initialize: function (latlngs, options) {
					this._layers = {};
					this._options = options;
					this.setLatLngs(latlngs);
				},

				setLatLngs: function (latlngs) {
					var i = 0,
					    len = latlngs.length;

					this.eachLayer(function (layer) {
						if (i < len) {
							layer.setLatLngs(latlngs[i++]);
						} else {
							this.removeLayer(layer);
						}
					}, this);

					while (i < len) {
						this.addLayer(new Klass(latlngs[i++], this._options));
					}

					return this;
				},

				getLatLngs: function () {
					var latlngs = [];

					this.eachLayer(function (layer) {
						latlngs.push(layer.getLatLngs());
					});

					return latlngs;
				}
			});
		}

		L.MultiPolyline = createMulti(L.Polyline);
		L.MultiPolygon = createMulti(L.Polygon);

		L.multiPolyline = function (latlngs, options) {
			return new L.MultiPolyline(latlngs, options);
		};

		L.multiPolygon = function (latlngs, options) {
			return new L.MultiPolygon(latlngs, options);
		};
	}());


	/*
	 * L.Rectangle extends Polygon and creates a rectangle when passed a LatLngBounds object.
	 */

	L.Rectangle = L.Polygon.extend({
		initialize: function (latLngBounds, options) {
			L.Polygon.prototype.initialize.call(this, this._boundsToLatLngs(latLngBounds), options);
		},

		setBounds: function (latLngBounds) {
			this.setLatLngs(this._boundsToLatLngs(latLngBounds));
		},

		_boundsToLatLngs: function (latLngBounds) {
			latLngBounds = L.latLngBounds(latLngBounds);
			return [
				latLngBounds.getSouthWest(),
				latLngBounds.getNorthWest(),
				latLngBounds.getNorthEast(),
				latLngBounds.getSouthEast()
			];
		}
	});

	L.rectangle = function (latLngBounds, options) {
		return new L.Rectangle(latLngBounds, options);
	};


	/*
	 * L.Circle is a circle overlay (with a certain radius in meters).
	 */

	L.Circle = L.Path.extend({
		initialize: function (latlng, radius, options) {
			L.Path.prototype.initialize.call(this, options);

			this._latlng = L.latLng(latlng);
			this._mRadius = radius;
		},

		options: {
			fill: true
		},

		setLatLng: function (latlng) {
			this._latlng = L.latLng(latlng);
			return this.redraw();
		},

		setRadius: function (radius) {
			this._mRadius = radius;
			return this.redraw();
		},

		projectLatlngs: function () {
			var lngRadius = this._getLngRadius(),
			    latlng = this._latlng,
			    pointLeft = this._map.latLngToLayerPoint([latlng.lat, latlng.lng - lngRadius]);

			this._point = this._map.latLngToLayerPoint(latlng);
			this._radius = Math.max(this._point.x - pointLeft.x, 1);
		},

		getBounds: function () {
			var lngRadius = this._getLngRadius(),
			    latRadius = (this._mRadius / 40075017) * 360,
			    latlng = this._latlng;

			return new L.LatLngBounds(
			        [latlng.lat - latRadius, latlng.lng - lngRadius],
			        [latlng.lat + latRadius, latlng.lng + lngRadius]);
		},

		getLatLng: function () {
			return this._latlng;
		},

		getPathString: function () {
			var p = this._point,
			    r = this._radius;

			if (this._checkIfEmpty()) {
				return '';
			}

			if (L.Browser.svg) {
				return 'M' + p.x + ',' + (p.y - r) +
				       'A' + r + ',' + r + ',0,1,1,' +
				       (p.x - 0.1) + ',' + (p.y - r) + ' z';
			} else {
				p._round();
				r = Math.round(r);
				return 'AL ' + p.x + ',' + p.y + ' ' + r + ',' + r + ' 0,' + (65535 * 360);
			}
		},

		getRadius: function () {
			return this._mRadius;
		},

		// TODO Earth hardcoded, move into projection code!

		_getLatRadius: function () {
			return (this._mRadius / 40075017) * 360;
		},

		_getLngRadius: function () {
			return this._getLatRadius() / Math.cos(L.LatLng.DEG_TO_RAD * this._latlng.lat);
		},

		_checkIfEmpty: function () {
			if (!this._map) {
				return false;
			}
			var vp = this._map._pathViewport,
			    r = this._radius,
			    p = this._point;

			return p.x - r > vp.max.x || p.y - r > vp.max.y ||
			       p.x + r < vp.min.x || p.y + r < vp.min.y;
		}
	});

	L.circle = function (latlng, radius, options) {
		return new L.Circle(latlng, radius, options);
	};


	/*
	 * L.CircleMarker is a circle overlay with a permanent pixel radius.
	 */

	L.CircleMarker = L.Circle.extend({
		options: {
			radius: 10,
			weight: 2
		},

		initialize: function (latlng, options) {
			L.Circle.prototype.initialize.call(this, latlng, null, options);
			this._radius = this.options.radius;
		},

		projectLatlngs: function () {
			this._point = this._map.latLngToLayerPoint(this._latlng);
		},

		_updateStyle : function () {
			L.Circle.prototype._updateStyle.call(this);
			this.setRadius(this.options.radius);
		},

		setLatLng: function (latlng) {
			L.Circle.prototype.setLatLng.call(this, latlng);
			if (this._popup && this._popup._isOpen) {
				this._popup.setLatLng(latlng);
			}
			return this;
		},

		setRadius: function (radius) {
			this.options.radius = this._radius = radius;
			return this.redraw();
		},

		getRadius: function () {
			return this._radius;
		}
	});

	L.circleMarker = function (latlng, options) {
		return new L.CircleMarker(latlng, options);
	};


	/*
	 * Extends L.Polyline to be able to manually detect clicks on Canvas-rendered polylines.
	 */

	L.Polyline.include(!L.Path.CANVAS ? {} : {
		_containsPoint: function (p, closed) {
			var i, j, k, len, len2, dist, part,
			    w = this.options.weight / 2;

			if (L.Browser.touch) {
				w += 10; // polyline click tolerance on touch devices
			}

			for (i = 0, len = this._parts.length; i < len; i++) {
				part = this._parts[i];
				for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
					if (!closed && (j === 0)) {
						continue;
					}

					dist = L.LineUtil.pointToSegmentDistance(p, part[k], part[j]);

					if (dist <= w) {
						return true;
					}
				}
			}
			return false;
		}
	});


	/*
	 * Extends L.Polygon to be able to manually detect clicks on Canvas-rendered polygons.
	 */

	L.Polygon.include(!L.Path.CANVAS ? {} : {
		_containsPoint: function (p) {
			var inside = false,
			    part, p1, p2,
			    i, j, k,
			    len, len2;

			// TODO optimization: check if within bounds first

			if (L.Polyline.prototype._containsPoint.call(this, p, true)) {
				// click on polygon border
				return true;
			}

			// ray casting algorithm for detecting if point is in polygon

			for (i = 0, len = this._parts.length; i < len; i++) {
				part = this._parts[i];

				for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
					p1 = part[j];
					p2 = part[k];

					if (((p1.y > p.y) !== (p2.y > p.y)) &&
							(p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x)) {
						inside = !inside;
					}
				}
			}

			return inside;
		}
	});


	/*
	 * Extends L.Circle with Canvas-specific code.
	 */

	L.Circle.include(!L.Path.CANVAS ? {} : {
		_drawPath: function () {
			var p = this._point;
			this._ctx.beginPath();
			this._ctx.arc(p.x, p.y, this._radius, 0, Math.PI * 2, false);
		},

		_containsPoint: function (p) {
			var center = this._point,
			    w2 = this.options.stroke ? this.options.weight / 2 : 0;

			return (p.distanceTo(center) <= this._radius + w2);
		}
	});


	/*
	 * CircleMarker canvas specific drawing parts.
	 */

	L.CircleMarker.include(!L.Path.CANVAS ? {} : {
		_updateStyle: function () {
			L.Path.prototype._updateStyle.call(this);
		}
	});


	/*
	 * L.GeoJSON turns any GeoJSON data into a Leaflet layer.
	 */

	L.GeoJSON = L.FeatureGroup.extend({

		initialize: function (geojson, options) {
			L.setOptions(this, options);

			this._layers = {};

			if (geojson) {
				this.addData(geojson);
			}
		},

		addData: function (geojson) {
			var features = L.Util.isArray(geojson) ? geojson : geojson.features,
			    i, len, feature;

			if (features) {
				for (i = 0, len = features.length; i < len; i++) {
					// Only add this if geometry or geometries are set and not null
					feature = features[i];
					if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
						this.addData(features[i]);
					}
				}
				return this;
			}

			var options = this.options;

			if (options.filter && !options.filter(geojson)) { return; }

			var layer = L.GeoJSON.geometryToLayer(geojson, options.pointToLayer, options.coordsToLatLng, options);
			layer.feature = L.GeoJSON.asFeature(geojson);

			layer.defaultOptions = layer.options;
			this.resetStyle(layer);

			if (options.onEachFeature) {
				options.onEachFeature(geojson, layer);
			}

			return this.addLayer(layer);
		},

		resetStyle: function (layer) {
			var style = this.options.style;
			if (style) {
				// reset any custom styles
				L.Util.extend(layer.options, layer.defaultOptions);

				this._setLayerStyle(layer, style);
			}
		},

		setStyle: function (style) {
			this.eachLayer(function (layer) {
				this._setLayerStyle(layer, style);
			}, this);
		},

		_setLayerStyle: function (layer, style) {
			if (typeof style === 'function') {
				style = style(layer.feature);
			}
			if (layer.setStyle) {
				layer.setStyle(style);
			}
		}
	});

	L.extend(L.GeoJSON, {
		geometryToLayer: function (geojson, pointToLayer, coordsToLatLng, vectorOptions) {
			var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
			    coords = geometry.coordinates,
			    layers = [],
			    latlng, latlngs, i, len;

			coordsToLatLng = coordsToLatLng || this.coordsToLatLng;

			switch (geometry.type) {
			case 'Point':
				latlng = coordsToLatLng(coords);
				return pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng);

			case 'MultiPoint':
				for (i = 0, len = coords.length; i < len; i++) {
					latlng = coordsToLatLng(coords[i]);
					layers.push(pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng));
				}
				return new L.FeatureGroup(layers);

			case 'LineString':
				latlngs = this.coordsToLatLngs(coords, 0, coordsToLatLng);
				return new L.Polyline(latlngs, vectorOptions);

			case 'Polygon':
				if (coords.length === 2 && !coords[1].length) {
					throw new Error('Invalid GeoJSON object.');
				}
				latlngs = this.coordsToLatLngs(coords, 1, coordsToLatLng);
				return new L.Polygon(latlngs, vectorOptions);

			case 'MultiLineString':
				latlngs = this.coordsToLatLngs(coords, 1, coordsToLatLng);
				return new L.MultiPolyline(latlngs, vectorOptions);

			case 'MultiPolygon':
				latlngs = this.coordsToLatLngs(coords, 2, coordsToLatLng);
				return new L.MultiPolygon(latlngs, vectorOptions);

			case 'GeometryCollection':
				for (i = 0, len = geometry.geometries.length; i < len; i++) {

					layers.push(this.geometryToLayer({
						geometry: geometry.geometries[i],
						type: 'Feature',
						properties: geojson.properties
					}, pointToLayer, coordsToLatLng, vectorOptions));
				}
				return new L.FeatureGroup(layers);

			default:
				throw new Error('Invalid GeoJSON object.');
			}
		},

		coordsToLatLng: function (coords) { // (Array[, Boolean]) -> LatLng
			return new L.LatLng(coords[1], coords[0], coords[2]);
		},

		coordsToLatLngs: function (coords, levelsDeep, coordsToLatLng) { // (Array[, Number, Function]) -> Array
			var latlng, i, len,
			    latlngs = [];

			for (i = 0, len = coords.length; i < len; i++) {
				latlng = levelsDeep ?
				        this.coordsToLatLngs(coords[i], levelsDeep - 1, coordsToLatLng) :
				        (coordsToLatLng || this.coordsToLatLng)(coords[i]);

				latlngs.push(latlng);
			}

			return latlngs;
		},

		latLngToCoords: function (latlng) {
			var coords = [latlng.lng, latlng.lat];

			if (latlng.alt !== undefined) {
				coords.push(latlng.alt);
			}
			return coords;
		},

		latLngsToCoords: function (latLngs) {
			var coords = [];

			for (var i = 0, len = latLngs.length; i < len; i++) {
				coords.push(L.GeoJSON.latLngToCoords(latLngs[i]));
			}

			return coords;
		},

		getFeature: function (layer, newGeometry) {
			return layer.feature ? L.extend({}, layer.feature, {geometry: newGeometry}) : L.GeoJSON.asFeature(newGeometry);
		},

		asFeature: function (geoJSON) {
			if (geoJSON.type === 'Feature') {
				return geoJSON;
			}

			return {
				type: 'Feature',
				properties: {},
				geometry: geoJSON
			};
		}
	});

	var PointToGeoJSON = {
		toGeoJSON: function () {
			return L.GeoJSON.getFeature(this, {
				type: 'Point',
				coordinates: L.GeoJSON.latLngToCoords(this.getLatLng())
			});
		}
	};

	L.Marker.include(PointToGeoJSON);
	L.Circle.include(PointToGeoJSON);
	L.CircleMarker.include(PointToGeoJSON);

	L.Polyline.include({
		toGeoJSON: function () {
			return L.GeoJSON.getFeature(this, {
				type: 'LineString',
				coordinates: L.GeoJSON.latLngsToCoords(this.getLatLngs())
			});
		}
	});

	L.Polygon.include({
		toGeoJSON: function () {
			var coords = [L.GeoJSON.latLngsToCoords(this.getLatLngs())],
			    i, len, hole;

			coords[0].push(coords[0][0]);

			if (this._holes) {
				for (i = 0, len = this._holes.length; i < len; i++) {
					hole = L.GeoJSON.latLngsToCoords(this._holes[i]);
					hole.push(hole[0]);
					coords.push(hole);
				}
			}

			return L.GeoJSON.getFeature(this, {
				type: 'Polygon',
				coordinates: coords
			});
		}
	});

	(function () {
		function multiToGeoJSON(type) {
			return function () {
				var coords = [];

				this.eachLayer(function (layer) {
					coords.push(layer.toGeoJSON().geometry.coordinates);
				});

				return L.GeoJSON.getFeature(this, {
					type: type,
					coordinates: coords
				});
			};
		}

		L.MultiPolyline.include({toGeoJSON: multiToGeoJSON('MultiLineString')});
		L.MultiPolygon.include({toGeoJSON: multiToGeoJSON('MultiPolygon')});

		L.LayerGroup.include({
			toGeoJSON: function () {

				var geometry = this.feature && this.feature.geometry,
					jsons = [],
					json;

				if (geometry && geometry.type === 'MultiPoint') {
					return multiToGeoJSON('MultiPoint').call(this);
				}

				var isGeometryCollection = geometry && geometry.type === 'GeometryCollection';

				this.eachLayer(function (layer) {
					if (layer.toGeoJSON) {
						json = layer.toGeoJSON();
						jsons.push(isGeometryCollection ? json.geometry : L.GeoJSON.asFeature(json));
					}
				});

				if (isGeometryCollection) {
					return L.GeoJSON.getFeature(this, {
						geometries: jsons,
						type: 'GeometryCollection'
					});
				}

				return {
					type: 'FeatureCollection',
					features: jsons
				};
			}
		});
	}());

	L.geoJson = function (geojson, options) {
		return new L.GeoJSON(geojson, options);
	};


	/*
	 * L.DomEvent contains functions for working with DOM events.
	 */

	L.DomEvent = {
		/* inspired by John Resig, Dean Edwards and YUI addEvent implementations */
		addListener: function (obj, type, fn, context) { // (HTMLElement, String, Function[, Object])

			var id = L.stamp(fn),
			    key = '_leaflet_' + type + id,
			    handler, originalHandler, newType;

			if (obj[key]) { return this; }

			handler = function (e) {
				return fn.call(context || obj, e || L.DomEvent._getEvent());
			};

			if (L.Browser.pointer && type.indexOf('touch') === 0) {
				return this.addPointerListener(obj, type, handler, id);
			}
			if (L.Browser.touch && (type === 'dblclick') && this.addDoubleTapListener) {
				this.addDoubleTapListener(obj, handler, id);
			}

			if ('addEventListener' in obj) {

				if (type === 'mousewheel') {
					obj.addEventListener('DOMMouseScroll', handler, false);
					obj.addEventListener(type, handler, false);

				} else if ((type === 'mouseenter') || (type === 'mouseleave')) {

					originalHandler = handler;
					newType = (type === 'mouseenter' ? 'mouseover' : 'mouseout');

					handler = function (e) {
						if (!L.DomEvent._checkMouse(obj, e)) { return; }
						return originalHandler(e);
					};

					obj.addEventListener(newType, handler, false);

				} else if (type === 'click' && L.Browser.android) {
					originalHandler = handler;
					handler = function (e) {
						return L.DomEvent._filterClick(e, originalHandler);
					};

					obj.addEventListener(type, handler, false);
				} else {
					obj.addEventListener(type, handler, false);
				}

			} else if ('attachEvent' in obj) {
				obj.attachEvent('on' + type, handler);
			}

			obj[key] = handler;

			return this;
		},

		removeListener: function (obj, type, fn) {  // (HTMLElement, String, Function)

			var id = L.stamp(fn),
			    key = '_leaflet_' + type + id,
			    handler = obj[key];

			if (!handler) { return this; }

			if (L.Browser.pointer && type.indexOf('touch') === 0) {
				this.removePointerListener(obj, type, id);
			} else if (L.Browser.touch && (type === 'dblclick') && this.removeDoubleTapListener) {
				this.removeDoubleTapListener(obj, id);

			} else if ('removeEventListener' in obj) {

				if (type === 'mousewheel') {
					obj.removeEventListener('DOMMouseScroll', handler, false);
					obj.removeEventListener(type, handler, false);

				} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
					obj.removeEventListener((type === 'mouseenter' ? 'mouseover' : 'mouseout'), handler, false);
				} else {
					obj.removeEventListener(type, handler, false);
				}
			} else if ('detachEvent' in obj) {
				obj.detachEvent('on' + type, handler);
			}

			obj[key] = null;

			return this;
		},

		stopPropagation: function (e) {

			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}
			L.DomEvent._skipped(e);

			return this;
		},

		disableScrollPropagation: function (el) {
			var stop = L.DomEvent.stopPropagation;

			return L.DomEvent
				.on(el, 'mousewheel', stop)
				.on(el, 'MozMousePixelScroll', stop);
		},

		disableClickPropagation: function (el) {
			var stop = L.DomEvent.stopPropagation;

			for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
				L.DomEvent.on(el, L.Draggable.START[i], stop);
			}

			return L.DomEvent
				.on(el, 'click', L.DomEvent._fakeStop)
				.on(el, 'dblclick', stop);
		},

		preventDefault: function (e) {

			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
			return this;
		},

		stop: function (e) {
			return L.DomEvent
				.preventDefault(e)
				.stopPropagation(e);
		},

		getMousePosition: function (e, container) {
			if (!container) {
				return new L.Point(e.clientX, e.clientY);
			}

			var rect = container.getBoundingClientRect();

			return new L.Point(
				e.clientX - rect.left - container.clientLeft,
				e.clientY - rect.top - container.clientTop);
		},

		getWheelDelta: function (e) {

			var delta = 0;

			if (e.wheelDelta) {
				delta = e.wheelDelta / 120;
			}
			if (e.detail) {
				delta = -e.detail / 3;
			}
			return delta;
		},

		_skipEvents: {},

		_fakeStop: function (e) {
			// fakes stopPropagation by setting a special event flag, checked/reset with L.DomEvent._skipped(e)
			L.DomEvent._skipEvents[e.type] = true;
		},

		_skipped: function (e) {
			var skipped = this._skipEvents[e.type];
			// reset when checking, as it's only used in map container and propagates outside of the map
			this._skipEvents[e.type] = false;
			return skipped;
		},

		// check if element really left/entered the event target (for mouseenter/mouseleave)
		_checkMouse: function (el, e) {

			var related = e.relatedTarget;

			if (!related) { return true; }

			try {
				while (related && (related !== el)) {
					related = related.parentNode;
				}
			} catch (err) {
				return false;
			}
			return (related !== el);
		},

		_getEvent: function () { // evil magic for IE
			/*jshint noarg:false */
			var e = window.event;
			if (!e) {
				var caller = arguments.callee.caller;
				while (caller) {
					e = caller['arguments'][0];
					if (e && window.Event === e.constructor) {
						break;
					}
					caller = caller.caller;
				}
			}
			return e;
		},

		// this is a horrible workaround for a bug in Android where a single touch triggers two click events
		_filterClick: function (e, handler) {
			var timeStamp = (e.timeStamp || e.originalEvent.timeStamp),
				elapsed = L.DomEvent._lastClick && (timeStamp - L.DomEvent._lastClick);

			// are they closer together than 500ms yet more than 100ms?
			// Android typically triggers them ~300ms apart while multiple listeners
			// on the same event should be triggered far faster;
			// or check if click is simulated on the element, and if it is, reject any non-simulated events

			if ((elapsed && elapsed > 100 && elapsed < 500) || (e.target._simulatedClick && !e._simulated)) {
				L.DomEvent.stop(e);
				return;
			}
			L.DomEvent._lastClick = timeStamp;

			return handler(e);
		}
	};

	L.DomEvent.on = L.DomEvent.addListener;
	L.DomEvent.off = L.DomEvent.removeListener;


	/*
	 * L.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
	 */

	L.Draggable = L.Class.extend({
		includes: L.Mixin.Events,

		statics: {
			START: L.Browser.touch ? ['touchstart', 'mousedown'] : ['mousedown'],
			END: {
				mousedown: 'mouseup',
				touchstart: 'touchend',
				pointerdown: 'touchend',
				MSPointerDown: 'touchend'
			},
			MOVE: {
				mousedown: 'mousemove',
				touchstart: 'touchmove',
				pointerdown: 'touchmove',
				MSPointerDown: 'touchmove'
			}
		},

		initialize: function (element, dragStartTarget) {
			this._element = element;
			this._dragStartTarget = dragStartTarget || element;
		},

		enable: function () {
			if (this._enabled) { return; }

			for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
				L.DomEvent.on(this._dragStartTarget, L.Draggable.START[i], this._onDown, this);
			}

			this._enabled = true;
		},

		disable: function () {
			if (!this._enabled) { return; }

			for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
				L.DomEvent.off(this._dragStartTarget, L.Draggable.START[i], this._onDown, this);
			}

			this._enabled = false;
			this._moved = false;
		},

		_onDown: function (e) {
			this._moved = false;

			if (e.shiftKey || ((e.which !== 1) && (e.button !== 1) && !e.touches)) { return; }

			L.DomEvent.stopPropagation(e);

			if (L.Draggable._disabled) { return; }

			L.DomUtil.disableImageDrag();
			L.DomUtil.disableTextSelection();

			if (this._moving) { return; }

			var first = e.touches ? e.touches[0] : e;

			this._startPoint = new L.Point(first.clientX, first.clientY);
			this._startPos = this._newPos = L.DomUtil.getPosition(this._element);

			L.DomEvent
			    .on(document, L.Draggable.MOVE[e.type], this._onMove, this)
			    .on(document, L.Draggable.END[e.type], this._onUp, this);
		},

		_onMove: function (e) {
			if (e.touches && e.touches.length > 1) {
				this._moved = true;
				return;
			}

			var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
			    newPoint = new L.Point(first.clientX, first.clientY),
			    offset = newPoint.subtract(this._startPoint);

			if (!offset.x && !offset.y) { return; }
			if (L.Browser.touch && Math.abs(offset.x) + Math.abs(offset.y) < 3) { return; }

			L.DomEvent.preventDefault(e);

			if (!this._moved) {
				this.fire('dragstart');

				this._moved = true;
				this._startPos = L.DomUtil.getPosition(this._element).subtract(offset);

				L.DomUtil.addClass(document.body, 'leaflet-dragging');
				this._lastTarget = e.target || e.srcElement;
				L.DomUtil.addClass(this._lastTarget, 'leaflet-drag-target');
			}

			this._newPos = this._startPos.add(offset);
			this._moving = true;

			L.Util.cancelAnimFrame(this._animRequest);
			this._animRequest = L.Util.requestAnimFrame(this._updatePosition, this, true, this._dragStartTarget);
		},

		_updatePosition: function () {
			this.fire('predrag');
			L.DomUtil.setPosition(this._element, this._newPos);
			this.fire('drag');
		},

		_onUp: function () {
			L.DomUtil.removeClass(document.body, 'leaflet-dragging');

			if (this._lastTarget) {
				L.DomUtil.removeClass(this._lastTarget, 'leaflet-drag-target');
				this._lastTarget = null;
			}

			for (var i in L.Draggable.MOVE) {
				L.DomEvent
				    .off(document, L.Draggable.MOVE[i], this._onMove)
				    .off(document, L.Draggable.END[i], this._onUp);
			}

			L.DomUtil.enableImageDrag();
			L.DomUtil.enableTextSelection();

			if (this._moved && this._moving) {
				// ensure drag is not fired after dragend
				L.Util.cancelAnimFrame(this._animRequest);

				this.fire('dragend', {
					distance: this._newPos.distanceTo(this._startPos)
				});
			}

			this._moving = false;
		}
	});


	/*
		L.Handler is a base class for handler classes that are used internally to inject
		interaction features like dragging to classes like Map and Marker.
	*/

	L.Handler = L.Class.extend({
		initialize: function (map) {
			this._map = map;
		},

		enable: function () {
			if (this._enabled) { return; }

			this._enabled = true;
			this.addHooks();
		},

		disable: function () {
			if (!this._enabled) { return; }

			this._enabled = false;
			this.removeHooks();
		},

		enabled: function () {
			return !!this._enabled;
		}
	});


	/*
	 * L.Handler.MapDrag is used to make the map draggable (with panning inertia), enabled by default.
	 */

	L.Map.mergeOptions({
		dragging: true,

		inertia: !L.Browser.android23,
		inertiaDeceleration: 3400, // px/s^2
		inertiaMaxSpeed: Infinity, // px/s
		inertiaThreshold: L.Browser.touch ? 32 : 18, // ms
		easeLinearity: 0.25,

		// TODO refactor, move to CRS
		worldCopyJump: false
	});

	L.Map.Drag = L.Handler.extend({
		addHooks: function () {
			if (!this._draggable) {
				var map = this._map;

				this._draggable = new L.Draggable(map._mapPane, map._container);

				this._draggable.on({
					'dragstart': this._onDragStart,
					'drag': this._onDrag,
					'dragend': this._onDragEnd
				}, this);

				if (map.options.worldCopyJump) {
					this._draggable.on('predrag', this._onPreDrag, this);
					map.on('viewreset', this._onViewReset, this);

					map.whenReady(this._onViewReset, this);
				}
			}
			this._draggable.enable();
		},

		removeHooks: function () {
			this._draggable.disable();
		},

		moved: function () {
			return this._draggable && this._draggable._moved;
		},

		_onDragStart: function () {
			var map = this._map;

			if (map._panAnim) {
				map._panAnim.stop();
			}

			map
			    .fire('movestart')
			    .fire('dragstart');

			if (map.options.inertia) {
				this._positions = [];
				this._times = [];
			}
		},

		_onDrag: function () {
			if (this._map.options.inertia) {
				var time = this._lastTime = +new Date(),
				    pos = this._lastPos = this._draggable._newPos;

				this._positions.push(pos);
				this._times.push(time);

				if (time - this._times[0] > 200) {
					this._positions.shift();
					this._times.shift();
				}
			}

			this._map
			    .fire('move')
			    .fire('drag');
		},

		_onViewReset: function () {
			// TODO fix hardcoded Earth values
			var pxCenter = this._map.getSize()._divideBy(2),
			    pxWorldCenter = this._map.latLngToLayerPoint([0, 0]);

			this._initialWorldOffset = pxWorldCenter.subtract(pxCenter).x;
			this._worldWidth = this._map.project([0, 180]).x;
		},

		_onPreDrag: function () {
			// TODO refactor to be able to adjust map pane position after zoom
			var worldWidth = this._worldWidth,
			    halfWidth = Math.round(worldWidth / 2),
			    dx = this._initialWorldOffset,
			    x = this._draggable._newPos.x,
			    newX1 = (x - halfWidth + dx) % worldWidth + halfWidth - dx,
			    newX2 = (x + halfWidth + dx) % worldWidth - halfWidth - dx,
			    newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;

			this._draggable._newPos.x = newX;
		},

		_onDragEnd: function (e) {
			var map = this._map,
			    options = map.options,
			    delay = +new Date() - this._lastTime,

			    noInertia = !options.inertia || delay > options.inertiaThreshold || !this._positions[0];

			map.fire('dragend', e);

			if (noInertia) {
				map.fire('moveend');

			} else {

				var direction = this._lastPos.subtract(this._positions[0]),
				    duration = (this._lastTime + delay - this._times[0]) / 1000,
				    ease = options.easeLinearity,

				    speedVector = direction.multiplyBy(ease / duration),
				    speed = speedVector.distanceTo([0, 0]),

				    limitedSpeed = Math.min(options.inertiaMaxSpeed, speed),
				    limitedSpeedVector = speedVector.multiplyBy(limitedSpeed / speed),

				    decelerationDuration = limitedSpeed / (options.inertiaDeceleration * ease),
				    offset = limitedSpeedVector.multiplyBy(-decelerationDuration / 2).round();

				if (!offset.x || !offset.y) {
					map.fire('moveend');

				} else {
					offset = map._limitOffset(offset, map.options.maxBounds);

					L.Util.requestAnimFrame(function () {
						map.panBy(offset, {
							duration: decelerationDuration,
							easeLinearity: ease,
							noMoveStart: true
						});
					});
				}
			}
		}
	});

	L.Map.addInitHook('addHandler', 'dragging', L.Map.Drag);


	/*
	 * L.Handler.DoubleClickZoom is used to handle double-click zoom on the map, enabled by default.
	 */

	L.Map.mergeOptions({
		doubleClickZoom: true
	});

	L.Map.DoubleClickZoom = L.Handler.extend({
		addHooks: function () {
			this._map.on('dblclick', this._onDoubleClick, this);
		},

		removeHooks: function () {
			this._map.off('dblclick', this._onDoubleClick, this);
		},

		_onDoubleClick: function (e) {
			var map = this._map,
			    zoom = map.getZoom() + (e.originalEvent.shiftKey ? -1 : 1);

			if (map.options.doubleClickZoom === 'center') {
				map.setZoom(zoom);
			} else {
				map.setZoomAround(e.containerPoint, zoom);
			}
		}
	});

	L.Map.addInitHook('addHandler', 'doubleClickZoom', L.Map.DoubleClickZoom);


	/*
	 * L.Handler.ScrollWheelZoom is used by L.Map to enable mouse scroll wheel zoom on the map.
	 */

	L.Map.mergeOptions({
		scrollWheelZoom: true
	});

	L.Map.ScrollWheelZoom = L.Handler.extend({
		addHooks: function () {
			L.DomEvent.on(this._map._container, 'mousewheel', this._onWheelScroll, this);
			L.DomEvent.on(this._map._container, 'MozMousePixelScroll', L.DomEvent.preventDefault);
			this._delta = 0;
		},

		removeHooks: function () {
			L.DomEvent.off(this._map._container, 'mousewheel', this._onWheelScroll);
			L.DomEvent.off(this._map._container, 'MozMousePixelScroll', L.DomEvent.preventDefault);
		},

		_onWheelScroll: function (e) {
			var delta = L.DomEvent.getWheelDelta(e);

			this._delta += delta;
			this._lastMousePos = this._map.mouseEventToContainerPoint(e);

			if (!this._startTime) {
				this._startTime = +new Date();
			}

			var left = Math.max(40 - (+new Date() - this._startTime), 0);

			clearTimeout(this._timer);
			this._timer = setTimeout(L.bind(this._performZoom, this), left);

			L.DomEvent.preventDefault(e);
			L.DomEvent.stopPropagation(e);
		},

		_performZoom: function () {
			var map = this._map,
			    delta = this._delta,
			    zoom = map.getZoom();

			delta = delta > 0 ? Math.ceil(delta) : Math.floor(delta);
			delta = Math.max(Math.min(delta, 4), -4);
			delta = map._limitZoom(zoom + delta) - zoom;

			this._delta = 0;
			this._startTime = null;

			if (!delta) { return; }

			if (map.options.scrollWheelZoom === 'center') {
				map.setZoom(zoom + delta);
			} else {
				map.setZoomAround(this._lastMousePos, zoom + delta);
			}
		}
	});

	L.Map.addInitHook('addHandler', 'scrollWheelZoom', L.Map.ScrollWheelZoom);


	/*
	 * Extends the event handling code with double tap support for mobile browsers.
	 */

	L.extend(L.DomEvent, {

		_touchstart: L.Browser.msPointer ? 'MSPointerDown' : L.Browser.pointer ? 'pointerdown' : 'touchstart',
		_touchend: L.Browser.msPointer ? 'MSPointerUp' : L.Browser.pointer ? 'pointerup' : 'touchend',

		// inspired by Zepto touch code by Thomas Fuchs
		addDoubleTapListener: function (obj, handler, id) {
			var last,
			    doubleTap = false,
			    delay = 250,
			    touch,
			    pre = '_leaflet_',
			    touchstart = this._touchstart,
			    touchend = this._touchend,
			    trackedTouches = [];

			function onTouchStart(e) {
				var count;

				if (L.Browser.pointer) {
					trackedTouches.push(e.pointerId);
					count = trackedTouches.length;
				} else {
					count = e.touches.length;
				}
				if (count > 1) {
					return;
				}

				var now = Date.now(),
					delta = now - (last || now);

				touch = e.touches ? e.touches[0] : e;
				doubleTap = (delta > 0 && delta <= delay);
				last = now;
			}

			function onTouchEnd(e) {
				if (L.Browser.pointer) {
					var idx = trackedTouches.indexOf(e.pointerId);
					if (idx === -1) {
						return;
					}
					trackedTouches.splice(idx, 1);
				}

				if (doubleTap) {
					if (L.Browser.pointer) {
						// work around .type being readonly with MSPointer* events
						var newTouch = { },
							prop;

						// jshint forin:false
						for (var i in touch) {
							prop = touch[i];
							if (typeof prop === 'function') {
								newTouch[i] = prop.bind(touch);
							} else {
								newTouch[i] = prop;
							}
						}
						touch = newTouch;
					}
					touch.type = 'dblclick';
					handler(touch);
					last = null;
				}
			}
			obj[pre + touchstart + id] = onTouchStart;
			obj[pre + touchend + id] = onTouchEnd;

			// on pointer we need to listen on the document, otherwise a drag starting on the map and moving off screen
			// will not come through to us, so we will lose track of how many touches are ongoing
			var endElement = L.Browser.pointer ? document.documentElement : obj;

			obj.addEventListener(touchstart, onTouchStart, false);
			endElement.addEventListener(touchend, onTouchEnd, false);

			if (L.Browser.pointer) {
				endElement.addEventListener(L.DomEvent.POINTER_CANCEL, onTouchEnd, false);
			}

			return this;
		},

		removeDoubleTapListener: function (obj, id) {
			var pre = '_leaflet_';

			obj.removeEventListener(this._touchstart, obj[pre + this._touchstart + id], false);
			(L.Browser.pointer ? document.documentElement : obj).removeEventListener(
			        this._touchend, obj[pre + this._touchend + id], false);

			if (L.Browser.pointer) {
				document.documentElement.removeEventListener(L.DomEvent.POINTER_CANCEL, obj[pre + this._touchend + id],
					false);
			}

			return this;
		}
	});


	/*
	 * Extends L.DomEvent to provide touch support for Internet Explorer and Windows-based devices.
	 */

	L.extend(L.DomEvent, {

		//static
		POINTER_DOWN: L.Browser.msPointer ? 'MSPointerDown' : 'pointerdown',
		POINTER_MOVE: L.Browser.msPointer ? 'MSPointerMove' : 'pointermove',
		POINTER_UP: L.Browser.msPointer ? 'MSPointerUp' : 'pointerup',
		POINTER_CANCEL: L.Browser.msPointer ? 'MSPointerCancel' : 'pointercancel',

		_pointers: [],
		_pointerDocumentListener: false,

		// Provides a touch events wrapper for (ms)pointer events.
		// Based on changes by veproza https://github.com/CloudMade/Leaflet/pull/1019
		//ref http://www.w3.org/TR/pointerevents/ https://www.w3.org/Bugs/Public/show_bug.cgi?id=22890

		addPointerListener: function (obj, type, handler, id) {

			switch (type) {
			case 'touchstart':
				return this.addPointerListenerStart(obj, type, handler, id);
			case 'touchend':
				return this.addPointerListenerEnd(obj, type, handler, id);
			case 'touchmove':
				return this.addPointerListenerMove(obj, type, handler, id);
			default:
				throw 'Unknown touch event type';
			}
		},

		addPointerListenerStart: function (obj, type, handler, id) {
			var pre = '_leaflet_',
			    pointers = this._pointers;

			var cb = function (e) {
				if (e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
					L.DomEvent.preventDefault(e);
				}

				var alreadyInArray = false;
				for (var i = 0; i < pointers.length; i++) {
					if (pointers[i].pointerId === e.pointerId) {
						alreadyInArray = true;
						break;
					}
				}
				if (!alreadyInArray) {
					pointers.push(e);
				}

				e.touches = pointers.slice();
				e.changedTouches = [e];

				handler(e);
			};

			obj[pre + 'touchstart' + id] = cb;
			obj.addEventListener(this.POINTER_DOWN, cb, false);

			// need to also listen for end events to keep the _pointers list accurate
			// this needs to be on the body and never go away
			if (!this._pointerDocumentListener) {
				var internalCb = function (e) {
					for (var i = 0; i < pointers.length; i++) {
						if (pointers[i].pointerId === e.pointerId) {
							pointers.splice(i, 1);
							break;
						}
					}
				};
				//We listen on the documentElement as any drags that end by moving the touch off the screen get fired there
				document.documentElement.addEventListener(this.POINTER_UP, internalCb, false);
				document.documentElement.addEventListener(this.POINTER_CANCEL, internalCb, false);

				this._pointerDocumentListener = true;
			}

			return this;
		},

		addPointerListenerMove: function (obj, type, handler, id) {
			var pre = '_leaflet_',
			    touches = this._pointers;

			function cb(e) {

				// don't fire touch moves when mouse isn't down
				if ((e.pointerType === e.MSPOINTER_TYPE_MOUSE || e.pointerType === 'mouse') && e.buttons === 0) { return; }

				for (var i = 0; i < touches.length; i++) {
					if (touches[i].pointerId === e.pointerId) {
						touches[i] = e;
						break;
					}
				}

				e.touches = touches.slice();
				e.changedTouches = [e];

				handler(e);
			}

			obj[pre + 'touchmove' + id] = cb;
			obj.addEventListener(this.POINTER_MOVE, cb, false);

			return this;
		},

		addPointerListenerEnd: function (obj, type, handler, id) {
			var pre = '_leaflet_',
			    touches = this._pointers;

			var cb = function (e) {
				for (var i = 0; i < touches.length; i++) {
					if (touches[i].pointerId === e.pointerId) {
						touches.splice(i, 1);
						break;
					}
				}

				e.touches = touches.slice();
				e.changedTouches = [e];

				handler(e);
			};

			obj[pre + 'touchend' + id] = cb;
			obj.addEventListener(this.POINTER_UP, cb, false);
			obj.addEventListener(this.POINTER_CANCEL, cb, false);

			return this;
		},

		removePointerListener: function (obj, type, id) {
			var pre = '_leaflet_',
			    cb = obj[pre + type + id];

			switch (type) {
			case 'touchstart':
				obj.removeEventListener(this.POINTER_DOWN, cb, false);
				break;
			case 'touchmove':
				obj.removeEventListener(this.POINTER_MOVE, cb, false);
				break;
			case 'touchend':
				obj.removeEventListener(this.POINTER_UP, cb, false);
				obj.removeEventListener(this.POINTER_CANCEL, cb, false);
				break;
			}

			return this;
		}
	});


	/*
	 * L.Handler.TouchZoom is used by L.Map to add pinch zoom on supported mobile browsers.
	 */

	L.Map.mergeOptions({
		touchZoom: L.Browser.touch && !L.Browser.android23,
		bounceAtZoomLimits: true
	});

	L.Map.TouchZoom = L.Handler.extend({
		addHooks: function () {
			L.DomEvent.on(this._map._container, 'touchstart', this._onTouchStart, this);
		},

		removeHooks: function () {
			L.DomEvent.off(this._map._container, 'touchstart', this._onTouchStart, this);
		},

		_onTouchStart: function (e) {
			var map = this._map;

			if (!e.touches || e.touches.length !== 2 || map._animatingZoom || this._zooming) { return; }

			var p1 = map.mouseEventToLayerPoint(e.touches[0]),
			    p2 = map.mouseEventToLayerPoint(e.touches[1]),
			    viewCenter = map._getCenterLayerPoint();

			this._startCenter = p1.add(p2)._divideBy(2);
			this._startDist = p1.distanceTo(p2);

			this._moved = false;
			this._zooming = true;

			this._centerOffset = viewCenter.subtract(this._startCenter);

			if (map._panAnim) {
				map._panAnim.stop();
			}

			L.DomEvent
			    .on(document, 'touchmove', this._onTouchMove, this)
			    .on(document, 'touchend', this._onTouchEnd, this);

			L.DomEvent.preventDefault(e);
		},

		_onTouchMove: function (e) {
			var map = this._map;

			if (!e.touches || e.touches.length !== 2 || !this._zooming) { return; }

			var p1 = map.mouseEventToLayerPoint(e.touches[0]),
			    p2 = map.mouseEventToLayerPoint(e.touches[1]);

			this._scale = p1.distanceTo(p2) / this._startDist;
			this._delta = p1._add(p2)._divideBy(2)._subtract(this._startCenter);

			if (this._scale === 1) { return; }

			if (!map.options.bounceAtZoomLimits) {
				if ((map.getZoom() === map.getMinZoom() && this._scale < 1) ||
				    (map.getZoom() === map.getMaxZoom() && this._scale > 1)) { return; }
			}

			if (!this._moved) {
				L.DomUtil.addClass(map._mapPane, 'leaflet-touching');

				map
				    .fire('movestart')
				    .fire('zoomstart');

				this._moved = true;
			}

			L.Util.cancelAnimFrame(this._animRequest);
			this._animRequest = L.Util.requestAnimFrame(
			        this._updateOnMove, this, true, this._map._container);

			L.DomEvent.preventDefault(e);
		},

		_updateOnMove: function () {
			var map = this._map,
			    origin = this._getScaleOrigin(),
			    center = map.layerPointToLatLng(origin),
			    zoom = map.getScaleZoom(this._scale);

			map._animateZoom(center, zoom, this._startCenter, this._scale, this._delta, false, true);
		},

		_onTouchEnd: function () {
			if (!this._moved || !this._zooming) {
				this._zooming = false;
				return;
			}

			var map = this._map;

			this._zooming = false;
			L.DomUtil.removeClass(map._mapPane, 'leaflet-touching');
			L.Util.cancelAnimFrame(this._animRequest);

			L.DomEvent
			    .off(document, 'touchmove', this._onTouchMove)
			    .off(document, 'touchend', this._onTouchEnd);

			var origin = this._getScaleOrigin(),
			    center = map.layerPointToLatLng(origin),

			    oldZoom = map.getZoom(),
			    floatZoomDelta = map.getScaleZoom(this._scale) - oldZoom,
			    roundZoomDelta = (floatZoomDelta > 0 ?
			            Math.ceil(floatZoomDelta) : Math.floor(floatZoomDelta)),

			    zoom = map._limitZoom(oldZoom + roundZoomDelta),
			    scale = map.getZoomScale(zoom) / this._scale;

			map._animateZoom(center, zoom, origin, scale);
		},

		_getScaleOrigin: function () {
			var centerOffset = this._centerOffset.subtract(this._delta).divideBy(this._scale);
			return this._startCenter.add(centerOffset);
		}
	});

	L.Map.addInitHook('addHandler', 'touchZoom', L.Map.TouchZoom);


	/*
	 * L.Map.Tap is used to enable mobile hacks like quick taps and long hold.
	 */

	L.Map.mergeOptions({
		tap: true,
		tapTolerance: 15
	});

	L.Map.Tap = L.Handler.extend({
		addHooks: function () {
			L.DomEvent.on(this._map._container, 'touchstart', this._onDown, this);
		},

		removeHooks: function () {
			L.DomEvent.off(this._map._container, 'touchstart', this._onDown, this);
		},

		_onDown: function (e) {
			if (!e.touches) { return; }

			L.DomEvent.preventDefault(e);

			this._fireClick = true;

			// don't simulate click or track longpress if more than 1 touch
			if (e.touches.length > 1) {
				this._fireClick = false;
				clearTimeout(this._holdTimeout);
				return;
			}

			var first = e.touches[0],
			    el = first.target;

			this._startPos = this._newPos = new L.Point(first.clientX, first.clientY);

			// if touching a link, highlight it
			if (el.tagName && el.tagName.toLowerCase() === 'a') {
				L.DomUtil.addClass(el, 'leaflet-active');
			}

			// simulate long hold but setting a timeout
			this._holdTimeout = setTimeout(L.bind(function () {
				if (this._isTapValid()) {
					this._fireClick = false;
					this._onUp();
					this._simulateEvent('contextmenu', first);
				}
			}, this), 1000);

			L.DomEvent
				.on(document, 'touchmove', this._onMove, this)
				.on(document, 'touchend', this._onUp, this);
		},

		_onUp: function (e) {
			clearTimeout(this._holdTimeout);

			L.DomEvent
				.off(document, 'touchmove', this._onMove, this)
				.off(document, 'touchend', this._onUp, this);

			if (this._fireClick && e && e.changedTouches) {

				var first = e.changedTouches[0],
				    el = first.target;

				if (el && el.tagName && el.tagName.toLowerCase() === 'a') {
					L.DomUtil.removeClass(el, 'leaflet-active');
				}

				// simulate click if the touch didn't move too much
				if (this._isTapValid()) {
					this._simulateEvent('click', first);
				}
			}
		},

		_isTapValid: function () {
			return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
		},

		_onMove: function (e) {
			var first = e.touches[0];
			this._newPos = new L.Point(first.clientX, first.clientY);
		},

		_simulateEvent: function (type, e) {
			var simulatedEvent = document.createEvent('MouseEvents');

			simulatedEvent._simulated = true;
			e.target._simulatedClick = true;

			simulatedEvent.initMouseEvent(
			        type, true, true, window, 1,
			        e.screenX, e.screenY,
			        e.clientX, e.clientY,
			        false, false, false, false, 0, null);

			e.target.dispatchEvent(simulatedEvent);
		}
	});

	if (L.Browser.touch && !L.Browser.pointer) {
		L.Map.addInitHook('addHandler', 'tap', L.Map.Tap);
	}


	/*
	 * L.Handler.ShiftDragZoom is used to add shift-drag zoom interaction to the map
	  * (zoom to a selected bounding box), enabled by default.
	 */

	L.Map.mergeOptions({
		boxZoom: true
	});

	L.Map.BoxZoom = L.Handler.extend({
		initialize: function (map) {
			this._map = map;
			this._container = map._container;
			this._pane = map._panes.overlayPane;
			this._moved = false;
		},

		addHooks: function () {
			L.DomEvent.on(this._container, 'mousedown', this._onMouseDown, this);
		},

		removeHooks: function () {
			L.DomEvent.off(this._container, 'mousedown', this._onMouseDown);
			this._moved = false;
		},

		moved: function () {
			return this._moved;
		},

		_onMouseDown: function (e) {
			this._moved = false;

			if (!e.shiftKey || ((e.which !== 1) && (e.button !== 1))) { return false; }

			L.DomUtil.disableTextSelection();
			L.DomUtil.disableImageDrag();

			this._startLayerPoint = this._map.mouseEventToLayerPoint(e);

			L.DomEvent
			    .on(document, 'mousemove', this._onMouseMove, this)
			    .on(document, 'mouseup', this._onMouseUp, this)
			    .on(document, 'keydown', this._onKeyDown, this);
		},

		_onMouseMove: function (e) {
			if (!this._moved) {
				this._box = L.DomUtil.create('div', 'leaflet-zoom-box', this._pane);
				L.DomUtil.setPosition(this._box, this._startLayerPoint);

				//TODO refactor: move cursor to styles
				this._container.style.cursor = 'crosshair';
				this._map.fire('boxzoomstart');
			}

			var startPoint = this._startLayerPoint,
			    box = this._box,

			    layerPoint = this._map.mouseEventToLayerPoint(e),
			    offset = layerPoint.subtract(startPoint),

			    newPos = new L.Point(
			        Math.min(layerPoint.x, startPoint.x),
			        Math.min(layerPoint.y, startPoint.y));

			L.DomUtil.setPosition(box, newPos);

			this._moved = true;

			// TODO refactor: remove hardcoded 4 pixels
			box.style.width  = (Math.max(0, Math.abs(offset.x) - 4)) + 'px';
			box.style.height = (Math.max(0, Math.abs(offset.y) - 4)) + 'px';
		},

		_finish: function () {
			if (this._moved) {
				this._pane.removeChild(this._box);
				this._container.style.cursor = '';
			}

			L.DomUtil.enableTextSelection();
			L.DomUtil.enableImageDrag();

			L.DomEvent
			    .off(document, 'mousemove', this._onMouseMove)
			    .off(document, 'mouseup', this._onMouseUp)
			    .off(document, 'keydown', this._onKeyDown);
		},

		_onMouseUp: function (e) {

			this._finish();

			var map = this._map,
			    layerPoint = map.mouseEventToLayerPoint(e);

			if (this._startLayerPoint.equals(layerPoint)) { return; }

			var bounds = new L.LatLngBounds(
			        map.layerPointToLatLng(this._startLayerPoint),
			        map.layerPointToLatLng(layerPoint));

			map.fitBounds(bounds);

			map.fire('boxzoomend', {
				boxZoomBounds: bounds
			});
		},

		_onKeyDown: function (e) {
			if (e.keyCode === 27) {
				this._finish();
			}
		}
	});

	L.Map.addInitHook('addHandler', 'boxZoom', L.Map.BoxZoom);


	/*
	 * L.Map.Keyboard is handling keyboard interaction with the map, enabled by default.
	 */

	L.Map.mergeOptions({
		keyboard: true,
		keyboardPanOffset: 80,
		keyboardZoomOffset: 1
	});

	L.Map.Keyboard = L.Handler.extend({

		keyCodes: {
			left:    [37],
			right:   [39],
			down:    [40],
			up:      [38],
			zoomIn:  [187, 107, 61, 171],
			zoomOut: [189, 109, 173]
		},

		initialize: function (map) {
			this._map = map;

			this._setPanOffset(map.options.keyboardPanOffset);
			this._setZoomOffset(map.options.keyboardZoomOffset);
		},

		addHooks: function () {
			var container = this._map._container;

			// make the container focusable by tabbing
			if (container.tabIndex === -1) {
				container.tabIndex = '0';
			}

			L.DomEvent
			    .on(container, 'focus', this._onFocus, this)
			    .on(container, 'blur', this._onBlur, this)
			    .on(container, 'mousedown', this._onMouseDown, this);

			this._map
			    .on('focus', this._addHooks, this)
			    .on('blur', this._removeHooks, this);
		},

		removeHooks: function () {
			this._removeHooks();

			var container = this._map._container;

			L.DomEvent
			    .off(container, 'focus', this._onFocus, this)
			    .off(container, 'blur', this._onBlur, this)
			    .off(container, 'mousedown', this._onMouseDown, this);

			this._map
			    .off('focus', this._addHooks, this)
			    .off('blur', this._removeHooks, this);
		},

		_onMouseDown: function () {
			if (this._focused) { return; }

			var body = document.body,
			    docEl = document.documentElement,
			    top = body.scrollTop || docEl.scrollTop,
			    left = body.scrollLeft || docEl.scrollLeft;

			this._map._container.focus();

			window.scrollTo(left, top);
		},

		_onFocus: function () {
			this._focused = true;
			this._map.fire('focus');
		},

		_onBlur: function () {
			this._focused = false;
			this._map.fire('blur');
		},

		_setPanOffset: function (pan) {
			var keys = this._panKeys = {},
			    codes = this.keyCodes,
			    i, len;

			for (i = 0, len = codes.left.length; i < len; i++) {
				keys[codes.left[i]] = [-1 * pan, 0];
			}
			for (i = 0, len = codes.right.length; i < len; i++) {
				keys[codes.right[i]] = [pan, 0];
			}
			for (i = 0, len = codes.down.length; i < len; i++) {
				keys[codes.down[i]] = [0, pan];
			}
			for (i = 0, len = codes.up.length; i < len; i++) {
				keys[codes.up[i]] = [0, -1 * pan];
			}
		},

		_setZoomOffset: function (zoom) {
			var keys = this._zoomKeys = {},
			    codes = this.keyCodes,
			    i, len;

			for (i = 0, len = codes.zoomIn.length; i < len; i++) {
				keys[codes.zoomIn[i]] = zoom;
			}
			for (i = 0, len = codes.zoomOut.length; i < len; i++) {
				keys[codes.zoomOut[i]] = -zoom;
			}
		},

		_addHooks: function () {
			L.DomEvent.on(document, 'keydown', this._onKeyDown, this);
		},

		_removeHooks: function () {
			L.DomEvent.off(document, 'keydown', this._onKeyDown, this);
		},

		_onKeyDown: function (e) {
			var key = e.keyCode,
			    map = this._map;

			if (key in this._panKeys) {

				if (map._panAnim && map._panAnim._inProgress) { return; }

				map.panBy(this._panKeys[key]);

				if (map.options.maxBounds) {
					map.panInsideBounds(map.options.maxBounds);
				}

			} else if (key in this._zoomKeys) {
				map.setZoom(map.getZoom() + this._zoomKeys[key]);

			} else {
				return;
			}

			L.DomEvent.stop(e);
		}
	});

	L.Map.addInitHook('addHandler', 'keyboard', L.Map.Keyboard);


	/*
	 * L.Handler.MarkerDrag is used internally by L.Marker to make the markers draggable.
	 */

	L.Handler.MarkerDrag = L.Handler.extend({
		initialize: function (marker) {
			this._marker = marker;
		},

		addHooks: function () {
			var icon = this._marker._icon;
			if (!this._draggable) {
				this._draggable = new L.Draggable(icon, icon);
			}

			this._draggable
				.on('dragstart', this._onDragStart, this)
				.on('drag', this._onDrag, this)
				.on('dragend', this._onDragEnd, this);
			this._draggable.enable();
			L.DomUtil.addClass(this._marker._icon, 'leaflet-marker-draggable');
		},

		removeHooks: function () {
			this._draggable
				.off('dragstart', this._onDragStart, this)
				.off('drag', this._onDrag, this)
				.off('dragend', this._onDragEnd, this);

			this._draggable.disable();
			L.DomUtil.removeClass(this._marker._icon, 'leaflet-marker-draggable');
		},

		moved: function () {
			return this._draggable && this._draggable._moved;
		},

		_onDragStart: function () {
			this._marker
			    .closePopup()
			    .fire('movestart')
			    .fire('dragstart');
		},

		_onDrag: function () {
			var marker = this._marker,
			    shadow = marker._shadow,
			    iconPos = L.DomUtil.getPosition(marker._icon),
			    latlng = marker._map.layerPointToLatLng(iconPos);

			// update shadow position
			if (shadow) {
				L.DomUtil.setPosition(shadow, iconPos);
			}

			marker._latlng = latlng;

			marker
			    .fire('move', {latlng: latlng})
			    .fire('drag');
		},

		_onDragEnd: function (e) {
			this._marker
			    .fire('moveend')
			    .fire('dragend', e);
		}
	});


	/*
	 * L.Control is a base class for implementing map controls. Handles positioning.
	 * All other controls extend from this class.
	 */

	L.Control = L.Class.extend({
		options: {
			position: 'topright'
		},

		initialize: function (options) {
			L.setOptions(this, options);
		},

		getPosition: function () {
			return this.options.position;
		},

		setPosition: function (position) {
			var map = this._map;

			if (map) {
				map.removeControl(this);
			}

			this.options.position = position;

			if (map) {
				map.addControl(this);
			}

			return this;
		},

		getContainer: function () {
			return this._container;
		},

		addTo: function (map) {
			this._map = map;

			var container = this._container = this.onAdd(map),
			    pos = this.getPosition(),
			    corner = map._controlCorners[pos];

			L.DomUtil.addClass(container, 'leaflet-control');

			if (pos.indexOf('bottom') !== -1) {
				corner.insertBefore(container, corner.firstChild);
			} else {
				corner.appendChild(container);
			}

			return this;
		},

		removeFrom: function (map) {
			var pos = this.getPosition(),
			    corner = map._controlCorners[pos];

			corner.removeChild(this._container);
			this._map = null;

			if (this.onRemove) {
				this.onRemove(map);
			}

			return this;
		},

		_refocusOnMap: function () {
			if (this._map) {
				this._map.getContainer().focus();
			}
		}
	});

	L.control = function (options) {
		return new L.Control(options);
	};


	// adds control-related methods to L.Map

	L.Map.include({
		addControl: function (control) {
			control.addTo(this);
			return this;
		},

		removeControl: function (control) {
			control.removeFrom(this);
			return this;
		},

		_initControlPos: function () {
			var corners = this._controlCorners = {},
			    l = 'leaflet-',
			    container = this._controlContainer =
			            L.DomUtil.create('div', l + 'control-container', this._container);

			function createCorner(vSide, hSide) {
				var className = l + vSide + ' ' + l + hSide;

				corners[vSide + hSide] = L.DomUtil.create('div', className, container);
			}

			createCorner('top', 'left');
			createCorner('top', 'right');
			createCorner('bottom', 'left');
			createCorner('bottom', 'right');
		},

		_clearControlPos: function () {
			this._container.removeChild(this._controlContainer);
		}
	});


	/*
	 * L.Control.Zoom is used for the default zoom buttons on the map.
	 */

	L.Control.Zoom = L.Control.extend({
		options: {
			position: 'topleft',
			zoomInText: '+',
			zoomInTitle: 'Zoom in',
			zoomOutText: '-',
			zoomOutTitle: 'Zoom out'
		},

		onAdd: function (map) {
			var zoomName = 'leaflet-control-zoom',
			    container = L.DomUtil.create('div', zoomName + ' leaflet-bar');

			this._map = map;

			this._zoomInButton  = this._createButton(
			        this.options.zoomInText, this.options.zoomInTitle,
			        zoomName + '-in',  container, this._zoomIn,  this);
			this._zoomOutButton = this._createButton(
			        this.options.zoomOutText, this.options.zoomOutTitle,
			        zoomName + '-out', container, this._zoomOut, this);

			this._updateDisabled();
			map.on('zoomend zoomlevelschange', this._updateDisabled, this);

			return container;
		},

		onRemove: function (map) {
			map.off('zoomend zoomlevelschange', this._updateDisabled, this);
		},

		_zoomIn: function (e) {
			this._map.zoomIn(e.shiftKey ? 3 : 1);
		},

		_zoomOut: function (e) {
			this._map.zoomOut(e.shiftKey ? 3 : 1);
		},

		_createButton: function (html, title, className, container, fn, context) {
			var link = L.DomUtil.create('a', className, container);
			link.innerHTML = html;
			link.href = '#';
			link.title = title;

			var stop = L.DomEvent.stopPropagation;

			L.DomEvent
			    .on(link, 'click', stop)
			    .on(link, 'mousedown', stop)
			    .on(link, 'dblclick', stop)
			    .on(link, 'click', L.DomEvent.preventDefault)
			    .on(link, 'click', fn, context)
			    .on(link, 'click', this._refocusOnMap, context);

			return link;
		},

		_updateDisabled: function () {
			var map = this._map,
				className = 'leaflet-disabled';

			L.DomUtil.removeClass(this._zoomInButton, className);
			L.DomUtil.removeClass(this._zoomOutButton, className);

			if (map._zoom === map.getMinZoom()) {
				L.DomUtil.addClass(this._zoomOutButton, className);
			}
			if (map._zoom === map.getMaxZoom()) {
				L.DomUtil.addClass(this._zoomInButton, className);
			}
		}
	});

	L.Map.mergeOptions({
		zoomControl: true
	});

	L.Map.addInitHook(function () {
		if (this.options.zoomControl) {
			this.zoomControl = new L.Control.Zoom();
			this.addControl(this.zoomControl);
		}
	});

	L.control.zoom = function (options) {
		return new L.Control.Zoom(options);
	};



	/*
	 * L.Control.Attribution is used for displaying attribution on the map (added by default).
	 */

	L.Control.Attribution = L.Control.extend({
		options: {
			position: 'bottomright',
			prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
		},

		initialize: function (options) {
			L.setOptions(this, options);

			this._attributions = {};
		},

		onAdd: function (map) {
			this._container = L.DomUtil.create('div', 'leaflet-control-attribution');
			L.DomEvent.disableClickPropagation(this._container);

			for (var i in map._layers) {
				if (map._layers[i].getAttribution) {
					this.addAttribution(map._layers[i].getAttribution());
				}
			}
			
			map
			    .on('layeradd', this._onLayerAdd, this)
			    .on('layerremove', this._onLayerRemove, this);

			this._update();

			return this._container;
		},

		onRemove: function (map) {
			map
			    .off('layeradd', this._onLayerAdd)
			    .off('layerremove', this._onLayerRemove);

		},

		setPrefix: function (prefix) {
			this.options.prefix = prefix;
			this._update();
			return this;
		},

		addAttribution: function (text) {
			if (!text) { return; }

			if (!this._attributions[text]) {
				this._attributions[text] = 0;
			}
			this._attributions[text]++;

			this._update();

			return this;
		},

		removeAttribution: function (text) {
			if (!text) { return; }

			if (this._attributions[text]) {
				this._attributions[text]--;
				this._update();
			}

			return this;
		},

		_update: function () {
			if (!this._map) { return; }

			var attribs = [];

			for (var i in this._attributions) {
				if (this._attributions[i]) {
					attribs.push(i);
				}
			}

			var prefixAndAttribs = [];

			if (this.options.prefix) {
				prefixAndAttribs.push(this.options.prefix);
			}
			if (attribs.length) {
				prefixAndAttribs.push(attribs.join(', '));
			}

			this._container.innerHTML = prefixAndAttribs.join(' | ');
		},

		_onLayerAdd: function (e) {
			if (e.layer.getAttribution) {
				this.addAttribution(e.layer.getAttribution());
			}
		},

		_onLayerRemove: function (e) {
			if (e.layer.getAttribution) {
				this.removeAttribution(e.layer.getAttribution());
			}
		}
	});

	L.Map.mergeOptions({
		attributionControl: true
	});

	L.Map.addInitHook(function () {
		if (this.options.attributionControl) {
			this.attributionControl = (new L.Control.Attribution()).addTo(this);
		}
	});

	L.control.attribution = function (options) {
		return new L.Control.Attribution(options);
	};


	/*
	 * L.Control.Scale is used for displaying metric/imperial scale on the map.
	 */

	L.Control.Scale = L.Control.extend({
		options: {
			position: 'bottomleft',
			maxWidth: 100,
			metric: true,
			imperial: true,
			updateWhenIdle: false
		},

		onAdd: function (map) {
			this._map = map;

			var className = 'leaflet-control-scale',
			    container = L.DomUtil.create('div', className),
			    options = this.options;

			this._addScales(options, className, container);

			map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
			map.whenReady(this._update, this);

			return container;
		},

		onRemove: function (map) {
			map.off(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
		},

		_addScales: function (options, className, container) {
			if (options.metric) {
				this._mScale = L.DomUtil.create('div', className + '-line', container);
			}
			if (options.imperial) {
				this._iScale = L.DomUtil.create('div', className + '-line', container);
			}
		},

		_update: function () {
			var bounds = this._map.getBounds(),
			    centerLat = bounds.getCenter().lat,
			    halfWorldMeters = 6378137 * Math.PI * Math.cos(centerLat * Math.PI / 180),
			    dist = halfWorldMeters * (bounds.getNorthEast().lng - bounds.getSouthWest().lng) / 180,

			    size = this._map.getSize(),
			    options = this.options,
			    maxMeters = 0;

			if (size.x > 0) {
				maxMeters = dist * (options.maxWidth / size.x);
			}

			this._updateScales(options, maxMeters);
		},

		_updateScales: function (options, maxMeters) {
			if (options.metric && maxMeters) {
				this._updateMetric(maxMeters);
			}

			if (options.imperial && maxMeters) {
				this._updateImperial(maxMeters);
			}
		},

		_updateMetric: function (maxMeters) {
			var meters = this._getRoundNum(maxMeters);

			this._mScale.style.width = this._getScaleWidth(meters / maxMeters) + 'px';
			this._mScale.innerHTML = meters < 1000 ? meters + ' m' : (meters / 1000) + ' km';
		},

		_updateImperial: function (maxMeters) {
			var maxFeet = maxMeters * 3.2808399,
			    scale = this._iScale,
			    maxMiles, miles, feet;

			if (maxFeet > 5280) {
				maxMiles = maxFeet / 5280;
				miles = this._getRoundNum(maxMiles);

				scale.style.width = this._getScaleWidth(miles / maxMiles) + 'px';
				scale.innerHTML = miles + ' mi';

			} else {
				feet = this._getRoundNum(maxFeet);

				scale.style.width = this._getScaleWidth(feet / maxFeet) + 'px';
				scale.innerHTML = feet + ' ft';
			}
		},

		_getScaleWidth: function (ratio) {
			return Math.round(this.options.maxWidth * ratio) - 10;
		},

		_getRoundNum: function (num) {
			var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1),
			    d = num / pow10;

			d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1;

			return pow10 * d;
		}
	});

	L.control.scale = function (options) {
		return new L.Control.Scale(options);
	};


	/*
	 * L.Control.Layers is a control to allow users to switch between different layers on the map.
	 */

	L.Control.Layers = L.Control.extend({
		options: {
			collapsed: true,
			position: 'topright',
			autoZIndex: true
		},

		initialize: function (baseLayers, overlays, options) {
			L.setOptions(this, options);

			this._layers = {};
			this._lastZIndex = 0;
			this._handlingClick = false;

			for (var i in baseLayers) {
				this._addLayer(baseLayers[i], i);
			}

			for (i in overlays) {
				this._addLayer(overlays[i], i, true);
			}
		},

		onAdd: function (map) {
			this._initLayout();
			this._update();

			map
			    .on('layeradd', this._onLayerChange, this)
			    .on('layerremove', this._onLayerChange, this);

			return this._container;
		},

		onRemove: function (map) {
			map
			    .off('layeradd', this._onLayerChange, this)
			    .off('layerremove', this._onLayerChange, this);
		},

		addBaseLayer: function (layer, name) {
			this._addLayer(layer, name);
			this._update();
			return this;
		},

		addOverlay: function (layer, name) {
			this._addLayer(layer, name, true);
			this._update();
			return this;
		},

		removeLayer: function (layer) {
			var id = L.stamp(layer);
			delete this._layers[id];
			this._update();
			return this;
		},

		_initLayout: function () {
			var className = 'leaflet-control-layers',
			    container = this._container = L.DomUtil.create('div', className);

			//Makes this work on IE10 Touch devices by stopping it from firing a mouseout event when the touch is released
			container.setAttribute('aria-haspopup', true);

			if (!L.Browser.touch) {
				L.DomEvent
					.disableClickPropagation(container)
					.disableScrollPropagation(container);
			} else {
				L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
			}

			var form = this._form = L.DomUtil.create('form', className + '-list');

			if (this.options.collapsed) {
				if (!L.Browser.android) {
					L.DomEvent
					    .on(container, 'mouseover', this._expand, this)
					    .on(container, 'mouseout', this._collapse, this);
				}
				var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
				link.href = '#';
				link.title = 'Layers';

				if (L.Browser.touch) {
					L.DomEvent
					    .on(link, 'click', L.DomEvent.stop)
					    .on(link, 'click', this._expand, this);
				}
				else {
					L.DomEvent.on(link, 'focus', this._expand, this);
				}
				//Work around for Firefox android issue https://github.com/Leaflet/Leaflet/issues/2033
				L.DomEvent.on(form, 'click', function () {
					setTimeout(L.bind(this._onInputClick, this), 0);
				}, this);

				this._map.on('click', this._collapse, this);
				// TODO keyboard accessibility
			} else {
				this._expand();
			}

			this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
			this._separator = L.DomUtil.create('div', className + '-separator', form);
			this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

			container.appendChild(form);
		},

		_addLayer: function (layer, name, overlay) {
			var id = L.stamp(layer);

			this._layers[id] = {
				layer: layer,
				name: name,
				overlay: overlay
			};

			if (this.options.autoZIndex && layer.setZIndex) {
				this._lastZIndex++;
				layer.setZIndex(this._lastZIndex);
			}
		},

		_update: function () {
			if (!this._container) {
				return;
			}

			this._baseLayersList.innerHTML = '';
			this._overlaysList.innerHTML = '';

			var baseLayersPresent = false,
			    overlaysPresent = false,
			    i, obj;

			for (i in this._layers) {
				obj = this._layers[i];
				this._addItem(obj);
				overlaysPresent = overlaysPresent || obj.overlay;
				baseLayersPresent = baseLayersPresent || !obj.overlay;
			}

			this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';
		},

		_onLayerChange: function (e) {
			var obj = this._layers[L.stamp(e.layer)];

			if (!obj) { return; }

			if (!this._handlingClick) {
				this._update();
			}

			var type = obj.overlay ?
				(e.type === 'layeradd' ? 'overlayadd' : 'overlayremove') :
				(e.type === 'layeradd' ? 'baselayerchange' : null);

			if (type) {
				this._map.fire(type, obj);
			}
		},

		// IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
		_createRadioElement: function (name, checked) {

			var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' + name + '"';
			if (checked) {
				radioHtml += ' checked="checked"';
			}
			radioHtml += '/>';

			var radioFragment = document.createElement('div');
			radioFragment.innerHTML = radioHtml;

			return radioFragment.firstChild;
		},

		_addItem: function (obj) {
			var label = document.createElement('label'),
			    input,
			    checked = this._map.hasLayer(obj.layer);

			if (obj.overlay) {
				input = document.createElement('input');
				input.type = 'checkbox';
				input.className = 'leaflet-control-layers-selector';
				input.defaultChecked = checked;
			} else {
				input = this._createRadioElement('leaflet-base-layers', checked);
			}

			input.layerId = L.stamp(obj.layer);

			L.DomEvent.on(input, 'click', this._onInputClick, this);

			var name = document.createElement('span');
			name.innerHTML = ' ' + obj.name;

			label.appendChild(input);
			label.appendChild(name);

			var container = obj.overlay ? this._overlaysList : this._baseLayersList;
			container.appendChild(label);

			return label;
		},

		_onInputClick: function () {
			var i, input, obj,
			    inputs = this._form.getElementsByTagName('input'),
			    inputsLen = inputs.length;

			this._handlingClick = true;

			for (i = 0; i < inputsLen; i++) {
				input = inputs[i];
				obj = this._layers[input.layerId];

				if (input.checked && !this._map.hasLayer(obj.layer)) {
					this._map.addLayer(obj.layer);

				} else if (!input.checked && this._map.hasLayer(obj.layer)) {
					this._map.removeLayer(obj.layer);
				}
			}

			this._handlingClick = false;

			this._refocusOnMap();
		},

		_expand: function () {
			L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
		},

		_collapse: function () {
			this._container.className = this._container.className.replace(' leaflet-control-layers-expanded', '');
		}
	});

	L.control.layers = function (baseLayers, overlays, options) {
		return new L.Control.Layers(baseLayers, overlays, options);
	};


	/*
	 * L.PosAnimation is used by Leaflet internally for pan animations.
	 */

	L.PosAnimation = L.Class.extend({
		includes: L.Mixin.Events,

		run: function (el, newPos, duration, easeLinearity) { // (HTMLElement, Point[, Number, Number])
			this.stop();

			this._el = el;
			this._inProgress = true;
			this._newPos = newPos;

			this.fire('start');

			el.style[L.DomUtil.TRANSITION] = 'all ' + (duration || 0.25) +
			        's cubic-bezier(0,0,' + (easeLinearity || 0.5) + ',1)';

			L.DomEvent.on(el, L.DomUtil.TRANSITION_END, this._onTransitionEnd, this);
			L.DomUtil.setPosition(el, newPos);

			// toggle reflow, Chrome flickers for some reason if you don't do this
			L.Util.falseFn(el.offsetWidth);

			// there's no native way to track value updates of transitioned properties, so we imitate this
			this._stepTimer = setInterval(L.bind(this._onStep, this), 50);
		},

		stop: function () {
			if (!this._inProgress) { return; }

			// if we just removed the transition property, the element would jump to its final position,
			// so we need to make it stay at the current position

			L.DomUtil.setPosition(this._el, this._getPos());
			this._onTransitionEnd();
			L.Util.falseFn(this._el.offsetWidth); // force reflow in case we are about to start a new animation
		},

		_onStep: function () {
			var stepPos = this._getPos();
			if (!stepPos) {
				this._onTransitionEnd();
				return;
			}
			// jshint camelcase: false
			// make L.DomUtil.getPosition return intermediate position value during animation
			this._el._leaflet_pos = stepPos;

			this.fire('step');
		},

		// you can't easily get intermediate values of properties animated with CSS3 Transitions,
		// we need to parse computed style (in case of transform it returns matrix string)

		_transformRe: /([-+]?(?:\d*\.)?\d+)\D*, ([-+]?(?:\d*\.)?\d+)\D*\)/,

		_getPos: function () {
			var left, top, matches,
			    el = this._el,
			    style = window.getComputedStyle(el);

			if (L.Browser.any3d) {
				matches = style[L.DomUtil.TRANSFORM].match(this._transformRe);
				if (!matches) { return; }
				left = parseFloat(matches[1]);
				top  = parseFloat(matches[2]);
			} else {
				left = parseFloat(style.left);
				top  = parseFloat(style.top);
			}

			return new L.Point(left, top, true);
		},

		_onTransitionEnd: function () {
			L.DomEvent.off(this._el, L.DomUtil.TRANSITION_END, this._onTransitionEnd, this);

			if (!this._inProgress) { return; }
			this._inProgress = false;

			this._el.style[L.DomUtil.TRANSITION] = '';

			// jshint camelcase: false
			// make sure L.DomUtil.getPosition returns the final position value after animation
			this._el._leaflet_pos = this._newPos;

			clearInterval(this._stepTimer);

			this.fire('step').fire('end');
		}

	});


	/*
	 * Extends L.Map to handle panning animations.
	 */

	L.Map.include({

		setView: function (center, zoom, options) {

			zoom = zoom === undefined ? this._zoom : this._limitZoom(zoom);
			center = this._limitCenter(L.latLng(center), zoom, this.options.maxBounds);
			options = options || {};

			if (this._panAnim) {
				this._panAnim.stop();
			}

			if (this._loaded && !options.reset && options !== true) {

				if (options.animate !== undefined) {
					options.zoom = L.extend({animate: options.animate}, options.zoom);
					options.pan = L.extend({animate: options.animate}, options.pan);
				}

				// try animating pan or zoom
				var animated = (this._zoom !== zoom) ?
					this._tryAnimatedZoom && this._tryAnimatedZoom(center, zoom, options.zoom) :
					this._tryAnimatedPan(center, options.pan);

				if (animated) {
					// prevent resize handler call, the view will refresh after animation anyway
					clearTimeout(this._sizeTimer);
					return this;
				}
			}

			// animation didn't start, just reset the map view
			this._resetView(center, zoom);

			return this;
		},

		panBy: function (offset, options) {
			offset = L.point(offset).round();
			options = options || {};

			if (!offset.x && !offset.y) {
				return this;
			}

			if (!this._panAnim) {
				this._panAnim = new L.PosAnimation();

				this._panAnim.on({
					'step': this._onPanTransitionStep,
					'end': this._onPanTransitionEnd
				}, this);
			}

			// don't fire movestart if animating inertia
			if (!options.noMoveStart) {
				this.fire('movestart');
			}

			// animate pan unless animate: false specified
			if (options.animate !== false) {
				L.DomUtil.addClass(this._mapPane, 'leaflet-pan-anim');

				var newPos = this._getMapPanePos().subtract(offset);
				this._panAnim.run(this._mapPane, newPos, options.duration || 0.25, options.easeLinearity);
			} else {
				this._rawPanBy(offset);
				this.fire('move').fire('moveend');
			}

			return this;
		},

		_onPanTransitionStep: function () {
			this.fire('move');
		},

		_onPanTransitionEnd: function () {
			L.DomUtil.removeClass(this._mapPane, 'leaflet-pan-anim');
			this.fire('moveend');
		},

		_tryAnimatedPan: function (center, options) {
			// difference between the new and current centers in pixels
			var offset = this._getCenterOffset(center)._floor();

			// don't animate too far unless animate: true specified in options
			if ((options && options.animate) !== true && !this.getSize().contains(offset)) { return false; }

			this.panBy(offset, options);

			return true;
		}
	});


	/*
	 * L.PosAnimation fallback implementation that powers Leaflet pan animations
	 * in browsers that don't support CSS3 Transitions.
	 */

	L.PosAnimation = L.DomUtil.TRANSITION ? L.PosAnimation : L.PosAnimation.extend({

		run: function (el, newPos, duration, easeLinearity) { // (HTMLElement, Point[, Number, Number])
			this.stop();

			this._el = el;
			this._inProgress = true;
			this._duration = duration || 0.25;
			this._easeOutPower = 1 / Math.max(easeLinearity || 0.5, 0.2);

			this._startPos = L.DomUtil.getPosition(el);
			this._offset = newPos.subtract(this._startPos);
			this._startTime = +new Date();

			this.fire('start');

			this._animate();
		},

		stop: function () {
			if (!this._inProgress) { return; }

			this._step();
			this._complete();
		},

		_animate: function () {
			// animation loop
			this._animId = L.Util.requestAnimFrame(this._animate, this);
			this._step();
		},

		_step: function () {
			var elapsed = (+new Date()) - this._startTime,
			    duration = this._duration * 1000;

			if (elapsed < duration) {
				this._runFrame(this._easeOut(elapsed / duration));
			} else {
				this._runFrame(1);
				this._complete();
			}
		},

		_runFrame: function (progress) {
			var pos = this._startPos.add(this._offset.multiplyBy(progress));
			L.DomUtil.setPosition(this._el, pos);

			this.fire('step');
		},

		_complete: function () {
			L.Util.cancelAnimFrame(this._animId);

			this._inProgress = false;
			this.fire('end');
		},

		_easeOut: function (t) {
			return 1 - Math.pow(1 - t, this._easeOutPower);
		}
	});


	/*
	 * Extends L.Map to handle zoom animations.
	 */

	L.Map.mergeOptions({
		zoomAnimation: true,
		zoomAnimationThreshold: 4
	});

	if (L.DomUtil.TRANSITION) {

		L.Map.addInitHook(function () {
			// don't animate on browsers without hardware-accelerated transitions or old Android/Opera
			this._zoomAnimated = this.options.zoomAnimation && L.DomUtil.TRANSITION &&
					L.Browser.any3d && !L.Browser.android23 && !L.Browser.mobileOpera;

			// zoom transitions run with the same duration for all layers, so if one of transitionend events
			// happens after starting zoom animation (propagating to the map pane), we know that it ended globally
			if (this._zoomAnimated) {
				L.DomEvent.on(this._mapPane, L.DomUtil.TRANSITION_END, this._catchTransitionEnd, this);
			}
		});
	}

	L.Map.include(!L.DomUtil.TRANSITION ? {} : {

		_catchTransitionEnd: function (e) {
			if (this._animatingZoom && e.propertyName.indexOf('transform') >= 0) {
				this._onZoomTransitionEnd();
			}
		},

		_nothingToAnimate: function () {
			return !this._container.getElementsByClassName('leaflet-zoom-animated').length;
		},

		_tryAnimatedZoom: function (center, zoom, options) {

			if (this._animatingZoom) { return true; }

			options = options || {};

			// don't animate if disabled, not supported or zoom difference is too large
			if (!this._zoomAnimated || options.animate === false || this._nothingToAnimate() ||
			        Math.abs(zoom - this._zoom) > this.options.zoomAnimationThreshold) { return false; }

			// offset is the pixel coords of the zoom origin relative to the current center
			var scale = this.getZoomScale(zoom),
			    offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale),
				origin = this._getCenterLayerPoint()._add(offset);

			// don't animate if the zoom origin isn't within one screen from the current center, unless forced
			if (options.animate !== true && !this.getSize().contains(offset)) { return false; }

			this
			    .fire('movestart')
			    .fire('zoomstart');

			this._animateZoom(center, zoom, origin, scale, null, true);

			return true;
		},

		_animateZoom: function (center, zoom, origin, scale, delta, backwards, forTouchZoom) {

			if (!forTouchZoom) {
				this._animatingZoom = true;
			}

			// put transform transition on all layers with leaflet-zoom-animated class
			L.DomUtil.addClass(this._mapPane, 'leaflet-zoom-anim');

			// remember what center/zoom to set after animation
			this._animateToCenter = center;
			this._animateToZoom = zoom;

			// disable any dragging during animation
			if (L.Draggable) {
				L.Draggable._disabled = true;
			}

			L.Util.requestAnimFrame(function () {
				this.fire('zoomanim', {
					center: center,
					zoom: zoom,
					origin: origin,
					scale: scale,
					delta: delta,
					backwards: backwards
				});
				// horrible hack to work around a Chrome bug https://github.com/Leaflet/Leaflet/issues/3689
				setTimeout(L.bind(this._onZoomTransitionEnd, this), 250);
			}, this);
		},

		_onZoomTransitionEnd: function () {
			if (!this._animatingZoom) { return; }

			this._animatingZoom = false;

			L.DomUtil.removeClass(this._mapPane, 'leaflet-zoom-anim');

			L.Util.requestAnimFrame(function () {
				this._resetView(this._animateToCenter, this._animateToZoom, true, true);

				if (L.Draggable) {
					L.Draggable._disabled = false;
				}
			}, this);
		}
	});


	/*
		Zoom animation logic for L.TileLayer.
	*/

	L.TileLayer.include({
		_animateZoom: function (e) {
			if (!this._animating) {
				this._animating = true;
				this._prepareBgBuffer();
			}

			var bg = this._bgBuffer,
			    transform = L.DomUtil.TRANSFORM,
			    initialTransform = e.delta ? L.DomUtil.getTranslateString(e.delta) : bg.style[transform],
			    scaleStr = L.DomUtil.getScaleString(e.scale, e.origin);

			bg.style[transform] = e.backwards ?
					scaleStr + ' ' + initialTransform :
					initialTransform + ' ' + scaleStr;
		},

		_endZoomAnim: function () {
			var front = this._tileContainer,
			    bg = this._bgBuffer;

			front.style.visibility = '';
			front.parentNode.appendChild(front); // Bring to fore

			// force reflow
			L.Util.falseFn(bg.offsetWidth);

			var zoom = this._map.getZoom();
			if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
				this._clearBgBuffer();
			}

			this._animating = false;
		},

		_clearBgBuffer: function () {
			var map = this._map;

			if (map && !map._animatingZoom && !map.touchZoom._zooming) {
				this._bgBuffer.innerHTML = '';
				this._bgBuffer.style[L.DomUtil.TRANSFORM] = '';
			}
		},

		_prepareBgBuffer: function () {

			var front = this._tileContainer,
			    bg = this._bgBuffer;

			// if foreground layer doesn't have many tiles but bg layer does,
			// keep the existing bg layer and just zoom it some more

			var bgLoaded = this._getLoadedTilesPercentage(bg),
			    frontLoaded = this._getLoadedTilesPercentage(front);

			if (bg && bgLoaded > 0.5 && frontLoaded < 0.5) {

				front.style.visibility = 'hidden';
				this._stopLoadingImages(front);
				return;
			}

			// prepare the buffer to become the front tile pane
			bg.style.visibility = 'hidden';
			bg.style[L.DomUtil.TRANSFORM] = '';

			// switch out the current layer to be the new bg layer (and vice-versa)
			this._tileContainer = bg;
			bg = this._bgBuffer = front;

			this._stopLoadingImages(bg);

			//prevent bg buffer from clearing right after zoom
			clearTimeout(this._clearBgBufferTimer);
		},

		_getLoadedTilesPercentage: function (container) {
			var tiles = container.getElementsByTagName('img'),
			    i, len, count = 0;

			for (i = 0, len = tiles.length; i < len; i++) {
				if (tiles[i].complete) {
					count++;
				}
			}
			return count / len;
		},

		// stops loading all tiles in the background layer
		_stopLoadingImages: function (container) {
			var tiles = Array.prototype.slice.call(container.getElementsByTagName('img')),
			    i, len, tile;

			for (i = 0, len = tiles.length; i < len; i++) {
				tile = tiles[i];

				if (!tile.complete) {
					tile.onload = L.Util.falseFn;
					tile.onerror = L.Util.falseFn;
					tile.src = L.Util.emptyImageUrl;

					tile.parentNode.removeChild(tile);
				}
			}
		}
	});


	/*
	 * Provides L.Map with convenient shortcuts for using browser geolocation features.
	 */

	L.Map.include({
		_defaultLocateOptions: {
			watch: false,
			setView: false,
			maxZoom: Infinity,
			timeout: 10000,
			maximumAge: 0,
			enableHighAccuracy: false
		},

		locate: function (/*Object*/ options) {

			options = this._locateOptions = L.extend(this._defaultLocateOptions, options);

			if (!navigator.geolocation) {
				this._handleGeolocationError({
					code: 0,
					message: 'Geolocation not supported.'
				});
				return this;
			}

			var onResponse = L.bind(this._handleGeolocationResponse, this),
				onError = L.bind(this._handleGeolocationError, this);

			if (options.watch) {
				this._locationWatchId =
				        navigator.geolocation.watchPosition(onResponse, onError, options);
			} else {
				navigator.geolocation.getCurrentPosition(onResponse, onError, options);
			}
			return this;
		},

		stopLocate: function () {
			if (navigator.geolocation) {
				navigator.geolocation.clearWatch(this._locationWatchId);
			}
			if (this._locateOptions) {
				this._locateOptions.setView = false;
			}
			return this;
		},

		_handleGeolocationError: function (error) {
			var c = error.code,
			    message = error.message ||
			            (c === 1 ? 'permission denied' :
			            (c === 2 ? 'position unavailable' : 'timeout'));

			if (this._locateOptions.setView && !this._loaded) {
				this.fitWorld();
			}

			this.fire('locationerror', {
				code: c,
				message: 'Geolocation error: ' + message + '.'
			});
		},

		_handleGeolocationResponse: function (pos) {
			var lat = pos.coords.latitude,
			    lng = pos.coords.longitude,
			    latlng = new L.LatLng(lat, lng),

			    latAccuracy = 180 * pos.coords.accuracy / 40075017,
			    lngAccuracy = latAccuracy / Math.cos(L.LatLng.DEG_TO_RAD * lat),

			    bounds = L.latLngBounds(
			            [lat - latAccuracy, lng - lngAccuracy],
			            [lat + latAccuracy, lng + lngAccuracy]),

			    options = this._locateOptions;

			if (options.setView) {
				var zoom = Math.min(this.getBoundsZoom(bounds), options.maxZoom);
				this.setView(latlng, zoom);
			}

			var data = {
				latlng: latlng,
				bounds: bounds,
				timestamp: pos.timestamp
			};

			for (var i in pos.coords) {
				if (typeof pos.coords[i] === 'number') {
					data[i] = pos.coords[i];
				}
			}

			this.fire('locationfound', data);
		}
	});


	}(window, document));

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var geocoderControl = __webpack_require__(11),
	    gridControl = __webpack_require__(21),
	    featureLayer = __webpack_require__(25),
	    legendControl = __webpack_require__(28),
	    shareControl = __webpack_require__(29),
	    tileLayer = __webpack_require__(31),
	    infoControl = __webpack_require__(32),
	    map = __webpack_require__(33),
	    gridLayer = __webpack_require__(34),
	    styleLayer = __webpack_require__(37);

	L.mapbox = module.exports = {
	    VERSION: __webpack_require__(17).version,
	    geocoder: __webpack_require__(12),
	    marker: __webpack_require__(26),
	    simplestyle: __webpack_require__(27),
	    tileLayer: tileLayer.tileLayer,
	    TileLayer: tileLayer.TileLayer,
	    styleLayer: styleLayer.styleLayer,
	    StyleLayer: styleLayer.StyleLayer,
	    infoControl: infoControl.infoControl,
	    InfoControl: infoControl.InfoControl,
	    shareControl: shareControl.shareControl,
	    ShareControl: shareControl.ShareControl,
	    legendControl: legendControl.legendControl,
	    LegendControl: legendControl.LegendControl,
	    geocoderControl: geocoderControl.geocoderControl,
	    GeocoderControl: geocoderControl.GeocoderControl,
	    gridControl: gridControl.gridControl,
	    GridControl: gridControl.GridControl,
	    gridLayer: gridLayer.gridLayer,
	    GridLayer: gridLayer.GridLayer,
	    featureLayer: featureLayer.featureLayer,
	    FeatureLayer: featureLayer.FeatureLayer,
	    map: map.map,
	    Map: map.Map,
	    config: __webpack_require__(16),
	    sanitize: __webpack_require__(23),
	    template: __webpack_require__(22).to_html,
	    feedback: __webpack_require__(18)
	};


	// Hardcode image path, because Leaflet's autodetection
	// fails, because mapbox.js is not named leaflet.js
	window.L.Icon.Default.imagePath =
	    // Detect bad-news protocols like file:// and hardcode
	    // to https if they're detected.
	    ((document.location.protocol === 'https:' ||
	    document.location.protocol === 'http:') ? '' : 'https:') +
	    '//api.tiles.mapbox.com/mapbox.js/' + 'v' +
	    __webpack_require__(17).version + '/images';


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var geocoder = __webpack_require__(12),
	    util = __webpack_require__(14);

	var GeocoderControl = L.Control.extend({
	    includes: L.Mixin.Events,

	    options: {
	        proximity: true,
	        position: 'topleft',
	        pointZoom: 16,
	        keepOpen: false,
	        autocomplete: false
	    },

	    initialize: function(_, options) {
	        L.Util.setOptions(this, options);
	        this.setURL(_);
	        this._updateSubmit = L.bind(this._updateSubmit, this);
	        this._updateAutocomplete = L.bind(this._updateAutocomplete, this);
	        this._chooseResult = L.bind(this._chooseResult, this);
	    },

	    setURL: function(_) {
	        this.geocoder = geocoder(_, {
	            accessToken: this.options.accessToken
	        });
	        return this;
	    },

	    getURL: function() {
	        return this.geocoder.getURL();
	    },

	    setID: function(_) {
	        return this.setURL(_);
	    },

	    setTileJSON: function(_) {
	        return this.setURL(_.geocoder);
	    },

	    _toggle: function(e) {
	        if (e) L.DomEvent.stop(e);
	        if (L.DomUtil.hasClass(this._container, 'active')) {
	            L.DomUtil.removeClass(this._container, 'active');
	            this._results.innerHTML = '';
	            this._input.blur();
	        } else {
	            L.DomUtil.addClass(this._container, 'active');
	            this._input.focus();
	            this._input.select();
	        }
	    },

	    _closeIfOpen: function() {
	        if (L.DomUtil.hasClass(this._container, 'active') &&
	            !this.options.keepOpen) {
	            L.DomUtil.removeClass(this._container, 'active');
	            this._results.innerHTML = '';
	            this._input.blur();
	        }
	    },

	    onAdd: function(map) {

	        var container = L.DomUtil.create('div', 'leaflet-control-mapbox-geocoder leaflet-bar leaflet-control'),
	            link = L.DomUtil.create('a', 'leaflet-control-mapbox-geocoder-toggle mapbox-icon mapbox-icon-geocoder', container),
	            results = L.DomUtil.create('div', 'leaflet-control-mapbox-geocoder-results', container),
	            wrap = L.DomUtil.create('div', 'leaflet-control-mapbox-geocoder-wrap', container),
	            form = L.DomUtil.create('form', 'leaflet-control-mapbox-geocoder-form', wrap),
	            input = L.DomUtil.create('input', '', form);

	        link.href = '#';
	        link.innerHTML = '&nbsp;';

	        input.type = 'text';
	        input.setAttribute('placeholder', 'Search');

	        L.DomEvent.addListener(form, 'submit', this._geocode, this);
	        L.DomEvent.addListener(input, 'keyup', this._autocomplete, this);
	        L.DomEvent.disableClickPropagation(container);

	        this._map = map;
	        this._results = results;
	        this._input = input;
	        this._form = form;

	        if (this.options.keepOpen) {
	            L.DomUtil.addClass(container, 'active');
	        } else {
	            this._map.on('click', this._closeIfOpen, this);
	            L.DomEvent.addListener(link, 'click', this._toggle, this);
	        }

	        return container;
	    },

	    _updateSubmit: function(err, resp) {
	        L.DomUtil.removeClass(this._container, 'searching');
	        this._results.innerHTML = '';
	        if (err || !resp) {
	            this.fire('error', {error: err});
	        } else {
	            var features = [];
	            if (resp.results && resp.results.features) {
	                features = resp.results.features;
	            }
	            if (features.length === 1) {
	                this.fire('autoselect', { feature: features[0] });
	                this.fire('found', {results: resp.results});
	                this._chooseResult(features[0]);
	                this._closeIfOpen();
	            } else if (features.length > 1) {
	                this.fire('found', {results: resp.results});
	                this._displayResults(features);
	            } else {
	                this._displayResults(features);
	            }
	        }
	    },

	    _updateAutocomplete: function(err, resp) {
	        this._results.innerHTML = '';
	        if (err || !resp) {
	            this.fire('error', {error: err});
	        } else {
	            var features = [];
	            if (resp.results && resp.results.features) {
	                features = resp.results.features;
	            }
	            if (features.length) {
	                this.fire('found', {results: resp.results});
	            }
	            this._displayResults(features);
	        }
	    },

	    _displayResults: function(features) {
	        for (var i = 0, l = Math.min(features.length, 5); i < l; i++) {
	            var feature = features[i];
	            var name = feature.place_name;
	            if (!name.length) continue;

	            var r = L.DomUtil.create('a', '', this._results);
	            var text = ('innerText' in r) ? 'innerText' : 'textContent';
	            r[text] = name;
	            r.setAttribute('title', name);
	            r.href = '#';

	            (L.bind(function(feature) {
	                L.DomEvent.addListener(r, 'click', function(e) {
	                    this._chooseResult(feature);
	                    L.DomEvent.stop(e);
	                    this.fire('select', { feature: feature });
	                }, this);
	            }, this))(feature);
	        }
	        if (features.length > 5) {
	            var outof = L.DomUtil.create('span', '', this._results);
	            outof.innerHTML = 'Top 5 of ' + features.length + '  results';
	        }
	    },

	    _chooseResult: function(result) {
	        if (result.bbox) {
	            this._map.fitBounds(util.lbounds(result.bbox));
	        } else if (result.center) {
	            this._map.setView([result.center[1], result.center[0]], (this._map.getZoom() === undefined) ?
	                this.options.pointZoom :
	                Math.max(this._map.getZoom(), this.options.pointZoom));
	        }
	    },

	    _geocode: function(e) {
	        L.DomEvent.preventDefault(e);
	        if (this._input.value === '') return this._updateSubmit();
	        L.DomUtil.addClass(this._container, 'searching');
	        this.geocoder.query({
	            query: this._input.value,
	            proximity: this.options.proximity ? this._map.getCenter() : false
	        }, this._updateSubmit);
	    },

	    _autocomplete: function() {
	        if (!this.options.autocomplete) return;
	        if (this._input.value === '') return this._updateAutocomplete();
	        this.geocoder.query({
	            query: this._input.value,
	            proximity: this.options.proximity ? this._map.getCenter() : false
	        }, this._updateAutocomplete);
	    }
	});

	module.exports.GeocoderControl = GeocoderControl;

	module.exports.geocoderControl = function(_, options) {
	    return new GeocoderControl(_, options);
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArray = __webpack_require__(13),
	    util = __webpack_require__(14),
	    format_url = __webpack_require__(15),
	    feedback = __webpack_require__(18),
	    request = __webpack_require__(19);

	// Low-level geocoding interface - wraps specific API calls and their
	// return values.
	module.exports = function(url, options) {
	    if (!options) options = {};
	    var geocoder = {};

	    util.strict(url, 'string');

	    if (url.indexOf('/') === -1) {
	        url = format_url('/geocoding/v5/' + url + '/{query}.json', options.accessToken, 5);
	    }

	    function roundTo(latLng, precision) {
	        var mult = Math.pow(10, precision);
	        latLng.lat = Math.round(latLng.lat * mult) / mult;
	        latLng.lng = Math.round(latLng.lng * mult) / mult;
	        return latLng;
	    }

	    geocoder.getURL = function() {
	        return url;
	    };

	    geocoder.queryURL = function(_) {
	        var isObject = !(isArray(_) || typeof _ === 'string'),
	            query = isObject ? _.query : _;

	        if (isArray(query)) {
	            var parts = [];
	            for (var i = 0; i < query.length; i++) {
	                parts[i] = encodeURIComponent(query[i]);
	            }
	            query = parts.join(';');
	        } else {
	            query = encodeURIComponent(query);
	        }

	        feedback.record({ geocoding: query });

	        var url = L.Util.template(geocoder.getURL(), {query: query});

	        if (isObject && _.types) {
	            if (isArray(_.types)) {
	                url += '&types=' + _.types.join();
	            } else {
	                url += '&types=' + _.types;
	            }
	        }

	        if (isObject && _.proximity) {
	            var proximity = roundTo(L.latLng(_.proximity), 3);
	            url += '&proximity=' + proximity.lng + ',' + proximity.lat;
	        }

	        return url;
	    };

	    geocoder.query = function(_, callback) {
	        util.strict(callback, 'function');

	        request(geocoder.queryURL(_), function(err, json) {
	            if (json && (json.length || json.features)) {
	                var res = {
	                    results: json
	                };
	                if (json.features && json.features.length) {
	                    res.latlng = [
	                        json.features[0].center[1],
	                        json.features[0].center[0]];

	                    if (json.features[0].bbox) {
	                        res.bounds = json.features[0].bbox;
	                        res.lbounds = util.lbounds(res.bounds);
	                    }
	                }
	                callback(null, res);
	            } else callback(err || true);
	        });

	        return geocoder;
	    };

	    // a reverse geocode:
	    //
	    //  geocoder.reverseQuery([80, 20])
	    geocoder.reverseQuery = function(_, callback) {
	        var q = '';

	        // sort through different ways people represent lat and lon pairs
	        function normalize(x) {
	            var latLng;
	            if (x.lat !== undefined && x.lng !== undefined) {
	                latLng = L.latLng(x.lat, x.lng);
	            } else if (x.lat !== undefined && x.lon !== undefined) {
	                latLng = L.latLng(x.lat, x.lon);
	            } else {
	                latLng = L.latLng(x[1], x[0]);
	            }
	            latLng = roundTo(latLng, 5);
	            return latLng.lng + ',' + latLng.lat;
	        }

	        if (_.length && _[0].length) {
	            for (var i = 0, pts = []; i < _.length; i++) {
	                pts.push(normalize(_[i]));
	            }
	            q = pts.join(';');
	        } else {
	            q = normalize(_);
	        }

	        request(geocoder.queryURL(q), function(err, json) {
	            callback(err, json);
	        });

	        return geocoder;
	    };

	    return geocoder;
	};


/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	function contains(item, list) {
	    if (!list || !list.length) return false;
	    for (var i = 0; i < list.length; i++) {
	        if (list[i] === item) return true;
	    }
	    return false;
	}

	module.exports = {
	    idUrl: function(_, t) {
	        if (_.indexOf('/') === -1) t.loadID(_);
	        else t.loadURL(_);
	    },
	    log: function(_) {
	        if (typeof console === 'object' &&
	            typeof console.error === 'function') {
	            console.error(_);
	        }
	    },
	    strict: function(_, type) {
	        if (typeof _ !== type) {
	            throw new Error('Invalid argument: ' + type + ' expected');
	        }
	    },
	    strict_instance: function(_, klass, name) {
	        if (!(_ instanceof klass)) {
	            throw new Error('Invalid argument: ' + name + ' expected');
	        }
	    },
	    strict_oneof: function(_, values) {
	        if (!contains(_, values)) {
	            throw new Error('Invalid argument: ' + _ + ' given, valid values are ' +
	                values.join(', '));
	        }
	    },
	    strip_tags: function(_) {
	        return _.replace(/<[^<]+>/g, '');
	    },
	    lbounds: function(_) {
	        // leaflet-compatible bounds, since leaflet does not do geojson
	        return new L.LatLngBounds([[_[1], _[0]], [_[3], _[2]]]);
	    }
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var config = __webpack_require__(16),
	    version = __webpack_require__(17).version;

	module.exports = function(path, accessToken) {
	    accessToken = accessToken || L.mapbox.accessToken;

	    if (!accessToken && config.REQUIRE_ACCESS_TOKEN) {
	        throw new Error('An API access token is required to use Mapbox.js. ' +
	            'See https://www.mapbox.com/mapbox.js/api/v' + version + '/api-access-tokens/');
	    }

	    var url = (document.location.protocol === 'https:' || config.FORCE_HTTPS) ? config.HTTPS_URL : config.HTTP_URL;
	    url = url.replace(/\/v4$/, '');
	    url += path;

	    if (config.REQUIRE_ACCESS_TOKEN) {
	        if (accessToken[0] === 's') {
	            throw new Error('Use a public access token (pk.*) with Mapbox.js, not a secret access token (sk.*). ' +
	                'See https://www.mapbox.com/mapbox.js/api/v' + version + '/api-access-tokens/');
	        }

	        url += url.indexOf('?') !== -1 ? '&access_token=' : '?access_token=';
	        url += accessToken;
	    }

	    return url;
	};

	module.exports.tileJSON = function(urlOrMapID, accessToken) {
	    if (urlOrMapID.indexOf('/') !== -1)
	        return urlOrMapID;

	    var url = module.exports('/v4/' + urlOrMapID + '.json', accessToken);

	    // TileJSON requests need a secure flag appended to their URLs so
	    // that the server knows to send SSL-ified resource references.
	    if (url.indexOf('https') === 0)
	        url += '&secure';

	    return url;
	};


	module.exports.style = function(styleURL, accessToken) {
	    if (styleURL.indexOf('mapbox://styles/') === -1) throw new Error('Incorrectly formatted Mapbox style at ' + styleURL);

	    var ownerIDStyle = styleURL.split('mapbox://styles/')[1];
	    var url = module.exports('/styles/v1/' + ownerIDStyle, accessToken)
	        .replace('http://', 'https://');

	    return url;
	};


/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    HTTP_URL: 'http://a.tiles.mapbox.com/v4',
	    HTTPS_URL: 'https://a.tiles.mapbox.com/v4',
	    FORCE_HTTPS: false,
	    REQUIRE_ACCESS_TOKEN: true
	};


/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = {
		"author": {
			"name": "Mapbox"
		},
		"name": "mapbox.js",
		"description": "mapbox javascript api",
		"version": "2.3.0",
		"homepage": "http://mapbox.com/",
		"repository": {
			"type": "git",
			"url": "git://github.com/mapbox/mapbox.js.git"
		},
		"main": "src/index.js",
		"dependencies": {
			"corslite": "0.0.6",
			"isarray": "0.0.1",
			"leaflet": "0.7.7",
			"mustache": "2.2.1",
			"sanitize-caja": "0.1.3"
		},
		"scripts": {
			"test": "eslint --no-eslintrc -c .eslintrc src && mocha-phantomjs test/index.html"
		},
		"license": "BSD-3-Clause",
		"devDependencies": {
			"browserify": "^6.3.2",
			"clean-css": "~2.0.7",
			"eslint": "^0.23.0",
			"expect.js": "0.3.1",
			"happen": "0.1.3",
			"leaflet-fullscreen": "0.0.4",
			"leaflet-hash": "0.2.1",
			"marked": "~0.3.0",
			"minifyify": "^6.1.0",
			"minimist": "0.0.5",
			"mocha": "1.17.1",
			"mocha-phantomjs": "3.1.6",
			"sinon": "1.10.2"
		},
		"optionalDependencies": {},
		"engines": {
			"node": "*"
		},
		"gitHead": "ab621173937327f039600b0490ea2889359f2234",
		"bugs": {
			"url": "https://github.com/mapbox/mapbox.js/issues"
		},
		"_id": "mapbox.js@2.3.0",
		"_shasum": "1434ef14060ee1126919dfc407444f0e79cfb3cf",
		"_from": "mapbox.js@*",
		"_npmVersion": "2.14.15",
		"_nodeVersion": "0.10.38",
		"_npmUser": {
			"name": "willwhite",
			"email": "will@mapbox.com"
		},
		"maintainers": [
			{
				"name": "1ec5",
				"email": "mxn@1ec5.org"
			},
			{
				"name": "aaronlidman",
				"email": "aaronlidman@gmail.com"
			},
			{
				"name": "ajashton",
				"email": "aj.ashton@gmail.com"
			},
			{
				"name": "alulsh",
				"email": "ulsh@mapbox.com"
			},
			{
				"name": "ansis",
				"email": "ansis.brammanis@gmail.com"
			},
			{
				"name": "apendleton",
				"email": "andrew@mapbox.com"
			},
			{
				"name": "bergwerkgis",
				"email": "wb@bergwerk-gis.at"
			},
			{
				"name": "bhousel",
				"email": "bryan@mapbox.com"
			},
			{
				"name": "bsudekum",
				"email": "bobby@mapbox.com"
			},
			{
				"name": "camilleanne",
				"email": "camille@mapbox.com"
			},
			{
				"name": "dnomadb",
				"email": "damon@mapbox.com"
			},
			{
				"name": "dthompson",
				"email": "dthompson@gmail.com"
			},
			{
				"name": "emilymcafee",
				"email": "emily@mapbox.com"
			},
			{
				"name": "flippmoke",
				"email": "flippmoke@gmail.com"
			},
			{
				"name": "freenerd",
				"email": "spam@freenerd.de"
			},
			{
				"name": "gretacb",
				"email": "carol@mapbox.com"
			},
			{
				"name": "ian29",
				"email": "ian.villeda@gmail.com"
			},
			{
				"name": "ianshward",
				"email": "ian@mapbox.com"
			},
			{
				"name": "ingalls",
				"email": "nicholas.ingalls@gmail.com"
			},
			{
				"name": "jfirebaugh",
				"email": "john.firebaugh@gmail.com"
			},
			{
				"name": "jrpruit1",
				"email": "jake@jakepruitt.com"
			},
			{
				"name": "karenzshea",
				"email": "karen@mapbox.com"
			},
			{
				"name": "kelvinabrokwa",
				"email": "kelvinabrokwa@gmail.com"
			},
			{
				"name": "kkaefer",
				"email": "kkaefer@gmail.com"
			},
			{
				"name": "lbud",
				"email": "lauren@mapbox.com"
			},
			{
				"name": "lucaswoj",
				"email": "lucas@lucaswoj.com"
			},
			{
				"name": "lxbarth",
				"email": "alex@mapbox.com"
			},
			{
				"name": "lyzidiamond",
				"email": "lyzi@mapbox.com"
			},
			{
				"name": "mapbox-admin",
				"email": "accounts@mapbox.com"
			},
			{
				"name": "mateov",
				"email": "matt@mapbox.com"
			},
			{
				"name": "mcwhittemore",
				"email": "mcwhittemore@gmail.com"
			},
			{
				"name": "miccolis",
				"email": "jeff@miccolis.net"
			},
			{
				"name": "mikemorris",
				"email": "michael.patrick.morris@gmail.com"
			},
			{
				"name": "morganherlocker",
				"email": "morgan.herlocker@gmail.com"
			},
			{
				"name": "mourner",
				"email": "agafonkin@gmail.com"
			},
			{
				"name": "mtirwin",
				"email": "irwin@mapbox.com"
			},
			{
				"name": "nickidlugash",
				"email": "nicki@mapbox.com"
			},
			{
				"name": "rclark",
				"email": "ryan.clark.j@gmail.com"
			},
			{
				"name": "samanbb",
				"email": "saman@mapbox.com"
			},
			{
				"name": "sbma44",
				"email": "tlee@mapbox.com"
			},
			{
				"name": "scothis",
				"email": "scothis@gmail.com"
			},
			{
				"name": "sgillies",
				"email": "sean@mapbox.com"
			},
			{
				"name": "springmeyer",
				"email": "dane@mapbox.com"
			},
			{
				"name": "themarex",
				"email": "patrick@mapbox.com"
			},
			{
				"name": "tmcw",
				"email": "tom@macwright.org"
			},
			{
				"name": "tristen",
				"email": "tristen.brown@gmail.com"
			},
			{
				"name": "willwhite",
				"email": "will@mapbox.com"
			},
			{
				"name": "yhahn",
				"email": "young@mapbox.com"
			}
		],
		"dist": {
			"shasum": "1434ef14060ee1126919dfc407444f0e79cfb3cf",
			"tarball": "http://registry.npmjs.org/mapbox.js/-/mapbox.js-2.3.0.tgz"
		},
		"_npmOperationalInternal": {
			"host": "packages-9-west.internal.npmjs.com",
			"tmp": "tmp/mapbox.js-2.3.0.tgz_1454784636609_0.5188249044585973"
		},
		"directories": {},
		"_resolved": "https://registry.npmjs.org/mapbox.js/-/mapbox.js-2.3.0.tgz",
		"readme": "ERROR: No README data found!"
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	var Feedback = L.Class.extend({
	    includes: L.Mixin.Events,
	    data: {},
	    record: function(data) {
	        L.extend(this.data, data);
	        this.fire('change');
	    }
	});

	module.exports = new Feedback();


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var corslite = __webpack_require__(20),
	    strict = __webpack_require__(14).strict,
	    config = __webpack_require__(16);

	var protocol = /^(https?:)?(?=\/\/(.|api)\.tiles\.mapbox\.com\/)/;

	module.exports = function(url, callback) {
	    strict(url, 'string');
	    strict(callback, 'function');

	    url = url.replace(protocol, function(match, protocol) {
	        if (!('withCredentials' in new window.XMLHttpRequest())) {
	            // XDomainRequest in use; doesn't support cross-protocol requests
	            return document.location.protocol;
	        } else if (protocol === 'https:' || document.location.protocol === 'https:' || config.FORCE_HTTPS) {
	            return 'https:';
	        } else {
	            return 'http:';
	        }
	    });

	    function onload(err, resp) {
	        if (!err && resp) {
	            resp = JSON.parse(resp.responseText);
	        }
	        callback(err, resp);
	    }

	    return corslite(url, onload);
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	function corslite(url, callback, cors) {
	    var sent = false;

	    if (typeof window.XMLHttpRequest === 'undefined') {
	        return callback(Error('Browser not supported'));
	    }

	    if (typeof cors === 'undefined') {
	        var m = url.match(/^\s*https?:\/\/[^\/]*/);
	        cors = m && (m[0] !== location.protocol + '//' + location.domain +
	                (location.port ? ':' + location.port : ''));
	    }

	    var x = new window.XMLHttpRequest();

	    function isSuccessful(status) {
	        return status >= 200 && status < 300 || status === 304;
	    }

	    if (cors && !('withCredentials' in x)) {
	        // IE8-9
	        x = new window.XDomainRequest();

	        // Ensure callback is never called synchronously, i.e., before
	        // x.send() returns (this has been observed in the wild).
	        // See https://github.com/mapbox/mapbox.js/issues/472
	        var original = callback;
	        callback = function() {
	            if (sent) {
	                original.apply(this, arguments);
	            } else {
	                var that = this, args = arguments;
	                setTimeout(function() {
	                    original.apply(that, args);
	                }, 0);
	            }
	        }
	    }

	    function loaded() {
	        if (
	            // XDomainRequest
	            x.status === undefined ||
	            // modern browsers
	            isSuccessful(x.status)) callback.call(x, null, x);
	        else callback.call(x, x, null);
	    }

	    // Both `onreadystatechange` and `onload` can fire. `onreadystatechange`
	    // has [been supported for longer](http://stackoverflow.com/a/9181508/229001).
	    if ('onload' in x) {
	        x.onload = loaded;
	    } else {
	        x.onreadystatechange = function readystate() {
	            if (x.readyState === 4) {
	                loaded();
	            }
	        };
	    }

	    // Call the callback with the XMLHttpRequest object as an error and prevent
	    // it from ever being called again by reassigning it to `noop`
	    x.onerror = function error(evt) {
	        // XDomainRequest provides no evt parameter
	        callback.call(this, evt || true, null);
	        callback = function() { };
	    };

	    // IE9 must have onprogress be set to a unique function.
	    x.onprogress = function() { };

	    x.ontimeout = function(evt) {
	        callback.call(this, evt, null);
	        callback = function() { };
	    };

	    x.onabort = function(evt) {
	        callback.call(this, evt, null);
	        callback = function() { };
	    };

	    // GET is the only supported HTTP Verb by XDomainRequest and is the
	    // only one supported here.
	    x.open('GET', url, true);

	    // Send the request. Sending data is not supported.
	    x.send(null);
	    sent = true;

	    return x;
	}

	if (true) module.exports = corslite;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(14),
	    Mustache = __webpack_require__(22);

	var GridControl = L.Control.extend({

	    options: {
	        pinnable: true,
	        follow: false,
	        sanitizer: __webpack_require__(23),
	        touchTeaser: true,
	        location: true
	    },

	    _currentContent: '',

	    // pinned means that this control is on a feature and the user has likely
	    // clicked. pinned will not become false unless the user clicks off
	    // of the feature onto another or clicks x
	    _pinned: false,

	    initialize: function(_, options) {
	        L.Util.setOptions(this, options);
	        util.strict_instance(_, L.Class, 'L.mapbox.gridLayer');
	        this._layer = _;
	    },

	    setTemplate: function(template) {
	        util.strict(template, 'string');
	        this.options.template = template;
	        return this;
	    },

	    _template: function(format, data) {
	        if (!data) return;
	        var template = this.options.template || this._layer.getTileJSON().template;
	        if (template) {
	            var d = {};
	            d['__' + format + '__'] = true;
	            return this.options.sanitizer(
	                Mustache.to_html(template, L.extend(d, data)));
	        }
	    },

	    // change the content of the tooltip HTML if it has changed, otherwise
	    // noop
	    _show: function(content, o) {
	        if (content === this._currentContent) return;

	        this._currentContent = content;

	        if (this.options.follow) {
	            this._popup.setContent(content)
	                .setLatLng(o.latLng);
	            if (this._map._popup !== this._popup) this._popup.openOn(this._map);
	        } else {
	            this._container.style.display = 'block';
	            this._contentWrapper.innerHTML = content;
	        }
	    },

	    hide: function() {
	        this._pinned = false;
	        this._currentContent = '';

	        this._map.closePopup();
	        this._container.style.display = 'none';
	        this._contentWrapper.innerHTML = '';

	        L.DomUtil.removeClass(this._container, 'closable');

	        return this;
	    },

	    _mouseover: function(o) {
	        if (o.data) {
	            L.DomUtil.addClass(this._map._container, 'map-clickable');
	        } else {
	            L.DomUtil.removeClass(this._map._container, 'map-clickable');
	        }

	        if (this._pinned) return;

	        var content = this._template('teaser', o.data);
	        if (content) {
	            this._show(content, o);
	        } else {
	            this.hide();
	        }
	    },

	    _mousemove: function(o) {
	        if (this._pinned) return;
	        if (!this.options.follow) return;

	        this._popup.setLatLng(o.latLng);
	    },

	    _navigateTo: function(url) {
	        window.top.location.href = url;
	    },

	    _click: function(o) {

	        var location_formatted = this._template('location', o.data);
	        if (this.options.location && location_formatted &&
	            location_formatted.search(/^https?:/) === 0) {
	            return this._navigateTo(this._template('location', o.data));
	        }

	        if (!this.options.pinnable) return;

	        var content = this._template('full', o.data);

	        if (!content && this.options.touchTeaser && L.Browser.touch) {
	            content = this._template('teaser', o.data);
	        }

	        if (content) {
	            L.DomUtil.addClass(this._container, 'closable');
	            this._pinned = true;
	            this._show(content, o);
	        } else if (this._pinned) {
	            L.DomUtil.removeClass(this._container, 'closable');
	            this._pinned = false;
	            this.hide();
	        }
	    },

	    _onPopupClose: function() {
	        this._currentContent = null;
	        this._pinned = false;
	    },

	    _createClosebutton: function(container, fn) {
	        var link = L.DomUtil.create('a', 'close', container);

	        link.innerHTML = 'close';
	        link.href = '#';
	        link.title = 'close';

	        L.DomEvent
	            .on(link, 'click', L.DomEvent.stopPropagation)
	            .on(link, 'mousedown', L.DomEvent.stopPropagation)
	            .on(link, 'dblclick', L.DomEvent.stopPropagation)
	            .on(link, 'click', L.DomEvent.preventDefault)
	            .on(link, 'click', fn, this);

	        return link;
	    },

	    onAdd: function(map) {
	        this._map = map;

	        var className = 'leaflet-control-grid map-tooltip',
	            container = L.DomUtil.create('div', className),
	            contentWrapper = L.DomUtil.create('div', 'map-tooltip-content');

	        // hide the container element initially
	        container.style.display = 'none';
	        this._createClosebutton(container, this.hide);
	        container.appendChild(contentWrapper);

	        this._contentWrapper = contentWrapper;
	        this._popup = new L.Popup({ autoPan: false, closeOnClick: false });

	        map.on('popupclose', this._onPopupClose, this);

	        L.DomEvent
	            .disableClickPropagation(container)
	            // allow people to scroll tooltips with mousewheel
	            .addListener(container, 'mousewheel', L.DomEvent.stopPropagation);

	        this._layer
	            .on('mouseover', this._mouseover, this)
	            .on('mousemove', this._mousemove, this)
	            .on('click', this._click, this);

	        return container;
	    },

	    onRemove: function (map) {

	        map.off('popupclose', this._onPopupClose, this);

	        this._layer
	            .off('mouseover', this._mouseover, this)
	            .off('mousemove', this._mousemove, this)
	            .off('click', this._click, this);
	    }
	});

	module.exports.GridControl = GridControl;

	module.exports.gridControl = function(_, options) {
	    return new GridControl(_, options);
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * mustache.js - Logic-less {{mustache}} templates with JavaScript
	 * http://github.com/janl/mustache.js
	 */

	/*global define: false Mustache: true*/

	(function defineMustache (global, factory) {
	  if (typeof exports === 'object' && exports && typeof exports.nodeName !== 'string') {
	    factory(exports); // CommonJS
	  } else if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // AMD
	  } else {
	    global.Mustache = {};
	    factory(global.Mustache); // script, wsh, asp
	  }
	}(this, function mustacheFactory (mustache) {

	  var objectToString = Object.prototype.toString;
	  var isArray = Array.isArray || function isArrayPolyfill (object) {
	    return objectToString.call(object) === '[object Array]';
	  };

	  function isFunction (object) {
	    return typeof object === 'function';
	  }

	  /**
	   * More correct typeof string handling array
	   * which normally returns typeof 'object'
	   */
	  function typeStr (obj) {
	    return isArray(obj) ? 'array' : typeof obj;
	  }

	  function escapeRegExp (string) {
	    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
	  }

	  /**
	   * Null safe way of checking whether or not an object,
	   * including its prototype, has a given property
	   */
	  function hasProperty (obj, propName) {
	    return obj != null && typeof obj === 'object' && (propName in obj);
	  }

	  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
	  // See https://github.com/janl/mustache.js/issues/189
	  var regExpTest = RegExp.prototype.test;
	  function testRegExp (re, string) {
	    return regExpTest.call(re, string);
	  }

	  var nonSpaceRe = /\S/;
	  function isWhitespace (string) {
	    return !testRegExp(nonSpaceRe, string);
	  }

	  var entityMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#39;',
	    '/': '&#x2F;',
	    '`': '&#x60;',
	    '=': '&#x3D;'
	  };

	  function escapeHtml (string) {
	    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
	      return entityMap[s];
	    });
	  }

	  var whiteRe = /\s*/;
	  var spaceRe = /\s+/;
	  var equalsRe = /\s*=/;
	  var curlyRe = /\s*\}/;
	  var tagRe = /#|\^|\/|>|\{|&|=|!/;

	  /**
	   * Breaks up the given `template` string into a tree of tokens. If the `tags`
	   * argument is given here it must be an array with two string values: the
	   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
	   * course, the default is to use mustaches (i.e. mustache.tags).
	   *
	   * A token is an array with at least 4 elements. The first element is the
	   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
	   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
	   * all text that appears outside a symbol this element is "text".
	   *
	   * The second element of a token is its "value". For mustache tags this is
	   * whatever else was inside the tag besides the opening symbol. For text tokens
	   * this is the text itself.
	   *
	   * The third and fourth elements of the token are the start and end indices,
	   * respectively, of the token in the original template.
	   *
	   * Tokens that are the root node of a subtree contain two more elements: 1) an
	   * array of tokens in the subtree and 2) the index in the original template at
	   * which the closing tag for that section begins.
	   */
	  function parseTemplate (template, tags) {
	    if (!template)
	      return [];

	    var sections = [];     // Stack to hold section tokens
	    var tokens = [];       // Buffer to hold the tokens
	    var spaces = [];       // Indices of whitespace tokens on the current line
	    var hasTag = false;    // Is there a {{tag}} on the current line?
	    var nonSpace = false;  // Is there a non-space char on the current line?

	    // Strips all whitespace tokens array for the current line
	    // if there was a {{#tag}} on it and otherwise only space.
	    function stripSpace () {
	      if (hasTag && !nonSpace) {
	        while (spaces.length)
	          delete tokens[spaces.pop()];
	      } else {
	        spaces = [];
	      }

	      hasTag = false;
	      nonSpace = false;
	    }

	    var openingTagRe, closingTagRe, closingCurlyRe;
	    function compileTags (tagsToCompile) {
	      if (typeof tagsToCompile === 'string')
	        tagsToCompile = tagsToCompile.split(spaceRe, 2);

	      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
	        throw new Error('Invalid tags: ' + tagsToCompile);

	      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
	      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
	      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
	    }

	    compileTags(tags || mustache.tags);

	    var scanner = new Scanner(template);

	    var start, type, value, chr, token, openSection;
	    while (!scanner.eos()) {
	      start = scanner.pos;

	      // Match any text between tags.
	      value = scanner.scanUntil(openingTagRe);

	      if (value) {
	        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
	          chr = value.charAt(i);

	          if (isWhitespace(chr)) {
	            spaces.push(tokens.length);
	          } else {
	            nonSpace = true;
	          }

	          tokens.push([ 'text', chr, start, start + 1 ]);
	          start += 1;

	          // Check for whitespace on the current line.
	          if (chr === '\n')
	            stripSpace();
	        }
	      }

	      // Match the opening tag.
	      if (!scanner.scan(openingTagRe))
	        break;

	      hasTag = true;

	      // Get the tag type.
	      type = scanner.scan(tagRe) || 'name';
	      scanner.scan(whiteRe);

	      // Get the tag value.
	      if (type === '=') {
	        value = scanner.scanUntil(equalsRe);
	        scanner.scan(equalsRe);
	        scanner.scanUntil(closingTagRe);
	      } else if (type === '{') {
	        value = scanner.scanUntil(closingCurlyRe);
	        scanner.scan(curlyRe);
	        scanner.scanUntil(closingTagRe);
	        type = '&';
	      } else {
	        value = scanner.scanUntil(closingTagRe);
	      }

	      // Match the closing tag.
	      if (!scanner.scan(closingTagRe))
	        throw new Error('Unclosed tag at ' + scanner.pos);

	      token = [ type, value, start, scanner.pos ];
	      tokens.push(token);

	      if (type === '#' || type === '^') {
	        sections.push(token);
	      } else if (type === '/') {
	        // Check section nesting.
	        openSection = sections.pop();

	        if (!openSection)
	          throw new Error('Unopened section "' + value + '" at ' + start);

	        if (openSection[1] !== value)
	          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
	      } else if (type === 'name' || type === '{' || type === '&') {
	        nonSpace = true;
	      } else if (type === '=') {
	        // Set the tags for the next time around.
	        compileTags(value);
	      }
	    }

	    // Make sure there are no open sections when we're done.
	    openSection = sections.pop();

	    if (openSection)
	      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

	    return nestTokens(squashTokens(tokens));
	  }

	  /**
	   * Combines the values of consecutive text tokens in the given `tokens` array
	   * to a single token.
	   */
	  function squashTokens (tokens) {
	    var squashedTokens = [];

	    var token, lastToken;
	    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
	      token = tokens[i];

	      if (token) {
	        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
	          lastToken[1] += token[1];
	          lastToken[3] = token[3];
	        } else {
	          squashedTokens.push(token);
	          lastToken = token;
	        }
	      }
	    }

	    return squashedTokens;
	  }

	  /**
	   * Forms the given array of `tokens` into a nested tree structure where
	   * tokens that represent a section have two additional items: 1) an array of
	   * all tokens that appear in that section and 2) the index in the original
	   * template that represents the end of that section.
	   */
	  function nestTokens (tokens) {
	    var nestedTokens = [];
	    var collector = nestedTokens;
	    var sections = [];

	    var token, section;
	    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
	      token = tokens[i];

	      switch (token[0]) {
	        case '#':
	        case '^':
	          collector.push(token);
	          sections.push(token);
	          collector = token[4] = [];
	          break;
	        case '/':
	          section = sections.pop();
	          section[5] = token[2];
	          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
	          break;
	        default:
	          collector.push(token);
	      }
	    }

	    return nestedTokens;
	  }

	  /**
	   * A simple string scanner that is used by the template parser to find
	   * tokens in template strings.
	   */
	  function Scanner (string) {
	    this.string = string;
	    this.tail = string;
	    this.pos = 0;
	  }

	  /**
	   * Returns `true` if the tail is empty (end of string).
	   */
	  Scanner.prototype.eos = function eos () {
	    return this.tail === '';
	  };

	  /**
	   * Tries to match the given regular expression at the current position.
	   * Returns the matched text if it can match, the empty string otherwise.
	   */
	  Scanner.prototype.scan = function scan (re) {
	    var match = this.tail.match(re);

	    if (!match || match.index !== 0)
	      return '';

	    var string = match[0];

	    this.tail = this.tail.substring(string.length);
	    this.pos += string.length;

	    return string;
	  };

	  /**
	   * Skips all text until the given regular expression can be matched. Returns
	   * the skipped string, which is the entire tail if no match can be made.
	   */
	  Scanner.prototype.scanUntil = function scanUntil (re) {
	    var index = this.tail.search(re), match;

	    switch (index) {
	      case -1:
	        match = this.tail;
	        this.tail = '';
	        break;
	      case 0:
	        match = '';
	        break;
	      default:
	        match = this.tail.substring(0, index);
	        this.tail = this.tail.substring(index);
	    }

	    this.pos += match.length;

	    return match;
	  };

	  /**
	   * Represents a rendering context by wrapping a view object and
	   * maintaining a reference to the parent context.
	   */
	  function Context (view, parentContext) {
	    this.view = view;
	    this.cache = { '.': this.view };
	    this.parent = parentContext;
	  }

	  /**
	   * Creates a new context using the given view with this context
	   * as the parent.
	   */
	  Context.prototype.push = function push (view) {
	    return new Context(view, this);
	  };

	  /**
	   * Returns the value of the given name in this context, traversing
	   * up the context hierarchy if the value is absent in this context's view.
	   */
	  Context.prototype.lookup = function lookup (name) {
	    var cache = this.cache;

	    var value;
	    if (cache.hasOwnProperty(name)) {
	      value = cache[name];
	    } else {
	      var context = this, names, index, lookupHit = false;

	      while (context) {
	        if (name.indexOf('.') > 0) {
	          value = context.view;
	          names = name.split('.');
	          index = 0;

	          /**
	           * Using the dot notion path in `name`, we descend through the
	           * nested objects.
	           *
	           * To be certain that the lookup has been successful, we have to
	           * check if the last object in the path actually has the property
	           * we are looking for. We store the result in `lookupHit`.
	           *
	           * This is specially necessary for when the value has been set to
	           * `undefined` and we want to avoid looking up parent contexts.
	           **/
	          while (value != null && index < names.length) {
	            if (index === names.length - 1)
	              lookupHit = hasProperty(value, names[index]);

	            value = value[names[index++]];
	          }
	        } else {
	          value = context.view[name];
	          lookupHit = hasProperty(context.view, name);
	        }

	        if (lookupHit)
	          break;

	        context = context.parent;
	      }

	      cache[name] = value;
	    }

	    if (isFunction(value))
	      value = value.call(this.view);

	    return value;
	  };

	  /**
	   * A Writer knows how to take a stream of tokens and render them to a
	   * string, given a context. It also maintains a cache of templates to
	   * avoid the need to parse the same template twice.
	   */
	  function Writer () {
	    this.cache = {};
	  }

	  /**
	   * Clears all cached templates in this writer.
	   */
	  Writer.prototype.clearCache = function clearCache () {
	    this.cache = {};
	  };

	  /**
	   * Parses and caches the given `template` and returns the array of tokens
	   * that is generated from the parse.
	   */
	  Writer.prototype.parse = function parse (template, tags) {
	    var cache = this.cache;
	    var tokens = cache[template];

	    if (tokens == null)
	      tokens = cache[template] = parseTemplate(template, tags);

	    return tokens;
	  };

	  /**
	   * High-level method that is used to render the given `template` with
	   * the given `view`.
	   *
	   * The optional `partials` argument may be an object that contains the
	   * names and templates of partials that are used in the template. It may
	   * also be a function that is used to load partial templates on the fly
	   * that takes a single argument: the name of the partial.
	   */
	  Writer.prototype.render = function render (template, view, partials) {
	    var tokens = this.parse(template);
	    var context = (view instanceof Context) ? view : new Context(view);
	    return this.renderTokens(tokens, context, partials, template);
	  };

	  /**
	   * Low-level method that renders the given array of `tokens` using
	   * the given `context` and `partials`.
	   *
	   * Note: The `originalTemplate` is only ever used to extract the portion
	   * of the original template that was contained in a higher-order section.
	   * If the template doesn't use higher-order sections, this argument may
	   * be omitted.
	   */
	  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate) {
	    var buffer = '';

	    var token, symbol, value;
	    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
	      value = undefined;
	      token = tokens[i];
	      symbol = token[0];

	      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
	      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
	      else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);
	      else if (symbol === '&') value = this.unescapedValue(token, context);
	      else if (symbol === 'name') value = this.escapedValue(token, context);
	      else if (symbol === 'text') value = this.rawValue(token);

	      if (value !== undefined)
	        buffer += value;
	    }

	    return buffer;
	  };

	  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
	    var self = this;
	    var buffer = '';
	    var value = context.lookup(token[1]);

	    // This function is used to render an arbitrary template
	    // in the current context by higher-order sections.
	    function subRender (template) {
	      return self.render(template, context, partials);
	    }

	    if (!value) return;

	    if (isArray(value)) {
	      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
	        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
	      }
	    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
	      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
	    } else if (isFunction(value)) {
	      if (typeof originalTemplate !== 'string')
	        throw new Error('Cannot use higher-order sections without the original template');

	      // Extract the portion of the original template that the section contains.
	      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

	      if (value != null)
	        buffer += value;
	    } else {
	      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
	    }
	    return buffer;
	  };

	  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
	    var value = context.lookup(token[1]);

	    // Use JavaScript's definition of falsy. Include empty arrays.
	    // See https://github.com/janl/mustache.js/issues/186
	    if (!value || (isArray(value) && value.length === 0))
	      return this.renderTokens(token[4], context, partials, originalTemplate);
	  };

	  Writer.prototype.renderPartial = function renderPartial (token, context, partials) {
	    if (!partials) return;

	    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
	    if (value != null)
	      return this.renderTokens(this.parse(value), context, partials, value);
	  };

	  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
	    var value = context.lookup(token[1]);
	    if (value != null)
	      return value;
	  };

	  Writer.prototype.escapedValue = function escapedValue (token, context) {
	    var value = context.lookup(token[1]);
	    if (value != null)
	      return mustache.escape(value);
	  };

	  Writer.prototype.rawValue = function rawValue (token) {
	    return token[1];
	  };

	  mustache.name = 'mustache.js';
	  mustache.version = '2.2.1';
	  mustache.tags = [ '{{', '}}' ];

	  // All high-level mustache.* functions use this writer.
	  var defaultWriter = new Writer();

	  /**
	   * Clears all cached templates in the default writer.
	   */
	  mustache.clearCache = function clearCache () {
	    return defaultWriter.clearCache();
	  };

	  /**
	   * Parses and caches the given template in the default writer and returns the
	   * array of tokens it contains. Doing this ahead of time avoids the need to
	   * parse templates on the fly as they are rendered.
	   */
	  mustache.parse = function parse (template, tags) {
	    return defaultWriter.parse(template, tags);
	  };

	  /**
	   * Renders the `template` with the given `view` and `partials` using the
	   * default writer.
	   */
	  mustache.render = function render (template, view, partials) {
	    if (typeof template !== 'string') {
	      throw new TypeError('Invalid template! Template should be a "string" ' +
	                          'but "' + typeStr(template) + '" was given as the first ' +
	                          'argument for mustache#render(template, view, partials)');
	    }

	    return defaultWriter.render(template, view, partials);
	  };

	  // This is here for backwards compatibility with 0.4.x.,
	  /*eslint-disable */ // eslint wants camel cased function name
	  mustache.to_html = function to_html (template, view, partials, send) {
	    /*eslint-enable*/

	    var result = mustache.render(template, view, partials);

	    if (isFunction(send)) {
	      send(result);
	    } else {
	      return result;
	    }
	  };

	  // Export the escaping function so that the user may override it.
	  // See https://github.com/janl/mustache.js/issues/244
	  mustache.escape = escapeHtml;

	  // Export these mainly for testing, but also for advanced usage.
	  mustache.Scanner = Scanner;
	  mustache.Context = Context;
	  mustache.Writer = Writer;

	}));


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var html_sanitize = __webpack_require__(24);

	module.exports = function(_) {
	    if (!_) return '';
	    return html_sanitize(_, cleanUrl, cleanId);
	};

	// https://bugzilla.mozilla.org/show_bug.cgi?id=255107
	function cleanUrl(url) {
	    'use strict';
	    if (/^https?/.test(url.getScheme())) return url.toString();
	    if (/^mailto?/.test(url.getScheme())) return url.toString();
	    if ('data' == url.getScheme() && /^image/.test(url.getPath())) {
	        return url.toString();
	    }
	}

	function cleanId(id) { return id; }


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	
	// Copyright (C) 2010 Google Inc.
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.

	/**
	 * @fileoverview
	 * Implements RFC 3986 for parsing/formatting URIs.
	 *
	 * @author mikesamuel@gmail.com
	 * \@provides URI
	 * \@overrides window
	 */

	var URI = (function () {

	/**
	 * creates a uri from the string form.  The parser is relaxed, so special
	 * characters that aren't escaped but don't cause ambiguities will not cause
	 * parse failures.
	 *
	 * @return {URI|null}
	 */
	function parse(uriStr) {
	  var m = ('' + uriStr).match(URI_RE_);
	  if (!m) { return null; }
	  return new URI(
	      nullIfAbsent(m[1]),
	      nullIfAbsent(m[2]),
	      nullIfAbsent(m[3]),
	      nullIfAbsent(m[4]),
	      nullIfAbsent(m[5]),
	      nullIfAbsent(m[6]),
	      nullIfAbsent(m[7]));
	}


	/**
	 * creates a uri from the given parts.
	 *
	 * @param scheme {string} an unencoded scheme such as "http" or null
	 * @param credentials {string} unencoded user credentials or null
	 * @param domain {string} an unencoded domain name or null
	 * @param port {number} a port number in [1, 32768].
	 *    -1 indicates no port, as does null.
	 * @param path {string} an unencoded path
	 * @param query {Array.<string>|string|null} a list of unencoded cgi
	 *   parameters where even values are keys and odds the corresponding values
	 *   or an unencoded query.
	 * @param fragment {string} an unencoded fragment without the "#" or null.
	 * @return {URI}
	 */
	function create(scheme, credentials, domain, port, path, query, fragment) {
	  var uri = new URI(
	      encodeIfExists2(scheme, URI_DISALLOWED_IN_SCHEME_OR_CREDENTIALS_),
	      encodeIfExists2(
	          credentials, URI_DISALLOWED_IN_SCHEME_OR_CREDENTIALS_),
	      encodeIfExists(domain),
	      port > 0 ? port.toString() : null,
	      encodeIfExists2(path, URI_DISALLOWED_IN_PATH_),
	      null,
	      encodeIfExists(fragment));
	  if (query) {
	    if ('string' === typeof query) {
	      uri.setRawQuery(query.replace(/[^?&=0-9A-Za-z_\-~.%]/g, encodeOne));
	    } else {
	      uri.setAllParameters(query);
	    }
	  }
	  return uri;
	}
	function encodeIfExists(unescapedPart) {
	  if ('string' == typeof unescapedPart) {
	    return encodeURIComponent(unescapedPart);
	  }
	  return null;
	};
	/**
	 * if unescapedPart is non null, then escapes any characters in it that aren't
	 * valid characters in a url and also escapes any special characters that
	 * appear in extra.
	 *
	 * @param unescapedPart {string}
	 * @param extra {RegExp} a character set of characters in [\01-\177].
	 * @return {string|null} null iff unescapedPart == null.
	 */
	function encodeIfExists2(unescapedPart, extra) {
	  if ('string' == typeof unescapedPart) {
	    return encodeURI(unescapedPart).replace(extra, encodeOne);
	  }
	  return null;
	};
	/** converts a character in [\01-\177] to its url encoded equivalent. */
	function encodeOne(ch) {
	  var n = ch.charCodeAt(0);
	  return '%' + '0123456789ABCDEF'.charAt((n >> 4) & 0xf) +
	      '0123456789ABCDEF'.charAt(n & 0xf);
	}

	/**
	 * {@updoc
	 *  $ normPath('foo/./bar')
	 *  # 'foo/bar'
	 *  $ normPath('./foo')
	 *  # 'foo'
	 *  $ normPath('foo/.')
	 *  # 'foo'
	 *  $ normPath('foo//bar')
	 *  # 'foo/bar'
	 * }
	 */
	function normPath(path) {
	  return path.replace(/(^|\/)\.(?:\/|$)/g, '$1').replace(/\/{2,}/g, '/');
	}

	var PARENT_DIRECTORY_HANDLER = new RegExp(
	    ''
	    // A path break
	    + '(/|^)'
	    // followed by a non .. path element
	    // (cannot be . because normPath is used prior to this RegExp)
	    + '(?:[^./][^/]*|\\.{2,}(?:[^./][^/]*)|\\.{3,}[^/]*)'
	    // followed by .. followed by a path break.
	    + '/\\.\\.(?:/|$)');

	var PARENT_DIRECTORY_HANDLER_RE = new RegExp(PARENT_DIRECTORY_HANDLER);

	var EXTRA_PARENT_PATHS_RE = /^(?:\.\.\/)*(?:\.\.$)?/;

	/**
	 * Normalizes its input path and collapses all . and .. sequences except for
	 * .. sequences that would take it above the root of the current parent
	 * directory.
	 * {@updoc
	 *  $ collapse_dots('foo/../bar')
	 *  # 'bar'
	 *  $ collapse_dots('foo/./bar')
	 *  # 'foo/bar'
	 *  $ collapse_dots('foo/../bar/./../../baz')
	 *  # 'baz'
	 *  $ collapse_dots('../foo')
	 *  # '../foo'
	 *  $ collapse_dots('../foo').replace(EXTRA_PARENT_PATHS_RE, '')
	 *  # 'foo'
	 * }
	 */
	function collapse_dots(path) {
	  if (path === null) { return null; }
	  var p = normPath(path);
	  // Only /../ left to flatten
	  var r = PARENT_DIRECTORY_HANDLER_RE;
	  // We replace with $1 which matches a / before the .. because this
	  // guarantees that:
	  // (1) we have at most 1 / between the adjacent place,
	  // (2) always have a slash if there is a preceding path section, and
	  // (3) we never turn a relative path into an absolute path.
	  for (var q; (q = p.replace(r, '$1')) != p; p = q) {};
	  return p;
	}

	/**
	 * resolves a relative url string to a base uri.
	 * @return {URI}
	 */
	function resolve(baseUri, relativeUri) {
	  // there are several kinds of relative urls:
	  // 1. //foo - replaces everything from the domain on.  foo is a domain name
	  // 2. foo - replaces the last part of the path, the whole query and fragment
	  // 3. /foo - replaces the the path, the query and fragment
	  // 4. ?foo - replace the query and fragment
	  // 5. #foo - replace the fragment only

	  var absoluteUri = baseUri.clone();
	  // we satisfy these conditions by looking for the first part of relativeUri
	  // that is not blank and applying defaults to the rest

	  var overridden = relativeUri.hasScheme();

	  if (overridden) {
	    absoluteUri.setRawScheme(relativeUri.getRawScheme());
	  } else {
	    overridden = relativeUri.hasCredentials();
	  }

	  if (overridden) {
	    absoluteUri.setRawCredentials(relativeUri.getRawCredentials());
	  } else {
	    overridden = relativeUri.hasDomain();
	  }

	  if (overridden) {
	    absoluteUri.setRawDomain(relativeUri.getRawDomain());
	  } else {
	    overridden = relativeUri.hasPort();
	  }

	  var rawPath = relativeUri.getRawPath();
	  var simplifiedPath = collapse_dots(rawPath);
	  if (overridden) {
	    absoluteUri.setPort(relativeUri.getPort());
	    simplifiedPath = simplifiedPath
	        && simplifiedPath.replace(EXTRA_PARENT_PATHS_RE, '');
	  } else {
	    overridden = !!rawPath;
	    if (overridden) {
	      // resolve path properly
	      if (simplifiedPath.charCodeAt(0) !== 0x2f /* / */) {  // path is relative
	        var absRawPath = collapse_dots(absoluteUri.getRawPath() || '')
	            .replace(EXTRA_PARENT_PATHS_RE, '');
	        var slash = absRawPath.lastIndexOf('/') + 1;
	        simplifiedPath = collapse_dots(
	            (slash ? absRawPath.substring(0, slash) : '')
	            + collapse_dots(rawPath))
	            .replace(EXTRA_PARENT_PATHS_RE, '');
	      }
	    } else {
	      simplifiedPath = simplifiedPath
	          && simplifiedPath.replace(EXTRA_PARENT_PATHS_RE, '');
	      if (simplifiedPath !== rawPath) {
	        absoluteUri.setRawPath(simplifiedPath);
	      }
	    }
	  }

	  if (overridden) {
	    absoluteUri.setRawPath(simplifiedPath);
	  } else {
	    overridden = relativeUri.hasQuery();
	  }

	  if (overridden) {
	    absoluteUri.setRawQuery(relativeUri.getRawQuery());
	  } else {
	    overridden = relativeUri.hasFragment();
	  }

	  if (overridden) {
	    absoluteUri.setRawFragment(relativeUri.getRawFragment());
	  }

	  return absoluteUri;
	}

	/**
	 * a mutable URI.
	 *
	 * This class contains setters and getters for the parts of the URI.
	 * The <tt>getXYZ</tt>/<tt>setXYZ</tt> methods return the decoded part -- so
	 * <code>uri.parse('/foo%20bar').getPath()</code> will return the decoded path,
	 * <tt>/foo bar</tt>.
	 *
	 * <p>The raw versions of fields are available too.
	 * <code>uri.parse('/foo%20bar').getRawPath()</code> will return the raw path,
	 * <tt>/foo%20bar</tt>.  Use the raw setters with care, since
	 * <code>URI::toString</code> is not guaranteed to return a valid url if a
	 * raw setter was used.
	 *
	 * <p>All setters return <tt>this</tt> and so may be chained, a la
	 * <code>uri.parse('/foo').setFragment('part').toString()</code>.
	 *
	 * <p>You should not use this constructor directly -- please prefer the factory
	 * functions {@link uri.parse}, {@link uri.create}, {@link uri.resolve}
	 * instead.</p>
	 *
	 * <p>The parameters are all raw (assumed to be properly escaped) parts, and
	 * any (but not all) may be null.  Undefined is not allowed.</p>
	 *
	 * @constructor
	 */
	function URI(
	    rawScheme,
	    rawCredentials, rawDomain, port,
	    rawPath, rawQuery, rawFragment) {
	  this.scheme_ = rawScheme;
	  this.credentials_ = rawCredentials;
	  this.domain_ = rawDomain;
	  this.port_ = port;
	  this.path_ = rawPath;
	  this.query_ = rawQuery;
	  this.fragment_ = rawFragment;
	  /**
	   * @type {Array|null}
	   */
	  this.paramCache_ = null;
	}

	/** returns the string form of the url. */
	URI.prototype.toString = function () {
	  var out = [];
	  if (null !== this.scheme_) { out.push(this.scheme_, ':'); }
	  if (null !== this.domain_) {
	    out.push('//');
	    if (null !== this.credentials_) { out.push(this.credentials_, '@'); }
	    out.push(this.domain_);
	    if (null !== this.port_) { out.push(':', this.port_.toString()); }
	  }
	  if (null !== this.path_) { out.push(this.path_); }
	  if (null !== this.query_) { out.push('?', this.query_); }
	  if (null !== this.fragment_) { out.push('#', this.fragment_); }
	  return out.join('');
	};

	URI.prototype.clone = function () {
	  return new URI(this.scheme_, this.credentials_, this.domain_, this.port_,
	                 this.path_, this.query_, this.fragment_);
	};

	URI.prototype.getScheme = function () {
	  // HTML5 spec does not require the scheme to be lowercased but
	  // all common browsers except Safari lowercase the scheme.
	  return this.scheme_ && decodeURIComponent(this.scheme_).toLowerCase();
	};
	URI.prototype.getRawScheme = function () {
	  return this.scheme_;
	};
	URI.prototype.setScheme = function (newScheme) {
	  this.scheme_ = encodeIfExists2(
	      newScheme, URI_DISALLOWED_IN_SCHEME_OR_CREDENTIALS_);
	  return this;
	};
	URI.prototype.setRawScheme = function (newScheme) {
	  this.scheme_ = newScheme ? newScheme : null;
	  return this;
	};
	URI.prototype.hasScheme = function () {
	  return null !== this.scheme_;
	};


	URI.prototype.getCredentials = function () {
	  return this.credentials_ && decodeURIComponent(this.credentials_);
	};
	URI.prototype.getRawCredentials = function () {
	  return this.credentials_;
	};
	URI.prototype.setCredentials = function (newCredentials) {
	  this.credentials_ = encodeIfExists2(
	      newCredentials, URI_DISALLOWED_IN_SCHEME_OR_CREDENTIALS_);

	  return this;
	};
	URI.prototype.setRawCredentials = function (newCredentials) {
	  this.credentials_ = newCredentials ? newCredentials : null;
	  return this;
	};
	URI.prototype.hasCredentials = function () {
	  return null !== this.credentials_;
	};


	URI.prototype.getDomain = function () {
	  return this.domain_ && decodeURIComponent(this.domain_);
	};
	URI.prototype.getRawDomain = function () {
	  return this.domain_;
	};
	URI.prototype.setDomain = function (newDomain) {
	  return this.setRawDomain(newDomain && encodeURIComponent(newDomain));
	};
	URI.prototype.setRawDomain = function (newDomain) {
	  this.domain_ = newDomain ? newDomain : null;
	  // Maintain the invariant that paths must start with a slash when the URI
	  // is not path-relative.
	  return this.setRawPath(this.path_);
	};
	URI.prototype.hasDomain = function () {
	  return null !== this.domain_;
	};


	URI.prototype.getPort = function () {
	  return this.port_ && decodeURIComponent(this.port_);
	};
	URI.prototype.setPort = function (newPort) {
	  if (newPort) {
	    newPort = Number(newPort);
	    if (newPort !== (newPort & 0xffff)) {
	      throw new Error('Bad port number ' + newPort);
	    }
	    this.port_ = '' + newPort;
	  } else {
	    this.port_ = null;
	  }
	  return this;
	};
	URI.prototype.hasPort = function () {
	  return null !== this.port_;
	};


	URI.prototype.getPath = function () {
	  return this.path_ && decodeURIComponent(this.path_);
	};
	URI.prototype.getRawPath = function () {
	  return this.path_;
	};
	URI.prototype.setPath = function (newPath) {
	  return this.setRawPath(encodeIfExists2(newPath, URI_DISALLOWED_IN_PATH_));
	};
	URI.prototype.setRawPath = function (newPath) {
	  if (newPath) {
	    newPath = String(newPath);
	    this.path_ = 
	      // Paths must start with '/' unless this is a path-relative URL.
	      (!this.domain_ || /^\//.test(newPath)) ? newPath : '/' + newPath;
	  } else {
	    this.path_ = null;
	  }
	  return this;
	};
	URI.prototype.hasPath = function () {
	  return null !== this.path_;
	};


	URI.prototype.getQuery = function () {
	  // From http://www.w3.org/Addressing/URL/4_URI_Recommentations.html
	  // Within the query string, the plus sign is reserved as shorthand notation
	  // for a space.
	  return this.query_ && decodeURIComponent(this.query_).replace(/\+/g, ' ');
	};
	URI.prototype.getRawQuery = function () {
	  return this.query_;
	};
	URI.prototype.setQuery = function (newQuery) {
	  this.paramCache_ = null;
	  this.query_ = encodeIfExists(newQuery);
	  return this;
	};
	URI.prototype.setRawQuery = function (newQuery) {
	  this.paramCache_ = null;
	  this.query_ = newQuery ? newQuery : null;
	  return this;
	};
	URI.prototype.hasQuery = function () {
	  return null !== this.query_;
	};

	/**
	 * sets the query given a list of strings of the form
	 * [ key0, value0, key1, value1, ... ].
	 *
	 * <p><code>uri.setAllParameters(['a', 'b', 'c', 'd']).getQuery()</code>
	 * will yield <code>'a=b&c=d'</code>.
	 */
	URI.prototype.setAllParameters = function (params) {
	  if (typeof params === 'object') {
	    if (!(params instanceof Array)
	        && (params instanceof Object
	            || Object.prototype.toString.call(params) !== '[object Array]')) {
	      var newParams = [];
	      var i = -1;
	      for (var k in params) {
	        var v = params[k];
	        if ('string' === typeof v) {
	          newParams[++i] = k;
	          newParams[++i] = v;
	        }
	      }
	      params = newParams;
	    }
	  }
	  this.paramCache_ = null;
	  var queryBuf = [];
	  var separator = '';
	  for (var j = 0; j < params.length;) {
	    var k = params[j++];
	    var v = params[j++];
	    queryBuf.push(separator, encodeURIComponent(k.toString()));
	    separator = '&';
	    if (v) {
	      queryBuf.push('=', encodeURIComponent(v.toString()));
	    }
	  }
	  this.query_ = queryBuf.join('');
	  return this;
	};
	URI.prototype.checkParameterCache_ = function () {
	  if (!this.paramCache_) {
	    var q = this.query_;
	    if (!q) {
	      this.paramCache_ = [];
	    } else {
	      var cgiParams = q.split(/[&\?]/);
	      var out = [];
	      var k = -1;
	      for (var i = 0; i < cgiParams.length; ++i) {
	        var m = cgiParams[i].match(/^([^=]*)(?:=(.*))?$/);
	        // From http://www.w3.org/Addressing/URL/4_URI_Recommentations.html
	        // Within the query string, the plus sign is reserved as shorthand
	        // notation for a space.
	        out[++k] = decodeURIComponent(m[1]).replace(/\+/g, ' ');
	        out[++k] = decodeURIComponent(m[2] || '').replace(/\+/g, ' ');
	      }
	      this.paramCache_ = out;
	    }
	  }
	};
	/**
	 * sets the values of the named cgi parameters.
	 *
	 * <p>So, <code>uri.parse('foo?a=b&c=d&e=f').setParameterValues('c', ['new'])
	 * </code> yields <tt>foo?a=b&c=new&e=f</tt>.</p>
	 *
	 * @param key {string}
	 * @param values {Array.<string>} the new values.  If values is a single string
	 *   then it will be treated as the sole value.
	 */
	URI.prototype.setParameterValues = function (key, values) {
	  // be nice and avoid subtle bugs where [] operator on string performs charAt
	  // on some browsers and crashes on IE
	  if (typeof values === 'string') {
	    values = [ values ];
	  }

	  this.checkParameterCache_();
	  var newValueIndex = 0;
	  var pc = this.paramCache_;
	  var params = [];
	  for (var i = 0, k = 0; i < pc.length; i += 2) {
	    if (key === pc[i]) {
	      if (newValueIndex < values.length) {
	        params.push(key, values[newValueIndex++]);
	      }
	    } else {
	      params.push(pc[i], pc[i + 1]);
	    }
	  }
	  while (newValueIndex < values.length) {
	    params.push(key, values[newValueIndex++]);
	  }
	  this.setAllParameters(params);
	  return this;
	};
	URI.prototype.removeParameter = function (key) {
	  return this.setParameterValues(key, []);
	};
	/**
	 * returns the parameters specified in the query part of the uri as a list of
	 * keys and values like [ key0, value0, key1, value1, ... ].
	 *
	 * @return {Array.<string>}
	 */
	URI.prototype.getAllParameters = function () {
	  this.checkParameterCache_();
	  return this.paramCache_.slice(0, this.paramCache_.length);
	};
	/**
	 * returns the value<b>s</b> for a given cgi parameter as a list of decoded
	 * query parameter values.
	 * @return {Array.<string>}
	 */
	URI.prototype.getParameterValues = function (paramNameUnescaped) {
	  this.checkParameterCache_();
	  var values = [];
	  for (var i = 0; i < this.paramCache_.length; i += 2) {
	    if (paramNameUnescaped === this.paramCache_[i]) {
	      values.push(this.paramCache_[i + 1]);
	    }
	  }
	  return values;
	};
	/**
	 * returns a map of cgi parameter names to (non-empty) lists of values.
	 * @return {Object.<string,Array.<string>>}
	 */
	URI.prototype.getParameterMap = function (paramNameUnescaped) {
	  this.checkParameterCache_();
	  var paramMap = {};
	  for (var i = 0; i < this.paramCache_.length; i += 2) {
	    var key = this.paramCache_[i++],
	      value = this.paramCache_[i++];
	    if (!(key in paramMap)) {
	      paramMap[key] = [value];
	    } else {
	      paramMap[key].push(value);
	    }
	  }
	  return paramMap;
	};
	/**
	 * returns the first value for a given cgi parameter or null if the given
	 * parameter name does not appear in the query string.
	 * If the given parameter name does appear, but has no '<tt>=</tt>' following
	 * it, then the empty string will be returned.
	 * @return {string|null}
	 */
	URI.prototype.getParameterValue = function (paramNameUnescaped) {
	  this.checkParameterCache_();
	  for (var i = 0; i < this.paramCache_.length; i += 2) {
	    if (paramNameUnescaped === this.paramCache_[i]) {
	      return this.paramCache_[i + 1];
	    }
	  }
	  return null;
	};

	URI.prototype.getFragment = function () {
	  return this.fragment_ && decodeURIComponent(this.fragment_);
	};
	URI.prototype.getRawFragment = function () {
	  return this.fragment_;
	};
	URI.prototype.setFragment = function (newFragment) {
	  this.fragment_ = newFragment ? encodeURIComponent(newFragment) : null;
	  return this;
	};
	URI.prototype.setRawFragment = function (newFragment) {
	  this.fragment_ = newFragment ? newFragment : null;
	  return this;
	};
	URI.prototype.hasFragment = function () {
	  return null !== this.fragment_;
	};

	function nullIfAbsent(matchPart) {
	  return ('string' == typeof matchPart) && (matchPart.length > 0)
	         ? matchPart
	         : null;
	}




	/**
	 * a regular expression for breaking a URI into its component parts.
	 *
	 * <p>http://www.gbiv.com/protocols/uri/rfc/rfc3986.html#RFC2234 says
	 * As the "first-match-wins" algorithm is identical to the "greedy"
	 * disambiguation method used by POSIX regular expressions, it is natural and
	 * commonplace to use a regular expression for parsing the potential five
	 * components of a URI reference.
	 *
	 * <p>The following line is the regular expression for breaking-down a
	 * well-formed URI reference into its components.
	 *
	 * <pre>
	 * ^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?
	 *  12            3  4          5       6  7        8 9
	 * </pre>
	 *
	 * <p>The numbers in the second line above are only to assist readability; they
	 * indicate the reference points for each subexpression (i.e., each paired
	 * parenthesis). We refer to the value matched for subexpression <n> as $<n>.
	 * For example, matching the above expression to
	 * <pre>
	 *     http://www.ics.uci.edu/pub/ietf/uri/#Related
	 * </pre>
	 * results in the following subexpression matches:
	 * <pre>
	 *    $1 = http:
	 *    $2 = http
	 *    $3 = //www.ics.uci.edu
	 *    $4 = www.ics.uci.edu
	 *    $5 = /pub/ietf/uri/
	 *    $6 = <undefined>
	 *    $7 = <undefined>
	 *    $8 = #Related
	 *    $9 = Related
	 * </pre>
	 * where <undefined> indicates that the component is not present, as is the
	 * case for the query component in the above example. Therefore, we can
	 * determine the value of the five components as
	 * <pre>
	 *    scheme    = $2
	 *    authority = $4
	 *    path      = $5
	 *    query     = $7
	 *    fragment  = $9
	 * </pre>
	 *
	 * <p>msamuel: I have modified the regular expression slightly to expose the
	 * credentials, domain, and port separately from the authority.
	 * The modified version yields
	 * <pre>
	 *    $1 = http              scheme
	 *    $2 = <undefined>       credentials -\
	 *    $3 = www.ics.uci.edu   domain       | authority
	 *    $4 = <undefined>       port        -/
	 *    $5 = /pub/ietf/uri/    path
	 *    $6 = <undefined>       query without ?
	 *    $7 = Related           fragment without #
	 * </pre>
	 */
	var URI_RE_ = new RegExp(
	      "^" +
	      "(?:" +
	        "([^:/?#]+)" +         // scheme
	      ":)?" +
	      "(?://" +
	        "(?:([^/?#]*)@)?" +    // credentials
	        "([^/?#:@]*)" +        // domain
	        "(?::([0-9]+))?" +     // port
	      ")?" +
	      "([^?#]+)?" +            // path
	      "(?:\\?([^#]*))?" +      // query
	      "(?:#(.*))?" +           // fragment
	      "$"
	      );

	var URI_DISALLOWED_IN_SCHEME_OR_CREDENTIALS_ = /[#\/\?@]/g;
	var URI_DISALLOWED_IN_PATH_ = /[\#\?]/g;

	URI.parse = parse;
	URI.create = create;
	URI.resolve = resolve;
	URI.collapse_dots = collapse_dots;  // Visible for testing.

	// lightweight string-based api for loadModuleMaker
	URI.utils = {
	  mimeTypeOf: function (uri) {
	    var uriObj = parse(uri);
	    if (/\.html$/.test(uriObj.getPath())) {
	      return 'text/html';
	    } else {
	      return 'application/javascript';
	    }
	  },
	  resolve: function (base, uri) {
	    if (base) {
	      return resolve(parse(base), parse(uri)).toString();
	    } else {
	      return '' + uri;
	    }
	  }
	};


	return URI;
	})();

	// Copyright Google Inc.
	// Licensed under the Apache Licence Version 2.0
	// Autogenerated at Mon Feb 25 13:05:42 EST 2013
	// @overrides window
	// @provides html4
	var html4 = {};
	html4.atype = {
	  'NONE': 0,
	  'URI': 1,
	  'URI_FRAGMENT': 11,
	  'SCRIPT': 2,
	  'STYLE': 3,
	  'HTML': 12,
	  'ID': 4,
	  'IDREF': 5,
	  'IDREFS': 6,
	  'GLOBAL_NAME': 7,
	  'LOCAL_NAME': 8,
	  'CLASSES': 9,
	  'FRAME_TARGET': 10,
	  'MEDIA_QUERY': 13
	};
	html4[ 'atype' ] = html4.atype;
	html4.ATTRIBS = {
	  '*::class': 9,
	  '*::dir': 0,
	  '*::draggable': 0,
	  '*::hidden': 0,
	  '*::id': 4,
	  '*::inert': 0,
	  '*::itemprop': 0,
	  '*::itemref': 6,
	  '*::itemscope': 0,
	  '*::lang': 0,
	  '*::onblur': 2,
	  '*::onchange': 2,
	  '*::onclick': 2,
	  '*::ondblclick': 2,
	  '*::onfocus': 2,
	  '*::onkeydown': 2,
	  '*::onkeypress': 2,
	  '*::onkeyup': 2,
	  '*::onload': 2,
	  '*::onmousedown': 2,
	  '*::onmousemove': 2,
	  '*::onmouseout': 2,
	  '*::onmouseover': 2,
	  '*::onmouseup': 2,
	  '*::onreset': 2,
	  '*::onscroll': 2,
	  '*::onselect': 2,
	  '*::onsubmit': 2,
	  '*::onunload': 2,
	  '*::spellcheck': 0,
	  '*::style': 3,
	  '*::title': 0,
	  '*::translate': 0,
	  'a::accesskey': 0,
	  'a::coords': 0,
	  'a::href': 1,
	  'a::hreflang': 0,
	  'a::name': 7,
	  'a::onblur': 2,
	  'a::onfocus': 2,
	  'a::shape': 0,
	  'a::tabindex': 0,
	  'a::target': 10,
	  'a::type': 0,
	  'area::accesskey': 0,
	  'area::alt': 0,
	  'area::coords': 0,
	  'area::href': 1,
	  'area::nohref': 0,
	  'area::onblur': 2,
	  'area::onfocus': 2,
	  'area::shape': 0,
	  'area::tabindex': 0,
	  'area::target': 10,
	  'audio::controls': 0,
	  'audio::loop': 0,
	  'audio::mediagroup': 5,
	  'audio::muted': 0,
	  'audio::preload': 0,
	  'bdo::dir': 0,
	  'blockquote::cite': 1,
	  'br::clear': 0,
	  'button::accesskey': 0,
	  'button::disabled': 0,
	  'button::name': 8,
	  'button::onblur': 2,
	  'button::onfocus': 2,
	  'button::tabindex': 0,
	  'button::type': 0,
	  'button::value': 0,
	  'canvas::height': 0,
	  'canvas::width': 0,
	  'caption::align': 0,
	  'col::align': 0,
	  'col::char': 0,
	  'col::charoff': 0,
	  'col::span': 0,
	  'col::valign': 0,
	  'col::width': 0,
	  'colgroup::align': 0,
	  'colgroup::char': 0,
	  'colgroup::charoff': 0,
	  'colgroup::span': 0,
	  'colgroup::valign': 0,
	  'colgroup::width': 0,
	  'command::checked': 0,
	  'command::command': 5,
	  'command::disabled': 0,
	  'command::icon': 1,
	  'command::label': 0,
	  'command::radiogroup': 0,
	  'command::type': 0,
	  'data::value': 0,
	  'del::cite': 1,
	  'del::datetime': 0,
	  'details::open': 0,
	  'dir::compact': 0,
	  'div::align': 0,
	  'dl::compact': 0,
	  'fieldset::disabled': 0,
	  'font::color': 0,
	  'font::face': 0,
	  'font::size': 0,
	  'form::accept': 0,
	  'form::action': 1,
	  'form::autocomplete': 0,
	  'form::enctype': 0,
	  'form::method': 0,
	  'form::name': 7,
	  'form::novalidate': 0,
	  'form::onreset': 2,
	  'form::onsubmit': 2,
	  'form::target': 10,
	  'h1::align': 0,
	  'h2::align': 0,
	  'h3::align': 0,
	  'h4::align': 0,
	  'h5::align': 0,
	  'h6::align': 0,
	  'hr::align': 0,
	  'hr::noshade': 0,
	  'hr::size': 0,
	  'hr::width': 0,
	  'iframe::align': 0,
	  'iframe::frameborder': 0,
	  'iframe::height': 0,
	  'iframe::marginheight': 0,
	  'iframe::marginwidth': 0,
	  'iframe::width': 0,
	  'img::align': 0,
	  'img::alt': 0,
	  'img::border': 0,
	  'img::height': 0,
	  'img::hspace': 0,
	  'img::ismap': 0,
	  'img::name': 7,
	  'img::src': 1,
	  'img::usemap': 11,
	  'img::vspace': 0,
	  'img::width': 0,
	  'input::accept': 0,
	  'input::accesskey': 0,
	  'input::align': 0,
	  'input::alt': 0,
	  'input::autocomplete': 0,
	  'input::checked': 0,
	  'input::disabled': 0,
	  'input::inputmode': 0,
	  'input::ismap': 0,
	  'input::list': 5,
	  'input::max': 0,
	  'input::maxlength': 0,
	  'input::min': 0,
	  'input::multiple': 0,
	  'input::name': 8,
	  'input::onblur': 2,
	  'input::onchange': 2,
	  'input::onfocus': 2,
	  'input::onselect': 2,
	  'input::placeholder': 0,
	  'input::readonly': 0,
	  'input::required': 0,
	  'input::size': 0,
	  'input::src': 1,
	  'input::step': 0,
	  'input::tabindex': 0,
	  'input::type': 0,
	  'input::usemap': 11,
	  'input::value': 0,
	  'ins::cite': 1,
	  'ins::datetime': 0,
	  'label::accesskey': 0,
	  'label::for': 5,
	  'label::onblur': 2,
	  'label::onfocus': 2,
	  'legend::accesskey': 0,
	  'legend::align': 0,
	  'li::type': 0,
	  'li::value': 0,
	  'map::name': 7,
	  'menu::compact': 0,
	  'menu::label': 0,
	  'menu::type': 0,
	  'meter::high': 0,
	  'meter::low': 0,
	  'meter::max': 0,
	  'meter::min': 0,
	  'meter::value': 0,
	  'ol::compact': 0,
	  'ol::reversed': 0,
	  'ol::start': 0,
	  'ol::type': 0,
	  'optgroup::disabled': 0,
	  'optgroup::label': 0,
	  'option::disabled': 0,
	  'option::label': 0,
	  'option::selected': 0,
	  'option::value': 0,
	  'output::for': 6,
	  'output::name': 8,
	  'p::align': 0,
	  'pre::width': 0,
	  'progress::max': 0,
	  'progress::min': 0,
	  'progress::value': 0,
	  'q::cite': 1,
	  'select::autocomplete': 0,
	  'select::disabled': 0,
	  'select::multiple': 0,
	  'select::name': 8,
	  'select::onblur': 2,
	  'select::onchange': 2,
	  'select::onfocus': 2,
	  'select::required': 0,
	  'select::size': 0,
	  'select::tabindex': 0,
	  'source::type': 0,
	  'table::align': 0,
	  'table::bgcolor': 0,
	  'table::border': 0,
	  'table::cellpadding': 0,
	  'table::cellspacing': 0,
	  'table::frame': 0,
	  'table::rules': 0,
	  'table::summary': 0,
	  'table::width': 0,
	  'tbody::align': 0,
	  'tbody::char': 0,
	  'tbody::charoff': 0,
	  'tbody::valign': 0,
	  'td::abbr': 0,
	  'td::align': 0,
	  'td::axis': 0,
	  'td::bgcolor': 0,
	  'td::char': 0,
	  'td::charoff': 0,
	  'td::colspan': 0,
	  'td::headers': 6,
	  'td::height': 0,
	  'td::nowrap': 0,
	  'td::rowspan': 0,
	  'td::scope': 0,
	  'td::valign': 0,
	  'td::width': 0,
	  'textarea::accesskey': 0,
	  'textarea::autocomplete': 0,
	  'textarea::cols': 0,
	  'textarea::disabled': 0,
	  'textarea::inputmode': 0,
	  'textarea::name': 8,
	  'textarea::onblur': 2,
	  'textarea::onchange': 2,
	  'textarea::onfocus': 2,
	  'textarea::onselect': 2,
	  'textarea::placeholder': 0,
	  'textarea::readonly': 0,
	  'textarea::required': 0,
	  'textarea::rows': 0,
	  'textarea::tabindex': 0,
	  'textarea::wrap': 0,
	  'tfoot::align': 0,
	  'tfoot::char': 0,
	  'tfoot::charoff': 0,
	  'tfoot::valign': 0,
	  'th::abbr': 0,
	  'th::align': 0,
	  'th::axis': 0,
	  'th::bgcolor': 0,
	  'th::char': 0,
	  'th::charoff': 0,
	  'th::colspan': 0,
	  'th::headers': 6,
	  'th::height': 0,
	  'th::nowrap': 0,
	  'th::rowspan': 0,
	  'th::scope': 0,
	  'th::valign': 0,
	  'th::width': 0,
	  'thead::align': 0,
	  'thead::char': 0,
	  'thead::charoff': 0,
	  'thead::valign': 0,
	  'tr::align': 0,
	  'tr::bgcolor': 0,
	  'tr::char': 0,
	  'tr::charoff': 0,
	  'tr::valign': 0,
	  'track::default': 0,
	  'track::kind': 0,
	  'track::label': 0,
	  'track::srclang': 0,
	  'ul::compact': 0,
	  'ul::type': 0,
	  'video::controls': 0,
	  'video::height': 0,
	  'video::loop': 0,
	  'video::mediagroup': 5,
	  'video::muted': 0,
	  'video::poster': 1,
	  'video::preload': 0,
	  'video::width': 0
	};
	html4[ 'ATTRIBS' ] = html4.ATTRIBS;
	html4.eflags = {
	  'OPTIONAL_ENDTAG': 1,
	  'EMPTY': 2,
	  'CDATA': 4,
	  'RCDATA': 8,
	  'UNSAFE': 16,
	  'FOLDABLE': 32,
	  'SCRIPT': 64,
	  'STYLE': 128,
	  'VIRTUALIZED': 256
	};
	html4[ 'eflags' ] = html4.eflags;
	// these are bitmasks of the eflags above.
	html4.ELEMENTS = {
	  'a': 0,
	  'abbr': 0,
	  'acronym': 0,
	  'address': 0,
	  'applet': 272,
	  'area': 2,
	  'article': 0,
	  'aside': 0,
	  'audio': 0,
	  'b': 0,
	  'base': 274,
	  'basefont': 274,
	  'bdi': 0,
	  'bdo': 0,
	  'big': 0,
	  'blockquote': 0,
	  'body': 305,
	  'br': 2,
	  'button': 0,
	  'canvas': 0,
	  'caption': 0,
	  'center': 0,
	  'cite': 0,
	  'code': 0,
	  'col': 2,
	  'colgroup': 1,
	  'command': 2,
	  'data': 0,
	  'datalist': 0,
	  'dd': 1,
	  'del': 0,
	  'details': 0,
	  'dfn': 0,
	  'dialog': 272,
	  'dir': 0,
	  'div': 0,
	  'dl': 0,
	  'dt': 1,
	  'em': 0,
	  'fieldset': 0,
	  'figcaption': 0,
	  'figure': 0,
	  'font': 0,
	  'footer': 0,
	  'form': 0,
	  'frame': 274,
	  'frameset': 272,
	  'h1': 0,
	  'h2': 0,
	  'h3': 0,
	  'h4': 0,
	  'h5': 0,
	  'h6': 0,
	  'head': 305,
	  'header': 0,
	  'hgroup': 0,
	  'hr': 2,
	  'html': 305,
	  'i': 0,
	  'iframe': 16,
	  'img': 2,
	  'input': 2,
	  'ins': 0,
	  'isindex': 274,
	  'kbd': 0,
	  'keygen': 274,
	  'label': 0,
	  'legend': 0,
	  'li': 1,
	  'link': 274,
	  'map': 0,
	  'mark': 0,
	  'menu': 0,
	  'meta': 274,
	  'meter': 0,
	  'nav': 0,
	  'nobr': 0,
	  'noembed': 276,
	  'noframes': 276,
	  'noscript': 276,
	  'object': 272,
	  'ol': 0,
	  'optgroup': 0,
	  'option': 1,
	  'output': 0,
	  'p': 1,
	  'param': 274,
	  'pre': 0,
	  'progress': 0,
	  'q': 0,
	  's': 0,
	  'samp': 0,
	  'script': 84,
	  'section': 0,
	  'select': 0,
	  'small': 0,
	  'source': 2,
	  'span': 0,
	  'strike': 0,
	  'strong': 0,
	  'style': 148,
	  'sub': 0,
	  'summary': 0,
	  'sup': 0,
	  'table': 0,
	  'tbody': 1,
	  'td': 1,
	  'textarea': 8,
	  'tfoot': 1,
	  'th': 1,
	  'thead': 1,
	  'time': 0,
	  'title': 280,
	  'tr': 1,
	  'track': 2,
	  'tt': 0,
	  'u': 0,
	  'ul': 0,
	  'var': 0,
	  'video': 0,
	  'wbr': 2
	};
	html4[ 'ELEMENTS' ] = html4.ELEMENTS;
	html4.ELEMENT_DOM_INTERFACES = {
	  'a': 'HTMLAnchorElement',
	  'abbr': 'HTMLElement',
	  'acronym': 'HTMLElement',
	  'address': 'HTMLElement',
	  'applet': 'HTMLAppletElement',
	  'area': 'HTMLAreaElement',
	  'article': 'HTMLElement',
	  'aside': 'HTMLElement',
	  'audio': 'HTMLAudioElement',
	  'b': 'HTMLElement',
	  'base': 'HTMLBaseElement',
	  'basefont': 'HTMLBaseFontElement',
	  'bdi': 'HTMLElement',
	  'bdo': 'HTMLElement',
	  'big': 'HTMLElement',
	  'blockquote': 'HTMLQuoteElement',
	  'body': 'HTMLBodyElement',
	  'br': 'HTMLBRElement',
	  'button': 'HTMLButtonElement',
	  'canvas': 'HTMLCanvasElement',
	  'caption': 'HTMLTableCaptionElement',
	  'center': 'HTMLElement',
	  'cite': 'HTMLElement',
	  'code': 'HTMLElement',
	  'col': 'HTMLTableColElement',
	  'colgroup': 'HTMLTableColElement',
	  'command': 'HTMLCommandElement',
	  'data': 'HTMLElement',
	  'datalist': 'HTMLDataListElement',
	  'dd': 'HTMLElement',
	  'del': 'HTMLModElement',
	  'details': 'HTMLDetailsElement',
	  'dfn': 'HTMLElement',
	  'dialog': 'HTMLDialogElement',
	  'dir': 'HTMLDirectoryElement',
	  'div': 'HTMLDivElement',
	  'dl': 'HTMLDListElement',
	  'dt': 'HTMLElement',
	  'em': 'HTMLElement',
	  'fieldset': 'HTMLFieldSetElement',
	  'figcaption': 'HTMLElement',
	  'figure': 'HTMLElement',
	  'font': 'HTMLFontElement',
	  'footer': 'HTMLElement',
	  'form': 'HTMLFormElement',
	  'frame': 'HTMLFrameElement',
	  'frameset': 'HTMLFrameSetElement',
	  'h1': 'HTMLHeadingElement',
	  'h2': 'HTMLHeadingElement',
	  'h3': 'HTMLHeadingElement',
	  'h4': 'HTMLHeadingElement',
	  'h5': 'HTMLHeadingElement',
	  'h6': 'HTMLHeadingElement',
	  'head': 'HTMLHeadElement',
	  'header': 'HTMLElement',
	  'hgroup': 'HTMLElement',
	  'hr': 'HTMLHRElement',
	  'html': 'HTMLHtmlElement',
	  'i': 'HTMLElement',
	  'iframe': 'HTMLIFrameElement',
	  'img': 'HTMLImageElement',
	  'input': 'HTMLInputElement',
	  'ins': 'HTMLModElement',
	  'isindex': 'HTMLUnknownElement',
	  'kbd': 'HTMLElement',
	  'keygen': 'HTMLKeygenElement',
	  'label': 'HTMLLabelElement',
	  'legend': 'HTMLLegendElement',
	  'li': 'HTMLLIElement',
	  'link': 'HTMLLinkElement',
	  'map': 'HTMLMapElement',
	  'mark': 'HTMLElement',
	  'menu': 'HTMLMenuElement',
	  'meta': 'HTMLMetaElement',
	  'meter': 'HTMLMeterElement',
	  'nav': 'HTMLElement',
	  'nobr': 'HTMLElement',
	  'noembed': 'HTMLElement',
	  'noframes': 'HTMLElement',
	  'noscript': 'HTMLElement',
	  'object': 'HTMLObjectElement',
	  'ol': 'HTMLOListElement',
	  'optgroup': 'HTMLOptGroupElement',
	  'option': 'HTMLOptionElement',
	  'output': 'HTMLOutputElement',
	  'p': 'HTMLParagraphElement',
	  'param': 'HTMLParamElement',
	  'pre': 'HTMLPreElement',
	  'progress': 'HTMLProgressElement',
	  'q': 'HTMLQuoteElement',
	  's': 'HTMLElement',
	  'samp': 'HTMLElement',
	  'script': 'HTMLScriptElement',
	  'section': 'HTMLElement',
	  'select': 'HTMLSelectElement',
	  'small': 'HTMLElement',
	  'source': 'HTMLSourceElement',
	  'span': 'HTMLSpanElement',
	  'strike': 'HTMLElement',
	  'strong': 'HTMLElement',
	  'style': 'HTMLStyleElement',
	  'sub': 'HTMLElement',
	  'summary': 'HTMLElement',
	  'sup': 'HTMLElement',
	  'table': 'HTMLTableElement',
	  'tbody': 'HTMLTableSectionElement',
	  'td': 'HTMLTableDataCellElement',
	  'textarea': 'HTMLTextAreaElement',
	  'tfoot': 'HTMLTableSectionElement',
	  'th': 'HTMLTableHeaderCellElement',
	  'thead': 'HTMLTableSectionElement',
	  'time': 'HTMLTimeElement',
	  'title': 'HTMLTitleElement',
	  'tr': 'HTMLTableRowElement',
	  'track': 'HTMLTrackElement',
	  'tt': 'HTMLElement',
	  'u': 'HTMLElement',
	  'ul': 'HTMLUListElement',
	  'var': 'HTMLElement',
	  'video': 'HTMLVideoElement',
	  'wbr': 'HTMLElement'
	};
	html4[ 'ELEMENT_DOM_INTERFACES' ] = html4.ELEMENT_DOM_INTERFACES;
	html4.ueffects = {
	  'NOT_LOADED': 0,
	  'SAME_DOCUMENT': 1,
	  'NEW_DOCUMENT': 2
	};
	html4[ 'ueffects' ] = html4.ueffects;
	html4.URIEFFECTS = {
	  'a::href': 2,
	  'area::href': 2,
	  'blockquote::cite': 0,
	  'command::icon': 1,
	  'del::cite': 0,
	  'form::action': 2,
	  'img::src': 1,
	  'input::src': 1,
	  'ins::cite': 0,
	  'q::cite': 0,
	  'video::poster': 1
	};
	html4[ 'URIEFFECTS' ] = html4.URIEFFECTS;
	html4.ltypes = {
	  'UNSANDBOXED': 2,
	  'SANDBOXED': 1,
	  'DATA': 0
	};
	html4[ 'ltypes' ] = html4.ltypes;
	html4.LOADERTYPES = {
	  'a::href': 2,
	  'area::href': 2,
	  'blockquote::cite': 2,
	  'command::icon': 1,
	  'del::cite': 2,
	  'form::action': 2,
	  'img::src': 1,
	  'input::src': 1,
	  'ins::cite': 2,
	  'q::cite': 2,
	  'video::poster': 1
	};
	html4[ 'LOADERTYPES' ] = html4.LOADERTYPES;

	// Copyright (C) 2006 Google Inc.
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.

	/**
	 * @fileoverview
	 * An HTML sanitizer that can satisfy a variety of security policies.
	 *
	 * <p>
	 * The HTML sanitizer is built around a SAX parser and HTML element and
	 * attributes schemas.
	 *
	 * If the cssparser is loaded, inline styles are sanitized using the
	 * css property and value schemas.  Else they are remove during
	 * sanitization.
	 *
	 * If it exists, uses parseCssDeclarations, sanitizeCssProperty,  cssSchema
	 *
	 * @author mikesamuel@gmail.com
	 * @author jasvir@gmail.com
	 * \@requires html4, URI
	 * \@overrides window
	 * \@provides html, html_sanitize
	 */

	// The Turkish i seems to be a non-issue, but abort in case it is.
	if ('I'.toLowerCase() !== 'i') { throw 'I/i problem'; }

	/**
	 * \@namespace
	 */
	var html = (function(html4) {

	  // For closure compiler
	  var parseCssDeclarations, sanitizeCssProperty, cssSchema;
	  if ('undefined' !== typeof window) {
	    parseCssDeclarations = window['parseCssDeclarations'];
	    sanitizeCssProperty = window['sanitizeCssProperty'];
	    cssSchema = window['cssSchema'];
	  }

	  // The keys of this object must be 'quoted' or JSCompiler will mangle them!
	  // This is a partial list -- lookupEntity() uses the host browser's parser
	  // (when available) to implement full entity lookup.
	  // Note that entities are in general case-sensitive; the uppercase ones are
	  // explicitly defined by HTML5 (presumably as compatibility).
	  var ENTITIES = {
	    'lt': '<',
	    'LT': '<',
	    'gt': '>',
	    'GT': '>',
	    'amp': '&',
	    'AMP': '&',
	    'quot': '"',
	    'apos': '\'',
	    'nbsp': '\240'
	  };

	  // Patterns for types of entity/character reference names.
	  var decimalEscapeRe = /^#(\d+)$/;
	  var hexEscapeRe = /^#x([0-9A-Fa-f]+)$/;
	  // contains every entity per http://www.w3.org/TR/2011/WD-html5-20110113/named-character-references.html
	  var safeEntityNameRe = /^[A-Za-z][A-za-z0-9]+$/;
	  // Used as a hook to invoke the browser's entity parsing. <textarea> is used
	  // because its content is parsed for entities but not tags.
	  // TODO(kpreid): This retrieval is a kludge and leads to silent loss of
	  // functionality if the document isn't available.
	  var entityLookupElement =
	      ('undefined' !== typeof window && window['document'])
	          ? window['document'].createElement('textarea') : null;
	  /**
	   * Decodes an HTML entity.
	   *
	   * {\@updoc
	   * $ lookupEntity('lt')
	   * # '<'
	   * $ lookupEntity('GT')
	   * # '>'
	   * $ lookupEntity('amp')
	   * # '&'
	   * $ lookupEntity('nbsp')
	   * # '\xA0'
	   * $ lookupEntity('apos')
	   * # "'"
	   * $ lookupEntity('quot')
	   * # '"'
	   * $ lookupEntity('#xa')
	   * # '\n'
	   * $ lookupEntity('#10')
	   * # '\n'
	   * $ lookupEntity('#x0a')
	   * # '\n'
	   * $ lookupEntity('#010')
	   * # '\n'
	   * $ lookupEntity('#x00A')
	   * # '\n'
	   * $ lookupEntity('Pi')      // Known failure
	   * # '\u03A0'
	   * $ lookupEntity('pi')      // Known failure
	   * # '\u03C0'
	   * }
	   *
	   * @param {string} name the content between the '&' and the ';'.
	   * @return {string} a single unicode code-point as a string.
	   */
	  function lookupEntity(name) {
	    // TODO: entity lookup as specified by HTML5 actually depends on the
	    // presence of the ";".
	    if (ENTITIES.hasOwnProperty(name)) { return ENTITIES[name]; }
	    var m = name.match(decimalEscapeRe);
	    if (m) {
	      return String.fromCharCode(parseInt(m[1], 10));
	    } else if (!!(m = name.match(hexEscapeRe))) {
	      return String.fromCharCode(parseInt(m[1], 16));
	    } else if (entityLookupElement && safeEntityNameRe.test(name)) {
	      entityLookupElement.innerHTML = '&' + name + ';';
	      var text = entityLookupElement.textContent;
	      ENTITIES[name] = text;
	      return text;
	    } else {
	      return '&' + name + ';';
	    }
	  }

	  function decodeOneEntity(_, name) {
	    return lookupEntity(name);
	  }

	  var nulRe = /\0/g;
	  function stripNULs(s) {
	    return s.replace(nulRe, '');
	  }

	  var ENTITY_RE_1 = /&(#[0-9]+|#[xX][0-9A-Fa-f]+|\w+);/g;
	  var ENTITY_RE_2 = /^(#[0-9]+|#[xX][0-9A-Fa-f]+|\w+);/;
	  /**
	   * The plain text of a chunk of HTML CDATA which possibly containing.
	   *
	   * {\@updoc
	   * $ unescapeEntities('')
	   * # ''
	   * $ unescapeEntities('hello World!')
	   * # 'hello World!'
	   * $ unescapeEntities('1 &lt; 2 &amp;&AMP; 4 &gt; 3&#10;')
	   * # '1 < 2 && 4 > 3\n'
	   * $ unescapeEntities('&lt;&lt <- unfinished entity&gt;')
	   * # '<&lt <- unfinished entity>'
	   * $ unescapeEntities('/foo?bar=baz&copy=true')  // & often unescaped in URLS
	   * # '/foo?bar=baz&copy=true'
	   * $ unescapeEntities('pi=&pi;&#x3c0;, Pi=&Pi;\u03A0') // FIXME: known failure
	   * # 'pi=\u03C0\u03c0, Pi=\u03A0\u03A0'
	   * }
	   *
	   * @param {string} s a chunk of HTML CDATA.  It must not start or end inside
	   *     an HTML entity.
	   */
	  function unescapeEntities(s) {
	    return s.replace(ENTITY_RE_1, decodeOneEntity);
	  }

	  var ampRe = /&/g;
	  var looseAmpRe = /&([^a-z#]|#(?:[^0-9x]|x(?:[^0-9a-f]|$)|$)|$)/gi;
	  var ltRe = /[<]/g;
	  var gtRe = />/g;
	  var quotRe = /\"/g;

	  /**
	   * Escapes HTML special characters in attribute values.
	   *
	   * {\@updoc
	   * $ escapeAttrib('')
	   * # ''
	   * $ escapeAttrib('"<<&==&>>"')  // Do not just escape the first occurrence.
	   * # '&#34;&lt;&lt;&amp;&#61;&#61;&amp;&gt;&gt;&#34;'
	   * $ escapeAttrib('Hello <World>!')
	   * # 'Hello &lt;World&gt;!'
	   * }
	   */
	  function escapeAttrib(s) {
	    return ('' + s).replace(ampRe, '&amp;').replace(ltRe, '&lt;')
	        .replace(gtRe, '&gt;').replace(quotRe, '&#34;');
	  }

	  /**
	   * Escape entities in RCDATA that can be escaped without changing the meaning.
	   * {\@updoc
	   * $ normalizeRCData('1 < 2 &&amp; 3 > 4 &amp;& 5 &lt; 7&8')
	   * # '1 &lt; 2 &amp;&amp; 3 &gt; 4 &amp;&amp; 5 &lt; 7&amp;8'
	   * }
	   */
	  function normalizeRCData(rcdata) {
	    return rcdata
	        .replace(looseAmpRe, '&amp;$1')
	        .replace(ltRe, '&lt;')
	        .replace(gtRe, '&gt;');
	  }

	  // TODO(felix8a): validate sanitizer regexs against the HTML5 grammar at
	  // http://www.whatwg.org/specs/web-apps/current-work/multipage/syntax.html
	  // http://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html
	  // http://www.whatwg.org/specs/web-apps/current-work/multipage/tokenization.html
	  // http://www.whatwg.org/specs/web-apps/current-work/multipage/tree-construction.html

	  // We initially split input so that potentially meaningful characters
	  // like '<' and '>' are separate tokens, using a fast dumb process that
	  // ignores quoting.  Then we walk that token stream, and when we see a
	  // '<' that's the start of a tag, we use ATTR_RE to extract tag
	  // attributes from the next token.  That token will never have a '>'
	  // character.  However, it might have an unbalanced quote character, and
	  // when we see that, we combine additional tokens to balance the quote.

	  var ATTR_RE = new RegExp(
	    '^\\s*' +
	    '([-.:\\w]+)' +             // 1 = Attribute name
	    '(?:' + (
	      '\\s*(=)\\s*' +           // 2 = Is there a value?
	      '(' + (                   // 3 = Attribute value
	        // TODO(felix8a): maybe use backref to match quotes
	        '(\")[^\"]*(\"|$)' +    // 4, 5 = Double-quoted string
	        '|' +
	        '(\')[^\']*(\'|$)' +    // 6, 7 = Single-quoted string
	        '|' +
	        // Positive lookahead to prevent interpretation of
	        // <foo a= b=c> as <foo a='b=c'>
	        // TODO(felix8a): might be able to drop this case
	        '(?=[a-z][-\\w]*\\s*=)' +
	        '|' +
	        // Unquoted value that isn't an attribute name
	        // (since we didn't match the positive lookahead above)
	        '[^\"\'\\s]*' ) +
	      ')' ) +
	    ')?',
	    'i');

	  // false on IE<=8, true on most other browsers
	  var splitWillCapture = ('a,b'.split(/(,)/).length === 3);

	  // bitmask for tags with special parsing, like <script> and <textarea>
	  var EFLAGS_TEXT = html4.eflags['CDATA'] | html4.eflags['RCDATA'];

	  /**
	   * Given a SAX-like event handler, produce a function that feeds those
	   * events and a parameter to the event handler.
	   *
	   * The event handler has the form:{@code
	   * {
	   *   // Name is an upper-case HTML tag name.  Attribs is an array of
	   *   // alternating upper-case attribute names, and attribute values.  The
	   *   // attribs array is reused by the parser.  Param is the value passed to
	   *   // the saxParser.
	   *   startTag: function (name, attribs, param) { ... },
	   *   endTag:   function (name, param) { ... },
	   *   pcdata:   function (text, param) { ... },
	   *   rcdata:   function (text, param) { ... },
	   *   cdata:    function (text, param) { ... },
	   *   startDoc: function (param) { ... },
	   *   endDoc:   function (param) { ... }
	   * }}
	   *
	   * @param {Object} handler a record containing event handlers.
	   * @return {function(string, Object)} A function that takes a chunk of HTML
	   *     and a parameter.  The parameter is passed on to the handler methods.
	   */
	  function makeSaxParser(handler) {
	    // Accept quoted or unquoted keys (Closure compat)
	    var hcopy = {
	      cdata: handler.cdata || handler['cdata'],
	      comment: handler.comment || handler['comment'],
	      endDoc: handler.endDoc || handler['endDoc'],
	      endTag: handler.endTag || handler['endTag'],
	      pcdata: handler.pcdata || handler['pcdata'],
	      rcdata: handler.rcdata || handler['rcdata'],
	      startDoc: handler.startDoc || handler['startDoc'],
	      startTag: handler.startTag || handler['startTag']
	    };
	    return function(htmlText, param) {
	      return parse(htmlText, hcopy, param);
	    };
	  }

	  // Parsing strategy is to split input into parts that might be lexically
	  // meaningful (every ">" becomes a separate part), and then recombine
	  // parts if we discover they're in a different context.

	  // TODO(felix8a): Significant performance regressions from -legacy,
	  // tested on
	  //    Chrome 18.0
	  //    Firefox 11.0
	  //    IE 6, 7, 8, 9
	  //    Opera 11.61
	  //    Safari 5.1.3
	  // Many of these are unusual patterns that are linearly slower and still
	  // pretty fast (eg 1ms to 5ms), so not necessarily worth fixing.

	  // TODO(felix8a): "<script> && && && ... <\/script>" is slower on all
	  // browsers.  The hotspot is htmlSplit.

	  // TODO(felix8a): "<p title='>>>>...'><\/p>" is slower on all browsers.
	  // This is partly htmlSplit, but the hotspot is parseTagAndAttrs.

	  // TODO(felix8a): "<a><\/a><a><\/a>..." is slower on IE9.
	  // "<a>1<\/a><a>1<\/a>..." is faster, "<a><\/a>2<a><\/a>2..." is faster.

	  // TODO(felix8a): "<p<p<p..." is slower on IE[6-8]

	  var continuationMarker = {};
	  function parse(htmlText, handler, param) {
	    var m, p, tagName;
	    var parts = htmlSplit(htmlText);
	    var state = {
	      noMoreGT: false,
	      noMoreEndComments: false
	    };
	    parseCPS(handler, parts, 0, state, param);
	  }

	  function continuationMaker(h, parts, initial, state, param) {
	    return function () {
	      parseCPS(h, parts, initial, state, param);
	    };
	  }

	  function parseCPS(h, parts, initial, state, param) {
	    try {
	      if (h.startDoc && initial == 0) { h.startDoc(param); }
	      var m, p, tagName;
	      for (var pos = initial, end = parts.length; pos < end;) {
	        var current = parts[pos++];
	        var next = parts[pos];
	        switch (current) {
	        case '&':
	          if (ENTITY_RE_2.test(next)) {
	            if (h.pcdata) {
	              h.pcdata('&' + next, param, continuationMarker,
	                continuationMaker(h, parts, pos, state, param));
	            }
	            pos++;
	          } else {
	            if (h.pcdata) { h.pcdata("&amp;", param, continuationMarker,
	                continuationMaker(h, parts, pos, state, param));
	            }
	          }
	          break;
	        case '<\/':
	          if (m = /^([-\w:]+)[^\'\"]*/.exec(next)) {
	            if (m[0].length === next.length && parts[pos + 1] === '>') {
	              // fast case, no attribute parsing needed
	              pos += 2;
	              tagName = m[1].toLowerCase();
	              if (h.endTag) {
	                h.endTag(tagName, param, continuationMarker,
	                  continuationMaker(h, parts, pos, state, param));
	              }
	            } else {
	              // slow case, need to parse attributes
	              // TODO(felix8a): do we really care about misparsing this?
	              pos = parseEndTag(
	                parts, pos, h, param, continuationMarker, state);
	            }
	          } else {
	            if (h.pcdata) {
	              h.pcdata('&lt;/', param, continuationMarker,
	                continuationMaker(h, parts, pos, state, param));
	            }
	          }
	          break;
	        case '<':
	          if (m = /^([-\w:]+)\s*\/?/.exec(next)) {
	            if (m[0].length === next.length && parts[pos + 1] === '>') {
	              // fast case, no attribute parsing needed
	              pos += 2;
	              tagName = m[1].toLowerCase();
	              if (h.startTag) {
	                h.startTag(tagName, [], param, continuationMarker,
	                  continuationMaker(h, parts, pos, state, param));
	              }
	              // tags like <script> and <textarea> have special parsing
	              var eflags = html4.ELEMENTS[tagName];
	              if (eflags & EFLAGS_TEXT) {
	                var tag = { name: tagName, next: pos, eflags: eflags };
	                pos = parseText(
	                  parts, tag, h, param, continuationMarker, state);
	              }
	            } else {
	              // slow case, need to parse attributes
	              pos = parseStartTag(
	                parts, pos, h, param, continuationMarker, state);
	            }
	          } else {
	            if (h.pcdata) {
	              h.pcdata('&lt;', param, continuationMarker,
	                continuationMaker(h, parts, pos, state, param));
	            }
	          }
	          break;
	        case '<\!--':
	          // The pathological case is n copies of '<\!--' without '-->', and
	          // repeated failure to find '-->' is quadratic.  We avoid that by
	          // remembering when search for '-->' fails.
	          if (!state.noMoreEndComments) {
	            // A comment <\!--x--> is split into three tokens:
	            //   '<\!--', 'x--', '>'
	            // We want to find the next '>' token that has a preceding '--'.
	            // pos is at the 'x--'.
	            for (p = pos + 1; p < end; p++) {
	              if (parts[p] === '>' && /--$/.test(parts[p - 1])) { break; }
	            }
	            if (p < end) {
	              if (h.comment) {
	                var comment = parts.slice(pos, p).join('');
	                h.comment(
	                  comment.substr(0, comment.length - 2), param,
	                  continuationMarker,
	                  continuationMaker(h, parts, p + 1, state, param));
	              }
	              pos = p + 1;
	            } else {
	              state.noMoreEndComments = true;
	            }
	          }
	          if (state.noMoreEndComments) {
	            if (h.pcdata) {
	              h.pcdata('&lt;!--', param, continuationMarker,
	                continuationMaker(h, parts, pos, state, param));
	            }
	          }
	          break;
	        case '<\!':
	          if (!/^\w/.test(next)) {
	            if (h.pcdata) {
	              h.pcdata('&lt;!', param, continuationMarker,
	                continuationMaker(h, parts, pos, state, param));
	            }
	          } else {
	            // similar to noMoreEndComment logic
	            if (!state.noMoreGT) {
	              for (p = pos + 1; p < end; p++) {
	                if (parts[p] === '>') { break; }
	              }
	              if (p < end) {
	                pos = p + 1;
	              } else {
	                state.noMoreGT = true;
	              }
	            }
	            if (state.noMoreGT) {
	              if (h.pcdata) {
	                h.pcdata('&lt;!', param, continuationMarker,
	                  continuationMaker(h, parts, pos, state, param));
	              }
	            }
	          }
	          break;
	        case '<?':
	          // similar to noMoreEndComment logic
	          if (!state.noMoreGT) {
	            for (p = pos + 1; p < end; p++) {
	              if (parts[p] === '>') { break; }
	            }
	            if (p < end) {
	              pos = p + 1;
	            } else {
	              state.noMoreGT = true;
	            }
	          }
	          if (state.noMoreGT) {
	            if (h.pcdata) {
	              h.pcdata('&lt;?', param, continuationMarker,
	                continuationMaker(h, parts, pos, state, param));
	            }
	          }
	          break;
	        case '>':
	          if (h.pcdata) {
	            h.pcdata("&gt;", param, continuationMarker,
	              continuationMaker(h, parts, pos, state, param));
	          }
	          break;
	        case '':
	          break;
	        default:
	          if (h.pcdata) {
	            h.pcdata(current, param, continuationMarker,
	              continuationMaker(h, parts, pos, state, param));
	          }
	          break;
	        }
	      }
	      if (h.endDoc) { h.endDoc(param); }
	    } catch (e) {
	      if (e !== continuationMarker) { throw e; }
	    }
	  }

	  // Split str into parts for the html parser.
	  function htmlSplit(str) {
	    // can't hoist this out of the function because of the re.exec loop.
	    var re = /(<\/|<\!--|<[!?]|[&<>])/g;
	    str += '';
	    if (splitWillCapture) {
	      return str.split(re);
	    } else {
	      var parts = [];
	      var lastPos = 0;
	      var m;
	      while ((m = re.exec(str)) !== null) {
	        parts.push(str.substring(lastPos, m.index));
	        parts.push(m[0]);
	        lastPos = m.index + m[0].length;
	      }
	      parts.push(str.substring(lastPos));
	      return parts;
	    }
	  }

	  function parseEndTag(parts, pos, h, param, continuationMarker, state) {
	    var tag = parseTagAndAttrs(parts, pos);
	    // drop unclosed tags
	    if (!tag) { return parts.length; }
	    if (h.endTag) {
	      h.endTag(tag.name, param, continuationMarker,
	        continuationMaker(h, parts, pos, state, param));
	    }
	    return tag.next;
	  }

	  function parseStartTag(parts, pos, h, param, continuationMarker, state) {
	    var tag = parseTagAndAttrs(parts, pos);
	    // drop unclosed tags
	    if (!tag) { return parts.length; }
	    if (h.startTag) {
	      h.startTag(tag.name, tag.attrs, param, continuationMarker,
	        continuationMaker(h, parts, tag.next, state, param));
	    }
	    // tags like <script> and <textarea> have special parsing
	    if (tag.eflags & EFLAGS_TEXT) {
	      return parseText(parts, tag, h, param, continuationMarker, state);
	    } else {
	      return tag.next;
	    }
	  }

	  var endTagRe = {};

	  // Tags like <script> and <textarea> are flagged as CDATA or RCDATA,
	  // which means everything is text until we see the correct closing tag.
	  function parseText(parts, tag, h, param, continuationMarker, state) {
	    var end = parts.length;
	    if (!endTagRe.hasOwnProperty(tag.name)) {
	      endTagRe[tag.name] = new RegExp('^' + tag.name + '(?:[\\s\\/]|$)', 'i');
	    }
	    var re = endTagRe[tag.name];
	    var first = tag.next;
	    var p = tag.next + 1;
	    for (; p < end; p++) {
	      if (parts[p - 1] === '<\/' && re.test(parts[p])) { break; }
	    }
	    if (p < end) { p -= 1; }
	    var buf = parts.slice(first, p).join('');
	    if (tag.eflags & html4.eflags['CDATA']) {
	      if (h.cdata) {
	        h.cdata(buf, param, continuationMarker,
	          continuationMaker(h, parts, p, state, param));
	      }
	    } else if (tag.eflags & html4.eflags['RCDATA']) {
	      if (h.rcdata) {
	        h.rcdata(normalizeRCData(buf), param, continuationMarker,
	          continuationMaker(h, parts, p, state, param));
	      }
	    } else {
	      throw new Error('bug');
	    }
	    return p;
	  }

	  // at this point, parts[pos-1] is either "<" or "<\/".
	  function parseTagAndAttrs(parts, pos) {
	    var m = /^([-\w:]+)/.exec(parts[pos]);
	    var tag = {};
	    tag.name = m[1].toLowerCase();
	    tag.eflags = html4.ELEMENTS[tag.name];
	    var buf = parts[pos].substr(m[0].length);
	    // Find the next '>'.  We optimistically assume this '>' is not in a
	    // quoted context, and further down we fix things up if it turns out to
	    // be quoted.
	    var p = pos + 1;
	    var end = parts.length;
	    for (; p < end; p++) {
	      if (parts[p] === '>') { break; }
	      buf += parts[p];
	    }
	    if (end <= p) { return void 0; }
	    var attrs = [];
	    while (buf !== '') {
	      m = ATTR_RE.exec(buf);
	      if (!m) {
	        // No attribute found: skip garbage
	        buf = buf.replace(/^[\s\S][^a-z\s]*/, '');

	      } else if ((m[4] && !m[5]) || (m[6] && !m[7])) {
	        // Unterminated quote: slurp to the next unquoted '>'
	        var quote = m[4] || m[6];
	        var sawQuote = false;
	        var abuf = [buf, parts[p++]];
	        for (; p < end; p++) {
	          if (sawQuote) {
	            if (parts[p] === '>') { break; }
	          } else if (0 <= parts[p].indexOf(quote)) {
	            sawQuote = true;
	          }
	          abuf.push(parts[p]);
	        }
	        // Slurp failed: lose the garbage
	        if (end <= p) { break; }
	        // Otherwise retry attribute parsing
	        buf = abuf.join('');
	        continue;

	      } else {
	        // We have an attribute
	        var aName = m[1].toLowerCase();
	        var aValue = m[2] ? decodeValue(m[3]) : '';
	        attrs.push(aName, aValue);
	        buf = buf.substr(m[0].length);
	      }
	    }
	    tag.attrs = attrs;
	    tag.next = p + 1;
	    return tag;
	  }

	  function decodeValue(v) {
	    var q = v.charCodeAt(0);
	    if (q === 0x22 || q === 0x27) { // " or '
	      v = v.substr(1, v.length - 2);
	    }
	    return unescapeEntities(stripNULs(v));
	  }

	  /**
	   * Returns a function that strips unsafe tags and attributes from html.
	   * @param {function(string, Array.<string>): ?Array.<string>} tagPolicy
	   *     A function that takes (tagName, attribs[]), where tagName is a key in
	   *     html4.ELEMENTS and attribs is an array of alternating attribute names
	   *     and values.  It should return a record (as follows), or null to delete
	   *     the element.  It's okay for tagPolicy to modify the attribs array,
	   *     but the same array is reused, so it should not be held between calls.
	   *     Record keys:
	   *        attribs: (required) Sanitized attributes array.
	   *        tagName: Replacement tag name.
	   * @return {function(string, Array)} A function that sanitizes a string of
	   *     HTML and appends result strings to the second argument, an array.
	   */
	  function makeHtmlSanitizer(tagPolicy) {
	    var stack;
	    var ignoring;
	    var emit = function (text, out) {
	      if (!ignoring) { out.push(text); }
	    };
	    return makeSaxParser({
	      'startDoc': function(_) {
	        stack = [];
	        ignoring = false;
	      },
	      'startTag': function(tagNameOrig, attribs, out) {
	        if (ignoring) { return; }
	        if (!html4.ELEMENTS.hasOwnProperty(tagNameOrig)) { return; }
	        var eflagsOrig = html4.ELEMENTS[tagNameOrig];
	        if (eflagsOrig & html4.eflags['FOLDABLE']) {
	          return;
	        }

	        var decision = tagPolicy(tagNameOrig, attribs);
	        if (!decision) {
	          ignoring = !(eflagsOrig & html4.eflags['EMPTY']);
	          return;
	        } else if (typeof decision !== 'object') {
	          throw new Error('tagPolicy did not return object (old API?)');
	        }
	        if ('attribs' in decision) {
	          attribs = decision['attribs'];
	        } else {
	          throw new Error('tagPolicy gave no attribs');
	        }
	        var eflagsRep;
	        var tagNameRep;
	        if ('tagName' in decision) {
	          tagNameRep = decision['tagName'];
	          eflagsRep = html4.ELEMENTS[tagNameRep];
	        } else {
	          tagNameRep = tagNameOrig;
	          eflagsRep = eflagsOrig;
	        }
	        // TODO(mikesamuel): relying on tagPolicy not to insert unsafe
	        // attribute names.

	        // If this is an optional-end-tag element and either this element or its
	        // previous like sibling was rewritten, then insert a close tag to
	        // preserve structure.
	        if (eflagsOrig & html4.eflags['OPTIONAL_ENDTAG']) {
	          var onStack = stack[stack.length - 1];
	          if (onStack && onStack.orig === tagNameOrig &&
	              (onStack.rep !== tagNameRep || tagNameOrig !== tagNameRep)) {
	                out.push('<\/', onStack.rep, '>');
	          }
	        }

	        if (!(eflagsOrig & html4.eflags['EMPTY'])) {
	          stack.push({orig: tagNameOrig, rep: tagNameRep});
	        }

	        out.push('<', tagNameRep);
	        for (var i = 0, n = attribs.length; i < n; i += 2) {
	          var attribName = attribs[i],
	              value = attribs[i + 1];
	          if (value !== null && value !== void 0) {
	            out.push(' ', attribName, '="', escapeAttrib(value), '"');
	          }
	        }
	        out.push('>');

	        if ((eflagsOrig & html4.eflags['EMPTY'])
	            && !(eflagsRep & html4.eflags['EMPTY'])) {
	          // replacement is non-empty, synthesize end tag
	          out.push('<\/', tagNameRep, '>');
	        }
	      },
	      'endTag': function(tagName, out) {
	        if (ignoring) {
	          ignoring = false;
	          return;
	        }
	        if (!html4.ELEMENTS.hasOwnProperty(tagName)) { return; }
	        var eflags = html4.ELEMENTS[tagName];
	        if (!(eflags & (html4.eflags['EMPTY'] | html4.eflags['FOLDABLE']))) {
	          var index;
	          if (eflags & html4.eflags['OPTIONAL_ENDTAG']) {
	            for (index = stack.length; --index >= 0;) {
	              var stackElOrigTag = stack[index].orig;
	              if (stackElOrigTag === tagName) { break; }
	              if (!(html4.ELEMENTS[stackElOrigTag] &
	                    html4.eflags['OPTIONAL_ENDTAG'])) {
	                // Don't pop non optional end tags looking for a match.
	                return;
	              }
	            }
	          } else {
	            for (index = stack.length; --index >= 0;) {
	              if (stack[index].orig === tagName) { break; }
	            }
	          }
	          if (index < 0) { return; }  // Not opened.
	          for (var i = stack.length; --i > index;) {
	            var stackElRepTag = stack[i].rep;
	            if (!(html4.ELEMENTS[stackElRepTag] &
	                  html4.eflags['OPTIONAL_ENDTAG'])) {
	              out.push('<\/', stackElRepTag, '>');
	            }
	          }
	          if (index < stack.length) {
	            tagName = stack[index].rep;
	          }
	          stack.length = index;
	          out.push('<\/', tagName, '>');
	        }
	      },
	      'pcdata': emit,
	      'rcdata': emit,
	      'cdata': emit,
	      'endDoc': function(out) {
	        for (; stack.length; stack.length--) {
	          out.push('<\/', stack[stack.length - 1].rep, '>');
	        }
	      }
	    });
	  }

	  var ALLOWED_URI_SCHEMES = /^(?:https?|mailto|data)$/i;

	  function safeUri(uri, effect, ltype, hints, naiveUriRewriter) {
	    if (!naiveUriRewriter) { return null; }
	    try {
	      var parsed = URI.parse('' + uri);
	      if (parsed) {
	        if (!parsed.hasScheme() ||
	            ALLOWED_URI_SCHEMES.test(parsed.getScheme())) {
	          var safe = naiveUriRewriter(parsed, effect, ltype, hints);
	          return safe ? safe.toString() : null;
	        }
	      }
	    } catch (e) {
	      return null;
	    }
	    return null;
	  }

	  function log(logger, tagName, attribName, oldValue, newValue) {
	    if (!attribName) {
	      logger(tagName + " removed", {
	        change: "removed",
	        tagName: tagName
	      });
	    }
	    if (oldValue !== newValue) {
	      var changed = "changed";
	      if (oldValue && !newValue) {
	        changed = "removed";
	      } else if (!oldValue && newValue)  {
	        changed = "added";
	      }
	      logger(tagName + "." + attribName + " " + changed, {
	        change: changed,
	        tagName: tagName,
	        attribName: attribName,
	        oldValue: oldValue,
	        newValue: newValue
	      });
	    }
	  }

	  function lookupAttribute(map, tagName, attribName) {
	    var attribKey;
	    attribKey = tagName + '::' + attribName;
	    if (map.hasOwnProperty(attribKey)) {
	      return map[attribKey];
	    }
	    attribKey = '*::' + attribName;
	    if (map.hasOwnProperty(attribKey)) {
	      return map[attribKey];
	    }
	    return void 0;
	  }
	  function getAttributeType(tagName, attribName) {
	    return lookupAttribute(html4.ATTRIBS, tagName, attribName);
	  }
	  function getLoaderType(tagName, attribName) {
	    return lookupAttribute(html4.LOADERTYPES, tagName, attribName);
	  }
	  function getUriEffect(tagName, attribName) {
	    return lookupAttribute(html4.URIEFFECTS, tagName, attribName);
	  }

	  /**
	   * Sanitizes attributes on an HTML tag.
	   * @param {string} tagName An HTML tag name in lowercase.
	   * @param {Array.<?string>} attribs An array of alternating names and values.
	   * @param {?function(?string): ?string} opt_naiveUriRewriter A transform to
	   *     apply to URI attributes; it can return a new string value, or null to
	   *     delete the attribute.  If unspecified, URI attributes are deleted.
	   * @param {function(?string): ?string} opt_nmTokenPolicy A transform to apply
	   *     to attributes containing HTML names, element IDs, and space-separated
	   *     lists of classes; it can return a new string value, or null to delete
	   *     the attribute.  If unspecified, these attributes are kept unchanged.
	   * @return {Array.<?string>} The sanitized attributes as a list of alternating
	   *     names and values, where a null value means to omit the attribute.
	   */
	  function sanitizeAttribs(tagName, attribs,
	    opt_naiveUriRewriter, opt_nmTokenPolicy, opt_logger) {
	    // TODO(felix8a): it's obnoxious that domado duplicates much of this
	    // TODO(felix8a): maybe consistently enforce constraints like target=
	    for (var i = 0; i < attribs.length; i += 2) {
	      var attribName = attribs[i];
	      var value = attribs[i + 1];
	      var oldValue = value;
	      var atype = null, attribKey;
	      if ((attribKey = tagName + '::' + attribName,
	           html4.ATTRIBS.hasOwnProperty(attribKey)) ||
	          (attribKey = '*::' + attribName,
	           html4.ATTRIBS.hasOwnProperty(attribKey))) {
	        atype = html4.ATTRIBS[attribKey];
	      }
	      if (atype !== null) {
	        switch (atype) {
	          case html4.atype['NONE']: break;
	          case html4.atype['SCRIPT']:
	            value = null;
	            if (opt_logger) {
	              log(opt_logger, tagName, attribName, oldValue, value);
	            }
	            break;
	          case html4.atype['STYLE']:
	            if ('undefined' === typeof parseCssDeclarations) {
	              value = null;
	              if (opt_logger) {
	                log(opt_logger, tagName, attribName, oldValue, value);
		      }
	              break;
	            }
	            var sanitizedDeclarations = [];
	            parseCssDeclarations(
	                value,
	                {
	                  declaration: function (property, tokens) {
	                    var normProp = property.toLowerCase();
	                    var schema = cssSchema[normProp];
	                    if (!schema) {
	                      return;
	                    }
	                    sanitizeCssProperty(
	                        normProp, schema, tokens,
	                        opt_naiveUriRewriter
	                        ? function (url) {
	                            return safeUri(
	                                url, html4.ueffects.SAME_DOCUMENT,
	                                html4.ltypes.SANDBOXED,
	                                {
	                                  "TYPE": "CSS",
	                                  "CSS_PROP": normProp
	                                }, opt_naiveUriRewriter);
	                          }
	                        : null);
	                    sanitizedDeclarations.push(property + ': ' + tokens.join(' '));
	                  }
	                });
	            value = sanitizedDeclarations.length > 0 ?
	              sanitizedDeclarations.join(' ; ') : null;
	            if (opt_logger) {
	              log(opt_logger, tagName, attribName, oldValue, value);
	            }
	            break;
	          case html4.atype['ID']:
	          case html4.atype['IDREF']:
	          case html4.atype['IDREFS']:
	          case html4.atype['GLOBAL_NAME']:
	          case html4.atype['LOCAL_NAME']:
	          case html4.atype['CLASSES']:
	            value = opt_nmTokenPolicy ? opt_nmTokenPolicy(value) : value;
	            if (opt_logger) {
	              log(opt_logger, tagName, attribName, oldValue, value);
	            }
	            break;
	          case html4.atype['URI']:
	            value = safeUri(value,
	              getUriEffect(tagName, attribName),
	              getLoaderType(tagName, attribName),
	              {
	                "TYPE": "MARKUP",
	                "XML_ATTR": attribName,
	                "XML_TAG": tagName
	              }, opt_naiveUriRewriter);
	              if (opt_logger) {
	              log(opt_logger, tagName, attribName, oldValue, value);
	            }
	            break;
	          case html4.atype['URI_FRAGMENT']:
	            if (value && '#' === value.charAt(0)) {
	              value = value.substring(1);  // remove the leading '#'
	              value = opt_nmTokenPolicy ? opt_nmTokenPolicy(value) : value;
	              if (value !== null && value !== void 0) {
	                value = '#' + value;  // restore the leading '#'
	              }
	            } else {
	              value = null;
	            }
	            if (opt_logger) {
	              log(opt_logger, tagName, attribName, oldValue, value);
	            }
	            break;
	          default:
	            value = null;
	            if (opt_logger) {
	              log(opt_logger, tagName, attribName, oldValue, value);
	            }
	            break;
	        }
	      } else {
	        value = null;
	        if (opt_logger) {
	          log(opt_logger, tagName, attribName, oldValue, value);
	        }
	      }
	      attribs[i + 1] = value;
	    }
	    return attribs;
	  }

	  /**
	   * Creates a tag policy that omits all tags marked UNSAFE in html4-defs.js
	   * and applies the default attribute sanitizer with the supplied policy for
	   * URI attributes and NMTOKEN attributes.
	   * @param {?function(?string): ?string} opt_naiveUriRewriter A transform to
	   *     apply to URI attributes.  If not given, URI attributes are deleted.
	   * @param {function(?string): ?string} opt_nmTokenPolicy A transform to apply
	   *     to attributes containing HTML names, element IDs, and space-separated
	   *     lists of classes.  If not given, such attributes are left unchanged.
	   * @return {function(string, Array.<?string>)} A tagPolicy suitable for
	   *     passing to html.sanitize.
	   */
	  function makeTagPolicy(
	    opt_naiveUriRewriter, opt_nmTokenPolicy, opt_logger) {
	    return function(tagName, attribs) {
	      if (!(html4.ELEMENTS[tagName] & html4.eflags['UNSAFE'])) {
	        return {
	          'attribs': sanitizeAttribs(tagName, attribs,
	            opt_naiveUriRewriter, opt_nmTokenPolicy, opt_logger)
	        };
	      } else {
	        if (opt_logger) {
	          log(opt_logger, tagName, undefined, undefined, undefined);
	        }
	      }
	    };
	  }

	  /**
	   * Sanitizes HTML tags and attributes according to a given policy.
	   * @param {string} inputHtml The HTML to sanitize.
	   * @param {function(string, Array.<?string>)} tagPolicy A function that
	   *     decides which tags to accept and sanitizes their attributes (see
	   *     makeHtmlSanitizer above for details).
	   * @return {string} The sanitized HTML.
	   */
	  function sanitizeWithPolicy(inputHtml, tagPolicy) {
	    var outputArray = [];
	    makeHtmlSanitizer(tagPolicy)(inputHtml, outputArray);
	    return outputArray.join('');
	  }

	  /**
	   * Strips unsafe tags and attributes from HTML.
	   * @param {string} inputHtml The HTML to sanitize.
	   * @param {?function(?string): ?string} opt_naiveUriRewriter A transform to
	   *     apply to URI attributes.  If not given, URI attributes are deleted.
	   * @param {function(?string): ?string} opt_nmTokenPolicy A transform to apply
	   *     to attributes containing HTML names, element IDs, and space-separated
	   *     lists of classes.  If not given, such attributes are left unchanged.
	   */
	  function sanitize(inputHtml,
	    opt_naiveUriRewriter, opt_nmTokenPolicy, opt_logger) {
	    var tagPolicy = makeTagPolicy(
	      opt_naiveUriRewriter, opt_nmTokenPolicy, opt_logger);
	    return sanitizeWithPolicy(inputHtml, tagPolicy);
	  }

	  // Export both quoted and unquoted names for Closure linkage.
	  var html = {};
	  html.escapeAttrib = html['escapeAttrib'] = escapeAttrib;
	  html.makeHtmlSanitizer = html['makeHtmlSanitizer'] = makeHtmlSanitizer;
	  html.makeSaxParser = html['makeSaxParser'] = makeSaxParser;
	  html.makeTagPolicy = html['makeTagPolicy'] = makeTagPolicy;
	  html.normalizeRCData = html['normalizeRCData'] = normalizeRCData;
	  html.sanitize = html['sanitize'] = sanitize;
	  html.sanitizeAttribs = html['sanitizeAttribs'] = sanitizeAttribs;
	  html.sanitizeWithPolicy = html['sanitizeWithPolicy'] = sanitizeWithPolicy;
	  html.unescapeEntities = html['unescapeEntities'] = unescapeEntities;
	  return html;
	})(html4);

	var html_sanitize = html['sanitize'];

	// Loosen restrictions of Caja's
	// html-sanitizer to allow for styling
	html4.ATTRIBS['*::style'] = 0;
	html4.ELEMENTS['style'] = 0;
	html4.ATTRIBS['a::target'] = 0;
	html4.ELEMENTS['video'] = 0;
	html4.ATTRIBS['video::src'] = 0;
	html4.ATTRIBS['video::poster'] = 0;
	html4.ATTRIBS['video::controls'] = 0;
	html4.ELEMENTS['audio'] = 0;
	html4.ATTRIBS['audio::src'] = 0;
	html4.ATTRIBS['video::autoplay'] = 0;
	html4.ATTRIBS['video::controls'] = 0;

	if (true) {
	    module.exports = html_sanitize;
	}


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(14),
	    format_url = __webpack_require__(15),
	    request = __webpack_require__(19),
	    marker = __webpack_require__(26),
	    simplestyle = __webpack_require__(27);

	// # featureLayer
	//
	// A layer of features, loaded from Mapbox or else. Adds the ability
	// to reset features, filter them, and load them from a GeoJSON URL.
	var FeatureLayer = L.FeatureGroup.extend({
	    options: {
	        filter: function() { return true; },
	        sanitizer: __webpack_require__(23),
	        style: simplestyle.style,
	        popupOptions: { closeButton: false }
	    },

	    initialize: function(_, options) {
	        L.setOptions(this, options);

	        this._layers = {};

	        if (typeof _ === 'string') {
	            util.idUrl(_, this);
	        // javascript object of TileJSON data
	        } else if (_ && typeof _ === 'object') {
	            this.setGeoJSON(_);
	        }
	    },

	    setGeoJSON: function(_) {
	        this._geojson = _;
	        this.clearLayers();
	        this._initialize(_);
	        return this;
	    },

	    getGeoJSON: function() {
	        return this._geojson;
	    },

	    loadURL: function(url) {
	        if (this._request && 'abort' in this._request) this._request.abort();
	        this._request = request(url, L.bind(function(err, json) {
	            this._request = null;
	            if (err && err.type !== 'abort') {
	                util.log('could not load features at ' + url);
	                this.fire('error', {error: err});
	            } else if (json) {
	                this.setGeoJSON(json);
	                this.fire('ready');
	            }
	        }, this));
	        return this;
	    },

	    loadID: function(id) {
	        return this.loadURL(format_url('/v4/' + id + '/features.json', this.options.accessToken));
	    },

	    setFilter: function(_) {
	        this.options.filter = _;
	        if (this._geojson) {
	            this.clearLayers();
	            this._initialize(this._geojson);
	        }
	        return this;
	    },

	    getFilter: function() {
	        return this.options.filter;
	    },

	    _initialize: function(json) {
	        var features = L.Util.isArray(json) ? json : json.features,
	            i, len;

	        if (features) {
	            for (i = 0, len = features.length; i < len; i++) {
	                // Only add this if geometry or geometries are set and not null
	                if (features[i].geometries || features[i].geometry || features[i].features) {
	                    this._initialize(features[i]);
	                }
	            }
	        } else if (this.options.filter(json)) {

	            var opts = {accessToken: this.options.accessToken},
	                pointToLayer = this.options.pointToLayer || function(feature, latlon) {
	                  return marker.style(feature, latlon, opts);
	                },
	                layer = L.GeoJSON.geometryToLayer(json, pointToLayer),
	                popupHtml = marker.createPopup(json, this.options.sanitizer),
	                style = this.options.style,
	                defaultStyle = style === simplestyle.style;

	            if (style && 'setStyle' in layer &&
	                // if the style method is the simplestyle default, then
	                // never style L.Circle or L.CircleMarker because
	                // simplestyle has no rules over them, only over geometry
	                // primitives directly from GeoJSON
	                (!(defaultStyle && (layer instanceof L.Circle ||
	                  layer instanceof L.CircleMarker)))) {
	                if (typeof style === 'function') {
	                    style = style(json);
	                }
	                layer.setStyle(style);
	            }

	            layer.feature = json;

	            if (popupHtml) {
	                layer.bindPopup(popupHtml, this.options.popupOptions);
	            }

	            this.addLayer(layer);
	        }
	    }
	});

	module.exports.FeatureLayer = FeatureLayer;

	module.exports.featureLayer = function(_, options) {
	    return new FeatureLayer(_, options);
	};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var format_url = __webpack_require__(15),
	    util = __webpack_require__(14),
	    sanitize = __webpack_require__(23);

	// mapbox-related markers functionality
	// provide an icon from mapbox's simple-style spec and hosted markers
	// service
	function icon(fp, options) {
	    fp = fp || {};

	    var sizes = {
	            small: [20, 50],
	            medium: [30, 70],
	            large: [35, 90]
	        },
	        size = fp['marker-size'] || 'medium',
	        symbol = ('marker-symbol' in fp && fp['marker-symbol'] !== '') ? '-' + fp['marker-symbol'] : '',
	        color = (fp['marker-color'] || '7e7e7e').replace('#', '');

	    return L.icon({
	        iconUrl: format_url('/v4/marker/' +
	            'pin-' + size.charAt(0) + symbol + '+' + color +
	            // detect and use retina markers, which are x2 resolution
	            (L.Browser.retina ? '@2x' : '') + '.png', options && options.accessToken),
	        iconSize: sizes[size],
	        iconAnchor: [sizes[size][0] / 2, sizes[size][1] / 2],
	        popupAnchor: [0, -sizes[size][1] / 2]
	    });
	}

	// a factory that provides markers for Leaflet from Mapbox's
	// [simple-style specification](https://github.com/mapbox/simplestyle-spec)
	// and [Markers API](http://mapbox.com/developers/api/#markers).
	function style(f, latlon, options) {
	    return L.marker(latlon, {
	        icon: icon(f.properties, options),
	        title: util.strip_tags(
	            sanitize((f.properties && f.properties.title) || ''))
	    });
	}

	// Sanitize and format properties of a GeoJSON Feature object in order
	// to form the HTML string used as the argument for `L.createPopup`
	function createPopup(f, sanitizer) {
	    if (!f || !f.properties) return '';
	    var popup = '';

	    if (f.properties.title) {
	        popup += '<div class="marker-title">' + f.properties.title + '</div>';
	    }

	    if (f.properties.description) {
	        popup += '<div class="marker-description">' + f.properties.description + '</div>';
	    }

	    return (sanitizer || sanitize)(popup);
	}

	module.exports = {
	    icon: icon,
	    style: style,
	    createPopup: createPopup
	};


/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';

	// an implementation of the simplestyle spec for polygon and linestring features
	// https://github.com/mapbox/simplestyle-spec
	var defaults = {
	    stroke: '#555555',
	    'stroke-width': 2,
	    'stroke-opacity': 1,
	    fill: '#555555',
	    'fill-opacity': 0.5
	};

	var mapping = [
	    ['stroke', 'color'],
	    ['stroke-width', 'weight'],
	    ['stroke-opacity', 'opacity'],
	    ['fill', 'fillColor'],
	    ['fill-opacity', 'fillOpacity']
	];

	function fallback(a, b) {
	    var c = {};
	    for (var k in b) {
	        if (a[k] === undefined) c[k] = b[k];
	        else c[k] = a[k];
	    }
	    return c;
	}

	function remap(a) {
	    var d = {};
	    for (var i = 0; i < mapping.length; i++) {
	        d[mapping[i][1]] = a[mapping[i][0]];
	    }
	    return d;
	}

	function style(feature) {
	    return remap(fallback(feature.properties || {}, defaults));
	}

	module.exports = {
	    style: style,
	    defaults: defaults
	};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var LegendControl = L.Control.extend({

	    options: {
	        position: 'bottomright',
	        sanitizer: __webpack_require__(23)
	    },

	    initialize: function(options) {
	        L.setOptions(this, options);
	        this._legends = {};
	    },

	    onAdd: function() {
	        this._container = L.DomUtil.create('div', 'map-legends wax-legends');
	        L.DomEvent.disableClickPropagation(this._container);

	        this._update();

	        return this._container;
	    },

	    addLegend: function(text) {
	        if (!text) { return this; }

	        if (!this._legends[text]) {
	            this._legends[text] = 0;
	        }

	        this._legends[text]++;
	        return this._update();
	    },

	    removeLegend: function(text) {
	        if (!text) { return this; }
	        if (this._legends[text]) this._legends[text]--;
	        return this._update();
	    },

	    _update: function() {
	        if (!this._map) { return this; }

	        this._container.innerHTML = '';
	        var hide = 'none';

	        for (var i in this._legends) {
	            if (this._legends.hasOwnProperty(i) && this._legends[i]) {
	                var div = L.DomUtil.create('div', 'map-legend wax-legend', this._container);
	                div.innerHTML = this.options.sanitizer(i);
	                hide = 'block';
	            }
	        }

	        // hide the control entirely unless there is at least one legend;
	        // otherwise there will be a small grey blemish on the map.
	        this._container.style.display = hide;

	        return this;
	    }
	});

	module.exports.LegendControl = LegendControl;

	module.exports.legendControl = function(options) {
	    return new LegendControl(options);
	};


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var format_url = __webpack_require__(15);

	var ShareControl = L.Control.extend({
	    includes: [__webpack_require__(30)],

	    options: {
	        position: 'topleft',
	        url: ''
	    },

	    initialize: function(_, options) {
	        L.setOptions(this, options);
	        this._loadTileJSON(_);
	    },

	    _setTileJSON: function(json) {
	        this._tilejson = json;
	    },

	    onAdd: function(map) {
	        this._map = map;

	        var container = L.DomUtil.create('div', 'leaflet-control-mapbox-share leaflet-bar');
	        var link = L.DomUtil.create('a', 'mapbox-share mapbox-icon mapbox-icon-share', container);
	        link.href = '#';

	        this._modal = L.DomUtil.create('div', 'mapbox-modal', this._map._container);
	        this._mask = L.DomUtil.create('div', 'mapbox-modal-mask', this._modal);
	        this._content = L.DomUtil.create('div', 'mapbox-modal-content', this._modal);

	        L.DomEvent.addListener(link, 'click', this._shareClick, this);
	        L.DomEvent.disableClickPropagation(container);

	        this._map.on('mousedown', this._clickOut, this);

	        return container;
	    },

	    _clickOut: function(e) {
	        if (this._sharing) {
	            L.DomEvent.preventDefault(e);
	            L.DomUtil.removeClass(this._modal, 'active');
	            this._content.innerHTML = '';
	            this._sharing = null;
	            return;
	        }
	    },

	    _shareClick: function(e) {
	        L.DomEvent.stop(e);
	        if (this._sharing) return this._clickOut(e);

	        var tilejson = this._tilejson || this._map._tilejson || {},
	            url = encodeURIComponent(this.options.url || tilejson.webpage || window.location),
	            name = encodeURIComponent(tilejson.name),
	            image = format_url('/v4/' + tilejson.id + '/' + this._map.getCenter().lng + ',' + this._map.getCenter().lat + ',' + this._map.getZoom() + '/600x600.png', this.options.accessToken),
	            embed = format_url('/v4/' + tilejson.id + '.html', this.options.accessToken),
	            twitterURL = '//twitter.com/intent/tweet?status=' + name + ' ' + url,
	            facebookURL = '//www.facebook.com/sharer.php?u=' + url + '&t=' + name,
	            pinterestURL = '//www.pinterest.com/pin/create/button/?url=' + url + '&media=' + image + '&description=' + name,
	            embedValue = '<iframe width="100%" height="500px" frameBorder="0" src="' + embed + '"></iframe>',
	            embedLabel = 'Copy and paste this <strong>HTML code</strong> into documents to embed this map on web pages.';

	        function createShareButton(buttonClass, href, socialMediaName) {
	            var elem = document.createElement('a');
	            elem.setAttribute('class', buttonClass);
	            elem.setAttribute('href', href);
	            elem.setAttribute('target', '_blank');
	            socialMediaName = document.createTextNode(socialMediaName);
	            elem.appendChild(socialMediaName);

	            return elem;
	        }

	        L.DomUtil.addClass(this._modal, 'active');

	        this._sharing = L.DomUtil.create('div', 'mapbox-modal-body', this._content);

	        var twitterButton = createShareButton('mapbox-button mapbox-button-icon mapbox-icon-twitter', twitterURL, 'Twitter');
	        var facebookButton = createShareButton('mapbox-button mapbox-button-icon mapbox-icon-facebook', facebookURL, 'Facebook');
	        var pinterestButton = createShareButton('mapbox-button mapbox-button-icon mapbox-icon-pinterest', pinterestURL, 'Pinterest');

	        var shareHeader = document.createElement('h3');
	        var shareText = document.createTextNode('Share this map');
	        shareHeader.appendChild(shareText);

	        var shareButtons = document.createElement('div');
	        shareButtons.setAttribute('class', 'mapbox-share-buttons');
	        shareButtons.appendChild(facebookButton);
	        shareButtons.appendChild(twitterButton);
	        shareButtons.appendChild(pinterestButton);

	        this._sharing.appendChild(shareHeader);
	        this._sharing.appendChild(shareButtons);

	        var input = L.DomUtil.create('input', 'mapbox-embed', this._sharing);
	        input.type = 'text';
	        input.value = embedValue;

	        var label = L.DomUtil.create('label', 'mapbox-embed-description', this._sharing);
	        label.innerHTML = embedLabel;

	        var close = L.DomUtil.create('a', 'leaflet-popup-close-button', this._sharing);
	        close.href = '#';

	        L.DomEvent.disableClickPropagation(this._sharing);
	        L.DomEvent.addListener(close, 'click', this._clickOut, this);
	        L.DomEvent.addListener(input, 'click', function(e) {
	            e.target.focus();
	            e.target.select();
	        });
	    }
	});

	module.exports.ShareControl = ShareControl;

	module.exports.shareControl = function(_, options) {
	    return new ShareControl(_, options);
	};


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var request = __webpack_require__(19),
	    format_url = __webpack_require__(15),
	    util = __webpack_require__(14);

	module.exports = {
	    _loadTileJSON: function(_) {
	        if (typeof _ === 'string') {
	            _ = format_url.tileJSON(_, this.options && this.options.accessToken);
	            request(_, L.bind(function(err, json) {
	                if (err) {
	                    util.log('could not load TileJSON at ' + _);
	                    this.fire('error', {error: err});
	                } else if (json) {
	                    this._setTileJSON(json);
	                    this.fire('ready');
	                }
	            }, this));
	        } else if (_ && typeof _ === 'object') {
	            this._setTileJSON(_);
	        }
	    }
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(14);
	var formatPattern = /\.((?:png|jpg)\d*)(?=$|\?)/;

	var TileLayer = L.TileLayer.extend({
	    includes: [__webpack_require__(30)],

	    options: {
	        sanitizer: __webpack_require__(23)
	    },

	    // http://mapbox.com/developers/api/#image_quality
	    formats: [
	        'png', 'jpg',
	        // PNG
	        'png32', 'png64', 'png128', 'png256',
	        // JPG
	        'jpg70', 'jpg80', 'jpg90'],

	    scalePrefix: '@2x.',

	    initialize: function(_, options) {
	        L.TileLayer.prototype.initialize.call(this, undefined, options);

	        this._tilejson = {};

	        if (options && options.format) {
	            util.strict_oneof(options.format, this.formats);
	        }

	        this._loadTileJSON(_);
	    },

	    setFormat: function(_) {
	        util.strict(_, 'string');
	        this.options.format = _;
	        this.redraw();
	        return this;
	    },

	    // disable the setUrl function, which is not available on mapbox tilelayers
	    setUrl: null,

	    _setTileJSON: function(json) {
	        util.strict(json, 'object');

	        this.options.format = this.options.format ||
	            json.tiles[0].match(formatPattern)[1];

	        L.extend(this.options, {
	            tiles: json.tiles,
	            attribution: this.options.sanitizer(json.attribution),
	            minZoom: json.minzoom || 0,
	            maxZoom: json.maxzoom || 18,
	            tms: json.scheme === 'tms',
	            bounds: json.bounds && util.lbounds(json.bounds)
	        });

	        this._tilejson = json;
	        this.redraw();
	        return this;
	    },

	    getTileJSON: function() {
	        return this._tilejson;
	    },

	    // this is an exception to mapbox.js naming rules because it's called
	    // by `L.map`
	    getTileUrl: function(tilePoint) {
	        var tiles = this.options.tiles,
	            index = Math.floor(Math.abs(tilePoint.x + tilePoint.y) % tiles.length),
	            url = tiles[index];

	        var templated = L.Util.template(url, tilePoint);
	        if (!templated) {
	            return templated;
	        } else {
	            return templated.replace(formatPattern,
	                (L.Browser.retina ? this.scalePrefix : '.') + this.options.format);
	        }
	    },

	    // TileJSON.TileLayers are added to the map immediately, so that they get
	    // the desired z-index, but do not update until the TileJSON has been loaded.
	    _update: function() {
	        if (this.options.tiles) {
	            L.TileLayer.prototype._update.call(this);
	        }
	    }
	});

	module.exports.TileLayer = TileLayer;

	module.exports.tileLayer = function(_, options) {
	    return new TileLayer(_, options);
	};


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var InfoControl = L.Control.extend({
	    options: {
	        position: 'bottomright',
	        sanitizer: __webpack_require__(23)
	    },

	    initialize: function(options) {
	        L.setOptions(this, options);
	        this._info = {};
	        console.warn('infoControl has been deprecated and will be removed in mapbox.js v3.0.0. Use the default attribution control instead, which is now responsive.');
	    },

	    onAdd: function(map) {
	        this._container = L.DomUtil.create('div', 'mapbox-control-info mapbox-small');
	        this._content = L.DomUtil.create('div', 'map-info-container', this._container);

	        var link = L.DomUtil.create('a', 'mapbox-info-toggle mapbox-icon mapbox-icon-info', this._container);
	        link.href = '#';

	        L.DomEvent.addListener(link, 'click', this._showInfo, this);
	        L.DomEvent.disableClickPropagation(this._container);

	        for (var i in map._layers) {
	            if (map._layers[i].getAttribution) {
	                this.addInfo(map._layers[i].getAttribution());
	            }
	        }

	        map
	            .on('layeradd', this._onLayerAdd, this)
	            .on('layerremove', this._onLayerRemove, this);

	        this._update();
	        return this._container;
	    },

	    onRemove: function(map) {
	        map
	            .off('layeradd', this._onLayerAdd, this)
	            .off('layerremove', this._onLayerRemove, this);
	    },

	    addInfo: function(text) {
	        if (!text) return this;
	        if (!this._info[text]) this._info[text] = 0;
	        this._info[text] = true;
	        return this._update();
	    },

	    removeInfo: function (text) {
	        if (!text) return this;
	        if (this._info[text]) this._info[text] = false;
	        return this._update();
	    },

	    _showInfo: function(e) {
	        L.DomEvent.preventDefault(e);
	        if (this._active === true) return this._hidecontent();

	        L.DomUtil.addClass(this._container, 'active');
	        this._active = true;
	        this._update();
	    },

	    _hidecontent: function() {
	        this._content.innerHTML = '';
	        this._active = false;
	        L.DomUtil.removeClass(this._container, 'active');
	        return;
	    },

	    _update: function() {
	        if (!this._map) { return this; }
	        this._content.innerHTML = '';
	        var hide = 'none';
	        var info = [];

	        for (var i in this._info) {
	            if (this._info.hasOwnProperty(i) && this._info[i]) {
	                info.push(this.options.sanitizer(i));
	                hide = 'block';
	            }
	        }

	        this._content.innerHTML += info.join(' | ');

	        // If there are no results in _info then hide this.
	        this._container.style.display = hide;
	        return this;
	    },

	    _onLayerAdd: function(e) {
	        if (e.layer.getAttribution && e.layer.getAttribution()) {
	            this.addInfo(e.layer.getAttribution());
	        } else if ('on' in e.layer && e.layer.getAttribution) {
	            e.layer.on('ready', L.bind(function() {
	                this.addInfo(e.layer.getAttribution());
	            }, this));
	        }
	    },

	    _onLayerRemove: function (e) {
	        if (e.layer.getAttribution) {
	            this.removeInfo(e.layer.getAttribution());
	        }
	    }
	});

	module.exports.InfoControl = InfoControl;

	module.exports.infoControl = function(options) {
	    return new InfoControl(options);
	};


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var tileLayer = __webpack_require__(31).tileLayer,
	    featureLayer = __webpack_require__(25).featureLayer,
	    gridLayer = __webpack_require__(34).gridLayer,
	    gridControl = __webpack_require__(21).gridControl,
	    infoControl = __webpack_require__(32).infoControl,
	    shareControl = __webpack_require__(29).shareControl,
	    legendControl = __webpack_require__(28).legendControl,
	    mapboxLogoControl = __webpack_require__(36).mapboxLogoControl,
	    feedback = __webpack_require__(18);

	function withAccessToken(options, accessToken) {
	    if (!accessToken || options.accessToken)
	        return options;
	    return L.extend({accessToken: accessToken}, options);
	}

	var LMap = L.Map.extend({
	    includes: [__webpack_require__(30)],

	    options: {
	        tileLayer: {},
	        featureLayer: {},
	        gridLayer: {},
	        legendControl: {},
	        gridControl: {},
	        infoControl: false,
	        shareControl: false,
	        sanitizer: __webpack_require__(23)
	    },

	    _tilejson: {},

	    initialize: function(element, _, options) {

	        L.Map.prototype.initialize.call(this, element,
	            L.extend({}, L.Map.prototype.options, options));

	        // Disable the default 'Leaflet' text
	        if (this.attributionControl) {
	            this.attributionControl.setPrefix('');

	            var compact = this.options.attributionControl.compact;
	            // Set a compact display if map container width is < 640 or
	            // compact is set to `true` in attributionControl options.
	            if (compact || (compact !== false && this._container.offsetWidth <= 640)) {
	                L.DomUtil.addClass(this.attributionControl._container, 'leaflet-compact-attribution');
	            }

	            if (compact === undefined) {
	                this.on('resize', function() {
	                    if (this._container.offsetWidth > 640) {
	                        L.DomUtil.removeClass(this.attributionControl._container, 'leaflet-compact-attribution');
	                    } else {
	                        L.DomUtil.addClass(this.attributionControl._container, 'leaflet-compact-attribution');
	                    }
	                });
	            }
	        }

	        if (this.options.tileLayer) {
	            this.tileLayer = tileLayer(undefined,
	                withAccessToken(this.options.tileLayer, this.options.accessToken));
	            this.addLayer(this.tileLayer);
	        }

	        if (this.options.featureLayer) {
	            this.featureLayer = featureLayer(undefined,
	                withAccessToken(this.options.featureLayer, this.options.accessToken));
	            this.addLayer(this.featureLayer);
	        }

	        if (this.options.gridLayer) {
	            this.gridLayer = gridLayer(undefined,
	                withAccessToken(this.options.gridLayer, this.options.accessToken));
	            this.addLayer(this.gridLayer);
	        }

	        if (this.options.gridLayer && this.options.gridControl) {
	            this.gridControl = gridControl(this.gridLayer, this.options.gridControl);
	            this.addControl(this.gridControl);
	        }

	        if (this.options.infoControl) {
	            this.infoControl = infoControl(this.options.infoControl);
	            this.addControl(this.infoControl);
	        }

	        if (this.options.legendControl) {
	            this.legendControl = legendControl(this.options.legendControl);
	            this.addControl(this.legendControl);
	        }

	        if (this.options.shareControl) {
	            this.shareControl = shareControl(undefined,
	                withAccessToken(this.options.shareControl, this.options.accessToken));
	            this.addControl(this.shareControl);
	        }

	        this._mapboxLogoControl = mapboxLogoControl(this.options.mapboxLogoControl);
	        this.addControl(this._mapboxLogoControl);

	        this._loadTileJSON(_);

	        this.on('layeradd', this._onLayerAdd, this)
	            .on('layerremove', this._onLayerRemove, this)
	            .on('moveend', this._updateMapFeedbackLink, this);

	        this.whenReady(function () {
	            feedback.on('change', this._updateMapFeedbackLink, this);
	        });

	        this.on('unload', function () {
	            feedback.off('change', this._updateMapFeedbackLink, this);
	        });
	    },

	    // use a javascript object of tilejson data to configure this layer
	    _setTileJSON: function(_) {
	        this._tilejson = _;
	        this._initialize(_);
	        return this;
	    },

	    getTileJSON: function() {
	        return this._tilejson;
	    },

	    _initialize: function(json) {
	        if (this.tileLayer) {
	            this.tileLayer._setTileJSON(json);
	            this._updateLayer(this.tileLayer);
	        }

	        if (this.featureLayer && !this.featureLayer.getGeoJSON() && json.data && json.data[0]) {
	            this.featureLayer.loadURL(json.data[0]);
	        }

	        if (this.gridLayer) {
	            this.gridLayer._setTileJSON(json);
	            this._updateLayer(this.gridLayer);
	        }

	        if (this.infoControl && json.attribution) {
	            this.infoControl.addInfo(this.options.sanitizer(json.attribution));
	            this._updateMapFeedbackLink();
	        }

	        if (this.legendControl && json.legend) {
	            this.legendControl.addLegend(json.legend);
	        }

	        if (this.shareControl) {
	            this.shareControl._setTileJSON(json);
	        }

	        this._mapboxLogoControl._setTileJSON(json);

	        if (!this._loaded && json.center) {
	            var zoom = this.getZoom() !== undefined ? this.getZoom() : json.center[2],
	                center = L.latLng(json.center[1], json.center[0]);

	            this.setView(center, zoom);
	        }
	    },

	    _updateMapFeedbackLink: function() {
	        if (!this._controlContainer.getElementsByClassName) return;
	        var link = this._controlContainer.getElementsByClassName('mapbox-improve-map');
	        if (link.length && this._loaded) {
	            var center = this.getCenter().wrap();
	            var tilejson = this._tilejson || {};
	            var id = tilejson.id || '';

	            var hash = '#' + id + '/' +
	                center.lng.toFixed(3) + '/' +
	                center.lat.toFixed(3) + '/' +
	                this.getZoom();

	            for (var key in feedback.data) {
	                hash += '/' + key + '=' + feedback.data[key];
	            }

	            for (var i = 0; i < link.length; i++) {
	                link[i].hash = hash;
	            }
	        }
	    },

	    _onLayerAdd: function(e) {
	        if ('on' in e.layer) {
	            e.layer.on('ready', this._onLayerReady, this);
	        }
	        window.setTimeout(L.bind(this._updateMapFeedbackLink, this), 0); // Update after attribution control resets the HTML.
	    },

	    _onLayerRemove: function(e) {
	        if ('on' in e.layer) {
	            e.layer.off('ready', this._onLayerReady, this);
	        }
	        window.setTimeout(L.bind(this._updateMapFeedbackLink, this), 0); // Update after attribution control resets the HTML.
	    },

	    _onLayerReady: function(e) {
	        this._updateLayer(e.target);
	    },

	    _updateLayer: function(layer) {
	        if (!layer.options) return;

	        if (this.infoControl && this._loaded) {
	            this.infoControl.addInfo(layer.options.infoControl);
	        }

	        if (this.attributionControl && this._loaded && layer.getAttribution) {
	            this.attributionControl.addAttribution(layer.getAttribution());
	        }

	        if (!(L.stamp(layer) in this._zoomBoundLayers) &&
	                (layer.options.maxZoom || layer.options.minZoom)) {
	            this._zoomBoundLayers[L.stamp(layer)] = layer;
	        }

	        this._updateMapFeedbackLink();
	        this._updateZoomLevels();
	    }
	});

	module.exports.Map = LMap;

	module.exports.map = function(element, _, options) {
	    return new LMap(element, _, options);
	};


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(14),
	    request = __webpack_require__(19),
	    grid = __webpack_require__(35);

	// forked from danzel/L.UTFGrid
	var GridLayer = L.Class.extend({
	    includes: [L.Mixin.Events, __webpack_require__(30)],

	    options: {
	        template: function() { return ''; }
	    },

	    _mouseOn: null,
	    _tilejson: {},
	    _cache: {},

	    initialize: function(_, options) {
	        L.Util.setOptions(this, options);
	        this._loadTileJSON(_);
	    },

	    _setTileJSON: function(json) {
	        util.strict(json, 'object');

	        L.extend(this.options, {
	            grids: json.grids,
	            minZoom: json.minzoom,
	            maxZoom: json.maxzoom,
	            bounds: json.bounds && util.lbounds(json.bounds)
	        });

	        this._tilejson = json;
	        this._cache = {};
	        this._update();

	        return this;
	    },

	    getTileJSON: function() {
	        return this._tilejson;
	    },

	    active: function() {
	        return !!(this._map && this.options.grids && this.options.grids.length);
	    },

	    addTo: function (map) {
	        map.addLayer(this);
	        return this;
	    },

	    onAdd: function(map) {
	        this._map = map;
	        this._update();

	        this._map
	            .on('click', this._click, this)
	            .on('mousemove', this._move, this)
	            .on('moveend', this._update, this);
	    },

	    onRemove: function() {
	        this._map
	            .off('click', this._click, this)
	            .off('mousemove', this._move, this)
	            .off('moveend', this._update, this);
	    },

	    getData: function(latlng, callback) {
	        if (!this.active()) return;

	        var map = this._map,
	            point = map.project(latlng.wrap()),
	            tileSize = 256,
	            resolution = 4,
	            x = Math.floor(point.x / tileSize),
	            y = Math.floor(point.y / tileSize),
	            max = map.options.crs.scale(map.getZoom()) / tileSize;

	        x = (x + max) % max;
	        y = (y + max) % max;

	        this._getTile(map.getZoom(), x, y, function(grid) {
	            var gridX = Math.floor((point.x - (x * tileSize)) / resolution),
	                gridY = Math.floor((point.y - (y * tileSize)) / resolution);

	            callback(grid(gridX, gridY));
	        });

	        return this;
	    },

	    _click: function(e) {
	        this.getData(e.latlng, L.bind(function(data) {
	            this.fire('click', {
	                latLng: e.latlng,
	                data: data
	            });
	        }, this));
	    },

	    _move: function(e) {
	        this.getData(e.latlng, L.bind(function(data) {
	            if (data !== this._mouseOn) {
	                if (this._mouseOn) {
	                    this.fire('mouseout', {
	                        latLng: e.latlng,
	                        data: this._mouseOn
	                    });
	                }

	                this.fire('mouseover', {
	                    latLng: e.latlng,
	                    data: data
	                });

	                this._mouseOn = data;
	            } else {
	                this.fire('mousemove', {
	                    latLng: e.latlng,
	                    data: data
	                });
	            }
	        }, this));
	    },

	    _getTileURL: function(tilePoint) {
	        var urls = this.options.grids,
	            index = (tilePoint.x + tilePoint.y) % urls.length,
	            url = urls[index];

	        return L.Util.template(url, tilePoint);
	    },

	    // Load up all required json grid files
	    _update: function() {
	        if (!this.active()) return;

	        var bounds = this._map.getPixelBounds(),
	            z = this._map.getZoom(),
	            tileSize = 256;

	        if (z > this.options.maxZoom || z < this.options.minZoom) return;

	        var tileBounds = L.bounds(
	                bounds.min.divideBy(tileSize)._floor(),
	                bounds.max.divideBy(tileSize)._floor()),
	            max = this._map.options.crs.scale(z) / tileSize;

	        for (var x = tileBounds.min.x; x <= tileBounds.max.x; x++) {
	            for (var y = tileBounds.min.y; y <= tileBounds.max.y; y++) {
	                // x wrapped
	                this._getTile(z, ((x % max) + max) % max, ((y % max) + max) % max);
	            }
	        }
	    },

	    _getTile: function(z, x, y, callback) {
	        var key = z + '_' + x + '_' + y,
	            tilePoint = L.point(x, y);

	        tilePoint.z = z;

	        if (!this._tileShouldBeLoaded(tilePoint)) {
	            return;
	        }

	        if (key in this._cache) {
	            if (!callback) return;

	            if (typeof this._cache[key] === 'function') {
	                callback(this._cache[key]); // Already loaded
	            } else {
	                this._cache[key].push(callback); // Pending
	            }

	            return;
	        }

	        this._cache[key] = [];

	        if (callback) {
	            this._cache[key].push(callback);
	        }

	        request(this._getTileURL(tilePoint), L.bind(function(err, json) {
	            var callbacks = this._cache[key];
	            this._cache[key] = grid(json);
	            for (var i = 0; i < callbacks.length; ++i) {
	                callbacks[i](this._cache[key]);
	            }
	        }, this));
	    },

	    _tileShouldBeLoaded: function(tilePoint) {
	        if (tilePoint.z > this.options.maxZoom || tilePoint.z < this.options.minZoom) {
	            return false;
	        }

	        if (this.options.bounds) {
	            var tileSize = 256,
	                nwPoint = tilePoint.multiplyBy(tileSize),
	                sePoint = nwPoint.add(new L.Point(tileSize, tileSize)),
	                nw = this._map.unproject(nwPoint),
	                se = this._map.unproject(sePoint),
	                bounds = new L.LatLngBounds([nw, se]);

	            if (!this.options.bounds.intersects(bounds)) {
	                return false;
	            }
	        }

	        return true;
	    }
	});

	module.exports.GridLayer = GridLayer;

	module.exports.gridLayer = function(_, options) {
	    return new GridLayer(_, options);
	};


/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict';

	function utfDecode(c) {
	    if (c >= 93) c--;
	    if (c >= 35) c--;
	    return c - 32;
	}

	module.exports = function(data) {
	    return function(x, y) {
	        if (!data) return;
	        var idx = utfDecode(data.grid[y].charCodeAt(x)),
	            key = data.keys[idx];
	        return data.data[key];
	    };
	};


/***/ },
/* 36 */
/***/ function(module, exports) {

	'use strict';

	var MapboxLogoControl = L.Control.extend({

	    options: {
	        position: 'bottomleft'
	    },

	    initialize: function(options) {
	        L.setOptions(this, options);
	    },

	    onAdd: function() {
	        this._container = L.DomUtil.create('div', 'mapbox-logo');
	        return this._container;
	    },

	    _setTileJSON: function(json) {
	        // Check if account referenced by the accessToken
	        // is asscociated with the Mapbox Logo
	        // as determined by mapbox-maps.
	        if (json.mapbox_logo) {
	            L.DomUtil.addClass(this._container, 'mapbox-logo-true');
	        }
	    }
	});

	module.exports.MapboxLogoControl = MapboxLogoControl;

	module.exports.mapboxLogoControl = function(options) {
	    return new MapboxLogoControl(options);
	};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(14);
	var format_url = __webpack_require__(15);
	var request = __webpack_require__(19);

	var StyleLayer = L.TileLayer.extend({

	    options: {
	        sanitizer: __webpack_require__(23)
	    },

	    initialize: function(_, options) {
	        L.TileLayer.prototype.initialize.call(this, undefined, options);

	        this.options.tiles = this._formatTileURL(_);
	        this.options.tileSize = 512;
	        this.options.zoomOffset = -1;
	        this.options.tms = false;

	        this._getAttribution(_);
	    },

	    _getAttribution: function(_) {
	        var styleURL = format_url.style(_, this.options && this.options.accessToken);
	        request(styleURL, L.bind(function(err, style) {
	            if (err) {
	                util.log('could not load Mapbox style at ' + styleURL);
	                this.fire('error', {error: err});
	            }
	            var sources = [];
	            for (var id in style.sources) {
	                var source = style.sources[id].url.split('mapbox://')[1];
	                sources.push(source);
	            }
	            request(format_url.tileJSON(sources.join(), this.options.accessToken), L.bind(function(err, json) {
	                if (err) {
	                    util.log('could not load TileJSON at ' + _);
	                    this.fire('error', {error: err});
	                } else if (json) {
	                    util.strict(json, 'object');

	                    this.options.attribution = this.options.sanitizer(json.attribution);

	                    this._tilejson = json;
	                    this.fire('ready');
	                }
	            }, this));
	        }, this));
	    },

	    // disable the setUrl function, which is not available on mapbox tilelayers
	    setUrl: null,

	    _formatTileURL: function(style) {
	        var retina = L.Browser.retina ? '@2x' : '';
	        if (typeof style === 'string') {
	            if (style.indexOf('mapbox://styles/') === -1) {
	                util.log('Incorrectly formatted Mapbox style at ' + style);
	                this.fire('error');
	            }
	            var ownerIDStyle = style.split('mapbox://styles/')[1];
	            return format_url('/styles/v1/' + ownerIDStyle + '/tiles/{z}/{x}/{y}' + retina, this.options.accessToken);
	        } else if (typeof style === 'object') {
	            return format_url('/styles/v1/' + style.owner + '/' + style.id + '/tiles/{z}/{x}/{y}' + retina, this.options.accessToken);
	        }
	    },

	    // this is an exception to mapbox.js naming rules because it's called
	    // by `L.map`
	    getTileUrl: function(tilePoint) {
	        var templated = L.Util.template(this.options.tiles, tilePoint);
	        return templated;
	    }
	});

	module.exports.StyleLayer = StyleLayer;

	module.exports.styleLayer = function(_, options) {
	    return new StyleLayer(_, options);
	};


/***/ },
/* 38 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAIICAMAAAAWgT0mAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABgUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3wlHLoAAAAfdFJOUwDYoAgNNvSA4/u3mcTrUb5VQCByjBcoRwJMrs9nfF29SYbmAAAFH0lEQVR42u2c55qrIBCGY8HeYkliC/d/l0cRlRjFgbO7z5b5fiV5fAUGhHEYcrmgUKhfpIDSQBmig/44FNAXBeAyRH0epFU97Nz/fzRQKBQKhUKhvrnv/0t9WBQKhUKhUKhvLdfd/yxlKHX3Pp9B85XCRzClwCwXKzH8ckVmolQZTrmXz4d0qqdjCB2T63Su1jDSGrBajwYKhUKhUEoibmo4jpG6BIwkxhqfMhIQkkevYa0oP2eu8TaAFl9PGZ++yT+h8pjuKJbXcG3P/XK5r+2S2u01FLh+k9nQOIIMSZ8K7XipHqXkzGHb07EPkh5DKaRJ2+odN8qhR4agzsdCxjFkgAyxgVKQyTeQC+rcDUQ+dhjpDVitR0PvIdR63PUmFr0pTG+y1JyWUSgUCgXW46FKVM8mjptnpeBg9xFfpfyoh8zmdhJ6r0uNFya2jLgVqb+3fPppcTuEqEQfC+VF4OwBTlBI11CrfjdEbQEsuNpDaoFdy5/ZevanyvtuTax7acis5wTdps15x6xzZnKjvPICrWtpwPvJabo87xoH+wn76Rv3EwqFQqG+SnakmJm4pWSXua+RrJWCMRtKAr3HKZ9qEGMyHwaJ3xdGAWKM/4xUoInJmDWg0MwwGwKhlRkpGCQyAwWC7itztrm9QmPjOXO2jS5Uz4543U7HuHiBfb+oQ7Lffhqk9HKnDbmqew3HFOZIoFAo1N8Q6RvPa3qVrTHbnBcLExyOIEK0xAMWZo9MWFdVHY4UrKyhbh7fgbwOvAmq3HD7ZdfyKt/8XdQPdVu/DTXsAVBDab1+qyltANDQDCFGXg0N1IFineq1OoYIP8vk2841NIYR1MMhno5ftD4ahoo3NT6EcRsS7pJp5RR/f0rZtXS13FFM80WhUChQkEA6x2olMn7dbvj7pW2fXJNQDSpY5kKmBHG/UgnybQ2I+TjPVs0QzKs0FK1nir/9BmjjDitDlk5JNx2o/tP99Fsg9xgCT7EChG4sCoVC/VjZJLudpsVaL4FNqxz3dOPnxXqaknyyOhIoq53PUTi0k5RUUoEq10WnzLJjKKXUu88Framxvp9aspLGtaxaQn3L+R1Zilw93ThIHtxH5pJmyVlzYoPTNqYASbOKM2Ls5vhK+yqgu5mC8mBsv/9GIw/72t4u1J0EEfeO/fhn2dW5+d6q06C5G72V5Z/mMpL3vGpApDjbUi0oy7J5aZUDTLTMhGbFoIj04yoeZfLOyyGu2Yp180vIvsYtFMzgmNC80aorm9aJjQCWm4pCoVCor9CDlNO51JJAj05ZhbhAFaA5PdmeUwAcnHU18sLMPZfFBJXjt2FHKtKVLaAsfpC6XZfnzjk7SG0xG/j9aOfqnpHRcDk7Zu4d27Bgdx33wztvWakn16w47NOYt7pa/nvUsPnZ6viol5mDPKY3NOPivhrOlJ1DL3k9MpZPcY9np5el7JbHvjzbdh/s/Lywvfrp+012tt6YQtcPZ3Impz4b8IcvOfLuTJ7xjZ9VT+cz7Lbs/wLiqQ3VdFvLmb1/IoMifmePxdevS6Q9k53IN/kwG6xlz066ObvrqcyXj8f6jbdt5iY9PJnJp0P77a1mzm4zF9TJ/2Sg5e9YrJtIS33zMY/iw2G0ZGvT6eQSGXvLnsZhcTwLeetrDHdF8+nlSPJoXBJ/fo2xfaMgpJj9benkUsx1SVSmlpIP0lDpFWV8jb4trYMGVAdT26sdYZPlYMNC+FMI4LTM3vN6M4qVFgAU6iv0D5QnfMaZoP9/AAAAAElFTkSuQmCC"

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(40);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(43)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../css-loader/index.js!./style.css", function() {
				var newContent = require("!!./../../css-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(41)();
	// imports


	// module
	exports.push([module.id, "/* general typography */\n.leaflet-container {\n  background:#fff;\n  font:12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;\n  color:#404040;\n  color:rgba(0,0,0,0.75);\n  outline:0;\n  overflow:hidden;\n  -ms-touch-action:none;\n  }\n\n.leaflet-container *,\n.leaflet-container *:after,\n.leaflet-container *:before {\n  -webkit-box-sizing:border-box;\n     -moz-box-sizing:border-box;\n          box-sizing:border-box;\n  }\n\n.leaflet-container h1,\n.leaflet-container h2,\n.leaflet-container h3,\n.leaflet-container h4,\n.leaflet-container h5,\n.leaflet-container h6,\n.leaflet-container p {\n  font-size:15px;\n  line-height:20px;\n  margin:0 0 10px;\n  }\n\n.leaflet-container .marker-description img {\n  margin-bottom: 10px;\n  }\n\n.leaflet-container a {\n  color:#3887BE;\n  font-weight:normal;\n  text-decoration:none;\n  }\n  .leaflet-container a:hover      { color:#63b6e5; }\n  .leaflet-container.dark a       { color:#63b6e5; }\n  .leaflet-container.dark a:hover { color:#8fcaec; }\n\n.leaflet-container.dark .mapbox-button,\n.leaflet-container .mapbox-button {\n  background-color:#3887be;\n  display:inline-block;\n  height:40px;\n  line-height:40px;\n  text-decoration:none;\n  color:#fff;\n  font-size:12px;\n  white-space:nowrap;\n  text-overflow:ellipsis;\n  }\n  .leaflet-container.dark .mapbox-button:hover,\n  .leaflet-container .mapbox-button:hover {\n    color:#fff;\n    background-color:#3bb2d0;\n    }\n\n/* Base Leaflet\n------------------------------------------------------- */\n.leaflet-map-pane,\n.leaflet-tile,\n.leaflet-marker-icon,\n.leaflet-marker-shadow,\n.leaflet-tile-pane,\n.leaflet-tile-container,\n.leaflet-overlay-pane,\n.leaflet-shadow-pane,\n.leaflet-marker-pane,\n.leaflet-popup-pane,\n.leaflet-overlay-pane svg,\n.leaflet-zoom-box,\n.leaflet-image-layer,\n.leaflet-layer {\n  position:absolute;\n  left:0;\n  top:0;\n  }\n\n.leaflet-tile,\n.leaflet-marker-icon,\n.leaflet-marker-shadow {\n  -webkit-user-drag:none;\n  -webkit-user-select:none;\n     -moz-user-select:none;\n          user-select:none;\n  }\n.leaflet-marker-icon,\n.leaflet-marker-shadow {\n  display: block;\n  }\n\n.leaflet-tile {\n  filter:inherit;\n  visibility:hidden;\n  }\n.leaflet-tile-loaded {\n  visibility:inherit;\n  }\n.leaflet-zoom-box {\n  width:0;\n  height:0;\n  }\n\n.leaflet-tile-pane    { z-index:2; }\n.leaflet-objects-pane { z-index:3; }\n.leaflet-overlay-pane { z-index:4; }\n.leaflet-shadow-pane  { z-index:5; }\n.leaflet-marker-pane  { z-index:6; }\n.leaflet-popup-pane   { z-index:7; }\n\n.leaflet-control {\n  position:relative;\n  z-index:7;\n  pointer-events:auto;\n  float:left;\n  clear:both;\n  }\n  .leaflet-right .leaflet-control   { float:right; }\n  .leaflet-top .leaflet-control     { margin-top:10px; }\n  .leaflet-bottom .leaflet-control  { margin-bottom:10px; }\n  .leaflet-left .leaflet-control    { margin-left:10px; }\n  .leaflet-right .leaflet-control   { margin-right:10px; }\n\n.leaflet-top,\n.leaflet-bottom {\n  position:absolute;\n  z-index:1000;\n  pointer-events:none;\n  }\n  .leaflet-top    { top:0; }\n  .leaflet-right  { right:0; }\n  .leaflet-bottom { bottom:0; }\n  .leaflet-left   { left:0; }\n\n/* zoom and fade animations */\n.leaflet-fade-anim .leaflet-tile,\n.leaflet-fade-anim .leaflet-popup {\n  opacity:0;\n  -webkit-transition:opacity 0.2s linear;\n     -moz-transition:opacity 0.2s linear;\n       -o-transition:opacity 0.2s linear;\n          transition:opacity 0.2s linear;\n  }\n  .leaflet-fade-anim .leaflet-tile-loaded,\n  .leaflet-fade-anim .leaflet-map-pane .leaflet-popup {\n    opacity:1;\n    }\n\n.leaflet-zoom-anim .leaflet-zoom-animated {\n  -webkit-transition:-webkit-transform 0.25s cubic-bezier(0,0,0.25,1);\n     -moz-transition:   -moz-transform 0.25s cubic-bezier(0,0,0.25,1);\n       -o-transition:     -o-transform 0.25s cubic-bezier(0,0,0.25,1);\n          transition:        transform 0.25s cubic-bezier(0,0,0.25,1);\n  }\n.leaflet-zoom-anim .leaflet-tile,\n.leaflet-pan-anim .leaflet-tile,\n.leaflet-touching .leaflet-zoom-animated {\n  -webkit-transition:none;\n     -moz-transition:none;\n       -o-transition:none;\n          transition:none;\n  }\n.leaflet-zoom-anim .leaflet-zoom-hide { visibility: hidden; }\n\n/* cursors */\n.leaflet-container {\n  cursor:-webkit-grab;\n  cursor:   -moz-grab;\n  }\n.leaflet-overlay-pane path,\n.leaflet-marker-icon,\n.leaflet-container.map-clickable,\n.leaflet-container.leaflet-clickable {\n  cursor:pointer;\n  }\n.leaflet-popup-pane,\n.leaflet-control {\n  cursor:auto;\n  }\n.leaflet-dragging,\n.leaflet-dragging .map-clickable,\n.leaflet-dragging .leaflet-clickable,\n.leaflet-dragging .leaflet-container {\n  cursor:move;\n  cursor:-webkit-grabbing;\n  cursor:   -moz-grabbing;\n  }\n\n.leaflet-zoom-box {\n  background:#fff;\n  border:2px dotted #202020;\n  opacity:0.5;\n  }\n\n/* general toolbar styles */\n.leaflet-control-layers,\n.leaflet-bar {\n  background-color:#fff;\n  border:1px solid #999;\n  border-color:rgba(0,0,0,0.4);\n  border-radius:3px;\n  box-shadow:none;\n  }\n.leaflet-bar a,\n.leaflet-bar a:hover {\n  color:#404040;\n  color:rgba(0,0,0,0.75);\n  border-bottom:1px solid #ddd;\n  border-bottom-color:rgba(0,0,0,0.10);\n  }\n  .leaflet-bar a:hover,\n  .leaflet-bar a:active {\n    background-color:#f8f8f8;\n    cursor:pointer;\n    }\n  .leaflet-bar a:hover:first-child {\n    border-radius:3px 3px 0 0;\n    }\n  .leaflet-bar a:hover:last-child {\n    border-bottom:none;\n    border-radius:0 0 3px 3px;\n    }\n  .leaflet-bar a:hover:only-of-type {\n    border-radius:3px;\n    }\n\n.leaflet-bar .leaflet-disabled {\n  cursor:default;\n  opacity:0.75;\n  }\n.leaflet-control-zoom-in,\n.leaflet-control-zoom-out {\n  display:block;\n  content:'';\n  text-indent:-999em;\n  }\n\n.leaflet-control-layers .leaflet-control-layers-list,\n.leaflet-control-layers-expanded .leaflet-control-layers-toggle {\n  display:none;\n  }\n  .leaflet-control-layers-expanded .leaflet-control-layers-list {\n    display:block;\n    position:relative;\n    }\n\n.leaflet-control-layers-expanded {\n  background:#fff;\n  padding:6px 10px 6px 6px;\n  color:#404040;\n  color:rgba(0,0,0,0.75);\n  }\n.leaflet-control-layers-selector {\n  margin-top:2px;\n  position:relative;\n  top:1px;\n  }\n.leaflet-control-layers label {\n  display: block;\n  }\n.leaflet-control-layers-separator {\n  height:0;\n  border-top:1px solid #ddd;\n  border-top-color:rgba(0,0,0,0.10);\n  margin:5px -10px 5px -6px;\n  }\n\n.leaflet-container .leaflet-control-attribution {\n  background-color:rgba(255,255,255,0.5);\n  margin:0;\n  box-shadow:none;\n  }\n  .leaflet-container .leaflet-control-attribution a,\n  .leaflet-container .map-info-container a {\n    color:#404040;\n    }\n    .leaflet-control-attribution a:hover,\n    .map-info-container a:hover {\n      color:inherit;\n      text-decoration:underline;\n      }\n\n.leaflet-control-attribution,\n.leaflet-control-scale-line {\n  padding:0 5px;\n  }\n  .leaflet-left .leaflet-control-scale    { margin-left:5px; }\n  .leaflet-bottom .leaflet-control-scale  { margin-bottom:5px; }\n\n/* Used for smaller map containers & triggered by container size */\n.leaflet-container .leaflet-control-attribution.leaflet-compact-attribution { margin:10px; }\n.leaflet-container .leaflet-control-attribution.leaflet-compact-attribution {\n  background:#fff;\n  border-radius:3px 13px 13px 3px;\n  padding:3px 31px 3px 3px;\n  visibility:hidden;\n  }\n  .leaflet-control-attribution.leaflet-compact-attribution:hover {\n    visibility:visible;\n    }\n\n.leaflet-control-attribution.leaflet-compact-attribution:after {\n  content:'';\n  background-color:#fff;\n  background-color:rgba(255,255,255,0.5);\n  background-position:0 -78px;\n  border-radius:50%;\n  position:absolute;\n  display:inline-block;\n  width:26px;\n  height:26px;\n  vertical-align:middle;\n  bottom:0;\n  z-index:1;\n  visibility:visible;\n  cursor:pointer;\n  }\n  .leaflet-control-attribution.leaflet-compact-attribution:hover:after { background-color:#fff; }\n\n.leaflet-right .leaflet-control-attribution.leaflet-compact-attribution:after { right:0; }\n.leaflet-left .leaflet-control-attribution.leaflet-compact-attribution:after { left:0; }\n\n.leaflet-control-scale-line {\n  background-color:rgba(255,255,255,0.5);\n  border:1px solid #999;\n  border-color:rgba(0,0,0,0.4);\n  border-top:none;\n  padding:2px 5px 1px;\n  white-space:nowrap;\n  overflow:hidden;\n  }\n  .leaflet-control-scale-line:not(:first-child) {\n    border-top:2px solid #ddd;\n    border-top-color:rgba(0,0,0,0.10);\n    border-bottom:none;\n    margin-top:-2px;\n    }\n  .leaflet-control-scale-line:not(:first-child):not(:last-child) {\n    border-bottom:2px solid #777;\n    }\n\n/* popup */\n.leaflet-popup {\n  position:absolute;\n  text-align:center;\n  pointer-events:none;\n  }\n.leaflet-popup-content-wrapper {\n  padding:1px;\n  text-align:left;\n  pointer-events:all;\n  }\n.leaflet-popup-content {\n  padding:10px 10px 15px;\n  margin:0;\n  line-height:inherit;\n  }\n  .leaflet-popup-close-button + .leaflet-popup-content-wrapper .leaflet-popup-content {\n    padding-top:15px;\n    }\n\n.leaflet-popup-tip-container {\n  width:20px;\n  height:20px;\n  margin:0 auto;\n  position:relative;\n  }\n.leaflet-popup-tip {\n  width:0;\n\theight:0;\n  margin:0;\n\tborder-left:10px solid transparent;\n\tborder-right:10px solid transparent;\n\tborder-top:10px solid #fff;\n  box-shadow:none;\n  }\n.leaflet-popup-close-button {\n  text-indent:-999em;\n  position:absolute;\n  top:0;right:0;\n  pointer-events:all;\n  }\n  .leaflet-popup-close-button:hover {\n    background-color:#f8f8f8;\n    }\n\n.leaflet-popup-scrolled {\n  overflow:auto;\n  border-bottom:1px solid #ddd;\n  border-top:1px solid #ddd;\n  }\n\n/* div icon */\n.leaflet-div-icon {\n  background:#fff;\n  border:1px solid #999;\n  border-color:rgba(0,0,0,0.4);\n  }\n.leaflet-editing-icon {\n  border-radius:3px;\n  }\n\n/* Leaflet + Mapbox\n------------------------------------------------------- */\n.leaflet-bar a,\n.mapbox-icon,\n.map-tooltip.closable .close,\n.leaflet-control-layers-toggle,\n.leaflet-popup-close-button,\n.mapbox-button-icon:before {\n  content:'';\n  display:inline-block;\n  width:26px;\n  height:26px;\n  vertical-align:middle;\n  background-repeat:no-repeat;\n  }\n.leaflet-bar a {\n  display:block;\n  }\n\n.leaflet-control-attribution:after,\n.leaflet-control-zoom-in,\n.leaflet-control-zoom-out,\n.leaflet-popup-close-button,\n.leaflet-control-layers-toggle,\n.leaflet-container.dark .map-tooltip .close,\n.map-tooltip .close,\n.mapbox-icon {\n  opacity: .75;\n  background-image:url(" + __webpack_require__(42) + ");\n  background-repeat:no-repeat;\n  background-size:26px 260px;\n  }\n  .leaflet-container.dark .leaflet-control-attribution:after,\n  .mapbox-button-icon:before,\n  .leaflet-container.dark .leaflet-control-zoom-in,\n  .leaflet-container.dark .leaflet-control-zoom-out,\n  .leaflet-container.dark .leaflet-control-layers-toggle,\n  .leaflet-container.dark .mapbox-icon {\n    opacity: 1;\n    background-image:url(" + __webpack_require__(38) + ");\n    background-size:26px 260px;\n    }\n  .leaflet-bar .leaflet-control-zoom-in                 { background-position:0 0; }\n  .leaflet-bar .leaflet-control-zoom-out                { background-position:0 -26px; }\n  .map-tooltip.closable .close,\n  .leaflet-popup-close-button {\n    background-position:-3px -55px;\n    width:20px;\n    height:20px;\n    border-radius:0 3px 0 0;\n    }\n  .mapbox-icon-info                                     { background-position:0 -78px; }\n  .leaflet-control-layers-toggle                        { background-position:0 -104px; }\n  .mapbox-icon.mapbox-icon-share:before, .mapbox-icon.mapbox-icon-share         { background-position:0 -130px; }\n  .mapbox-icon.mapbox-icon-geocoder:before, .mapbox-icon.mapbox-icon-geocoder   { background-position:0 -156px; }\n  .mapbox-icon-facebook:before, .mapbox-icon-facebook   { background-position:0 -182px; }\n  .mapbox-icon-twitter:before, .mapbox-icon-twitter     { background-position:0 -208px; }\n  .mapbox-icon-pinterest:before, .mapbox-icon-pinterest { background-position:0 -234px; }\n\n.leaflet-popup-content-wrapper,\n.map-legends,\n.map-tooltip {\n  background:#fff;\n  border-radius:3px;\n  box-shadow:0 1px 2px rgba(0,0,0,0.10);\n  }\n.map-legends,\n.map-tooltip {\n  max-width:300px;\n  }\n.map-legends .map-legend {\n  padding:10px;\n  }\n.map-tooltip {\n  z-index:999999;\n  padding:10px;\n  min-width:180px;\n  max-height:400px;\n  overflow:auto;\n  opacity:1;\n  -webkit-transition:opacity 150ms;\n     -moz-transition:opacity 150ms;\n       -o-transition:opacity 150ms;\n          transition:opacity 150ms;\n  }\n\n.map-tooltip .close {\n  text-indent:-999em;\n  overflow:hidden;\n  display:none;\n  }\n  .map-tooltip.closable .close {\n    position:absolute;\n    top:0;right:0;\n    border-radius:3px;\n    }\n    .map-tooltip.closable .close:active  {\n      background-color:#f8f8f8;\n      }\n\n.leaflet-control-interaction {\n  position:absolute;\n  top:10px;\n  right:10px;\n  width:300px;\n  }\n.leaflet-popup-content .marker-title {\n  font-weight:bold;\n  }\n.leaflet-control .mapbox-button {\n  background-color:#fff;\n  border:1px solid #ddd;\n  border-color:rgba(0,0,0,0.10);\n  padding:5px 10px;\n  border-radius:3px;\n  }\n\n/* Share modal\n------------------------------------------------------- */\n.mapbox-modal > div {\n  position:absolute;\n  top:0;\n  left:0;\n  width:100%;\n  height:100%;\n  z-index:-1;\n  overflow-y:auto;\n  }\n  .mapbox-modal.active > div {\n    z-index:99999;\n    transition:all .2s, z-index 0 0;\n    }\n\n.mapbox-modal .mapbox-modal-mask {\n  background:rgba(0,0,0,0.5);\n  opacity:0;\n  }\n  .mapbox-modal.active .mapbox-modal-mask { opacity:1; }\n\n.mapbox-modal .mapbox-modal-content {\n  -webkit-transform:translateY(-100%);\n     -moz-transform:translateY(-100%);\n      -ms-transform:translateY(-100%);\n          transform:translateY(-100%);\n  }\n  .mapbox-modal.active .mapbox-modal-content {\n    -webkit-transform:translateY(0);\n       -moz-transform:translateY(0);\n        -ms-transform:translateY(0);\n            transform:translateY(0);\n    }\n\n.mapbox-modal-body {\n  position:relative;\n  background:#fff;\n  padding:20px;\n  z-index:1000;\n  width:50%;\n  margin:20px 0 20px 25%;\n  }\n.mapbox-share-buttons {\n  margin:0 0 20px;\n  }\n.mapbox-share-buttons a {\n  width:33.3333%;\n  border-left:1px solid #fff;\n  text-align:center;\n  border-radius:0;\n  }\n  .mapbox-share-buttons a:last-child  { border-radius:0 3px 3px 0; }\n  .mapbox-share-buttons a:first-child { border:none; border-radius:3px 0 0 3px; }\n\n.mapbox-modal input {\n  width:100%;\n  height:40px;\n  padding:10px;\n  border:1px solid #ddd;\n  border-color:rgba(0,0,0,0.10);\n  color:rgba(0,0,0,0.5);\n  }\n\n/* Info Control\n------------------------------------------------------- */\n.leaflet-control.mapbox-control-info {\n  margin:5px 30px 10px 10px;\n  min-height:26px;\n  }\n  .leaflet-right .leaflet-control.mapbox-control-info {\n    margin:5px 10px 10px 30px;\n    }\n\n.mapbox-info-toggle {\n  background-color:#fff;\n  background-color:rgba(255,255,255,0.5);\n  border-radius:50%;\n  position:absolute;\n  bottom:0;left:0;\n  z-index:1;\n  }\n  .leaflet-right .mapbox-control-info .mapbox-info-toggle  { left:auto; right:0; }\n  .mapbox-info-toggle:hover { background-color:#fff; }\n\n.map-info-container {\n  background:#fff;\n  padding:3px 5px 3px 27px;\n  display:none;\n  position:relative;\n  bottom:0;left:0;\n  border-radius:13px 3px 3px 13px;\n  }\n  .leaflet-right .map-info-container {\n    left:auto;\n    right:0;\n    padding:3px 27px 3px 5px;\n    border-radius:3px 13px 13px 3px;\n    }\n\n.mapbox-control-info.active .map-info-container { display:inline-block; }\n.leaflet-container .mapbox-improve-map { font-weight:bold; }\n\n/* Geocoder\n------------------------------------------------------- */\n.leaflet-control-mapbox-geocoder {\n  position:relative;\n  }\n.leaflet-control-mapbox-geocoder.searching {\n  opacity:0.75;\n  }\n.leaflet-control-mapbox-geocoder .leaflet-control-mapbox-geocoder-wrap {\n  background:#fff;\n  position:absolute;\n  border:1px solid #999;\n  border-color:rgba(0,0,0,0.4);\n  overflow:hidden;\n  left:26px;\n  height:28px;\n  width:0;\n  top:-1px;\n  border-radius:0 3px 3px 0;\n  opacity:0;\n  -webkit-transition:opacity 100ms;\n     -moz-transition:opacity 100ms;\n       -o-transition:opacity 100ms;\n          transition:opacity 100ms;\n  }\n.leaflet-control-mapbox-geocoder.active .leaflet-control-mapbox-geocoder-wrap {\n  width:180px;\n  opacity:1;\n  }\n.leaflet-bar .leaflet-control-mapbox-geocoder-toggle,\n.leaflet-bar .leaflet-control-mapbox-geocoder-toggle:hover {\n  border-bottom:none;\n  }\n.leaflet-control-mapbox-geocoder-toggle {\n  border-radius:3px;\n  }\n.leaflet-control-mapbox-geocoder.active,\n.leaflet-control-mapbox-geocoder.active .leaflet-control-mapbox-geocoder-toggle {\n  border-top-right-radius:0;\n  border-bottom-right-radius:0;\n  }\n.leaflet-control-mapbox-geocoder .leaflet-control-mapbox-geocoder-form input {\n  background:transparent;\n  border:0;\n  width:180px;\n  padding:0 0 0 10px;\n  height:26px;\n  outline:none;\n  }\n.leaflet-control-mapbox-geocoder-results {\n  width:180px;\n  position:absolute;\n  left:26px;\n  top:25px;\n  border-radius:0 0 3px 3px;\n  }\n  .leaflet-control-mapbox-geocoder.active .leaflet-control-mapbox-geocoder-results {\n    background:#fff;\n    border:1px solid #999;\n    border-color:rgba(0,0,0,0.4);\n    }\n.leaflet-control-mapbox-geocoder-results a,\n.leaflet-control-mapbox-geocoder-results span {\n  padding:0 10px;\n  text-overflow:ellipsis;\n  white-space:nowrap;\n  display:block;\n  width:100%;\n  font-size:12px;\n  line-height:26px;\n  text-align:left;\n  overflow:hidden;\n  }\n  .leaflet-container.dark .leaflet-control .leaflet-control-mapbox-geocoder-results a:hover,\n  .leaflet-control-mapbox-geocoder-results a:hover {\n    background:#f8f8f8;\n    opacity:1;\n    }\n\n.leaflet-right .leaflet-control-mapbox-geocoder-wrap,\n.leaflet-right .leaflet-control-mapbox-geocoder-results {\n  left:auto;\n  right:26px;\n  }\n.leaflet-right .leaflet-control-mapbox-geocoder-wrap {\n  border-radius:3px 0 0 3px;\n  }\n.leaflet-right .leaflet-control-mapbox-geocoder.active,\n.leaflet-right .leaflet-control-mapbox-geocoder.active .leaflet-control-mapbox-geocoder-toggle {\n  border-radius:0 3px 3px 0;\n  }\n\n.leaflet-bottom .leaflet-control-mapbox-geocoder-results {\n  top:auto;\n  bottom:25px;\n  border-radius:3px 3px 0 0;\n  }\n\n/* Mapbox Logo\n------------------------------------------------------- */\n.mapbox-logo-true:before {\n  content:'';\n  display:inline-block;\n  width:61px;\n  height:19px;\n  vertical-align:middle;\n}\n.mapbox-logo-true {\n  background-repeat:no-repeat;\n  background-size:61px 19px;\n  background-image:url('data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSI2NSIgaGVpZ2h0PSIyMCI+PGRlZnMvPjxtZXRhZGF0YT48cmRmOlJERj48Y2M6V29yayByZGY6YWJvdXQ9IiI+PGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+PGRjOnR5cGUgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIvPjxkYzp0aXRsZS8+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNjEuODQ4MywtOTguNTAzOTUpIj48ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjE3NDQxODM2LDAsMCwwLjE3NDQxODM2LDIyMC41MjI4MiwyOS4yMjkzNDIpIiBzdHlsZT0ib3BhY2l0eTowLjI1O2ZpbGw6I2ZmZmZmZjtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MTcuMjAwMDIzNjU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLW9wYWNpdHk6MTtzdHJva2UtZGFzaGFycmF5Om5vbmUiPjxwYXRoIGQ9Ik0gNS4yOCAxLjUgQyA0LjU0IDEuNTYgMy45IDIuMjUgMy45MSAzIGwgMCAxMS44OCBjIDAuMDIgMC43NyAwLjcyIDEuNDcgMS41IDEuNDcgbCAxLjc1IDAgYyAwLjc4IDAgMS40OCAtMC42OSAxLjUgLTEuNDcgbCAwIC00LjI4IDAuNzIgMS4xOSBjIDAuNTMgMC44NyAyLjAzIDAuODcgMi41NiAwIGwgMC43MiAtMS4xOSAwIDQuMjggYyAwLjAyIDAuNzYgMC43IDEuNDUgMS40NyAxLjQ3IGwgMS43NSAwIGMgMC43OCAwIDEuNDggLTAuNjkgMS41IC0xLjQ3IGwgMCAtMC4xNiBjIDEuMDIgMS4xMiAyLjQ2IDEuODEgNC4wOSAxLjgxIGwgNC4wOSAwIDAgMS40NyBjIC0wIDAuNzggMC42OSAxLjQ4IDEuNDcgMS41IGwgMS43NSAwIGMgMC43OSAtMCAxLjUgLTAuNzEgMS41IC0xLjUgbCAwLjAyIC0xLjQ3IGMgMS43MiAwIDMuMDggLTAuNjQgNC4xNCAtMS42OSBsIDAgMC4xOSBjIDAgMC4zOSAwLjE2IDAuNzkgMC40NCAxLjA2IDAuMjggMC4yOCAwLjY3IDAuNDQgMS4wNiAwLjQ0IGwgMy4zMSAwIGMgMi4wMyAwIDMuODUgLTEuMDYgNC45MSAtMi42OSAxLjA1IDEuNjEgMi44NCAyLjY5IDQuODggMi42OSAxLjAzIDAgMS45OCAtMC4yNyAyLjgxIC0wLjc1IDAuMjggMC4zNSAwLjczIDAuNTcgMS4xOSAwLjU2IGwgMi4xMiAwIGMgMC40OCAwLjAxIDAuOTcgLTAuMjMgMS4yNSAtMC42MiBsIDAuOTEgLTEuMjggMC45MSAxLjI4IGMgMC4yOCAwLjM5IDAuNzQgMC42MyAxLjIyIDAuNjIgbCAyLjE2IDAgQyA2Mi42NyAxNi4zMyA2My40MiAxNC44OSA2Mi44MSAxNCBMIDYwLjIyIDEwLjM4IDYyLjYyIDcgQyA2My4yNiA2LjExIDYyLjUgNC42MiA2MS40MSA0LjYyIGwgLTIuMTYgMCBDIDU4Ljc4IDQuNjIgNTguMzEgNC44NiA1OC4wMyA1LjI1IEwgNTcuMzEgNi4yOCA1Ni41NiA1LjI1IEMgNTYuMjkgNC44NiA1NS44MiA0LjYyIDU1LjM0IDQuNjIgbCAtMi4xNiAwIGMgLTAuNDkgLTAgLTAuOTcgMC4yNSAtMS4yNSAwLjY2IC0wLjg2IC0wLjUxIC0xLjg0IC0wLjgxIC0yLjkxIC0wLjgxIC0yLjAzIDAgLTMuODMgMS4wOCAtNC44OCAyLjY5IEMgNDMuMSA1LjUzIDQxLjI3IDQuNDcgMzkuMTkgNC40NyBMIDM5LjE5IDMgQyAzOS4xOSAyLjYxIDM5LjAzIDIuMjEgMzguNzUgMS45NCAzOC40NyAxLjY2IDM4LjA4IDEuNSAzNy42OSAxLjUgbCAtMS43NSAwIGMgLTAuNzEgMCAtMS41IDAuODMgLTEuNSAxLjUgbCAwIDMuMTYgQyAzMy4zOCA1LjEgMzEuOTYgNC40NyAzMC4zOCA0LjQ3IGwgLTMuMzQgMCBjIC0wLjc3IDAuMDIgLTEuNDcgMC43MiAtMS40NyAxLjUgbCAwIDAuMzEgYyAtMS4wMiAtMS4xMiAtMi40NiAtMS44MSAtNC4wOSAtMS44MSAtMS42MyAwIC0zLjA3IDAuNyAtNC4wOSAxLjgxIEwgMTcuMzggMyBjIC0wIC0wLjc5IC0wLjcxIC0xLjUgLTEuNSAtMS41IEwgMTQuNSAxLjUgQyAxMy41NSAxLjUgMTIuMjggMS44NyAxMS42NiAyLjk0IGwgLTEgMS42OSAtMSAtMS42OSBDIDkuMDMgMS44NyA3Ljc3IDEuNSA2LjgxIDEuNSBsIC0xLjQxIDAgQyA1LjM2IDEuNSA1LjMyIDEuNSA1LjI4IDEuNSB6IG0gMTYuMTkgNy43MiBjIDAuNTMgMCAwLjk0IDAuMzUgMC45NCAxLjI4IGwgMCAxLjI4IC0wLjk0IDAgYyAtMC41MiAwIC0wLjk0IC0wLjM4IC0wLjk0IC0xLjI4IC0wIC0wLjkgMC40MiAtMS4yOCAwLjk0IC0xLjI4IHogbSA4LjgxIDAgYyAwLjgzIDAgMS4xOCAwLjY4IDEuMTkgMS4yOCAwLjAxIDAuOTQgLTAuNjIgMS4yOCAtMS4xOSAxLjI4IHogbSA4LjcyIDAgYyAwLjcyIDAgMS4zNyAwLjYgMS4zNyAxLjI4IDAgMC43NyAtMC41MSAxLjI4IC0xLjM3IDEuMjggeiBtIDEwLjAzIDAgYyAwLjU4IDAgMS4wOSAwLjUgMS4wOSAxLjI4IDAgMC43OCAtMC41MSAxLjI4IC0xLjA5IDEuMjggLTAuNTggMCAtMS4xMiAtMC41IC0xLjEyIC0xLjI4IDAgLTAuNzggMC41NCAtMS4yOCAxLjEyIC0xLjI4IHoiIHRyYW5zZm9ybT0ibWF0cml4KDUuNzMzMzQxNCwwLDAsNS43MzMzNDE0LDIzNi45MzMwOCwzOTcuMTc0OTgpIiBzdHlsZT0iZm9udC1zaXplOm1lZGl1bTtmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO3RleHQtaW5kZW50OjA7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWRlY29yYXRpb246bm9uZTtsaW5lLWhlaWdodDpub3JtYWw7bGV0dGVyLXNwYWNpbmc6bm9ybWFsO3dvcmQtc3BhY2luZzpub3JtYWw7dGV4dC10cmFuc2Zvcm06bm9uZTtkaXJlY3Rpb246bHRyO2Jsb2NrLXByb2dyZXNzaW9uOnRiO3dyaXRpbmctbW9kZTpsci10Yjt0ZXh0LWFuY2hvcjpzdGFydDtiYXNlbGluZS1zaGlmdDpiYXNlbGluZTtjb2xvcjojMDAwMDAwO2ZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTcuMjAwMDIzNjU7bWFya2VyOm5vbmU7dmlzaWJpbGl0eTp2aXNpYmxlO2Rpc3BsYXk6aW5saW5lO292ZXJmbG93OnZpc2libGU7ZW5hYmxlLWJhY2tncm91bmQ6YWNjdW11bGF0ZTtmb250LWZhbWlseTpTYW5zOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246U2FucyIvPjwvZz48ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjE3NDQxODM2LDAsMCwwLjE3NDQxODM2LDIyMC41MjI4MiwyOS4yMjkzNDIpIiBzdHlsZT0iZmlsbDojZmZmZmZmIj48cGF0aCBkPSJtIDUuNDEgMyAwIDEyIDEuNzUgMCAwIC05LjkxIDMuNSA1Ljk0IDMuNDcgLTUuOTQgMCA5LjkxIDEuNzUgMCAwIC0xMiBMIDE0LjUgMyBDIDEzLjggMyAxMy4yNSAzLjE2IDEyLjk0IDMuNjkgTCAxMC42NiA3LjU5IDguMzggMy42OSBDIDguMDcgMy4xNiA3LjUxIDMgNi44MSAzIHogTSAzNiAzIGwgMCAxMi4wMyAzLjI1IDAgYyAyLjQ0IDAgNC4zOCAtMS45MSA0LjM4IC00LjUzIDAgLTIuNjIgLTEuOTMgLTQuNDcgLTQuMzggLTQuNDcgQyAzOC43IDYuMDMgMzguMzIgNiAzNy43NSA2IGwgMCAtMyB6IE0gMjEuNDcgNS45NyBjIC0yLjQ0IDAgLTQuMTkgMS45MSAtNC4xOSA0LjUzIDAgMi42MiAxLjc1IDQuNTMgNC4xOSA0LjUzIGwgNC4xOSAwIDAgLTQuNTMgYyAwIC0yLjYyIC0xLjc1IC00LjUzIC00LjE5IC00LjUzIHogbSAyNy41NiAwIGMgLTIuNDEgMCAtNC4zOCAyLjAzIC00LjM4IDQuNTMgMCAyLjUgMS45NyA0LjUzIDQuMzggNC41MyAyLjQxIDAgNC4zNCAtMi4wMyA0LjM0IC00LjUzIDAgLTIuNSAtMS45NCAtNC41MyAtNC4zNCAtNC41MyB6IG0gLTIyIDAuMDMgMCAxMiAxLjc1IDAgMCAtMi45NyBjIDAuNTcgMCAxLjA0IC0wIDEuNTkgMCAyLjQ0IDAgNC4zNCAtMS45MSA0LjM0IC00LjUzIDAgLTIuNjIgLTEuOSAtNC41IC00LjM0IC00LjUgeiBtIDI2LjE2IDAgMy4wMyA0LjM4IC0zLjE5IDQuNjIgMi4xMiAwIEwgNTcuMzEgMTEuOTEgNTkuNDQgMTUgNjEuNTkgMTUgNTguMzggMTAuMzggNjEuNDEgNiA1OS4yNSA2IDU3LjMxIDguODEgNTUuMzQgNiB6IE0gMjEuNDcgNy43MiBjIDEuNCAwIDIuNDQgMS4xOSAyLjQ0IDIuNzggbCAwIDIuNzggLTIuNDQgMCBjIC0xLjQgMCAtMi40NCAtMS4yMSAtMi40NCAtMi43OCAtMCAtMS41NyAxLjA0IC0yLjc4IDIuNDQgLTIuNzggeiBtIDI3LjU2IDAgYyAxLjQ0IDAgMi41OSAxLjI0IDIuNTkgMi43OCAwIDEuNTQgLTEuMTUgMi43OCAtMi41OSAyLjc4IC0xLjQ0IDAgLTIuNjIgLTEuMjQgLTIuNjIgLTIuNzggMCAtMS41NCAxLjE4IC0yLjc4IDIuNjIgLTIuNzggeiBtIC0yMC4yNSAwLjAzIDEuNTkgMCBjIDEuNTkgMCAyLjU5IDEuMjggMi41OSAyLjc1IDAgMS40NyAtMS4xMyAyLjc4IC0yLjU5IDIuNzggbCAtMS41OSAwIHogbSA4Ljk3IDAgMS41IDAgYyAxLjQ3IDAgMi42MiAxLjI4IDIuNjIgMi43NSAwIDEuNDcgLTEuMDQgMi43OCAtMi42MiAyLjc4IGwgLTEuNSAwIHoiIHRyYW5zZm9ybT0ibWF0cml4KDUuNzMzMzQxNCwwLDAsNS43MzMzNDE0LDIzNi45MzMwOCwzOTcuMTc0OTgpIiBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lIi8+PC9nPjwvZz48L3N2Zz4=');\n}\n\n/* Dark Theme\n------------------------------------------------------- */\n.leaflet-container.dark .leaflet-bar {\n  background-color:#404040;\n  border-color:#202020;\n  border-color:rgba(0,0,0,0.75);\n  }\n  .leaflet-container.dark .leaflet-bar a {\n    color:#404040;\n    border-color:rgba(0,0,0,0.5);\n    }\n  .leaflet-container.dark .leaflet-bar a:active,\n  .leaflet-container.dark .leaflet-bar a:hover {\n    background-color:#505050;\n    }\n\n.leaflet-container.dark .leaflet-control-attribution:after,\n.leaflet-container.dark .mapbox-info-toggle,\n.leaflet-container.dark .map-info-container,\n.leaflet-container.dark .leaflet-control-attribution {\n  background-color:rgba(0,0,0,0.5);\n  color:#f8f8f8;\n  }\n  .leaflet-container.dark .leaflet-control-attribution a,\n  .leaflet-container.dark .leaflet-control-attribution a:hover,\n  .leaflet-container.dark .map-info-container a,\n  .leaflet-container.dark .map-info-container a:hover {\n    color:#fff;\n    }\n\n.leaflet-container.dark .leaflet-control-attribution:hover:after {\n  background-color:#000;\n  }\n.leaflet-container.dark .leaflet-control-layers-list span {\n  color:#f8f8f8;\n  }\n.leaflet-container.dark .leaflet-control-layers-separator {\n  border-top-color:rgba(255,255,255,0.10);\n  }\n.leaflet-container.dark .leaflet-bar a.leaflet-disabled,\n.leaflet-container.dark .leaflet-control .mapbox-button.disabled {\n  background-color:#252525;\n  color:#404040;\n  }\n.leaflet-container.dark .leaflet-control-mapbox-geocoder > div {\n  border-color:#202020;\n  border-color:rgba(0,0,0,0.75);\n  }\n  .leaflet-container.dark .leaflet-control .leaflet-control-mapbox-geocoder-results a {\n    border-color:#ddd #202020;\n    border-color:rgba(0,0,0,0.10) rgba(0,0,0,0.75);\n    }\n  .leaflet-container.dark .leaflet-control .leaflet-control-mapbox-geocoder-results span {\n    border-color:#202020;\n    border-color:rgba(0,0,0,0.75);\n    }\n\n/* Larger Screens\n------------------------------------------------------- */\n@media only screen and (max-width:800px) {\n.mapbox-modal-body {\n  width:83.3333%;\n  margin-left:8.3333%;\n  }\n}\n\n/* Smaller Screens\n------------------------------------------------------- */\n@media only screen and (max-width:640px) {\n.mapbox-modal-body {\n  width:100%;\n  height:100%;\n  margin:0;\n  }\n}\n\n/* Print\n------------------------------------------------------- */\n@media print { .mapbox-improve-map { display:none; } }\n\n/* Browser Fixes\n------------------------------------------------------- */\n/* VML support for IE8 */\n.leaflet-vml-shape { width:1px; height:1px; }\n.lvml { behavior:url(#default#VML); display:inline-block; position:absolute; }\n/* Map is broken in FF if you have max-width: 100% on tiles */\n.leaflet-container img.leaflet-tile { max-width:none !important; }\n/* Markers are broken in FF/IE if you have max-width: 100% on marker images */\n.leaflet-container img.leaflet-marker-icon { max-width:none; }\n/* Stupid Android 2 doesn't understand \"max-width: none\" properly */\n.leaflet-container img.leaflet-image-layer { max-width:15000px !important; }\n/* workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=888319 */\n.leaflet-overlay-pane svg { -moz-user-select:none; }\n/* Older IEs don't support the translateY property for display animation */\n.leaflet-oldie .mapbox-modal .mapbox-modal-content        { display:none; }\n.leaflet-oldie .mapbox-modal.active .mapbox-modal-content { display:block; }\n.map-tooltip { width:280px\\8; /* < IE9 */ }\n\n/* < IE8 */\n.leaflet-oldie .leaflet-control-zoom-in,\n.leaflet-oldie .leaflet-control-zoom-out,\n.leaflet-oldie .leaflet-popup-close-button,\n.leaflet-oldie .leaflet-control-layers-toggle,\n.leaflet-oldie .leaflet-container.dark .map-tooltip .close,\n.leaflet-oldie .map-tooltip .close,\n.leaflet-oldie .mapbox-icon {\n  background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAEECAYAAAA24SSRAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAXnSURBVHic7ZxfiFVFGMB/33pRUQsKto002DY3McJ6yBYkESQxpYTypaB66KEXYRWLYOlhr9RTRGWRUkk9RyEU+Y9ClECJVTKlPybWBilqkYuWrqBOD/NdPV7PmTPn3NPtat/AcO6ZP9/vfN/Mmfl2Zs6Kc452hK62UAxkIANdEURkVERGC9crOjKIiANwzkmRep1lOjWXa2ijaU7jaGWgKsL110a1EnV+LQMqbLqyobO6t4EMZCADGchABrqmQUlPNSWOVgaqIpi7ZSADGchABjKQga49kIjURaQem14apGE4KVR/D0fXds5FRaAOOL1e+h1dP7ZgE6wQxDnXvs7QWaZLE1wUVmRNdY1zrp6wRF0kfqHYnHwDGchABjJQIETNRyIyFVgBzAPmavIIsAt4xzn3d66QiNl1PnCYy05JczwMzG9pKlfIhQCkES/kwUKQqRma9GpM02xqGXdrBdCXZm2NzaFP66SGUGeYl5E+WqJO0HRHSG+PXtJN54AjVbhbjQcbBSjiakH4hR0p+hChOiHQrhKg7Drt6t7//Qtb9RAU5XtXMaiak28gAxnIQO0Gicg0EXlMRDaIyFGNGzRtWhQpMA/1A6uAL4BzZM9H57TMKqC/8HyUPFhZJLiMI4sh0/UDK4FtwHig3LiWWal1UkPsDDsFWAgsBZZo8hZgM7DdOXcmV0igjQ4Ba4HFwORAuclaZi1wqNU2OgNsVw22aNoS1XAhMCXx4OkubOBJZwKDwFbgLNm97qyWGQRmtuoFWRsV0ujabCPzVA1kIAMZqBNAIjIgImPNRxUzK+SsmtRJn4Pqmj8AjCXzsmTlaTSck/8zcDRX/QiNMp8S6Ab2a5nvG5plyioDaoLs1/sBYKwyUBokkTdQJeiVZgi6UR+UVQI0QWHdoXKFvKDYz7RiynXctk7LPlmeRmsKyAqWNQfSQAYykIGuS5CI1ERkSET2ishpvQ6JSLE93ByfoQbsRHeNgfe4vOO8E6iF6hdxToZU6OqGUIWv1vShqkB7VYNaU3pN0/fGgvLa6C5gk3PufJO5zwObgDuraqM8jbZWpdEnwG3AYKOX6XVQ07+sSqNQr3P4QxS9LXeGBGxIzTiGXwR8QSHRsCj7ZjxAbxFYaVAKbMe/BkrAduRpZJ6qgQxkoP8DKDRY1sk/s5W6YFhoUG3nFnZeOIJfxLgXWB7zBFmmyzPT44my9zXSC098OZCTwCQttzOZVzVoX1a5LHmdtYyWDM29yjknItKF3xSelFWvKo1mhCClQLo1sC95T8T/ebr+xrqOABVZT82tY56qgQxkIAN1CkhEulsGiUi3iCzKyJsjIpuBYyLyo4isFpHXReTuTFLAr1sOnAeeT8nbzNW+3rfAM2UcyAcSQj4FngR68Ot0F1NA24CuMqBu4PMUgYdS0hzwYqlFJ+AeNV3s30aLSoEUtjEScoHE3nkZ0Ay1fR7o3ZCcGNAEYHcO5A/g5pZACpsMPEf6UexTwCN5MvI6w2zgaeBt4HQK5BsC57ubY+jPll/wHzn1Ayc07QD+u6MR4GPn3LlA/SuCOZAGMpCBDFRhiF50EpFl+PP49wOzgIPAHmCLc+6zXAERE18P+b7DRqAnJCfvfF0P/mTgLZr0l97vB27CL3HO0rwTwBzn3PHCGiU0uQisA6bhzT0T/T4ZeAr4s6FZmal8WcI0LwETgdfwHzY1XKz3teyjibLLioLWa8UDeG/oZbxD+QHwdULwg1r+K71fXxQ0ohXfAgS/Mvyh5i1MgNZp2qt6P5ImL/QezdbrSeAG4EbVJJkH8LteJ+p1FikhBPpNr3Odc6fUNHdo2oJEucbX8Y2zDQeLgr7T62IReRb4AX9mGGC6Xo8Bu0VkOvCQpu1JlRZoo6Vc/WL2ad4C4A28CWvAR5TtdU0dwqH/ewHvHi8HbgUexh+euDRCFH6PVOh0/FKzw3um4M8zpA1DxwkMQzFjXR9+d/9N1WI8BZI71kU56Aq8HXgC+Ak/5o3gX+rUNmmO5nsbqP2gfwCyvJzPNoKXiAAAAABJRU5ErkJggg==');\n}\n.leaflet-oldie .mapbox-button-icon:before,\n.leaflet-oldie .leaflet-container.dark .leaflet-control-zoom-in,\n.leaflet-oldie .leaflet-container.dark .leaflet-control-zoom-out,\n.leaflet-oldie .leaflet-container.dark .leaflet-control-layers-toggle,\n.leaflet-oldie .leaflet-container.dark .mapbox-icon {\n  background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAEECAYAAAA24SSRAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAXYSURBVHic7ZxfiFVFHMc/a4uKWtDDtqJGZprYgwX5ByTdkkLbSgghCiKih14EBYtg6aEr9RRREKRUUs9hGEVtChKaYMkq2VqWmnUX2tKiNDNZY/Xbw/wue7x7zsw559626zY/GM6df7/P+c3MPfO7M3NumyTGQiaMCSWCIiiC6qVqoZC0lXgy1Cq0FanUck1XxVmSNL8WrzYT1LCMvz5qL1FnoAyoTNOVkpYb3hEUQREUQREUQRF0RYOqjHim9aHaTFDDEt2tCIqgCIqgCIqgCLoiQRULedNLgwCeq1NasbR8IilvqMhJpe5zrvpFQElYIYiksRsMLdd0aYoLwYqsqW5i9KjLLdHJj6AIiqAIiiCP5J2PpgLrgGXAYkvrA/YBrwF/BTXkmB2XSzqhbDlhZRqaypdLuuiB1ORiCOaDTM2wZLaFNMumZunzDYZ1wJy01ubyPfOazLE6qeIbDMsy0qsl6ngtWpyRfqOFInVKbWFXS9TxWtRXQl9mHR9oXwlQdp2xGt4t8YVt6iMor+/d8EM1OvkRFEERFEH/AWga8CCwFfjJwlZLm5ZHge/pPQ+4z8IKYGJGub+BT4GPLBwvCio7f6QeWfQ13TxgA7ATGPKUG7IyG6xOOj3nxDcFWAl0A/da2sdAL/AJcD6kwAc6bop6gT1kWzUZ6LKb6CbDqrx9dB535704S8BZ1o2zdEpSZ1HQ3MRddtmdp8kQzuKa9d8VBSUl9lEh0Pjro6ZKy00TERRBERRBLQZaCpxh9FHFUqBKiiJZ+n5gFfBHnrsKgUKb7t/j/PCwBNZwapKW1yGp3/KPSDrjKVsalIT0W3ypwZoGSoPU8pY2E/RCCqSiwJ55GdBVBusIlCu0Xpf3Na1guZbb1mnYJwtZtKmALm/Z6EBGUARFUASNV1A70AMcBP60aw9F93ADPkO7pD3mDwxKesOusvT2QP3czkmPKd2YUNpucVl+LlBo4jsITAduAIbrmnMAOAncnqflQn10M26JebgufdjSb8oDyQM6hlv3ru/4dkv/vFmgd4EZwPoErN3iM4BdeUGNjDpJqsrtmzc86mqwHkkH5X4t7JD0tEFyw3INzYwwuwisEVA9bPe/CarBdocsip5qBEVQBP3fQRWyX4jOCpUsZS2xhR2SQdwixq3A2lDhMkcTa7Ie2G6fwzfsmax8clrSJCu3py4vVV/ZphsALtjnFXkqtNwyWlLqR1Ub7obPA5OyKjXLolk+SFmQgEN18eD/PLXEI2j8gYqspwbrRE81giIogiKohUAdzQB1APdk5C3Ends6CXwLbAReBm7J1OZxINdKGpb0VEpeb4pT+aWkx8os0SxJKHlf0iOSOiXNkHQpBbRT0oQyoA5JH6YoPJ6SJknPeHR5+6gTWJ2SPjej/BceXV7QV8AHvsoJucTlvt5o8ZkraZa1fUheD+gJfo9+Bq4JlPkNt4Xgl9CdSJos6UlJF1IsOSvp/hw6vL8mFgCLgCXA44w+730IeIiM89314gP9ACzHHXD9xdIO49476gO2MfJjLCjRgYygCIqgCGqiFFl0WoM7j78ImA8cBQ7gzuaHp/wck1anpO2BqXy7lSu9I9YJ9APXWfycxfuBa4HbzDpwc9ZC4FQZi2qWXJK0WdI0ue3SuRp5P/lRSb8nLCvsQK5JNM2zkiZKeknSkKVdlPSmlX0gUXZNUdAWq3hY7tzj83K++FuS9icU32Hl91p8S1FQn1V8VVKb3Mrw25a3MgHabGkvWrwvTZ/ve7TArqeBq3H+3f66PIBf7VrzkuaTIj7Qj3ZdDJwF9jLy5wJdiXK1t+NrZxuOFgV9bddVwBPAN8ARS5tp15PAZxa/29IOpGrz9FG3Rsscy+uS9IqkBXLD/Z1GRl1yQEjuHANy7vFaSdMlrZa0K1Gm1PcISTMlDZiSbZa2I8VSSTolz2Mo9PQeBO7CvTE1iDtRc2dKuffwPX4CfVQfrpf0sKRjks5Zs27J6pP6EH3vCBp70D8db2VXFPfIagAAAABJRU5ErkJggg==');\n}\n\n.leaflet-oldie .mapbox-logo-true {\n  background-image: none;\n}\n", ""]);

	// exports


/***/ },
/* 41 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAIICAMAAAAWgT0mAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABgUExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPpP6I0AAAAfdFJOUwDYoAgNNvSA4/u3mcTrUb5VQCByjBcoRwJMrs9nfF29SYbmAAAFH0lEQVR42u2c55qrIBCGY8HeYkliC/d/l0cRlRjFgbO7z5b5fiV5fAUGhHEYcrmgUKhfpIDSQBmig/44FNAXBeAyRH0epFU97Nz/fzRQKBQKhUKhvrnv/0t9WBQKhUKhUKhvLdfd/yxlKHX3Pp9B85XCRzClwCwXKzH8ckVmolQZTrmXz4d0qqdjCB2T63Su1jDSGrBajwYKhUKhUEoibmo4jpG6BIwkxhqfMhIQkkevYa0oP2eu8TaAFl9PGZ++yT+h8pjuKJbXcG3P/XK5r+2S2u01FLh+k9nQOIIMSZ8K7XipHqXkzGHb07EPkh5DKaRJ2+odN8qhR4agzsdCxjFkgAyxgVKQyTeQC+rcDUQ+dhjpDVitR0PvIdR63PUmFr0pTG+y1JyWUSgUCgXW46FKVM8mjptnpeBg9xFfpfyoh8zmdhJ6r0uNFya2jLgVqb+3fPppcTuEqEQfC+VF4OwBTlBI11CrfjdEbQEsuNpDaoFdy5/ZevanyvtuTax7acis5wTdps15x6xzZnKjvPICrWtpwPvJabo87xoH+wn76Rv3EwqFQqG+SnakmJm4pWSXua+RrJWCMRtKAr3HKZ9qEGMyHwaJ3xdGAWKM/4xUoInJmDWg0MwwGwKhlRkpGCQyAwWC7itztrm9QmPjOXO2jS5Uz4543U7HuHiBfb+oQ7Lffhqk9HKnDbmqew3HFOZIoFAo1N8Q6RvPa3qVrTHbnBcLExyOIEK0xAMWZo9MWFdVHY4UrKyhbh7fgbwOvAmq3HD7ZdfyKt/8XdQPdVu/DTXsAVBDab1+qyltANDQDCFGXg0N1IFineq1OoYIP8vk2841NIYR1MMhno5ftD4ahoo3NT6EcRsS7pJp5RR/f0rZtXS13FFM80WhUChQkEA6x2olMn7dbvj7pW2fXJNQDSpY5kKmBHG/UgnybQ2I+TjPVs0QzKs0FK1nir/9BmjjDitDlk5JNx2o/tP99Fsg9xgCT7EChG4sCoVC/VjZJLudpsVaL4FNqxz3dOPnxXqaknyyOhIoq53PUTi0k5RUUoEq10WnzLJjKKXUu88Framxvp9aspLGtaxaQn3L+R1Zilw93ThIHtxH5pJmyVlzYoPTNqYASbOKM2Ls5vhK+yqgu5mC8mBsv/9GIw/72t4u1J0EEfeO/fhn2dW5+d6q06C5G72V5Z/mMpL3vGpApDjbUi0oy7J5aZUDTLTMhGbFoIj04yoeZfLOyyGu2Yp180vIvsYtFMzgmNC80aorm9aJjQCWm4pCoVCor9CDlNO51JJAj05ZhbhAFaA5PdmeUwAcnHU18sLMPZfFBJXjt2FHKtKVLaAsfpC6XZfnzjk7SG0xG/j9aOfqnpHRcDk7Zu4d27Bgdx33wztvWakn16w47NOYt7pa/nvUsPnZ6viol5mDPKY3NOPivhrOlJ1DL3k9MpZPcY9np5el7JbHvjzbdh/s/Lywvfrp+012tt6YQtcPZ3Impz4b8IcvOfLuTJ7xjZ9VT+cz7Lbs/wLiqQ3VdFvLmb1/IoMifmePxdevS6Q9k53IN/kwG6xlz066ObvrqcyXj8f6jbdt5iY9PJnJp0P77a1mzm4zF9TJ/2Sg5e9YrJtIS33zMY/iw2G0ZGvT6eQSGXvLnsZhcTwLeetrDHdF8+nlSPJoXBJ/fo2xfaMgpJj9benkUsx1SVSmlpIP0lDpFWV8jb4trYMGVAdT26sdYZPlYMNC+FMI4LTM3vN6M4qVFgAU6iv0D5QnfMaZoP9/AAAAAElFTkSuQmCC"

/***/ },
/* 43 */
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
		var sourceMap = obj.sourceMap;

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
		var media = obj.media;
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


/***/ },
/* 44 */
/***/ function(module, exports) {

	
	L.LineUtil.PolylineDecorator = {
	    computeAngle: function(a, b) {
	        return (Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI) + 90;
	    },

	    getPointPathPixelLength: function(pts) {
	        var nbPts = pts.length;
	        if(nbPts < 2) {
	            return 0;
	        }
	        var dist = 0,
	            prevPt = pts[0],
	            pt;
	        for(var i=1; i<nbPts; i++) {
	            dist += prevPt.distanceTo(pt = pts[i]);
	            prevPt = pt;
	        } 
	        return dist;
	    },

	    getPixelLength: function(pl, map) {
	        var ll = (pl instanceof L.Polyline) ? pl.getLatLngs() : pl,
	            nbPts = ll.length;
	        if(nbPts < 2) {
	            return 0;
	        }
	        var dist = 0,
	            prevPt = map.project(ll[0]), pt; 
	        for(var i=1; i<nbPts; i++) {
	            dist += prevPt.distanceTo(pt = map.project(ll[i]));
	            prevPt = pt;
	        } 
	        return dist;
	    },

	    /**
	    * path: array of L.LatLng
	    * offsetRatio: the ratio of the total pixel length where the pattern will start
	    * endOffsetRatio: the ratio of the total pixel length where the pattern will end
	    * repeatRatio: the ratio of the total pixel length between two points of the pattern 
	    * map: the map, to access the current projection state
	    */
	    projectPatternOnPath: function (path, offsetRatio, endOffsetRatio, repeatRatio, map) {
	        var pathAsPoints = [], i;

	        for(i=0, l=path.length; i<l; i++) {
	            pathAsPoints[i] = map.project(path[i]);
	        }
	        // project the pattern as pixel points
	        var pattern = this.projectPatternOnPointPath(pathAsPoints, offsetRatio, endOffsetRatio, repeatRatio);
	        // and convert it to latlngs;
	        for(i=0, l=pattern.length; i<l; i++) {
	            pattern[i].latLng = map.unproject(pattern[i].pt);
	        }        
	        return pattern;
	    },
	    
	    projectPatternOnPointPath: function (pts, offsetRatio, endOffsetRatio, repeatRatio) {
	        var positions = [];
	        // 1. compute the absolute interval length in pixels
	        var repeatIntervalLength = this.getPointPathPixelLength(pts) * repeatRatio;
	        // 2. find the starting point by using the offsetRatio and find the last pixel using endOffsetRatio
	        var previous = this.interpolateOnPointPath(pts, offsetRatio);
	        var endOffsetPixels = endOffsetRatio > 0 ? this.getPointPathPixelLength(pts) * endOffsetRatio : 0;
	        
	        positions.push(previous);
	        if(repeatRatio > 0) {
	            // 3. consider only the rest of the path, starting at the previous point
	            var remainingPath = pts;
	            remainingPath = remainingPath.slice(previous.predecessor);
	            
	            remainingPath[0] = previous.pt;
	            var remainingLength = this.getPointPathPixelLength(remainingPath);
	            
	            // 4. project as a ratio of the remaining length,
	            // and repeat while there is room for another point of the pattern

	            while(repeatIntervalLength <= remainingLength-endOffsetPixels) {
	                previous = this.interpolateOnPointPath(remainingPath, repeatIntervalLength/remainingLength);
	                positions.push(previous);
	                remainingPath = remainingPath.slice(previous.predecessor);
	                remainingPath[0] = previous.pt;
	                remainingLength = this.getPointPathPixelLength(remainingPath);
	            }
	        }
	        return positions;
	    },

	    /**
	    * pts: array of L.Point
	    * ratio: the ratio of the total length where the point should be computed
	    * Returns null if ll has less than 2 LatLng, or an object with the following properties:
	    *    latLng: the LatLng of the interpolated point
	    *    predecessor: the index of the previous vertex on the path
	    *    heading: the heading of the path at this point, in degrees
	    */
	    interpolateOnPointPath: function (pts, ratio) {
	        var nbVertices = pts.length;

	        if (nbVertices < 2) {
	            return null;
	        }
	        // easy limit cases: ratio negative/zero => first vertex
	        if (ratio <= 0) {
	            return {
	                pt: pts[0],
	                predecessor: 0,
	                heading: this.computeAngle(pts[0], pts[1])
	            };
	        }
	        // ratio >=1 => last vertex
	        if (ratio >= 1) {
	            return {
	                pt: pts[nbVertices - 1],
	                predecessor: nbVertices - 1,
	                heading: this.computeAngle(pts[nbVertices - 2], pts[nbVertices - 1])
	            };
	        }
	        // 1-segment-only path => direct linear interpolation
	        if (nbVertices == 2) {
	            return {
	                pt: this.interpolateBetweenPoints(pts[0], pts[1], ratio),
	                predecessor: 0,
	                heading: this.computeAngle(pts[0], pts[1])
	            };
	        }
	            
	        var pathLength = this.getPointPathPixelLength(pts);
	        var a = pts[0], b = a,
	            ratioA = 0, ratioB = 0,
	            distB = 0;
	        // follow the path segments until we find the one
	        // on which the point must lie => [ab] 
	        var i = 1;
	        for (; i < nbVertices && ratioB < ratio; i++) {
	            a = b;
	            ratioA = ratioB;
	            b = pts[i];
	            distB += a.distanceTo(b);
	            ratioB = distB / pathLength;
	        }

	        // compute the ratio relative to the segment [ab]
	        var segmentRatio = (ratio - ratioA) / (ratioB - ratioA);

	        return {
	            pt: this.interpolateBetweenPoints(a, b, segmentRatio),
	            predecessor: i-2,
	            heading: this.computeAngle(a, b)
	        };
	    },
	    
	    /**
	    * Finds the point which lies on the segment defined by points A and B,
	    * at the given ratio of the distance from A to B, by linear interpolation. 
	    */
	    interpolateBetweenPoints: function (ptA, ptB, ratio) {
	        if(ptB.x != ptA.x) {
	            return new L.Point(
	                (ptA.x * (1 - ratio)) + (ratio * ptB.x),
	                (ptA.y * (1 - ratio)) + (ratio * ptB.y)
	            );
	        }
	        // special case where points lie on the same vertical axis
	        return new L.Point(ptA.x, ptA.y + (ptB.y - ptA.y) * ratio);
	    }
	};

	L.PolylineDecorator = L.LayerGroup.extend({
	    options: {
	        patterns: []
	    },

	    initialize: function(paths, options) {
	        L.LayerGroup.prototype.initialize.call(this);
	        L.Util.setOptions(this, options);
	        this._map = null;
	        this._initPaths(paths);
	        this._initPatterns();
	    },

	    /**
	    * Deals with all the different cases. p can be one of these types:
	    * array of LatLng, array of 2-number arrays, Polyline, Polygon,
	    * array of one of the previous.
	    */
	    _initPaths: function(p) {
	        this._paths = [];
	        var isPolygon = false;
	        if(p instanceof L.Polyline) {
	            this._initPath(p.getLatLngs(), (p instanceof L.Polygon));
	        } else if(L.Util.isArray(p) && p.length > 0) {
	            if(p[0] instanceof L.Polyline) {
	                for(var i=0; i<p.length; i++) {
	                    this._initPath(p[i].getLatLngs(), (p[i] instanceof L.Polygon));
	                }
	            } else {
	                this._initPath(p);
	            }
	        }
	    },

	    _isCoordArray: function(ll) {
	        return(L.Util.isArray(ll) && ll.length > 0 && (
	            ll[0] instanceof L.LatLng ||
	            (L.Util.isArray(ll[0]) && ll[0].length == 2 && typeof ll[0][0] === 'number')
	        ));
	    },

	    _initPath: function(path, isPolygon) {
	        var latLngs;
	        // It may still be an array of array of coordinates
	        // (ex: polygon with rings)
	        if(this._isCoordArray(path)) {
	            latLngs = [path];
	        } else {
	            latLngs = path;
	        }
	        for(var i=0; i<latLngs.length; i++) {
	            // As of Leaflet >= v0.6, last polygon vertex (=first) isn't repeated.
	            // Our algorithm needs it, so we add it back explicitly.
	            if(isPolygon) {
	                latLngs[i].push(latLngs[i][0]);
	            }
	            this._paths.push(latLngs[i]);
	        }
	    },

	    _initPatterns: function() {
	        this._isZoomDependant = false;
	        this._patterns = [];
	        var pattern;
	        // parse pattern definitions and precompute some values
	        for(var i=0;i<this.options.patterns.length;i++) {
	            pattern = this._parsePatternDef(this.options.patterns[i]);
	            this._patterns.push(pattern);
	            // determines if we have to recompute the pattern on each zoom change
	            this._isZoomDependant = this._isZoomDependant ||
	                pattern.isOffsetInPixels ||
	                pattern.isEndOffsetInPixels ||
	                pattern.isRepeatInPixels ||
	                pattern.symbolFactory.isZoomDependant;
	        }
	    },

	    /**
	    * Changes the patterns used by this decorator
	    * and redraws the new one.
	    */
	    setPatterns: function(patterns) {
	        this.options.patterns = patterns;
	        this._initPatterns();
	        this._softRedraw();
	    },

	    /**
	    * Changes the patterns used by this decorator
	    * and redraws the new one.
	    */
	    setPaths: function(paths) {
	        this._initPaths(paths);
	        this.redraw();
	    },

	    /**
	    * Parse the pattern definition
	    */
	    _parsePatternDef: function(patternDef, latLngs) {
	        var pattern = {
	            cache: [],
	            symbolFactory: patternDef.symbol,
	            isOffsetInPixels: false,
	            isEndOffsetInPixels: false,
	            isRepeatInPixels: false
	        };

	        // Parse offset and repeat values, managing the two cases:
	        // absolute (in pixels) or relative (in percentage of the polyline length)
	        if(typeof patternDef.offset === 'string' && patternDef.offset.indexOf('%') != -1) {
	            pattern.offset = parseFloat(patternDef.offset) / 100;
	        } else {
	            pattern.offset = patternDef.offset ? parseFloat(patternDef.offset) : 0;
	            pattern.isOffsetInPixels = (pattern.offset > 0);
	        }

	        if(typeof patternDef.endOffset === 'string' && patternDef.endOffset.indexOf('%') != -1) {
	            pattern.endOffset = parseFloat(patternDef.endOffset) / 100;
	        } else {
	            pattern.endOffset = patternDef.endOffset ? parseFloat(patternDef.endOffset) : 0;
	            pattern.isEndOffsetInPixels = (pattern.endOffset > 0);
	        }

	        if(typeof patternDef.repeat === 'string' && patternDef.repeat.indexOf('%') != -1) {
	            pattern.repeat = parseFloat(patternDef.repeat) / 100;
	        } else {
	            pattern.repeat = parseFloat(patternDef.repeat);
	            pattern.isRepeatInPixels = (pattern.repeat > 0);
	        }

	        return(pattern);
	    },

	    onAdd: function (map) {
	        this._map = map;
	        this._draw();
	        // listen to zoom changes to redraw pixel-spaced patterns
	        if(this._isZoomDependant) {
	            this._map.on('zoomend', this._softRedraw, this);
	        }
	    },

	    onRemove: function (map) {
	        // remove optional map zoom listener
	        this._map.off('zoomend', this._softRedraw, this);
	        this._map = null;
	        L.LayerGroup.prototype.onRemove.call(this, map);
	    },

	    /**
	    * Returns an array of ILayers object
	    */
	    _buildSymbols: function(latLngs, symbolFactory, directionPoints) {
	        var symbols = [];
	        for(var i=0, l=directionPoints.length; i<l; i++) {
	            symbols.push(symbolFactory.buildSymbol(directionPoints[i], latLngs, this._map, i, l));
	        }
	        return symbols;
	    },

	    _getCache: function(pattern, zoom, pathIndex) {
	        var zoomCache = pattern.cache[zoom];
	        if(typeof zoomCache === 'undefined') {
	            pattern.cache[zoom] = [];
	            return null;
	        }
	        return zoomCache[pathIndex];
	    },

	    /**
	    * Select pairs of LatLng and heading angle,
	    * that define positions and directions of the symbols
	    * on the path
	    */
	    _getDirectionPoints: function(pathIndex, pattern) {
	        var zoom = this._map.getZoom();
	        var dirPoints = this._getCache(pattern, zoom, pathIndex);
	        if(dirPoints) {
	            return dirPoints;
	        }

	        var offset, endOffset, repeat, pathPixelLength = null, latLngs = this._paths[pathIndex];
	        if(pattern.isOffsetInPixels) {
	            pathPixelLength =  L.LineUtil.PolylineDecorator.getPixelLength(latLngs, this._map);
	            offset = pattern.offset/pathPixelLength;
	        } else {
	            offset = pattern.offset;
	        }
	        if(pattern.isEndOffsetInPixels) {
	            pathPixelLength = (pathPixelLength !== null) ? pathPixelLength : L.LineUtil.PolylineDecorator.getPixelLength(latLngs, this._map);
	            endOffset = pattern.endOffset/pathPixelLength;
	        } else {
	            endOffset = pattern.endOffset;
	        }
	        if(pattern.isRepeatInPixels) {
	            pathPixelLength = (pathPixelLength !== null) ? pathPixelLength : L.LineUtil.PolylineDecorator.getPixelLength(latLngs, this._map);
	            repeat = pattern.repeat/pathPixelLength;
	        } else {
	            repeat = pattern.repeat;
	        }
	        dirPoints = L.LineUtil.PolylineDecorator.projectPatternOnPath(latLngs, offset, endOffset, repeat, this._map);
	        // save in cache to avoid recomputing this
	        pattern.cache[zoom][pathIndex] = dirPoints;

	        return dirPoints;
	    },

	    /**
	    * Public redraw, invalidating the cache.
	    */
	    redraw: function() {
	        this._redraw(true);
	    },

	    /**
	    * "Soft" redraw, called internally for example on zoom changes,
	    * keeping the cache.
	    */
	    _softRedraw: function() {
	        this._redraw(false);
	    },

	    _redraw: function(clearCache) {
	        if(this._map === null)
	            return;
	        this.clearLayers();
	        if(clearCache) {
	            for(var i=0; i<this._patterns.length; i++) {
	                this._patterns[i].cache = [];
	            }
	        }
	        this._draw();
	    },

	    /**
	    * Draw a single pattern
	    */
	    _drawPattern: function(pattern) {
	        var directionPoints, symbols;
	        for(var i=0; i < this._paths.length; i++) {
	            directionPoints = this._getDirectionPoints(i, pattern);
	            symbols = this._buildSymbols(this._paths[i], pattern.symbolFactory, directionPoints);
	            for(var j=0; j < symbols.length; j++) {
	                this.addLayer(symbols[j]);
	            }
	        }
	    },

	    /**
	    * Draw all patterns
	    */
	    _draw: function () {
	        for(var i=0; i<this._patterns.length; i++) {
	            this._drawPattern(this._patterns[i]);
	        }
	    }
	});
	/*
	 * Allows compact syntax to be used
	 */
	L.polylineDecorator = function (paths, options) {
	    return new L.PolylineDecorator(paths, options);
	};

	L.RotatedMarker = L.Marker.extend({
	    options: {
	        angle: 0
	    },

	    statics: {
	        TRANSFORM_ORIGIN: L.DomUtil.testProp(
	            ['transformOrigin', 'WebkitTransformOrigin', 'OTransformOrigin', 'MozTransformOrigin', 'msTransformOrigin'])
	    },

	    _initIcon: function() {
	        L.Marker.prototype._initIcon.call(this);

	        this._icon.style[L.RotatedMarker.TRANSFORM_ORIGIN] = '50% 50%';
	    },

	    _setPos: function (pos) {
	        L.Marker.prototype._setPos.call(this, pos);

	        if (L.DomUtil.TRANSFORM) {
	            // use the CSS transform rule if available
	            this._icon.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.angle + 'deg)';
	        } else if(L.Browser.ie) {
	            // fallback for IE6, IE7, IE8
	            var rad = this.options.angle * (Math.PI / 180),
	                costheta = Math.cos(rad),
	                sintheta = Math.sin(rad);
	            this._icon.style.filter += ' progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'auto expand\', M11=' +
	                costheta + ', M12=' + (-sintheta) + ', M21=' + sintheta + ', M22=' + costheta + ')';
	        }
	    },

	    setAngle: function (ang) {
	        this.options.angle = ang;
	    }
	});

	L.rotatedMarker = function (pos, options) {
	    return new L.RotatedMarker(pos, options);
	};

	/**
	* Defines several classes of symbol factories,
	* to be used with L.PolylineDecorator
	*/

	L.Symbol = L.Symbol || {};

	/**
	* A simple dash symbol, drawn as a Polyline.
	* Can also be used for dots, if 'pixelSize' option is given the 0 value.
	*/
	L.Symbol.Dash = L.Class.extend({
	    isZoomDependant: true,
	    
	    options: {
	        pixelSize: 10,
	        pathOptions: { }
	    },
	    
	    initialize: function (options) {
	        L.Util.setOptions(this, options);
	        this.options.pathOptions.clickable = false;
	    },

	    buildSymbol: function(dirPoint, latLngs, map, index, total) {
	        var opts = this.options,
	            d2r = Math.PI / 180;
	        
	        // for a dot, nothing more to compute
	        if(opts.pixelSize <= 1) {
	            return new L.Polyline([dirPoint.latLng, dirPoint.latLng], opts.pathOptions);
	        }
	        
	        var midPoint = map.project(dirPoint.latLng);
	        var angle = (-(dirPoint.heading - 90)) * d2r;
	        var a = new L.Point(
	                midPoint.x + opts.pixelSize * Math.cos(angle + Math.PI) / 2,
	                midPoint.y + opts.pixelSize * Math.sin(angle) / 2
	            );
	        // compute second point by central symmetry to avoid unecessary cos/sin
	        var b = midPoint.add(midPoint.subtract(a));
	        return new L.Polyline([map.unproject(a), map.unproject(b)], opts.pathOptions);
	    }
	});

	L.Symbol.dash = function (options) {
	    return new L.Symbol.Dash(options);
	};

	L.Symbol.ArrowHead = L.Class.extend({
	    isZoomDependant: true,
	    
	    options: {
	        polygon: true,
	        pixelSize: 10,
	        headAngle: 60,
	        pathOptions: {
	            stroke: false,
	            weight: 2
	        }
	    },
	    
	    initialize: function (options) {
	        L.Util.setOptions(this, options);
	        this.options.pathOptions.clickable = false;
	    },

	    buildSymbol: function(dirPoint, latLngs, map, index, total) {
	        var opts = this.options;
	        var path;
	        if(opts.polygon) {
	            path = new L.Polygon(this._buildArrowPath(dirPoint, map), opts.pathOptions);
	        } else {
	            path = new L.Polyline(this._buildArrowPath(dirPoint, map), opts.pathOptions);
	        }
	        return path;
	    },
	    
	    _buildArrowPath: function (dirPoint, map) {
	        var d2r = Math.PI / 180;
	        var tipPoint = map.project(dirPoint.latLng);
	        var direction = (-(dirPoint.heading - 90)) * d2r;
	        var radianArrowAngle = this.options.headAngle / 2 * d2r;
	        
	        var headAngle1 = direction + radianArrowAngle,
	            headAngle2 = direction - radianArrowAngle;
	        var arrowHead1 = new L.Point(
	                tipPoint.x - this.options.pixelSize * Math.cos(headAngle1),
	                tipPoint.y + this.options.pixelSize * Math.sin(headAngle1)),
	            arrowHead2 = new L.Point(
	                tipPoint.x - this.options.pixelSize * Math.cos(headAngle2),
	                tipPoint.y + this.options.pixelSize * Math.sin(headAngle2));

	        return [
	            map.unproject(arrowHead1),
	            dirPoint.latLng,
	            map.unproject(arrowHead2)
	        ];
	    }
	});

	L.Symbol.arrowHead = function (options) {
	    return new L.Symbol.ArrowHead(options);
	};

	L.Symbol.Marker = L.Class.extend({
	    isZoomDependant: false,

	    options: {
	        markerOptions: { },
	        rotate: false
	    },
	    
	    initialize: function (options) {
	        L.Util.setOptions(this, options);
	        this.options.markerOptions.clickable = false;
	        this.options.markerOptions.draggable = false;
	        this.isZoomDependant = (L.Browser.ie && this.options.rotate);
	    },

	    buildSymbol: function(directionPoint, latLngs, map, index, total) {
	        if(!this.options.rotate) {
	            return new L.Marker(directionPoint.latLng, this.options.markerOptions);
	        }
	        else {
	            this.options.markerOptions.angle = directionPoint.heading + (this.options.angleCorrection || 0);
	            return new L.RotatedMarker(directionPoint.latLng, this.options.markerOptions);
	        }
	    }
	});

	L.Symbol.marker = function (options) {
	    return new L.Symbol.Marker(options);
	};




/***/ }
/******/ ])
});
;