(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
global.cuid = require('cuid');
require('module-notification');
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"cuid":2,"module-notification":3}],2:[function(require,module,exports){
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
  } else if (typeof module !== 'undefined') {
    module.exports = api;
  } else {
    app[namespace] = api;
  }

}(this.applitude || this));

},{}],3:[function(require,module,exports){
(function($) {
  /* return options if specified or default options otherwise */
  var applyArgs = function(argum, defaults) {
    /* extends default config and returns extended one */
    var extendDefaults = function(source, properties) {
      var property;
      for (property in properties) {
        if (properties.hasOwnProperty(property)) {
          source[property] = properties[property];
        }
      }
      return source;
    }
    if (argum && typeof argum === "object") {
      return extendDefaults(defaults, argum);
    } else {
      return defaults;
    }
  }
  
  /**
   * @constructs MNGroup - Private class of the group
   * @param {Object} groupOptions - Options of the new group
   */
  var MNGroup = function(groupOptions) {
    var _defaultOptions = {
      name: "common",
      greedy: false
    }
    this.options = applyArgs(groupOptions, _defaultOptions);
    this.notifs = [];
  }

  MNGroup.prototype = {
    /**
     * Pushes new notification to the group
     * @param {Object} notif - Instance of the notification
     */
    pushNotif: function(notif) {
      this.notifs.push(notif); 
    },
    /**
     * Detects if group has a notification with id
     * @param {String} id - Id of the notification
     * @returns Index of the notification in the array
     */
    hasNotif: function(id) {
      var index = -1;
      this.notifs.forEach(function(n, ind) { 
        if (n.id == id) {
          index = ind;
          return;
        }   
      });
      return index;
    }
  }
  
  /**
   * @constructs MNModule
   * @param {Object} moduleOptions - Options of the new module
   */
  this.MNModule = function(moduleOptions) {
    var _defaultModuleOptions = {
      container: "#notifications",
      onNotifsNumberChange: undefined,//e.g. (number) => { console.debug("Number of notifications", number); },
	    direction: "fromTop"//"fromTop", "fromBottom"
    }
    this.options = applyArgs(moduleOptions, _defaultModuleOptions);

    this.numberOfNotifs = 0;
    this.groups = {};
    this.id = cuid();

    //append module container to the specified container
    $("<div id='" + this.id + "' class='mn-module-container'></div>").appendTo(this.options.container);
	  console.debug("New notification module was registered", this.id, this.options);
  }

  this.MNModule.prototype = {
    /**
     * Detects if group with specified name exist
     * @param {String} groupName - Name of the group 
     * @returns Boolean value
     */
    isGroupExist: function(groupName) {
      return this.groups.hasOwnProperty(groupName);
    },
    /**
     * Creates an empty group
     * @param {Object} groupOptions - Options of the group
     * @returns Boolean value of result
     */
    createEmptyGroup: function(groupOptions) {
	    if (this.isGroupExist(groupOptions.name)) {
        console.debug("Group with name already exist:", groupOptions.name);
        return false;
      } else {
        this.groups[groupOptions.name] = new MNGroup(groupOptions)
        console.debug("New group was created", groupOptions.name);
        return true;
      }
    },
    /**
     * Pulls notifications of the specified group 
     * @param {String} groupName - Name of the group
     */
    pullGroupNotifs: function(groupName) {
      if (this.groups.hasOwnProperty(groupName)) {
        for (var i = 0; i < this.groups[groupName].notifs.length;) {
          this.groups[groupName].notifs[i].pull();
        } 
        console.debug("Group notifications were removed:", groupName);
      } else {
        console.debug("Group doesn't exist:", groupName);
      }
    },
    /**
     * Pulls all notifications from current module
     */
    pullAll: function() {
      for(var groupName in this.groups) {
        for (var i = 0; i < this.groups[groupName].notifs.length;) {
          this.groups[groupName].notifs[i].pull();
        } 
        console.debug("Group notifications were removed:", groupName);
      } 
    },
    /**
     * Pushes the new notification
     * @param {Object} options - Options of the notification
     * @returns {Object} notif instance
     */
    pushNotif: function(notifOptions) {
      var _self = this;
      var _defaultNotifOptions = {
        title: "",
        message: "",
        closeCond: 5000,//ms   
        group: "common",
        template: undefined,//function(title, message) { return "<span>" + title + "</span>"; }
        icon: undefined,
        type: "notice",//"notice", "warning", "error", "success"
      }
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
        }
        var notif = new MNNotification(notifOptions);
        notif.appendToContainer(additionalOptions);
        _self.groups[notifOptions.group].pushNotif(notif);
        return notif;		
      }

      var _pushResult = null;
      //group is not exist yet
      if (!_self.isGroupExist(_notifOptions.group)) {
        _self.createEmptyGroup({ name: _notifOptions.group });
        _pushResult = _pushInner(_notifOptions);
      //group exists
      } else {
        //group is not not greedy or is empty
        if (!_self.groups[_notifOptions.group].options.greedy || _self.groups[_notifOptions.group].notifs.length < 1) {
          _pushResult = _pushInner(_notifOptions);
        } else {
          _pushResult = null;
        }
      }

      if (_pushResult) {
        console.debug("New notification was pushed", _pushResult, _notifOptions);
        return _pushResult;
      } else {
        console.debug("New notification wasn't pushed", _notifOptions);
        return null;
      }
    },    
    /**
     * Callback function rises on changin the number of notifications 
     * @param {Number} number - current number of notifications
     */
    callOnNotifsNumberChange(number) {
      if (typeof this.options.onNotifsNumberChange === "function") {
        this.options.onNotifsNumberChange(number);    
      }
    }
  }

  /**
   * @constructs MNNotification
   * @param {Object} notifOptions - options of the new notification
   */
  var MNNotification = function(notifOptions) {    
    var _self = this;
    function _getIcon() {
      var icons = {
        "notice": "info-sign",
        "success": "ok-sign",
        "warning": "warning-sign",
        "error": "remove"
      }
      return ((notifOptions.icon == undefined) ? icons[notifOptions.type] : notifOptions.icon);
    }

    this.id = cuid();
    this.onBeforeRemove = () => {};
    this.options = notifOptions;
    this.options.icon = _getIcon();
  }

  MNNotification.prototype = {
    /**
     * Pulls notification 
     */
    pull: function() {
      var _self = this;
      if (typeof _self.onBeforeRemove === "function") {
        _self.onBeforeRemove(_self);   
        $("#" + _self.id).fadeOut(300, function() { 
          $("#" + _self.id).remove();
        });
      }
    },
    /**
     * Appends notification element to specified container
     * @param {Object} additionalOptions - Options of the appending 
     */
    appendToContainer: function(additionalOptions) {
      var _self = this;
      this.onBeforeRemove = additionalOptions.onBeforeRemove;
      
      var _getDefaultTemplate = function(title, message, type, icon) {
        var template = (
          "<div role='mn-alert' id='" + _self.id + "' class='mn-notification-container mn-alert mn-alert-" + type + " mn-alert-dismissible'>" +
            "<button type='button' class='mn-close-btn mn-close'><span aria-hidden='true'>&times;</span></button>" +
            "<div class='mn-notification-container-content'>"+ 
              "<i class='glyphicon glyphicon-" + icon + "'></i>" + 
              "<span> <strong>" + title + "</strong> " + message + "</span>" + 
            "</div>" +
          "</div>"
        ); 
        return template;
      }

      var _getCustomTemplate = function(title, message) {
        var template = (
          "<div id='" + _self.id + "'>" +
            _self.options.template(title, message) + 
          "</div>"
        );
        return template;
      }

      var _getTemplate = function() {
        var template = typeof _self.options.template == "function" 
          ? _getCustomTemplate(_self.options.title, _self.options.message)
          : _getDefaultTemplate(_self.options.title, _self.options.message, _self.options.type, _self.options.icon);
        return template;
      }
      
      var _getCloseBtnSelector = function() {
        var selector = "#" + _self.id + " .mn-close-btn";
        return selector;
      };

      (function append() {
        if (additionalOptions.direction == "fromTop") {
          $(_getTemplate()).appendTo("#" + additionalOptions.moduleId).hide().fadeIn(300);
        } else {
          $(_getTemplate()).prependTo("#" + additionalOptions.moduleId).hide().fadeIn(300);
        }
      })();

      (function setCloseConditions() {
        $(_getCloseBtnSelector()).on("click", function() {
          _self.pull();
        });
        if (_self.options.closeCond !== false) {
          if (typeof _self.options.closeCond === "function") {
          } else {
            setTimeout(function() {
              _self.pull();
            }, _self.options.closeCond); 
          }
        }
      })();
    }
  }
})(jQuery);
},{}]},{},[1])