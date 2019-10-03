import * as $ from "jquery";
import { generateId, getDefaultTemplate } from './utils'

/**
 * @constructs MNNotification
 * @param {Object} notifOptions - options of the new notification
 */
export class MNNotification {
  constructor(notifOptions) {
    let _self = this;
    function _getIcon() {
      let icons = {
        notice: "info-sign",
        success: "ok-sign",
        warning: "warning-sign",
        error: "remove"
      };
      return notifOptions.icon == undefined
        ? icons[notifOptions.type]
        : notifOptions.icon;
    }

    this.id = generateId();
    this.onBeforeRemove = () => { };
    this.options = notifOptions;
    this.options.icon = _getIcon();
  };


  /**
   * Pulls notification
   */
  pull() {
    let _self = this;
    if (typeof _self.onBeforeRemove === "function") {
      _self.onBeforeRemove(_self);
      $("#" + _self.id).fadeOut(300, function () {
        $("#" + _self.id).remove();
      });
    }
  }

  /**
   * Appends notification element to specified container
   * @param {Object} additionalOptions - Options of the appending
   */
  appendToContainer(additionalOptions) {
    let _self = this;
    this.onBeforeRemove = additionalOptions.onBeforeRemove;

    let _getCustomTemplate = function (title, message) {
      let template =
        "<div id='" +
        _self.id +
        "'>" +
        _self.options.template(title, message) +
        "</div>";
      return template;
    };

    let _getTemplate = function () {
      let template =
        typeof _self.options.template == "function"
          ? _getCustomTemplate(_self.options.title, _self.options.message)
          : getDefaultTemplate(
            _self.id,
            _self.options.title,
            _self.options.message,
            _self.options.type,
            _self.options.icon
          );
      return template;
    };

    let _getCloseBtnSelector = function () {
      let selector = "#" + _self.id + " .mn-close-btn";
      return selector;
    };

    (function append() {
      if (additionalOptions.direction == "fromTop") {
        $(_getTemplate())
          .appendTo("#" + additionalOptions.moduleId)
          .hide()
          .fadeIn(300);
      } else {
        $(_getTemplate())
          .prependTo("#" + additionalOptions.moduleId)
          .hide()
          .fadeIn(300);
      }
    })();

    (function setCloseConditions() {
      $(_getCloseBtnSelector()).on("click", function () {
        _self.pull();
      });
      if (_self.options.closeCond !== false) {
        if (typeof _self.options.closeCond === "function") {
        } else {
          setTimeout(function () {
            _self.pull();
          }, _self.options.closeCond);
        }
      }
    })();
  }
}
