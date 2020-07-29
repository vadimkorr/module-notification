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
  this._notifications = [];
}

/**
 * Pushes new notification to the group
 * @param {Object} notif - Instance of the notification
 */
MNGroup.prototype.pushNotif = function(notification) {
  this._notifications = [...this._notifications, notification];
};

/**
 * Detects if group has a notification with id
 * @param {String} id - Id of the notification
 * @returns Index of the notification in the array
 */
MNGroup.prototype.hasNotif = function(id) {
  let index = -1;
  this._notifications.forEach((n, ind) => {
    if (n.id == id) {
      index = ind;
      return;
    }
  });
  return index;
};

MNGroup.prototype.removeNotification = function(id) {
  this._notifications.filter(n => n.id !== id);
};

MNGroup.prototype.getNotifications = function*() {
  for (let i = 0; i < this._notifications.length; i++) {
    yield this._notifications[i];
  }
};

MNGroup.prototype.getLength = function() {
  return this._notifications.length;
};

MNGroup.prototype.removeNotifications = function() {
  // use while, pull
  for (let i = 0; i < this._notifications.length; i++) {
    this._notifications[i].pull();
  }
  this._notifications = [];
};
