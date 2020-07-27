import {
  generateId,
  getDefaultTemplate,
  getCustomTemplate,
  getIconNameByType,
  getCloseButtonSelector,
} from './utils/utils';
import {
  getElement,
  addOnClick,
  getElementFromHtmlString,
  appendElementToContainerWithFadeIn,
  prependElementToContainerWithFadeIn,
  removeElementWithFadeOut,
} from './utils/domUtils';
import { DIRECTION } from './const';

const FADE_MS = 200;

/**
 * @constructs MNNotification
 * @param {Object} notifOptions - options of the new notification
 */
export class MNNotification {
  constructor(notifOptions) {
    this.id = generateId();
    this.onBeforeRemove = () => {};
    this.options = notifOptions;
    this.options.icon = notifOptions.icon
      ? notifOptions.icon
      : getIconNameByType(notifOptions.type);
  }

  /**
   * Pulls notification
   */
  pull() {
    let _self = this;
    if (typeof _self.onBeforeRemove === 'function') {
      _self.onBeforeRemove(_self);
      removeElementWithFadeOut(`#${_self.id}`, FADE_MS);
    }
  }

  /**
   * Appends notification element to specified container
   * @param {Object} additionalOptions - Options of the appending
   */
  appendToContainer(additionalOptions) {
    let _self = this;
    this.onBeforeRemove = additionalOptions.onBeforeRemove;

    let _getTemplate = function() {
      let template =
        typeof _self.options.template == 'function'
          ? getCustomTemplate(
              _self.id,
              _self.options.template(_self.options.title, _self.options.message)
            )
          : getDefaultTemplate(
              _self.id,
              _self.options.title,
              _self.options.message,
              _self.options.type,
              _self.options.icon
            );
      return template;
    };

    (function append() {
      const container = getElement(`#${additionalOptions.moduleId}`);
      if (additionalOptions.direction == DIRECTION.FROM_TOP) {
        appendElementToContainerWithFadeIn(
          container,
          getElementFromHtmlString(_getTemplate()),
          FADE_MS
        );
      } else {
        prependElementToContainerWithFadeIn(
          container,
          getElementFromHtmlString(_getTemplate()),
          FADE_MS
        );
      }
    })();

    (function setCloseConditions() {
      addOnClick(getCloseButtonSelector(_self.id), () => {
        _self.pull();
      });
      if (_self.options.closeCond !== false) {
        if (typeof _self.options.closeCond === 'function') {
        } else {
          setTimeout(() => {
            _self.pull();
          }, _self.options.closeCond);
        }
      }
    })();
  }
}
