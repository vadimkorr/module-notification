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
      onNotifsNumberChange: undefined,//e.g. (number) => { console.info("Number of notifications", number); },
	    direction: "fromTop"//"fromTop", "fromBottom"
    }
    this.options = applyArgs(moduleOptions, _defaultModuleOptions);
    
    this.numberOfNotifs = 0;
    this.groups = {};
    this.id = (() => {
      return (+new Date).toString(16);
    })();

    //append module container to the specified container
    $("<div id='" + this.id + "' class='mn-module-container'></div>").appendTo(this.options.container);
	  console.info("New notification module was registered", this.id, this.options);
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
        console.warn("Group with name already exist:", groupOptions.name);
        return false;
      } else {
        this.groups[groupOptions.name] = new MNGroup(groupOptions)
        console.info("New group was created", groupOptions.name);
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
        console.info("Group notifications were removed:", groupName);
      } else {
        console.warn("Group doesn't exist:", groupName);
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
        console.info("Group notifications were removed:", groupName);
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
        console.info("New notification was pushed", _pushResult, _notifOptions);
        return _pushResult;
      } else {
        console.warn("New notification wasn't pushed", _notifOptions);
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

    this.id = (() => {
      return (+new Date).toString(16);
    })();
    this.onBeforeRemove = () => {};
    this.options = notifOptions;
    this.options.icon = _getIcon();
    this.notificationElementId;
  }

  MNNotification.prototype = {
    /**
     * Pulls notification 
     */
    pull: function() {
      var _self = this;
      if (typeof _self.onBeforeRemove === "function") {
        _self.onBeforeRemove(_self);   
        $("#" + _self.notificationElementId).fadeOut(300, function() { 
          $("#" + _self.notificationElementId).remove();
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
      this.notificationElementId = (function getNotificationElementId() {
        var elId = "mn-notification-" + additionalOptions.moduleId + "-" + _self.id;
        return elId; 
      })();
      
      var _getDefaultTemplate = function(title, message, type, icon) {
        var template = (
          "<div role='mn-alert' id='" + _self.notificationElementId + "' class='mn-notification-container mn-alert mn-alert-" + type + " mn-alert-dismissible'>" +
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
          "<div id='" + _self.notificationElementId + "'>" +
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
        var selector = "#" + _self.notificationElementId + " .mn-close-btn";
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