var myMNModule

function addNotificationToDefaultGroup() {
  myMNModule.pushNotification({
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
    title: 'Success',
    message: 'Notification',
    type: 'success',
  })
}

function addInfoNotification() {
  myMNModule.pushNotification({
    title: 'Info',
    message: 'Notification',
    type: 'info',
  })
}

function addWarningNotif() {
  myMNModule.pushNotification({
    title: 'Warning',
    message: 'Notification',
    type: 'warning',
  })
}

function addErrorNotif() {
  myMNModule.pushNotification({
    title: 'Error',
    message: 'Notification',
    type: 'error',
  })
}

function addTimeoutNotif() {
  myMNModule.pushNotification({
    closeInMS: 2000,
    title: 'Info',
    message: 'Notification with Timeout',
    type: 'info',
  })
}

/* <p>Removing notification</p> */

function removeAll() {
  myMNModule.removeNotifications()
}

var notifToRemove
function addInfoNotificationToRemove() {
  notifToRemove = myMNModule.pushNotification({
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
    message: 'Success',
    type: 'success',
  })
}

function addTimeoutNotifFromTopDir() {
  dirFromTopMNModule.unshiftNotification({
    closeInMS: 2000,
    message: 'Info',
    type: 'info',
  })
}

function addSuccessNotifFromBottomDir() {
  dirFromBottomMNModule.pushNotification({
    message: 'Success',
    type: 'success',
  })
}

function addTimeoutNotifFromBottomDir() {
  dirFromBottomMNModule.pushNotification({
    closeInMS: 2000,
    message: 'Info',
    type: 'info',
  })
}

/* DEMONSTRATING CUSTOMIZED NOTIFICATIONS */
var customizedNotifsModule

// define function which will return custom template
const customTemplateFunc = ({ title, message }) =>
  `
    <div class='custom-notification'>
      <span>${title}</span>
      <span>${message}</span>
      <span class='mn-close-btn custom-close-btn'>[x]</span>
    </div>
  `

function pushCustomNotif() {
  customizedNotifsModule.pushNotification({
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
      message: 'Click buttons to add/remove the notifications',
      type: 'success',
      closeInMS: 7000,
    })

    dirFromTopMNModule = new MNModule({
      container: '#notifications-from-top',
      onNotificationsCountChange: function(number) {
        console.info('Number of notifs [' + this.container + ']: ' + number)
      },
    })

    dirFromBottomMNModule = new MNModule({
      container: '#notifications-from-bottom',
      onNotificationsCountChange: function(number) {
        console.info('Number of notifs [' + this.container + ']: ' + number)
      },
    })

    customizedNotifsModule = new MNModule({
      container: '#custom-notifications-container',
    })
  }
}
