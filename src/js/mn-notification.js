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
    const animation = options.animation || 'slide'; // 'fade', 'swing', 'rotate', 'slide'

    const el = getElementFromHtmlString(_getTemplate());
    addClass(el, `mn-${animation}`);

    const fns = {
      [DIRECTION.FROM_TOP]: appendElementToContainer,
      [DIRECTION.FROM_BOTTOM]: prependElementToContainer,
    };
    fns[options.direction](getElement(`#${options.moduleId}`), el);
    setTimeout(() => {
      addClass(el, 'show');
    }, 10);
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
