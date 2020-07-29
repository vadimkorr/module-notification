var myMNModule;

function addCommonNotif() {
  myMNModule.pushNotification({
    closeCond: false,
    title: 'Common Group notification',
    type: 'notice',
  });
}

function removeCommonGroup() {
  myMNModule.pullGroupNotifs('common');
}

function addTestGroup() {
  myMNModule.createEmptyGroup({
    name: 'test',
  });
}

function addTestNotification() {
  myMNModule.pushNotification({
    closeCond: false,
    title: 'Test Group notification',
    type: 'success',
    group: 'test',
  });
}

function removeTestGroup() {
  myMNModule.pullGroupNotifs('test');
}

function addNotifToGreedyGroup() {
  myMNModule.pushNotification({
    closeCond: false,
    title: 'Greedy Group notification',
    type: 'warning',
    group: 'greedy',
  });
}

function removeGreedyGroup() {
  myMNModule.pullGroupNotifs('greedy');
}

function addSuccessNotif() {
  myMNModule.pushNotification({
    closeCond: false,
    title: 'Success',
    message: 'Notification',
    type: 'success',
  });
}

function addNoticeNotif() {
  myMNModule.pushNotification({
    closeCond: false,
    title: 'Notice',
    message: 'Notification',
    type: 'notice',
  });
}

function addWarningNotif() {
  myMNModule.pushNotification({
    closeCond: false,
    title: 'Warning',
    message: 'Notification',
    type: 'warning',
  });
}

function addErrorNotif() {
  myMNModule.pushNotification({
    closeCond: false,
    title: 'Error',
    message: 'Notification',
    type: 'error',
  });
}

function addTimeoutNotif() {
  myMNModule.pushNotification({
    closeCond: 2000,
    title: 'Notice',
    message: 'Notification with Timeout',
    type: 'notice',
  });
}

/* <p>Removing notification</p> */

function removeAll() {
  myMNModule.pullAll();
}

var notifToRemove;
function addNoticeNotifToRemove() {
  notifToRemove = myMNModule.pushNotification({
    closeCond: false,
    title: 'Add notification',
    message: 'to remove it',
    type: 'notice',
  });
}

function removeSpecificNotif() {
  notifToRemove.pull();
}

/* DEMONSTRAING THE DIRECTIONS */
var dirFromBottomMNModule;
var dirFromTopMNModule;

function addSuccessNotifFromTopDir() {
  dirFromTopMNModule.unshiftNotification({
    closeCond: false,
    message: 'Success',
    type: 'success',
  });
}

function addTimeoutNotifFromTopDir() {
  dirFromTopMNModule.unshiftNotification({
    closeCond: 2000,
    message: 'Notice',
    type: 'notice',
  });
}

function addSuccessNotifFromBottomDir() {
  dirFromBottomMNModule.pushNotification({
    closeCond: false,
    message: 'Success',
    type: 'success',
  });
}

function addTimeoutNotifFromBottomDir() {
  dirFromBottomMNModule.pushNotification({
    closeCond: 2000,
    message: 'Notice',
    type: 'notice',
  });
}

/* DEMONSTRATING CUSTOMIZED NOTIFICATIONS */
var customizedNotifsModule;

// define function which will return custom template
var customTemplateFunc = function(title, message) {
  return (
    "<div class='custom-notification'>" +
    '<span>' +
    title +
    '</span> ' +
    '<span>' +
    message +
    '</span> ' +
    "<span class='mn-close-btn custom-close-btn'>[x]</span>" +
    '</div>'
  );
};

function pushCustomNotif() {
  customizedNotifsModule.pushNotification({
    closeCond: false,
    title: 'Hey',
    message: "I'm a custom notification",
    template: customTemplateFunc,
  });
}

function pullCustomizedNotifs() {
  customizedNotifsModule.pullAll();
}

/*  */

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    myMNModule = new MNModule({
      container: '#notifications',
      onNotifsNumberChange: function(number) {
        console.info('Number of notifs [' + this.container + ']: ' + number);
      },
      direction: 'fromTop',
    });

    // add greedy group
    myMNModule.createEmptyGroup({
      name: 'greedy',
      greedy: true,
    });

    myMNModule.pushNotification({
      title: 'Hello!',
      message: 'and Welcome ;)',
      type: 'notice',
      closeCond: 5000,
    });

    myMNModule.pushNotification({
      message: 'Click buttons to push/pull the notifications',
      type: 'success',
      closeCond: 7000,
    });

    dirFromTopMNModule = new MNModule({
      container: '#notifications-from-top',
      onNotifsNumberChange: function(number) {
        console.info('Number of notifs [' + this.container + ']: ' + number);
      },
      direction: 'fromTop',
    });

    dirFromBottomMNModule = new MNModule({
      container: '#notifications-from-bottom',
      onNotifsNumberChange: function(number) {
        console.info('Number of notifs [' + this.container + ']: ' + number);
      },
      direction: 'fromBottom',
    });

    customizedNotifsModule = new MNModule({
      container: '#custom-notifications-container',
      direction: 'fromTop',
    });
  }
};
