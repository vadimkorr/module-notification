import {
  generateId,
  getDefaultTemplate,
  getCustomTemplate,
  getCloseButtonSelector,
} from './utils/utils'
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
} from './utils/domUtils'
import { ADD_ELEMENT_MODE } from './const'

const FADE_MS = 500
const fns = {
  [ADD_ELEMENT_MODE.PUSH]: appendElementToContainer,
  [ADD_ELEMENT_MODE.UNSHIFT]: prependElementToContainer,
}

/**
 * @constructs MNNotification
 * @param {Object} options - options of the new notification
 */

export function MNNotification(options) {
  this.id = generateId()
  this.options = options
  this.onBeforeRemove = null
}

/**
 * Pulls notification
 */
MNNotification.prototype.remove = function() {
  typeof this.onBeforeRemove === 'function' && this.onBeforeRemove(this)
  const el = getElementById(this.id)
  removeClass(el, 'show')
  setTimeout(() => {
    removeElementById(this.id)
  }, FADE_MS)
}

/**
 * Appends notification element to specified container
 * @param {Object} options - Options of the appending
 */
MNNotification.prototype._addToContainer = function(options) {
  this.onBeforeRemove = options.onBeforeRemove

  let template =
    typeof this.options.template == 'function'
      ? getCustomTemplate(
          this.id,
          this.options.template({
            title: this.options.title,
            message: this.options.message,
          })
        )
      : getDefaultTemplate(
          this.id,
          this.options.title,
          this.options.message,
          this.options.type
        )

  const el = getElementFromHtmlString(template)
  addClass(el, `mn-${this.options.animation}`)

  fns[options.mode](getElement(`#${options.moduleId}`), el)
  setTimeout(() => {
    addClass(el, 'show')
  }, 10)

  const setCloseConditions = () => {
    addOnClick(getCloseButtonSelector(this.id), () => {
      this.remove()
    })
    this.options.closeInMS &&
      setTimeout(() => {
        this.remove()
      }, this.options.closeInMS)
  }
  setCloseConditions()
}
