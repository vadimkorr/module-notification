(function($) {

  /* ===== Commons ===== */
  // Utility method to extend defaults with user options
  function extendDefaults(source, properties) {
    let property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }
  
  function applyArgs(argum, defaults) {
    if (argum && typeof argum === "object") {
      return extendDefaults(defaults, argum);
    } else {
		return defaults;
	}
  }
  

  /* ===== MNConfig ===== */
  this.MNConfig = function() {
    let _defaultConfigs = {
      container: "#notifications",
    }
	
	this._configs = applyArgs(arguments[0], _defaultConfigs);

	this._currModuleIndex = (+new Date).toString(16);
	this._currNotifIndex = 0;
	this._groups = {};

	this._decIndex = function() {
      this._currNotifIndex > 0 ? this._currNotifIndex-- : this._currNotifIndex = 0;
	  console.log("dec index = " + this._currNotifIndex);
    }

	this._incCounter = function() {
      this._currNotifIndex++;
	  console.log("index = " + this._currNotifIndex);
	  return this._currNotifIndex;
    }

	this._pull = function(notif) {
	  var index = this._groups[notif.group].notifs.indexOf(notif.id);

	  if (index > -1) {
		//dec index
		this._decIndex();
		//pull from UI
		$(notif.id).remove();//.fadeOut('fast');
	    this._groups[notif.group].notifs.splice(index, 1);
	  }
	}
	
	  this._createEmptyGroup = function() {
		  let _defaultOptions = {
			  name: "common",
			  greedy: false
		  }
		  
		  let _options = applyArgs(arguments[0], _defaultOptions);
		  
		  this._groups[_options.name] = {
			  options: _options,
			  notifs: []
		  }
	  }


  }
  
  this.MNConfig.prototype = {
	  get configs() {
		  console.log(this._configs);
		  return this._configs
	  }
  }

  this.MNConfig.prototype.pullGroup = function(group) {
	for (let i = 0; i < this._groups[group].notifs.length;) {
		console.log("LEN = " + this._groups[group].notifs.length);
		let id = this._groups[group].notifs[i];
		this._pull({id: id, group: group});
	}
  }
  

  
  this.MNConfig.prototype.createEmptyGroup = function(options) {
    this._createEmptyGroup(options); 
  }

  this.MNConfig.prototype.put = function() {
    let defaultOptions = {
      title: "Title",
      message: "Message",
      img: "[img]",
      closeCond: 5000,//ms
	  type: "info",//"success", "warning", "danger"
	  group: "common"
    }

    let _options = applyArgs(arguments[0], defaultOptions);

	let _self = this;
	

	
	function _getNotificationId(withoutPrefix) {
		let id = (withoutPrefix ? '' : '#') + "mn-container-" + _self._currModuleIndex + "_" + _self._currNotifIndex;
		console.log(id);
		return id; 
	}
	
	function _getCloseBtnSelector(id) {
		let selector = id + " > .mn-close-btn";
		console.log(selector);
		return selector;
	}



    function _getTemplate() {
	  let template = (
	    "<div role='alert' id='" + _getNotificationId(true) + "' class='alert alert-" + _options.type + " alert-dismissible'>" +
		  "<button type='button' class='mn-close-btn close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
          "<div id='nn-header'>"+        
            _options.img + _options.title +
          "</div>" +
          "<div id='nn-content'>" +
            _options.message +
          "</div>" +
        "</div>"
	  ); 
      return template;
    }

    function _push() {
      let index = _self._incCounter();
	  let id = _getNotificationId();
	  if (_self._groups[_options.group] == undefined) {
		  _self._createEmptyGroup({ name: _options.group });
		  //_self._groups[_options.group].notifs = [];
	  } 
	  _self._groups[_options.group].notifs.push(id);
      $(_getTemplate()).appendTo(_self._configs.container);
	  return { id: id, group: _options.group};
    }

	function _setCloseConditions(notif) {
	  $(_getCloseBtnSelector(notif.id)).on("click", function() {
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

    _setCloseConditions(_push());
  }
})(jQuery);