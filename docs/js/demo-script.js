var myMNModule

function addNotificationToDefaultGroup() {
  myMNModule.pushNotification({
    closeInMS: false,
    title: 'Default Group notification',
    type: 'info',
  })
}

function removeNotificationsFromDefaultGroup() {
  myMNModule.removeNotifications('default')
}

function addTestGroup() {
  myMNModule.createEmptyGroup({
    id: 'test',
  })
}

function addTestNotification() {
  myMNModule.pushNotification({
    closeInMS: false,
    title: 'Test Group notification',
    type: 'success',
    groupId: 'test',
  })
}

function removeTestGroup() {
  myMNModule.removeNotifications('test')
}

function addNotifToGreedyGroup() {
  myMNModule.pushNotification({
    closeInMS: false,
    title: 'Greedy Group notification',
    type: 'warning',
    groupId: 'greedy',
  })
}

function removeGreedyGroup() {
  myMNModule.removeNotifications('greedy')
}

function addSuccessNotif() {
  myMNModule.pushNotification({
    closeInMS: false,
    title: 'Success',
    message: 'Notification',
    type: 'success',
  })
}

function addNoticeNotif() {
  myMNModule.pushNotification({
    closeInMS: false,
    title: 'Notice',
    message: 'Notification',
    type: 'info',
  })
}

function addWarningNotif() {
  myMNModule.pushNotification({
    closeInMS: false,
    title: 'Warning',
    message: 'Notification',
    type: 'warning',
  })
}

function addErrorNotif() {
  myMNModule.pushNotification({
    closeInMS: false,
    title: 'Error',
    message: 'Notification',
    type: 'error',
  })
}

function addTimeoutNotif() {
  myMNModule.pushNotification({
    closeInMS: 2000,
    title: 'Notice',
    message: 'Notification with Timeout',
    type: 'info',
  })
}

/* <p>Removing notification</p> */

function removeAll() {
  myMNModule.removeNotifications()
}

var notifToRemove
function addNoticeNotifToRemove() {
  notifToRemove = myMNModule.pushNotification({
    closeInMS: false,
    title: 'Add notification',
    message: 'to remove it',
    type: 'info',
  })
}

function removeSpecificNotif() {
  notifToRemove.remove()
}

/* DEMONSTRAING THE DIRECTIONS */
var dirFromBottomMNModule
var dirFromTopMNModule

function addSuccessNotifFromTopDir() {
  dirFromTopMNModule.unshiftNotification({
    closeInMS: false,
    message: 'Success',
    type: 'success',
  })
}

function addTimeoutNotifFromTopDir() {
  dirFromTopMNModule.unshiftNotification({
    closeInMS: 2000,
    message: 'Notice',
    type: 'info',
  })
}

function addSuccessNotifFromBottomDir() {
  dirFromBottomMNModule.pushNotification({
    closeInMS: false,
    message: 'Success',
    type: 'success',
  })
}

function addTimeoutNotifFromBottomDir() {
  dirFromBottomMNModule.pushNotification({
    closeInMS: 2000,
    message: 'Notice',
    type: 'info',
  })
}

/* DEMONSTRATING CUSTOMIZED NOTIFICATIONS */
var customizedNotifsModule

// define function which will return custom template
var customTemplateFunc = ({ title, message }) => {
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
  )
}

function pushCustomNotif() {
  customizedNotifsModule.pushNotification({
    closeInMS: false,
    title: 'Hey',
    message: "I'm a custom notification",
    template: customTemplateFunc,
  })
}

function pullCustomizedNotifs() {
  customizedNotifsModule.removeNotifications()
}

/*  */

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    myMNModule = new MNModule({
      container: '#notifications',
      onNotificationsCountChange: function(number) {
        console.info('Number of notifs [' + this.container + ']: ' + number)
      },
      direction: 'fromTop',
    })

    // add greedy group
    myMNModule.createEmptyGroup({
      id: 'greedy',
      greedy: true,
    })

    myMNModule.pushNotification({
      title: 'Hello!',
      message: 'and Welcome ;)',
      type: 'info',
      closeInMS: 5000,
    })

    myMNModule.pushNotification({
      message: 'Click buttons to push/pull the notifications',
      type: 'success',
      closeInMS: 7000,
    })

    dirFromTopMNModule = new MNModule({
      container: '#notifications-from-top',
      onNotificationsCountChange: function(number) {
        console.info('Number of notifs [' + this.container + ']: ' + number)
      },
      direction: 'fromTop',
    })

    dirFromBottomMNModule = new MNModule({
      container: '#notifications-from-bottom',
      onNotificationsCountChange: function(number) {
        console.info('Number of notifs [' + this.container + ']: ' + number)
      },
      direction: 'fromBottom',
    })

    customizedNotifsModule = new MNModule({
      container: '#custom-notifications-container',
      direction: 'fromTop',
    })
  }
}
