window["MNModule"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

module.exports = _taggedTemplateLiteral;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * cuid.js
 * Collision-resistant UID generator for browsers and node.
 * Sequential for fast db lookups and recency sorting.
 * Safe for element IDs and server-side lookups.
 *
 * Extracted from CLCTR
 *
 * Copyright (c) Eric Elliott 2012
 * MIT License
 */

/*global window, navigator, document, require, process, module */
(function (app) {
  'use strict';
  var namespace = 'cuid',
    c = 0,
    blockSize = 4,
    base = 36,
    discreteValues = Math.pow(base, blockSize),

    pad = function pad(num, size) {
      var s = "000000000" + num;
      return s.substr(s.length-size);
    },

    randomBlock = function randomBlock() {
      return pad((Math.random() *
            discreteValues << 0)
            .toString(base), blockSize);
    },

    safeCounter = function () {
      c = (c < discreteValues) ? c : 0;
      c++; // this is not subliminal
      return c - 1;
    },

    api = function cuid() {
      // Starting with a lowercase letter makes
      // it HTML element ID friendly.
      var letter = 'c', // hard-coded allows for sequential access

        // timestamp
        // warning: this exposes the exact date and time
        // that the uid was created.
        timestamp = (new Date().getTime()).toString(base),

        // Prevent same-machine collisions.
        counter,

        // A few chars to generate distinct ids for different
        // clients (so different computers are far less
        // likely to generate the same id)
        fingerprint = api.fingerprint(),

        // Grab some more chars from Math.random()
        random = randomBlock() + randomBlock();

        counter = pad(safeCounter().toString(base), blockSize);

      return  (letter + timestamp + counter + fingerprint + random);
    };

  api.slug = function slug() {
    var date = new Date().getTime().toString(36),
      counter,
      print = api.fingerprint().slice(0,1) +
        api.fingerprint().slice(-1),
      random = randomBlock().slice(-2);

      counter = safeCounter().toString(36).slice(-4);

    return date.slice(-2) +
      counter + print + random;
  };

  api.globalCount = function globalCount() {
    // We want to cache the results of this
    var cache = (function calc() {
        var i,
          count = 0;

        for (i in window) {
          count++;
        }

        return count;
      }());

    api.globalCount = function () { return cache; };
    return cache;
  };

  api.fingerprint = function browserPrint() {
    return pad((navigator.mimeTypes.length +
      navigator.userAgent.length).toString(36) +
      api.globalCount().toString(36), 4);
  };

  // don't change anything from here down.
  if (app.register) {
    app.register(namespace, api);
  } else if (true) {
    module.exports = api;
  } else {}

}(this.applitude || this));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./src/css/module-notification.css
var module_notification = __webpack_require__(4);

// EXTERNAL MODULE: ./src/css/animations/fade.css
var fade = __webpack_require__(5);

// EXTERNAL MODULE: ./src/css/animations/swing.css
var swing = __webpack_require__(6);

// EXTERNAL MODULE: ./src/css/animations/rotate.css
var rotate = __webpack_require__(7);

// EXTERNAL MODULE: ./src/css/animations/slide.css
var slide = __webpack_require__(8);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/defineProperty.js
var defineProperty = __webpack_require__(0);
var defineProperty_default = /*#__PURE__*/__webpack_require__.n(defineProperty);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/taggedTemplateLiteral.js
var taggedTemplateLiteral = __webpack_require__(1);
var taggedTemplateLiteral_default = /*#__PURE__*/__webpack_require__.n(taggedTemplateLiteral);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/typeof.js
var helpers_typeof = __webpack_require__(2);
var typeof_default = /*#__PURE__*/__webpack_require__.n(helpers_typeof);

// EXTERNAL MODULE: ./node_modules/cuid/dist/browser-cuid.js
var browser_cuid = __webpack_require__(3);
var browser_cuid_default = /*#__PURE__*/__webpack_require__.n(browser_cuid);

// CONCATENATED MODULE: ./src/js/utils/utils.js



function _templateObject2() {
  var data = taggedTemplateLiteral_default()(["<div id='{{id}}'>{{content}}</div>"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = taggedTemplateLiteral_default()(["\n  <div\n    class=\"mn-notification\"\n    id='{{id}}'\n  >\n    <div class=\"mn-alert mn-alert-{{type}} mn-alert-dismissible\">\n      <button\n        type='button'\n        class='mn-close-btn mn-close'>\n        <span aria-hidden='true'>&times;</span>\n      </button>\n      <div class='mn-notification-container__content'>\n        <i class=\"mn-icon mn-icon-{{type}}\"></i>\n        <span><strong>{{title}}</strong> {{message}}</span>\n      </div>\n    </div>\n  </div>"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}


var utils_generateId = function generateId() {
  return browser_cuid_default()();
};
/* extends default config and returns extended one */

var extendDefaults = function extendDefaults(source, properties) {
  var property;

  for (property in properties) {
    if (properties.hasOwnProperty(property)) {
      source[property] = properties[property];
    }
  }

  return source;
};
/* return options if specified or default options otherwise */

var utils_applyArgs = function applyArgs(argum, defaults) {
  if (argum && typeof_default()(argum) === 'object') {
    return extendDefaults(defaults, argum);
  } else {
    return defaults;
  }
};

var replace = function replace(str, find, by) {
  return str.replace(new RegExp(find, 'g'), by);
};

var templater = function templater(_ref) {
  var id = _ref.id,
      _ref$title = _ref.title,
      title = _ref$title === void 0 ? '' : _ref$title,
      _ref$message = _ref.message,
      message = _ref$message === void 0 ? '' : _ref$message,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? '' : _ref$type,
      _ref$content = _ref.content,
      content = _ref$content === void 0 ? '' : _ref$content;
  return function (t) {
    var str = t ? t[0] : '';
    var replacer = [{
      find: '{{id}}',
      by: id
    }, {
      find: '{{title}}',
      by: title
    }, {
      find: '{{message}}',
      by: message
    }, {
      find: '{{type}}',
      by: type
    }, {
      find: '{{content}}',
      by: content
    }];
    replacer.forEach(function (_ref2) {
      var find = _ref2.find,
          by = _ref2.by;
      str = replace(str, find, by);
    });
    return str;
  };
};
var getDefaultTemplate = function getDefaultTemplate(id, title, message, type) {
  return templater({
    id: id,
    title: title,
    message: message,
    type: type
  })(_templateObject());
};
var getCustomTemplate = function getCustomTemplate(id, content) {
  return templater({
    id: id,
    content: content
  })(_templateObject2());
};
var getCloseButtonSelector = function getCloseButtonSelector(id) {
  return "#".concat(id, " .mn-close-btn");
};
// CONCATENATED MODULE: ./src/js/mn-group.js

/**
 * @constructs MNGroup - Private class of the group
 * @param {Object} groupOptions - Options of the new group
 */

function MNGroup(groupOptions) {
  var _defaultOptions = {
    name: 'common',
    greedy: false
  };
  this.options = utils_applyArgs(groupOptions, _defaultOptions);
  this._notifications = new Map();
}

MNGroup.prototype._getId = function () {
  return this.options.name;
};
/**
 * Pushes new notification to the group
 * @param {Object} notif - Instance of the notification
 */


MNGroup.prototype.addNotification = function (notification) {
  this._notifications.set(notification.id, notification);
};
/**
 * Detects if group has a notification with id
 * @param {String} id - Id of the notification
 * @returns Index of the notification in the array
 */


MNGroup.prototype.hasNotification = function (id) {
  return this._notifications.has(id);
};

MNGroup.prototype.removeNotification = function (id) {
  this._notifications.delete(id);
};

MNGroup.prototype.getNotifications = function () {
  return this._notifications;
};

MNGroup.prototype.getLength = function () {
  return this._notifications.size;
};

MNGroup.prototype.isEmpty = function () {
  return this._notifications.size === 0;
};
// CONCATENATED MODULE: ./src/js/utils/domUtils.js
var getElement = function getElement(query) {
  return document.querySelector("".concat(query));
};
var getElementById = function getElementById(id) {
  return getElement("#".concat(id));
};
var removeClass = function removeClass(el, className) {
  if (el) {
    el.classList.remove(className);
  }
};
var addClass = function addClass(el, className) {
  if (el) {
    el.className = "".concat(el.className, " ").concat(className);
  }
};
var getElementFromHtmlString = function getElementFromHtmlString(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
};
var appendElementToContainer = function appendElementToContainer(container, element) {
  if (!container || !element) return;

  if (typeof element === 'string') {
    container.insertAdjacentHTML('beforeend', element);
  } else {
    container.append(element);
  }
};
var prependElementToContainer = function prependElementToContainer(container, element) {
  if (!container || !element) return;

  if (typeof element === 'string') {
    container.insertAdjacentHTML('afterbegin', element);
  } else {
    container.prepend(element);
  }
};
var removeElement = function removeElement(element) {
  element.parentNode.removeChild(element);
};
var removeElementById = function removeElementById(id) {
  var el = getElementById(id);

  if (el) {
    removeElement(el);
  }
};
var addOnClick = function addOnClick(query, cb) {
  var element = getElement(query);

  if (element) {
    element.addEventListener('click', cb, false);
  }
};
// CONCATENATED MODULE: ./src/js/const/icon.js
var ICONS = {
  INFO: 'info'
};
// CONCATENATED MODULE: ./src/js/const/add-element-mode.js
var ADD_ELEMENT_MODE = {
  PUSH: 'push',
  UNSHIFT: 'unshift'
};
// CONCATENATED MODULE: ./src/js/const/index.js


// CONCATENATED MODULE: ./src/js/mn-notification.js


var _fns;




var FADE_MS = 500;
var fns = (_fns = {}, defineProperty_default()(_fns, ADD_ELEMENT_MODE.PUSH, appendElementToContainer), defineProperty_default()(_fns, ADD_ELEMENT_MODE.UNSHIFT, prependElementToContainer), _fns);
/**
 * @constructs MNNotification
 * @param {Object} notifOptions - options of the new notification
 */

function MNNotification(notifOptions) {
  this.id = utils_generateId();
  this.options = notifOptions;
  this.onBeforeRemove = [];
}
/**
 * Pulls notification
 */

MNNotification.prototype.pull = function () {
  var _this = this;

  this.onBeforeRemove.forEach(function (fn) {
    if (typeof fn === 'function') {
      fn(_this);
    }
  });
  var el = getElementById(this.id);
  removeClass(el, 'show');
  setTimeout(function () {
    removeElementById(_this.id);
  }, FADE_MS);
};
/**
 * Appends notification element to specified container
 * @param {Object} additionalOptions - Options of the appending
 */


MNNotification.prototype.addToContainer = function (options) {
  var _this2 = this;

  options.onBeforeRemove && this.onBeforeRemove.push(options.onBeforeRemove);
  var template = typeof this.options.template == 'function' ? getCustomTemplate(this.id, this.options.template(this.options.title, this.options.message)) : getDefaultTemplate(this.id, this.options.title, this.options.message, this.options.type);
  var animation = options.animation || 'slide'; // 'fade', 'swing', 'rotate', 'slide'

  var el = getElementFromHtmlString(template);
  addClass(el, "mn-".concat(animation));
  fns[options.mode](getElement("#".concat(options.moduleId)), el);
  setTimeout(function () {
    addClass(el, 'show');
  }, 10);

  var setCloseConditions = function setCloseConditions() {
    addOnClick(getCloseButtonSelector(_this2.id), function () {
      _this2.pull();
    });

    if (_this2.options.closeCond !== false) {
      if (typeof _this2.options.closeCond === 'function') {} else {
        setTimeout(function () {
          _this2.pull();
        }, _this2.options.closeCond);
      }
    }
  };

  setCloseConditions();
};
// CONCATENATED MODULE: ./src/js/mn-module.js


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { defineProperty_default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }






var _defaultNotifOptions = {
  title: '',
  message: '',
  closeCond: 5000,
  // ms
  group: 'common',
  template: undefined,
  // function(title, message) { return "<span>" + title + "</span>"; }
  icon: undefined,
  // deprecated
  type: ICONS.INFO // "info", "warning", "error", "success"

};
/**
 * @constructs MNModule
 * @param {Object} moduleOptions - Options of the new module
 */

var mn_module_MNModule = function MNModule(moduleOptions) {
  var _defaultModuleOptions = {
    container: '#notifications',
    onNotifsNumberChange: undefined // e.g. (number) => { console.debug("Number of notifications", number); },

  };
  this.options = utils_applyArgs(moduleOptions, _defaultModuleOptions);
  this.numberOfNotifs = 0;
  this.groups = new Map();
  this.id = utils_generateId(); //append module container to the specified container

  appendElementToContainer(getElement(this.options.container), "<div id='".concat(this.id, "' class='mn-module-container'></div>"));
  console.debug('New notification module was registered', this.id, this.options);
};

mn_module_MNModule.prototype.setNotificationsCount = function (count) {
  this.numberOfNotifs = Math.max(count, 0);

  if (typeof this.options.onNotifsNumberChange === 'function') {
    this.options.onNotifsNumberChange(this.numberOfNotifs);
  }
};
/**
 * Detects if group with specified name exist
 * @param {String} groupName - Name of the group
 * @returns Boolean value
 */
// used in tests only


mn_module_MNModule.prototype.getGroup = function (id) {
  return this.groups.get(id);
}; // used in tests only


mn_module_MNModule.prototype.getGroups = function () {
  return this.groups.values();
}; // used in tests only


mn_module_MNModule.prototype.getGroupsCount = function () {
  return this.groups.size;
};
/**
 * Creates an empty group
 * @param {Object} groupOptions - Options of the group
 * @returns Boolean value of result
 */


mn_module_MNModule.prototype.createEmptyGroup = function (groupOptions) {
  if (this.groups.has(groupOptions.name)) {
    console.debug('Group with name already exist:', groupOptions.name);
    return false;
  }

  this.groups.set(groupOptions.name, new MNGroup(groupOptions));
  console.debug('New group was created', groupOptions.name);
  return true;
};
/**
 * Pulls notifications of the specified group
 * @param {String} groupName - Name of the group
 */


mn_module_MNModule.prototype.pullGroupNotifs = function (id) {
  if (!this.groups.has(id)) throw new Error("Group with id ".concat(id, " does not exist"));
  this.groups.get(id).getNotifications().forEach(function (notification) {
    return notification.pull();
  });
  console.debug('Group notifications were removed:', id);
};
/**
 * Pulls all notifications from current module
 */


mn_module_MNModule.prototype.pullAll = function () {
  var _this = this;

  this.groups.forEach(function (_, groupId) {
    return _this.pullGroupNotifs(groupId);
  });
};

mn_module_MNModule.prototype._onBeforeRemove = function (mnNotification) {
  var group = this.groups.get(mnNotification.options.group);

  if (group.hasNotification(mnNotification.id)) {
    group.removeNotification(mnNotification.id);
  }

  this.setNotificationsCount(this.numberOfNotifs - 1);
};

mn_module_MNModule.prototype._createNotification = function (options) {
  var _this2 = this;

  this.setNotificationsCount(this.numberOfNotifs + 1);
  var notification = new MNNotification(options);
  notification.addToContainer({
    moduleId: this.id,
    mode: options.mode,
    onBeforeRemove: function onBeforeRemove(n) {
      return _this2._onBeforeRemove(n);
    }
  });
  this.groups.get(options.group).addNotification(notification);
  return notification;
};

mn_module_MNModule.prototype._addNotification = function (options) {
  var _options = utils_applyArgs(options, _defaultNotifOptions);

  this.createEmptyGroup({
    name: _options.group
  });
  var group = this.groups.get(_options.group);

  var _pushResult = !group.options.greedy || group.isEmpty() ? this._createNotification(_options) : null;

  console.debug('New notification', _pushResult, _options);
  return _pushResult;
};
/**
 * Pushes the new notification
 * @param {Object} options - Options of the notification
 * @returns {Object} notif instance
 */


mn_module_MNModule.prototype.pushNotification = function (options) {
  return this._addNotification(_objectSpread({}, options, {
    mode: ADD_ELEMENT_MODE.PUSH
  }));
};

mn_module_MNModule.prototype.unshiftNotification = function (options) {
  return this._addNotification(_objectSpread({}, options, {
    mode: ADD_ELEMENT_MODE.UNSHIFT
  }));
};
// CONCATENATED MODULE: ./src/js/index.js

// CONCATENATED MODULE: ./src/index.js






/* harmony default export */ var src = __webpack_exports__["default"] = (mn_module_MNModule);

/***/ })
/******/ ])["default"];