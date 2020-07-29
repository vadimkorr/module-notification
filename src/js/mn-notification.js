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
  prependElementToContainer,
  appendElementToContainer,
  removeElementById,
  getElementById,
  removeClass,
  addClass,
} from './utils/domUtils';
import { ADD_ELEMENT_MODE } from './const';

const FADE_MS = 500;
const fns = {
  [ADD_ELEMENT_MODE.PUSH]: appendElementToContainer,
  [ADD_ELEMENT_MODE.UNSHIFT]: prependElementToContainer,
};

/**
 * @constructs MNNotification
 * @param {Object} notifOptions - options of the new notification
 */

export function MNNotification(notifOptions) {
  this.id = generateId();
  this.options = notifOptions;
  this.onBeforeRemove = [];
  this.options.icon = notifOptions.icon
    ? notifOptions.icon
    : getIconNameByType(notifOptions.type);
}

/**
 * Pulls notification
 */
MNNotification.prototype.pull = function() {
  this.onBeforeRemove.forEach(fn => {
    if (typeof fn === 'function') {
      fn(this);
    }
  });

  const el = getElementById(this.id);
  removeClass(el, 'show');
  setTimeout(() => {
    removeElementById(this.id);
  }, FADE_MS);
};

/**
 * Appends notification element to specified container
 * @param {Object} additionalOptions - Options of the appending
 */
MNNotification.prototype.addToContainer = function(options) {
  options.onBeforeRemove && this.onBeforeRemove.push(options.onBeforeRemove);

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

  const animation = options.animation || 'slide'; // 'fade', 'swing', 'rotate', 'slide'

  const el = getElementFromHtmlString(template);
  addClass(el, `mn-${animation}`);

  fns[options.mode](getElement(`#${options.moduleId}`), el);
  setTimeout(() => {
    addClass(el, 'show');
  }, 10);

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
