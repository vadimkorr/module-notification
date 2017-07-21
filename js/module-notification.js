(function($) {
  /* Commons */

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
  /* return options if specified or default options otherwise */
  var applyArgs = function(argum, defaults) {
    if (argum && typeof argum === "object") {
      return extendDefaults(defaults, argum);
    } else {
      return defaults;
    }
  }
  
  /**
   * @constructs MNGroup - private class
   * @param {any} groupOptions - options of the new group
   */
  var MNGroup = function(groupOptions) {
    var _defaultOptions = {
      name: "common",
      greedy: false
    }
    var options = applyArgs(groupOptions, _defaultOptions);
    this.name = options.name;
    this.greedy = options.greedy;
    this.notifs = [];
  }

  /**
   * Pushes new notification to the group
   * 
   * @param {any} notif 
   */
  MNGroup.prototype.pushNotif = function(notif) {
    this.notifs.push(notif); 
  }

  /**
   * Detects if group has a notification with id
   * 
   * @param {any} id 
   * @returns 
   */
  MNGroup.prototype.hasNotif = function(id) {
    var index = -1;
    this.notifs.forEach(function(n, ind) { 
      if (n.id == id) {
        index = ind;
        return;
      }   
    });
    return index;
  }
  
  /**
   * @constructs MNModule
   * @param {any} config - options of the new module
   */
  this.MNModule = function(moduleOptions) {
    var _self = this;

    /* input options */
    var _defaultOptions = {
      container: "#notifications",
      onNotifsNumberChange: function(number) {
        console.info("Number of notifications", number, moduleOptions);
      },
	    direction: "fromTop"//"fromTop", "fromBottom"
    }
    var _options = applyArgs(moduleOptions, _defaultOptions);

    //unique id
    var _id = (() => {
      return (+new Date).toString(16);
    })();

    //append module container to the specified container
    $("<div id='" + _id + "' class='mn-module-container'></div>").appendTo(_options.container);

    var _numberOfNotifs = 0;
    this.groups = {};
  
    /* calls on number of notifications in current module changing */
    function _callOnNotifsNumberChange(number) {
      if (typeof _options.onNotifsNumberChange === "function") {
        _options.onNotifsNumberChange(number);    
      }
    }

    /* detects if group with specified name exist */
    this.isGroupExist = function(groupName) {
      return _self.groups.hasOwnProperty(groupName);
    }

    /* pulls notification */
    this.pull = function(notif) {
      var hasInd = _self.groups[notif.group].hasNotif(notif.id);
      if (hasInd != -1) {
        //decrement counter
        (function _decCount() {
          _numberOfNotifs > 0 ? _numberOfNotifs-- : _numberOfNotifs = 0;
          _callOnNotifsNumberChange(_numberOfNotifs);
        })();
        //remove from group
        _self.groups[notif.group].notifs.splice(hasInd, 1);
      }
    }      
    
    this._push = function(options) {
      //increment counter
      (function incCount() {
        _numberOfNotifs++;
        _callOnNotifsNumberChange(_numberOfNotifs);
      })();
      var additionalOptions = {
        moduleId: _id,
        direction: _options.direction,
        onBeforeRemove: _self.pull
      }
      //create notif
      var notif = new MNNotification(options);
      //append to UI
      notif.appendToContainer(additionalOptions);
      //push to group
      _self.groups[options.group].pushNotif(notif);
      return notif;		
    }
  
    this.addEmptyGroup = function(groupOptions) { 
	    //check if group already exists
	    if (_self.isGroupExist(groupOptions.name)) {
        console.warn("Group with name already exist:", groupOptions.name);
	    } else {
        _self.groups[groupOptions.name] = new MNGroup(groupOptions)
        console.info("New group was created", groupOptions.name);
      }
	  }

	  console.info("New notification module was registered", _id, _options);
  }
  
  /**
   * Pulls notifications of the specified group 
   * 
   * @param {any} groupName name of the group
   */
  this.MNModule.prototype.pullGroupNotifs = function(groupName) {
    var _self = this;
    if (_self.groups.hasOwnProperty(groupName)) {
      for (var i = 0; i < _self.groups[groupName].notifs.length;) {
        _self.groups[groupName].notifs[i].pull();
      } 
      console.info("Group notifications were removed:", groupName);
    } else {
      console.warn("Group doesn't exist:", groupName);
    }
  }

  /**
   * Creates an empty group
   * 
   * @param {any} options - options of the group
   */
  this.MNModule.prototype.createEmptyGroup = function(options) {
    
    this.addEmptyGroup(options); 
  }

  /**
   * Pushes the new notification 
   * 
   * @param {any} options - options of the notification
   */
  this.MNModule.prototype.pushNotif = function(notifOptions) {
    var _self = this;
    /* input options */
    var defaultOptions = {
      title: "",
      message: "",
      icon: undefined,
      closeCond: 5000,//ms
      type: "notice",//"notice", "warning", "error", "success"
      group: "common",
    }
    var options = applyArgs(notifOptions, defaultOptions);
    
    /* pushes new notifications */
    function _push() {
      //group is not exist yet
      if (!_self.isGroupExist(options.group)) {
        _self.addEmptyGroup({ name: options.group });
        return _self._push(options);
      //group exists
      } else {
        //group is greedy
        if (_self.groups[options.group].greedy) {
          //greedy group already has a member
          if (_self.groups[options.group].notifs.length >= 1) {
            console.warn("Greedy group " + options.group + " already has a member");
            return null;      
          //greedy group is empty
          } else {
            return _self._push(options);
          }
        //group is not greedy
        } else {
          return _self._push(options);
        }
      }
    }

    var pushResult = _push();
  
    if (pushResult) {
      //_setCloseConditions(pushResult);
      console.info("New notification was pushed", pushResult, options);
      return pushResult;
    } else {
      console.warn("New notification wasn't pushed", options);
      return null;
    }
  }

  /**
   * Pulls all notifications from current module
   * 
   * 
   */
  this.MNModule.prototype.pullAll = function() {
    var _self = this;
    for(var groupName in _self.groups) {
      for (var i = 0; i < _self.groups[groupName].notifs.length;) {
        _self.groups[groupName].notifs[i].pull();
      } 
      console.info("Group notifications were removed:", groupName);
    } 
  }
  
  var MNNotification = function(options) {    
    var _self = this;

    /* unique id */
    this.id = (() => {
      return (+new Date).toString(16);
    })();

    this.moduleId = "";//init on pushing notification
    this.onBeforeRemove = () => {};

    /* returns icon depending on type */
    function _getIcon() {
      var icons = {
        "notice": "info-sign",
        "success": "ok-sign",
        "warning": "warning-sign",
        "error": "remove"
      }
      return ((options.icon == undefined) ? icons[options.type] : options.icon);
    }
    
    this.title = options.title;
    this.message = options.message
    this.icon = _getIcon();
    this.closeCond = options.closeCond;
    this.type = options.type;
    this.group = options.group;
    
    /* get notification element id */
    this.notificationElementId = (function getNotificationElementId() {
      var elId = "mn-container-" + _self.moduleId + "_" + _self.id;
      return elId; 
    })();

    this.pull = function() {
      if (typeof _self.onBeforeRemove === "function") {
        _self.onBeforeRemove(_self);   
        $("#" + _self.notificationElementId).fadeOut(300, function() { 
          $("#" + _self.notificationElementId).remove();
        });
      }
    };
  }

  MNNotification.prototype.pull = function() {
    this.pull();
  }

  MNNotification.prototype.appendToContainer = function(additionalOptions) {
    var _self = this;
    this.moduleId = additionalOptions.moduleId;
    this.onBeforeRemove = additionalOptions.onBeforeRemove;
    /* returns filled template */
    var _getTemplate = function() {
      var template = (
        "<div role='mn-alert' id='" + _self.notificationElementId + "' class='mn-notification-container mn-alert mn-alert-" + _self.type + " mn-alert-dismissible'>" +
          "<button type='button' class='mn-close-btn mn-close'><span aria-hidden='true'>&times;</span></button>" +
          "<div class='mn-notification-container-content'>"+ 
            "<i class='glyphicon glyphicon-" + _self.icon + "'></i>" + 
            "<span> <strong>" + _self.title + "</strong> " + _self.message + "</span>" + 
          "</div>" +
        "</div>"
      ); 
      return template;
    }
    
    /* get selector of the close button of the notification element */
    var _getCloseBtnSelector = function() {
      var selector = "#" + _self.notificationElementId + " > .mn-close-btn";
      return selector;
    };

    (function append() {
      if (additionalOptions.direction == "fromTop") {
        $(_getTemplate()).appendTo("#" + _self.moduleId).hide().fadeIn(300);
      } else {
        $(_getTemplate()).prependTo("#" + _self.moduleId).hide().fadeIn(300);
      }
    })();

    /* sets time after which notification will be closed */
    (function setCloseConditions() {
      $(_getCloseBtnSelector()).on("click", function() {
        _self.pull();
      });
      if (_self.closeCond !== false) {
        if (typeof _self.closeCond === "function") {

        } else {
          setTimeout(function() {
            _self.pull();
          }, _self.closeCond); 
        }
      }
    })();
  }

})(jQuery);