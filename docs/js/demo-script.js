var myMNModule;

function addCommonNotif() {
  myMNModule.pushNotif({
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
  myMNModule.pushNotif({
    closeCond: false,
    title: 'Test Group notification',
    type: 'success',
    group: 'test',
  });
}

function removeTestGroup() {
  myMNModule.pullGroupNotifs('test');
}

function addGreedyGroup() {
  myMNModule.createEmptyGroup({
    name: 'greedy',
    greedy: true,
  });
}

function addNotifToGreedyGroup() {
  myMNModule.pushNotif({
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
  myMNModule.pushNotif({
    closeCond: false,
    title: 'Success',
    message: 'Notification',
    type: 'success',
  });
}

function addNoticeNotif() {
  myMNModule.pushNotif({
    closeCond: false,
    title: 'Notice',
    message: 'Notification',
    type: 'notice',
  });
}

function addWarningNotif() {
  myMNModule.pushNotif({
    closeCond: false,
    title: 'Warning',
    message: 'Notification',
    type: 'warning',
  });
}

function addErrorNotif() {
  myMNModule.pushNotif({
    closeCond: false,
    title: 'Error',
    message: 'Notification',
    type: 'error',
  });
}

function addTimeoutNotif() {
  myMNModule.pushNotif({
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
  notifToRemove = myMNModule.pushNotif({
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
  dirFromTopMNModule.pushNotif({
    closeCond: false,
    message: 'Success',
    type: 'success',
  });
}

function addTimeoutNotifFromTopDir() {
  dirFromTopMNModule.pushNotif({
    closeCond: 2000,
    message: 'Notice',
    type: 'notice',
  });
}

function addSuccessNotifFromBottomDir() {
  dirFromBottomMNModule.pushNotif({
    closeCond: false,
    message: 'Success',
    type: 'success',
  });
}

function addTimeoutNotifFromBottomDir() {
  dirFromBottomMNModule.pushNotif({
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
  customizedNotifsModule.pushNotif({
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

    myMNModule.pushNotif({
      title: 'Hello!',
      message: 'and Welcome ;)',
      type: 'notice',
      closeCond: 5000,
    });

    myMNModule.pushNotif({
      message: 'Click buttons to push/pull the notifications',
      type: 'success',
      closeCond: 7000,
    });

    customizedNotifsModule = new MNModule({
      container: '#custom-notifications-container',
      direction: 'fromTop',
    });
  }
};
