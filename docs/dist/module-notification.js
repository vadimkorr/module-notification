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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./src/css/module-notification.css
var module_notification = __webpack_require__(1);

// EXTERNAL MODULE: ./node_modules/font-awesome/css/font-awesome.min.css
var font_awesome_min = __webpack_require__(2);

// EXTERNAL MODULE: ./node_modules/cuid/dist/browser-cuid.js
var browser_cuid = __webpack_require__(0);
var browser_cuid_default = /*#__PURE__*/__webpack_require__.n(browser_cuid);

// CONCATENATED MODULE: ./src/js/const/icon.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ICONS = function ICONS() {
  _classCallCheck(this, ICONS);
};

_defineProperty(ICONS, "INFO", 'info-circle');

_defineProperty(ICONS, "SUCCESS", 'check-circle');

_defineProperty(ICONS, "WARNING", 'exclamation-circle');

_defineProperty(ICONS, "ERROR", 'times-circle');
// CONCATENATED MODULE: ./src/js/utils.js
function _templateObject2() {
  var data = _taggedTemplateLiteral(["<div id='{{id}}'>{{content}}</div>"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  <div\n    role='mn-alert'\n    id='{{id}}'\n    class='mn-notification-container mn-alert mn-alert-{{type}} mn-alert-dismissible'>\n    <button\n      type='button'\n      class='mn-close-btn mn-close'>\n      <span aria-hidden='true'>&times;</span>\n    </button>\n    <div class='mn-notification-container-content'>\n      <i class=\"fa fa-{{icon}}\"></i>\n      <span><strong>{{title}}</strong> {{message}}</span>\n    </div>\n  </div>"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



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

var applyArgs = function applyArgs(argum, defaults) {
  if (argum && _typeof(argum) === 'object') {
    return extendDefaults(defaults, argum);
  } else {
    return defaults;
  }
};
var templater = function templater(_ref) {
  var id = _ref.id,
      _ref$title = _ref.title,
      title = _ref$title === void 0 ? '' : _ref$title,
      _ref$message = _ref.message,
      message = _ref$message === void 0 ? '' : _ref$message,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? '' : _ref$type,
      _ref$icon = _ref.icon,
      icon = _ref$icon === void 0 ? '' : _ref$icon,
      _ref$content = _ref.content,
      content = _ref$content === void 0 ? '' : _ref$content;
  return function (t) {
    var idPlaceholder = '{{id}}';
    var titlePlaceholder = '{{title}}';
    var messagePlaceholder = '{{message}}';
    var typePlaceholder = '{{type}}';
    var iconPlaceholder = '{{icon}}';
    var contentPlaceholder = '{{content}}';
    return (t ? t[0] : '').replace(idPlaceholder, id).replace(titlePlaceholder, title).replace(messagePlaceholder, message).replace(typePlaceholder, type).replace(iconPlaceholder, icon).replace(contentPlaceholder, content);
  };
};
var getDefaultTemplate = function getDefaultTemplate(id, title, message, type, icon) {
  return templater({
    id: id,
    title: title,
    message: message,
    type: type,
    icon: icon
  })(_templateObject());
};
var getCustomTemplate = function getCustomTemplate(id, content) {
  return templater({
    id: id,
    content: content
  })(_templateObject2());
};
var utils_getIconNameByType = function getIconNameByType(type) {
  switch (type) {
    default:
    case 'notice':
      return ICONS.INFO;

    case 'success':
      return ICONS.SUCCESS;

    case 'warning':
      return ICONS.WARNING;

    case 'error':
      return ICONS.ERROR;
  }
};
var getCloseButtonSelector = function getCloseButtonSelector(id) {
  return "#".concat(id, " .mn-close-btn");
};
var msToSec = function msToSec(ms) {
  return ms / 1000;
};
var fadeOut = function fadeOut(ms, cb) {
  var opacity = 0;
  var step = 50;
  var opacityStep = step / ms;
  var timer = setInterval(function () {
    if (opacity >= 1.0) {
      clearInterval(timer);
    }

    cb(opacity);
    opacity += opacityStep;
  }, step);
};
// CONCATENATED MODULE: ./src/js/MNGroup.js
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function MNGroup_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


/**
 * @constructs MNGroup - Private class of the group
 * @param {Object} groupOptions - Options of the new group
 */

var MNGroup_MNGroup =
/*#__PURE__*/
function () {
  function MNGroup(groupOptions) {
    MNGroup_classCallCheck(this, MNGroup);

    var _defaultOptions = {
      name: 'common',
      greedy: false
    };
    this.options = applyArgs(groupOptions, _defaultOptions);
    this.notifs = [];
  }
  /**
   * Pushes new notification to the group
   * @param {Object} notif - Instance of the notification
   */


  _createClass(MNGroup, [{
    key: "pushNotif",
    value: function pushNotif(notif) {
      this.notifs = [].concat(_toConsumableArray(this.notifs), [notif]);
    }
    /**
     * Detects if group has a notification with id
     * @param {String} id - Id of the notification
     * @returns Index of the notification in the array
     */

  }, {
    key: "hasNotif",
    value: function hasNotif(id) {
      var index = -1;
      this.notifs.forEach(function (n, ind) {
        if (n.id == id) {
          index = ind;
          return;
        }
      });
      return index;
    }
  }]);

  return MNGroup;
}();
// CONCATENATED MODULE: ./src/js/domUtils.js

var getElement = function getElement(query) {
  return document.querySelector("".concat(query));
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
var domUtils_appendElementToContainerWithFadeIn = function appendElementToContainerWithFadeIn(container, element) {
  var ms = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 300;
  element.style.opacity = 0;
  fadeOut(ms, function (opacity) {
    element.style.opacity = opacity;
  });
  appendElementToContainer(container, element);
};
var domUtils_prependElementToContainerWithFadeIn = function prependElementToContainerWithFadeIn(container, element) {
  var ms = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 300;
  element.style.opacity = 0;
  fadeOut(ms, function (opacity) {
    element.style.opacity = opacity;
  });
  prependElementToContainer(container, element);
};

var _removeElement = function _removeElement(element) {
  element.parentNode.removeChild(element);
};

var removeElement = function removeElement(query) {
  var element = getElement(query);

  if (element) {
    _removeElement(element);
  }
};
var domUtils_removeElementWithFadeOut = function removeElementWithFadeOut(query) {
  var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;
  var element = getElement(query);

  if (element) {
    var sec = msToSec(ms);
    element.style.transition = "opacity ".concat(sec, "s ease");
    element.style.opacity = 0;
    setTimeout(function () {
      _removeElement(element);
    }, ms);
  }
};
var addOnClick = function addOnClick(query, cb) {
  var element = getElement(query);

  if (element) {
    element.addEventListener('click', cb, false);
  }
};
// CONCATENATED MODULE: ./src/js/const/direction.js
function direction_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function direction_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DIRECTION = function DIRECTION() {
  direction_classCallCheck(this, DIRECTION);
};

direction_defineProperty(DIRECTION, "FROM_TOP", 'fromTop');

direction_defineProperty(DIRECTION, "FROM_BOTTOM", 'fromBottom');
// CONCATENATED MODULE: ./src/js/const/index.js


// CONCATENATED MODULE: ./src/js/MNNotification.js
function MNNotification_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function MNNotification_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function MNNotification_createClass(Constructor, protoProps, staticProps) { if (protoProps) MNNotification_defineProperties(Constructor.prototype, protoProps); if (staticProps) MNNotification_defineProperties(Constructor, staticProps); return Constructor; }




var FADE_MS = 200;
/**
 * @constructs MNNotification
 * @param {Object} notifOptions - options of the new notification
 */

var MNNotification_MNNotification =
/*#__PURE__*/
function () {
  function MNNotification(notifOptions) {
    MNNotification_classCallCheck(this, MNNotification);

    this.id = utils_generateId();

    this.onBeforeRemove = function () {};

    this.options = notifOptions;
    this.options.icon = notifOptions.icon ? notifOptions.icon : utils_getIconNameByType(notifOptions.type);
  }
  /**
   * Pulls notification
   */


  MNNotification_createClass(MNNotification, [{
    key: "pull",
    value: function pull() {
      var _self = this;

      if (typeof _self.onBeforeRemove === 'function') {
        _self.onBeforeRemove(_self);

        domUtils_removeElementWithFadeOut("#".concat(_self.id), FADE_MS);
      }
    }
    /**
     * Appends notification element to specified container
     * @param {Object} additionalOptions - Options of the appending
     */

  }, {
    key: "appendToContainer",
    value: function appendToContainer(additionalOptions) {
      var _self = this;

      this.onBeforeRemove = additionalOptions.onBeforeRemove;

      var _getTemplate = function _getTemplate() {
        var template = typeof _self.options.template == 'function' ? getCustomTemplate(_self.id, _self.options.template(_self.options.title, _self.options.message)) : getDefaultTemplate(_self.id, _self.options.title, _self.options.message, _self.options.type, _self.options.icon);
        return template;
      };

      (function append() {
        var container = getElement("#".concat(additionalOptions.moduleId));

        if (additionalOptions.direction == DIRECTION.FROM_TOP) {
          domUtils_appendElementToContainerWithFadeIn(container, getElementFromHtmlString(_getTemplate()), FADE_MS);
        } else {
          domUtils_prependElementToContainerWithFadeIn(container, getElementFromHtmlString(_getTemplate()), FADE_MS);
        }
      })();

      (function setCloseConditions() {
        addOnClick(getCloseButtonSelector(_self.id), function () {
          _self.pull();
        });

        if (_self.options.closeCond !== false) {
          if (typeof _self.options.closeCond === 'function') {} else {
            setTimeout(function () {
              _self.pull();
            }, _self.options.closeCond);
          }
        }
      })();
    }
  }]);

  return MNNotification;
}();
// CONCATENATED MODULE: ./src/js/MNModule.js
function MNModule_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function MNModule_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function MNModule_createClass(Constructor, protoProps, staticProps) { if (protoProps) MNModule_defineProperties(Constructor.prototype, protoProps); if (staticProps) MNModule_defineProperties(Constructor, staticProps); return Constructor; }






/**
 * @constructs MNModule
 * @param {Object} moduleOptions - Options of the new module
 */

var MNModule_MNModule =
/*#__PURE__*/
function () {
  function MNModule(moduleOptions) {
    MNModule_classCallCheck(this, MNModule);

    var _defaultModuleOptions = {
      container: '#notifications',
      onNotifsNumberChange: undefined,
      // e.g. (number) => { console.debug("Number of notifications", number); },
      direction: DIRECTION.FROM_TOP // "fromTop", "fromBottom"

    };
    this.options = applyArgs(moduleOptions, _defaultModuleOptions);
    this.numberOfNotifs = 0;
    this.groups = {};
    this.id = utils_generateId(); //append module container to the specified container

    appendElementToContainer(getElement(this.options.container), "<div id='".concat(this.id, "' class='mn-module-container'></div>"));
    console.debug('New notification module was registered', this.id, this.options);
  }
  /**
   * Detects if group with specified name exist
   * @param {String} groupName - Name of the group
   * @returns Boolean value
   */


  MNModule_createClass(MNModule, [{
    key: "isGroupExist",
    value: function isGroupExist(groupName) {
      return this.groups.hasOwnProperty(groupName);
    }
    /**
     * Creates an empty group
     * @param {Object} groupOptions - Options of the group
     * @returns Boolean value of result
     */

  }, {
    key: "createEmptyGroup",
    value: function createEmptyGroup(groupOptions) {
      if (this.isGroupExist(groupOptions.name)) {
        console.debug('Group with name already exist:', groupOptions.name);
        return false;
      } else {
        this.groups[groupOptions.name] = new MNGroup_MNGroup(groupOptions);
        console.debug('New group was created', groupOptions.name);
        return true;
      }
    }
    /**
     * Pulls notifications of the specified group
     * @param {String} groupName - Name of the group
     */

  }, {
    key: "pullGroupNotifs",
    value: function pullGroupNotifs(groupName) {
      if (this.groups.hasOwnProperty(groupName)) {
        for (var i = 0; i < this.groups[groupName].notifs.length;) {
          this.groups[groupName].notifs[i].pull();
        }

        console.debug('Group notifications were removed:', groupName);
      } else {
        console.debug("Group doesn't exist:", groupName);
      }
    }
    /**
     * Pulls all notifications from current module
     */

  }, {
    key: "pullAll",
    value: function pullAll() {
      for (var groupName in this.groups) {
        for (var i = 0; i < this.groups[groupName].notifs.length;) {
          this.groups[groupName].notifs[i].pull();
        }

        console.debug('Group notifications were removed:', groupName);
      }
    }
    /**
     * Pushes the new notification
     * @param {Object} options - Options of the notification
     * @returns {Object} notif instance
     */

  }, {
    key: "pushNotif",
    value: function pushNotif(notifOptions) {
      var _self = this;

      var _defaultNotifOptions = {
        title: '',
        message: '',
        closeCond: 5000,
        // ms
        group: 'common',
        template: undefined,
        // function(title, message) { return "<span>" + title + "</span>"; }
        icon: undefined,
        type: ICONS.INFO // "notice", "warning", "error", "success"

      };

      var _notifOptions = applyArgs(notifOptions, _defaultNotifOptions);

      function _onBeforeRemove(mnNotification) {
        var hasInd = _self.groups[mnNotification.options.group].hasNotif(mnNotification.id);

        if (hasInd != -1) {
          (function _decCount() {
            _self.numberOfNotifs > 0 ? _self.numberOfNotifs-- : _self.numberOfNotifs = 0;

            _self.callOnNotifsNumberChange(_self.numberOfNotifs);
          })();

          _self.groups[mnNotification.options.group].notifs.splice(hasInd, 1);
        }
      }

      function _pushInner(notifOptions) {
        (function incCount() {
          _self.numberOfNotifs++;

          _self.callOnNotifsNumberChange(_self.numberOfNotifs);
        })();

        var additionalOptions = {
          moduleId: _self.id,
          direction: _self.options.direction,
          onBeforeRemove: _onBeforeRemove
        };
        var notif = new MNNotification_MNNotification(notifOptions);
        notif.appendToContainer(additionalOptions);

        _self.groups[notifOptions.group].pushNotif(notif);

        return notif;
      }

      var _pushResult = null; //group is not exist yet

      if (!_self.isGroupExist(_notifOptions.group)) {
        _self.createEmptyGroup({
          name: _notifOptions.group
        });

        _pushResult = _pushInner(_notifOptions); //group exists
      } else {
        //group is not not greedy or is empty
        if (!_self.groups[_notifOptions.group].options.greedy || _self.groups[_notifOptions.group].notifs.length < 1) {
          _pushResult = _pushInner(_notifOptions);
        } else {
          _pushResult = null;
        }
      }

      if (_pushResult) {
        console.debug('New notification was pushed', _pushResult, _notifOptions);
        return _pushResult;
      } else {
        console.debug("New notification wasn't pushed", _notifOptions);
        return null;
      }
    }
    /**
     * Callback function rises on changin the number of notifications
     * @param {Number} number - current number of notifications
     */

  }, {
    key: "callOnNotifsNumberChange",
    value: function callOnNotifsNumberChange(number) {
      if (typeof this.options.onNotifsNumberChange === 'function') {
        this.options.onNotifsNumberChange(number);
      }
    }
  }]);

  return MNModule;
}();
// CONCATENATED MODULE: ./src/js/index.js

// CONCATENATED MODULE: ./src/index.js




(function (window) {
  window.MNModule = MNModule_MNModule;
})(window);

/***/ })
/******/ ]);