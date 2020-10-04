import { applyArgs } from './utils/utils'

const defaultOptions = {
  id: null, // required
  greedy: false,
}

/**
 * @constructs MNGroup - Class of the group
 * @param {Object} groupOptions - Options of the new group
 */
export function MNGroup(groupOptions) {
  this.options = applyArgs(groupOptions, defaultOptions)
  if (!this.options.id) {
    throw new Error('Group id is required')
  }
  this._notifications = new Map()
}

/**
 * Adds new notification to the group
 * @param {Object} notification - instance of the notification
 */
MNGroup.prototype._addNotification = function(notification) {
  this._notifications.set(notification.id, notification)
}

/**
 * Detects if group has a notification with id
 * @param {String} id - id of the notification
 * @returns boolean value
 */
MNGroup.prototype._hasNotification = function(id) {
  return this._notifications.has(id)
}

/**
 * Removes notification from the group
 * @param {String} id - id of the notification
 */
MNGroup.prototype._removeNotification = function(id) {
  this._notifications.delete(id)
}

/**
 * Returnes all notifications from the group
 * @returns list of notifications
 */
MNGroup.prototype._getNotifications = function() {
  return this._notifications
}

/**
 * Returnes count of notifications in the group
 * @returns number
 */
MNGroup.prototype._getLength = function() {
  return this._notifications.size
}

/**
 * Returnes if group is empty
 * @returns boolean
 */
MNGroup.prototype._isEmpty = function() {
  return this._getLength() === 0
}

// The following methods used in tests only
/**
 * Returnes id of the group
 * @returns id
 */
MNGroup.prototype.__getId = function() {
  return this.options.id
}
