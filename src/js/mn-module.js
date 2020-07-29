import { MNGroup } from './mn-group';
import { MNNotification } from './mn-notification';
import { applyArgs, generateId } from './utils/utils';
import { getElement, appendElementToContainer } from './utils/domUtils';
import { ICONS, DIRECTION } from './const';

/**
 * @constructs MNModule
 * @param {Object} moduleOptions - Options of the new module
 */
export const MNModule = function(moduleOptions) {
  let _defaultModuleOptions = {
    container: '#notifications',
    onNotifsNumberChange: undefined, // e.g. (number) => { console.debug("Number of notifications", number); },
    direction: DIRECTION.FROM_TOP, // "fromTop", "fromBottom"
  };
  this.options = applyArgs(moduleOptions, _defaultModuleOptions);

  this.numberOfNotifs = 0;
  this.groups = new Map();
  this.id = generateId();

  //append module container to the specified container
  appendElementToContainer(
    getElement(this.options.container),
    `<div id='${this.id}' class='mn-module-container'></div>`
  );
  console.debug(
    'New notification module was registered',
    this.id,
    this.options
  );
};

MNModule.prototype.setNotificationsCount = function(count) {
  this.numberOfNotifs = Math.max(count, 0);
  if (typeof this.options.onNotifsNumberChange === 'function') {
    this.options.onNotifsNumberChange(this.numberOfNotifs);
  }
};

/**
 * Detects if group with specified name exist
 * @param {String} groupName - Name of the group
 * @returns Boolean value
 */
MNModule.prototype.getGroup = function(id) {
  return this.groups.get(id);
};
MNModule.prototype.getGroups = function() {
  return this.groups.values();
};
MNModule.prototype.getGroupsCount = function() {
  return this.groups.size;
};

/**
 * Creates an empty group
 * @param {Object} groupOptions - Options of the group
 * @returns Boolean value of result
 */
MNModule.prototype.createEmptyGroup = function(groupOptions) {
  if (this.groups.has(groupOptions.name)) {
    console.debug('Group with name already exist:', groupOptions.name);
    return false;
  }
  this.groups.set(groupOptions.name, new MNGroup(groupOptions));
  console.debug('New group was created', groupOptions.name);
  return true;
};

/**
 * Pulls notifications of the specified group
 * @param {String} groupName - Name of the group
 */
MNModule.prototype.pullGroupNotifs = function(groupName) {
  if (!this.groups.has(groupName))
    throw new Error(`Group with id ${groupName} does not exist`);
  this.groups
    .get(groupName)
    .getNotifications()
    .forEach(notification => {
      notification.pull();
    });
  console.debug('Group notifications were removed:', groupName);
};

/**
 * Pulls all notifications from current module
 */
MNModule.prototype.pullAll = function() {
  this.groups.forEach((_, groupId) => {
    this.pullGroupNotifs(groupId);
    console.debug('Group notifications were removed:', groupId);
  });
};

MNModule.prototype._onBeforeRemove = function(mnNotification) {
  if (
    this.groups
      .get(mnNotification.options.group)
      .hasNotification(mnNotification.id)
  ) {
    this.setNotificationsCount(this.numberOfNotifs - 1);
    this.groups
      .get(mnNotification.options.group)
      .removeNotification(mnNotification.id);
  }
};

MNModule.prototype.createNotification = function(notifOptions) {
  this.setNotificationsCount(this.numberOfNotifs + 1);

  const notification = new MNNotification(notifOptions);
  notification.appendToContainer({
    moduleId: this.id,
    direction: this.options.direction, // deprecated
    onBeforeRemove: n => this._onBeforeRemove(n),
  });
  this.groups.get(notifOptions.group).pushNotif(notification);
  return notification;
};

/**
 * Pushes the new notification
 * @param {Object} options - Options of the notification
 * @returns {Object} notif instance
 */
MNModule.prototype.pushNotif = function(notifOptions) {
  let _defaultNotifOptions = {
    title: '',
    message: '',
    closeCond: 5000, // ms
    group: 'common',
    template: undefined, // function(title, message) { return "<span>" + title + "</span>"; }
    icon: undefined,
    type: ICONS.INFO, // "notice", "warning", "error", "success"
  };
  let _notifOptions = applyArgs(notifOptions, _defaultNotifOptions);

  this.createEmptyGroup({ name: _notifOptions.group });

  const _pushResult =
    !this.groups.get(_notifOptions.group).options.greedy ||
    this.groups.get(_notifOptions.group).getLength() < 1
      ? this.createNotification(_notifOptions)
      : null;

  console.debug('New notification', _pushResult, _notifOptions);
  return _pushResult;
};
