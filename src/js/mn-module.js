import { MNGroup } from './mn-group'
import { MNNotification } from './mn-notification'
import { applyArgs, generateId } from './utils/utils'
import { getElement, appendElementToContainer } from './utils/domUtils'
import { ICONS, ADD_ELEMENT_MODE, REMOVE_NOTIFICATION_DELAY_MS } from './const'

const defaultNotificationOptions = {
  title: '',
  message: '',
  groupId: 'default',
  closeInMS: 5000,
  animation: 'fade', // 'fade', 'swing', 'rotate', 'slide'
  type: ICONS.INFO, // "info", "warning", "error", "success"
  template: null, // function(title, message) { return "<span>" + title + "</span>"; }
}

const defaultModuleOptions = {
  container: null, // required
  onNotificationsCountChange: null, // e.g. (number) => { console.debug("Number of notifications", number); },
}

/**
 * @constructs MNModule
 * @param {Object} moduleOptions - Options of the new module
 */
export const MNModule = function(moduleOptions) {
  this.options = applyArgs(moduleOptions, defaultModuleOptions)

  this.notificationsCount = 0
  this.groups = new Map()
  this.id = generateId()

  //append module container to the specified container
  appendElementToContainer(
    getElement(this.options.container),
    `<div id='${this.id}' class='mn-module-container'></div>`
  )
  console.debug('New notification module was registered', this.id, this.options)
}

MNModule.prototype._setNotificationsCount = function(count) {
  this.notificationsCount = Math.max(count, 0)
  if (typeof this.options.onNotificationsCountChange === 'function') {
    this.options.onNotificationsCountChange(this.notificationsCount)
  }
}

/**
 * Detects if group with specified id exist
 * @param {String} groupName - Name of the group
 * @returns Boolean value
 */
// used in tests only
MNModule.prototype._getGroup = function(id) {
  return this.groups.get(id)
}
// used in tests only
MNModule.prototype._getGroups = function() {
  return this.groups.values()
}
// used in tests only
MNModule.prototype._getGroupsCount = function() {
  return this.groups.size
}

/**
 * Creates an empty group
 * @param {Object} groupOptions - Options of the group
 * @returns Boolean value of result
 */
MNModule.prototype.createEmptyGroup = function(groupOptions) {
  if (this.groups.has(groupOptions.id)) {
    console.debug('Group with id already exist:', groupOptions.id)
    return false
  }
  this.groups.set(groupOptions.id, new MNGroup(groupOptions))
  console.debug('New group was created', groupOptions.id)
  return true
}

MNModule.prototype._removeGroupNotifications = function(
  id,
  notificationStartIndex = 0
) {
  if (!this.groups.has(id))
    throw new Error(`Group with id ${id} does not exist`)
  let index = notificationStartIndex
  this.groups
    .get(id)
    ._getNotifications()
    .forEach(notification => {
      setTimeout(() => {
        notification.remove()
      }, index * REMOVE_NOTIFICATION_DELAY_MS)
      index++
    })

  console.debug('Group notifications were removed:', id)
}

/**
 * Pulls notifications
 * @param {String} id - id of the group, if not specified removes all notifications
 */
MNModule.prototype.removeNotifications = function(id) {
  if (id) {
    this._removeGroupNotifications(id)
  } else {
    let notificationStartIndex = 0
    this.groups.forEach((_, groupId) => {
      this._removeGroupNotifications(groupId, notificationStartIndex)
      notificationStartIndex += this.groups.get(groupId)._getLength()
    })
  }
}

MNModule.prototype._onBeforeRemove = function(notification) {
  const group = this.groups.get(notification.options.groupId)
  if (group._hasNotification(notification.id)) {
    group._removeNotification(notification.id)
  }
  this._setNotificationsCount(this.notificationsCount - 1)
}

MNModule.prototype._createNotification = function(options) {
  this._setNotificationsCount(this.notificationsCount + 1)

  const notification = new MNNotification(options)
  notification._addToContainer({
    moduleId: this.id,
    mode: options.mode,
    onBeforeRemove: n => this._onBeforeRemove(n),
  })
  this.groups.get(options.groupId)._addNotification(notification)
  return notification
}

MNModule.prototype._addNotification = function(options) {
  const _options = applyArgs(options, defaultNotificationOptions)

  this.createEmptyGroup({ id: _options.groupId })
  const group = this.groups.get(_options.groupId)
  const _pushResult =
    !group.options.greedy || group._isEmpty()
      ? this._createNotification(_options)
      : null

  console.debug('New notification', _pushResult, _options)
  return _pushResult
}

/**
 * Pushes the new notification
 * @param {Object} options - Options of the notification
 * @returns {Object} notif instance
 */
MNModule.prototype.pushNotification = function(options) {
  return this._addNotification({ ...options, mode: ADD_ELEMENT_MODE.PUSH })
}

MNModule.prototype.unshiftNotification = function(options) {
  return this._addNotification({ ...options, mode: ADD_ELEMENT_MODE.UNSHIFT })
}
