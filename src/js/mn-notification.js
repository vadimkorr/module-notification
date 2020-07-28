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
  appendElementToContainer,
  removeElementById,
  getElementById,
  removeClass,
} from './utils/domUtils';
import { DIRECTION } from './const';

const FADE_MS = 500;

/**
 * @constructs MNNotification
 * @param {Object} notifOptions - options of the new notification
 */

export function MNNotification(notifOptions) {
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
MNNotification.prototype.pull = function() {
  if (typeof this.onBeforeRemove === 'function') {
    this.onBeforeRemove(this);
    const el = getElementById(this.id);
    removeClass(el, 'show');
    setTimeout(() => {
      removeElementById(this.id);
    }, FADE_MS);
    // removeElementWithFadeOut(`#${this.id}`, FADE_MS);
  }
};

/**
 * Appends notification element to specified container
 * @param {Object} additionalOptions - Options of the appending
 */
MNNotification.prototype.appendToContainer = function(options) {
  this.onBeforeRemove = options.onBeforeRemove;

  const _getTemplate = () => {
    let template =
      typeof this.options.template == 'function'
        ? getCustomTemplate(
            this.id,
            this.options.template(this.options.title, this.options.message)
          )
        : getDefaultTemplate(
            this.id,
            this.options.title,
            this.options.message,
            this.options.type,
            this.options.icon
          );
    return template;
  };

  const append = () => {
    const container = getElement(`#${options.moduleId}`);
    // if (options.direction == DIRECTION.FROM_TOP) {
    const el = getElementFromHtmlString(_getTemplate());
    appendElementToContainer(container, el);
    console.log('===>', el);
    setTimeout(function() {
      el.className = el.className + ' show';
    }, 10);
    // appendElementToContainerWithFadeIn(
    //   container,
    //   getElementFromHtmlString(_getTemplate()),
    //   FADE_MS
    // );
    // } else {
    //   prependElementToContainerWithFadeIn(
    //     container,
    //     getElementFromHtmlString(_getTemplate()),
    //     FADE_MS
    //   );
    // }
  };
  append();

  const setCloseConditions = () => {
    addOnClick(getCloseButtonSelector(this.id), () => {
      this.pull();
    });
    if (this.options.closeCond !== false) {
      if (typeof this.options.closeCond === 'function') {
      } else {
        setTimeout(() => {
          this.pull();
        }, this.options.closeCond);
      }
    }
  };
  setCloseConditions();
};
