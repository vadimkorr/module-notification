import { applyArgs } from './utils/utils';

/**
 * @constructs MNGroup - Private class of the group
 * @param {Object} groupOptions - Options of the new group
 */
export function MNGroup(groupOptions) {
  let _defaultOptions = {
    name: 'common',
    greedy: false,
  };
  this.options = applyArgs(groupOptions, _defaultOptions);
  this._notifications = new Map();
}

MNGroup.prototype._getId = function() {
  return this.options.name;
};

/**
 * Pushes new notification to the group
 * @param {Object} notif - Instance of the notification
 */
MNGroup.prototype.pushNotif = function(notification) {
  this._notifications.set(notification.id, notification);
};

/**
 * Detects if group has a notification with id
 * @param {String} id - Id of the notification
 * @returns Index of the notification in the array
 */
MNGroup.prototype.hasNotification = function(id) {
  return this._notifications.has(id);
};

MNGroup.prototype.removeNotification = function(id) {
  this._notifications.delete(id);
};

MNGroup.prototype.getNotifications = function() {
  return this._notifications;
};

MNGroup.prototype.getLength = function() {
  return this._notifications.size;
};

MNGroup.prototype.removeNotifications = function() {
  this._notifications.forEach(notification => {
    notification.pull();
  });
  this._notifications = new Map();
};
