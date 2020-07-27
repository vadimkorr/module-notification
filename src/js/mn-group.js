import { applyArgs } from './utils/utils';

/**
 * @constructs MNGroup - Private class of the group
 * @param {Object} groupOptions - Options of the new group
 */
export class MNGroup {
  constructor(groupOptions) {
    let _defaultOptions = {
      name: 'common',
      greedy: false,
    };
    this.options = applyArgs(groupOptions, _defaultOptions);
    this.notifs = [];
  }

  /**
   * Pushes new notification to the group
   * @param {Object} notif - Instance of the notification
   */
  pushNotif(notif) {
    this.notifs = [...this.notifs, notif];
  }

  /**
   * Detects if group has a notification with id
   * @param {String} id - Id of the notification
   * @returns Index of the notification in the array
   */
  hasNotif(id) {
    let index = -1;
    this.notifs.forEach((n, ind) => {
      if (n.id == id) {
        index = ind;
        return;
      }
    });
    return index;
  }
}
