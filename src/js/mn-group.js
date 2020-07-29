import { applyArgs } from './utils/utils';

const defaultOptions = {
  id: null,
  greedy: false,
};

/**
 * @constructs MNGroup - Class of the group
 * @param {Object} groupOptions - Options of the new group
 */
export function MNGroup(groupOptions) {
  this.options = applyArgs(groupOptions, defaultOptions);
  if (!this.options.id) {
    throw new Error('Group id is required');
  }
  this._notifications = new Map();
}

/**
 * Returnes id of the group
 * @returns id
 */
MNGroup.prototype.getId = function() {
  return this.options.id;
};

/**
 * Adds new notification to the group
 * @param {Object} notification - instance of the notification
 */
MNGroup.prototype.addNotification = function(notification) {
  this._notifications.set(notification.id, notification);
};

/**
 * Detects if group has a notification with id
 * @param {String} id - id of the notification
 * @returns boolean value
 */
MNGroup.prototype.hasNotification = function(id) {
  return this._notifications.has(id);
};

/**
 * Removes notification from the group
 * @param {String} id - id of the notification
 */
MNGroup.prototype.removeNotification = function(id) {
  this._notifications.delete(id);
};

/**
 * Returnes all notifications from the group
 * @returns list of notifications
 */
MNGroup.prototype.getNotifications = function() {
  return this._notifications;
};

/**
 * Returnes count of notifications in the group
 * @returns number
 */
MNGroup.prototype.getLength = function() {
  return this._notifications.size;
};

/**
 * Returnes if group is empty
 * @returns boolean
 */
MNGroup.prototype.isEmpty = function() {
  return this._notifications.size === 0;
};
