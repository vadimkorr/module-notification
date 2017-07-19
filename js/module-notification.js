(function($) {
  /* Commons */
  /* extends default configs and returns extended */
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
   * @constructs MNModule
   * @param {any} config - options of the new module
   */
  this.MNModule = function(config) {
    var _defaultConfigs = {
      container: "#notifications",
      onNotifsNumberChange: function(number) {
        console.info("Number of notifications", number, _defaultConfigs);
      },
	  direction: "fromTop"//"fromBottom"
    }
  
    var _self = this;
    _self._configs = applyArgs(config, _defaultConfigs);

    var _generateModuleIndex = function() {
      return (+new Date).toString(16);
    }  
    var _generateNotifIndex = function() {
      return (+new Date).toString(16);
    }
  
    _self._currModuleIndex = _generateModuleIndex();
    _self._currNotifIndex = _generateNotifIndex();

    $("<div id='" + _self._currModuleIndex + "' class='mn-module-container'></div>").appendTo(_self._configs.container);
  
    _self._currCount = 0;
    _self._groups = {};
  
    var _callOnNotifsNumberChange = function(number) {
      if (typeof _self._configs.onNotifsNumberChange === "function") {
        _self._configs.onNotifsNumberChange(number);    
      }
    } 
  
    /* decrement counter */
    _self._decCount = function() {
      _self._currCount > 0 ? _self._currCount-- : _self._currCount = 0;
      _self._currNotifIndex = _generateNotifIndex();
      _callOnNotifsNumberChange(_self._currCount);
    }
    /* increment counter */
    _self._incCount = function() {
      _self._currCount++;
      _self._currNotifIndex = _generateNotifIndex();
      _callOnNotifsNumberChange(_self._currCount);
    }
    /* pull notification */
    _self._pull = function(notif) {
      var index = _self._groups[notif.group].notifs.indexOf(notif.id);
      if (index > -1) {
        //dec index
        _self._decCount();
        //pull from UI
        //$(notif.id).remove();
        $(notif.id).fadeOut(300, function() { 
          $(notif.id).remove();
        });
        _self._groups[notif.group].notifs.splice(index, 1);
      }
    }
    /* get notification element id */
    _self._getNotificationElementId = function(withoutPrefix) {
      var id = (withoutPrefix ? '' : '#') + "mn-container-" + _self._currModuleIndex + "_" + _self._currNotifIndex;
      return id; 
    }
    /* get selector of the close button of the notification element */
    _self._getCloseBtnSelector = function(id) {
      var selector = id + " > .mn-close-btn";
      return selector;
    }
  
    _self._createEmptyGroup = function() {
      var _defaultOptions = {
        name: "common",
        greedy: false
      }
      
      var _options = applyArgs(arguments[0], _defaultOptions);
	  
	    //check if group already exists
	    if (_self._groups.hasOwnProperty(_options.name)) {
        console.warn("Group with name already exist:", _options.name);
	    } else {
        _self._groups[_options.name] = {
          options: _options,
          notifs: []
        }
        console.info("New group was created", _self._groups[_options.name]);
      }
	  }
	  console.info("New notification module was registered", _self._currModuleIndex, _self._configs);
  }
  
  /**
   * Pulls notifications of the specified group 
   * 
   * @param {any} groupName name of the group
   */
  this.MNModule.prototype.pullGroupNotifs = function(groupName) {
    var _self = this;
    if (_self._groups.hasOwnProperty(groupName)) {
      for (var i = 0; i < _self._groups[groupName].notifs.length;) {
        var id = _self._groups[groupName].notifs[i];
        _self._pull({id: id, group: groupName});
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
    this._createEmptyGroup(options); 
  }

  /**
   * Pushes the new notification 
   * 
   * @param {any} options - options of the notification
   */
  this.MNModule.prototype.pushNotif = function(options) {
    var NOT_DEFINED = "";
    
    var defaultOptions = {
      title: "",
      message: "",
      icon: NOT_DEFINED,
      closeCond: 5000,//ms
      type: "notice",//notice, warning, error, success
      group: "common"
    }

    var _options = applyArgs(options, defaultOptions);

    var _self = this;
    /* returns icon depending on type */
    function _getIcon() {
      var _icons = {
        "notice": "info-sign",
        "success": "ok-sign",
        "warning": "warning-sign",
        "error": "remove"
      }
      return ((_options.icon == NOT_DEFINED) ? _icons[_options.type] : _options.icon);
    }
    /* returns filled template */
    function _getTemplate() {
      var template = (
        "<div role='mn-alert' id='" + _self._getNotificationElementId(true) + "' class='mn-notification-container mn-alert mn-alert-" + _options.type + " mn-alert-dismissible'>" +
          "<button type='button' class='mn-close-btn mn-close'><span aria-hidden='true'>&times;</span></button>" +
          "<div class='mn-notification-container-content'>"+ 
            "<i class='glyphicon glyphicon-" + _getIcon() + "'></i>" + 
            "<span> <strong>" + _options.title + "</strong> " + _options.message + "</span>" + 
          "</div>" +
        "</div>"
      ); 
      return template;
    }
    /* pushes new notifications */
    function _push() {
      var pushInner = function() {
        _self._incCount();
        _self._groups[_options.group].notifs.push(_self._getNotificationElementId()); 
        if (_self._configs.direction == "fromTop") {
          $(_getTemplate()).appendTo("#" + _self._currModuleIndex).hide().fadeIn(300);
		} else {
		  $(_getTemplate()).prependTo("#" + _self._currModuleIndex).hide().fadeIn(300);
		}		
        
        return { id: _self._getNotificationElementId(), group: _options.group };
      }
      //group is not exist yet
      if (!_self._groups.hasOwnProperty(_options.group)) {
        _self._createEmptyGroup({ name: _options.group });
        return pushInner();
      //group exists
      } else {
        //group is greedy
        if (_self._groups[_options.group].options.greedy) {
          //greedy group already has a member
          if (_self._groups[_options.group].notifs.length >= 1) {
            console.warn("Greedy group " + _options.group + " already has a member");
            return false;      
          //greedy group is empty
          } else {
            return pushInner();
          }
        //group is not greedy
        } else {
          return pushInner();
        }
      }
    }
    /* sets time after which notification will be closed */
    function _setCloseConditions(notif) {
      $(_self._getCloseBtnSelector(notif.id)).on("click", function() {
        _self._pull(notif);
      });
      if (_options.closeCond !== false) {
        if (typeof _options.closeCond === "function") {

        } else {
          setTimeout(function() {
            _self._pull(notif);
          }, _options.closeCond); 
        }
      }
    }
  
    var pushResult = _push();
  
    if (pushResult) {
      _setCloseConditions(pushResult);
      console.info("New notification was pushed", _self._getNotificationElementId(true), _options);
    } else {
      console.warn("New notification wasn't pushed", _options);
    }
  }
})(jQuery);