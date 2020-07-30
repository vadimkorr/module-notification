import { MNGroup } from './mn-group'
import { MNNotification } from './mn-notification'
import { applyArgs, generateId } from './utils/utils'
import { getElement, appendElementToContainer } from './utils/domUtils'
import { ICONS, ADD_ELEMENT_MODE } from './const'

const defaultNotificationOptions = {
  title: '',
  message: '',
  groupId: null, // required
  closeInMS: 5000,
  type: ICONS.INFO, // "info", "warning", "error", "success"
  template: undefined, // function(title, message) { return "<span>" + title + "</span>"; }
}

const defaultModuleOptions = {
  container: null, // required
  onNotifsNumberChange: undefined, // e.g. (number) => { console.debug("Number of notifications", number); },
}

/**
 * @constructs MNModule
 * @param {Object} moduleOptions - Options of the new module
 */
export const MNModule = function(moduleOptions) {
  this.options = applyArgs(moduleOptions, defaultModuleOptions)

  this.numberOfNotifs = 0
  this.groups = new Map()
  this.id = generateId()

  //append module container to the specified container
  appendElementToContainer(
    getElement(this.options.container),
    `<div id='${this.id}' class='mn-module-container'></div>`
  )
  console.debug('New notification module was registered', this.id, this.options)
}

MNModule.prototype.setNotificationsCount = function(count) {
  this.numberOfNotifs = Math.max(count, 0)
  if (typeof this.options.onNotifsNumberChange === 'function') {
    this.options.onNotifsNumberChange(this.numberOfNotifs)
  }
}

/**
 * Detects if group with specified id exist
 * @param {String} groupName - Name of the group
 * @returns Boolean value
 */
// used in tests only
MNModule.prototype.getGroup = function(id) {
  return this.groups.get(id)
}
// used in tests only
MNModule.prototype.getGroups = function() {
  return this.groups.values()
}
// used in tests only
MNModule.prototype.getGroupsCount = function() {
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

/**
 * Pulls notifications of the specified group
 * @param {String} groupName - Name of the group
 */
MNModule.prototype.pullGroupNotifs = function(id) {
  if (!this.groups.has(id))
    throw new Error(`Group with id ${id} does not exist`)
  this.groups
    .get(id)
    .getNotifications()
    .forEach(notification => notification.pull())
  console.debug('Group notifications were removed:', id)
}

/**
 * Pulls all notifications from current module
 */
MNModule.prototype.pullAll = function() {
  this.groups.forEach((_, groupId) => this.pullGroupNotifs(groupId))
}

MNModule.prototype._onBeforeRemove = function(mnNotification) {
  const group = this.groups.get(mnNotification.options.groupId)
  if (group.hasNotification(mnNotification.id)) {
    group.removeNotification(mnNotification.id)
  }
  this.setNotificationsCount(this.numberOfNotifs - 1)
}

MNModule.prototype._createNotification = function(options) {
  this.setNotificationsCount(this.numberOfNotifs + 1)

  const notification = new MNNotification(options)
  notification.addToContainer({
    moduleId: this.id,
    mode: options.mode,
    onBeforeRemove: n => this._onBeforeRemove(n),
  })
  this.groups.get(options.groupId).addNotification(notification)
  return notification
}

MNModule.prototype._addNotification = function(options) {
  const _options = applyArgs(options, defaultNotificationOptions)

  this.createEmptyGroup({ id: _options.groupId })
  const group = this.groups.get(_options.groupId)
  const _pushResult =
    !group.options.greedy || group.isEmpty()
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
