import * as $ from 'jquery';
import { MNGroup } from './MNGroup';
import { MNNotification } from './MNNotification';
import { applyArgs, generateId } from './utils';

/**
 * @constructs MNModule
 * @param {Object} moduleOptions - Options of the new module
 */
export class MNModule {
  constructor(moduleOptions) {
    let _defaultModuleOptions = {
      container: '#notifications',
      onNotifsNumberChange: undefined, //e.g. (number) => { console.debug("Number of notifications", number); },
      direction: 'fromTop', //"fromTop", "fromBottom"
    };
    this.options = applyArgs(moduleOptions, _defaultModuleOptions);

    this.numberOfNotifs = 0;
    this.groups = {};
    this.id = generateId();

    //append module container to the specified container
    $("<div id='" + this.id + "' class='mn-module-container'></div>").appendTo(
      this.options.container,
    );
    console.debug(
      'New notification module was registered',
      this.id,
      this.options,
    );
  }

  /**
   * Detects if group with specified name exist
   * @param {String} groupName - Name of the group
   * @returns Boolean value
   */
  isGroupExist(groupName) {
    return this.groups.hasOwnProperty(groupName);
  }

  /**
   * Creates an empty group
   * @param {Object} groupOptions - Options of the group
   * @returns Boolean value of result
   */
  createEmptyGroup(groupOptions) {
    if (this.isGroupExist(groupOptions.name)) {
      console.debug('Group with name already exist:', groupOptions.name);
      return false;
    } else {
      this.groups[groupOptions.name] = new MNGroup(groupOptions);
      console.debug('New group was created', groupOptions.name);
      return true;
    }
  }

  /**
   * Pulls notifications of the specified group
   * @param {String} groupName - Name of the group
   */
  pullGroupNotifs(groupName) {
    if (this.groups.hasOwnProperty(groupName)) {
      for (let i = 0; i < this.groups[groupName].notifs.length; ) {
        this.groups[groupName].notifs[i].pull();
      }
      console.debug('Group notifications were removed:', groupName);
    } else {
      console.debug("Group doesn't exist:", groupName);
    }
  }

  /**
   * Pulls all notifications from current module
   */
  pullAll() {
    for (let groupName in this.groups) {
      for (let i = 0; i < this.groups[groupName].notifs.length; ) {
        this.groups[groupName].notifs[i].pull();
      }
      console.debug('Group notifications were removed:', groupName);
    }
  }

  /**
   * Pushes the new notification
   * @param {Object} options - Options of the notification
   * @returns {Object} notif instance
   */
  pushNotif(notifOptions) {
    let _self = this;
    let _defaultNotifOptions = {
      title: '',
      message: '',
      closeCond: 5000, //ms
      group: 'common',
      template: undefined, //function(title, message) { return "<span>" + title + "</span>"; }
      icon: undefined,
      type: 'notice', //"notice", "warning", "error", "success"
    };
    let _notifOptions = applyArgs(notifOptions, _defaultNotifOptions);

    function _onBeforeRemove(mnNotification) {
      let hasInd = _self.groups[mnNotification.options.group].hasNotif(
        mnNotification.id,
      );
      if (hasInd != -1) {
        (function _decCount() {
          _self.numberOfNotifs > 0
            ? _self.numberOfNotifs--
            : (_self.numberOfNotifs = 0);
          _self.callOnNotifsNumberChange(_self.numberOfNotifs);
        })();
        _self.groups[mnNotification.options.group].notifs.splice(hasInd, 1);
      }
    }

    function _pushInner(notifOptions) {
      (function incCount() {
        _self.numberOfNotifs++;
        _self.callOnNotifsNumberChange(_self.numberOfNotifs);
      })();
      let additionalOptions = {
        moduleId: _self.id,
        direction: _self.options.direction,
        onBeforeRemove: _onBeforeRemove,
      };
      let notif = new MNNotification(notifOptions);
      notif.appendToContainer(additionalOptions);
      _self.groups[notifOptions.group].pushNotif(notif);
      return notif;
    }

    let _pushResult = null;
    //group is not exist yet
    if (!_self.isGroupExist(_notifOptions.group)) {
      _self.createEmptyGroup({ name: _notifOptions.group });
      _pushResult = _pushInner(_notifOptions);
      //group exists
    } else {
      //group is not not greedy or is empty
      if (
        !_self.groups[_notifOptions.group].options.greedy ||
        _self.groups[_notifOptions.group].notifs.length < 1
      ) {
        _pushResult = _pushInner(_notifOptions);
      } else {
        _pushResult = null;
      }
    }

    if (_pushResult) {
      console.debug('New notification was pushed', _pushResult, _notifOptions);
      return _pushResult;
    } else {
      console.debug("New notification wasn't pushed", _notifOptions);
      return null;
    }
  }

  /**
   * Callback function rises on changin the number of notifications
   * @param {Number} number - current number of notifications
   */
  callOnNotifsNumberChange(number) {
    if (typeof this.options.onNotifsNumberChange === 'function') {
      this.options.onNotifsNumberChange(number);
    }
  }
}
