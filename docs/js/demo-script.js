var myMNModule;

function addCommonNotif() {
  myMNModule.pushNotification({
    closeInMS: false,
    title: 'Common Group notification',
    type: 'info',
    groupId: 'common',
  });
}

function removeCommonGroup() {
  myMNModule.pullGroupNotifs('common');
}

function addTestGroup() {
  myMNModule.createEmptyGroup({
    id: 'test',
  });
}

function addTestNotification() {
  myMNModule.pushNotification({
    closeInMS: false,
    title: 'Test Group notification',
    type: 'success',
    groupId: 'test',
  });
}

function removeTestGroup() {
  myMNModule.pullGroupNotifs('test');
}

function addNotifToGreedyGroup() {
  myMNModule.pushNotification({
    closeInMS: false,
    title: 'Greedy Group notification',
    type: 'warning',
    groupId: 'greedy',
  });
}

function removeGreedyGroup() {
  myMNModule.pullGroupNotifs('greedy');
}

function addSuccessNotif() {
  myMNModule.pushNotification({
    closeInMS: false,
    title: 'Success',
    message: 'Notification',
    type: 'success',
    groupId: 'common',
  });
}

function addNoticeNotif() {
  myMNModule.pushNotification({
    closeInMS: false,
    title: 'Notice',
    message: 'Notification',
    type: 'info',
    groupId: 'common',
  });
}

function addWarningNotif() {
  myMNModule.pushNotification({
    closeInMS: false,
    title: 'Warning',
    message: 'Notification',
    type: 'warning',
    groupId: 'common',
  });
}

function addErrorNotif() {
  myMNModule.pushNotification({
    closeInMS: false,
    title: 'Error',
    message: 'Notification',
    type: 'error',
    groupId: 'common',
  });
}

function addTimeoutNotif() {
  myMNModule.pushNotification({
    closeInMS: 2000,
    title: 'Notice',
    message: 'Notification with Timeout',
    type: 'info',
    groupId: 'common',
  });
}

/* <p>Removing notification</p> */

function removeAll() {
  myMNModule.pullAll();
}

var notifToRemove;
function addNoticeNotifToRemove() {
  notifToRemove = myMNModule.pushNotification({
    closeInMS: false,
    title: 'Add notification',
    message: 'to remove it',
    type: 'info',
    groupId: 'common',
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
    closeInMS: false,
    message: 'Success',
    type: 'success',
    groupId: 'common',
  });
}

function addTimeoutNotifFromTopDir() {
  dirFromTopMNModule.unshiftNotification({
    closeInMS: 2000,
    message: 'Notice',
    type: 'info',
    groupId: 'common',
  });
}

function addSuccessNotifFromBottomDir() {
  dirFromBottomMNModule.pushNotification({
    closeInMS: false,
    message: 'Success',
    type: 'success',
    groupId: 'common',
  });
}

function addTimeoutNotifFromBottomDir() {
  dirFromBottomMNModule.pushNotification({
    closeInMS: 2000,
    message: 'Notice',
    type: 'info',
    groupId: 'common',
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
    closeInMS: false,
    title: 'Hey',
    message: "I'm a custom notification",
    template: customTemplateFunc,
    groupId: 'common',
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
      id: 'greedy',
      greedy: true,
    });

    myMNModule.pushNotification({
      title: 'Hello!',
      message: 'and Welcome ;)',
      type: 'info',
      groupId: 'common',
      closeInMS: 5000,
    });

    myMNModule.pushNotification({
      message: 'Click buttons to push/pull the notifications',
      type: 'success',
      closeInMS: 7000,
      groupId: 'common',
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
