const REMOVE_NOTIFICATION_DELAY_MS = 100

function getRemoveWaitingTimeMS(module) {
  let allNotificationsCount = 0
  for (let group of module._getGroups()) {
    allNotificationsCount += group._getLength()
  }
  return allNotificationsCount * REMOVE_NOTIFICATION_DELAY_MS
}

function getRemoveWaitingTimeMSByGroupId(module, groupId) {
  return module._getGroup(groupId)._getLength() * REMOVE_NOTIFICATION_DELAY_MS
}

function wait(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms)
  })
}

describe('Notification', function() {
  beforeEach(function() {
    var testModuleOptions = {
      container: '#notifications-container',
      onNotificationsCountChange: function(number) {
        console.info('Number of notifs = ' + number)
      },
    }
    mnModule = new MNModule(testModuleOptions)
  })

  it('should be able to be pushed to module', function() {
    var testNotifsOptions = [
      {
        title: 'title1',
        message: 'message1',
        icon: 'music',
        closeInMS: 5000,
        type: 'info',
        groupId: 'common',
        template: () => {
          return '<div></div>'
        },
      },
      {
        title: 'title2',
        message: 'message2',
        icon: 'music',
        closeInMS: 6000,
        type: 'success',
        groupId: 'common',
        template: () => {
          return '<div></div>'
        },
      },
      {
        title: 'title3',
        message: 'message3',
        icon: 'ok-sign',
        closeInMS: 7000,
        type: 'success',
        groupId: 'common',
        template: () => {
          return '<div></div>'
        },
      },
    ]

    for (var i = 0; i < testNotifsOptions.length; i++) {
      var testNotifOptions = testNotifsOptions[i]
      //push notif
      var notif = mnModule.pushNotification(testNotifOptions)
      //check if ref is not null
      expect(notif).not.toBeNull()
      //check if notif was pushed with specified params
      // const { mode, ...options } = notif.options;
      // expect(options).toEqual(testNotifOptions);
    }
  })

  it('should be able to be pushed to specified group', function() {
    var testNotifsOptions = [
      {
        groupId: 'common1',
        expectedNumberOfNotifsAfterPushing: 1,
      },
      {
        groupId: 'common2',
        expectedNumberOfNotifsAfterPushing: 1,
      },
      {
        groupId: 'common2',
        expectedNumberOfNotifsAfterPushing: 2,
      },
      {
        groupId: 'common3',
        expectedNumberOfNotifsAfterPushing: 1,
      },
      {
        groupId: 'common3',
        expectedNumberOfNotifsAfterPushing: 2,
      },
    ]

    for (var i = 0; i < testNotifsOptions.length; i++) {
      var testNotifOptions = testNotifsOptions[i]
      //push notif
      var notif = mnModule.pushNotification(testNotifOptions)
      //check if notif was pushed to appropriate group
      expect(mnModule._getGroup(testNotifOptions.groupId)._getLength()).toEqual(
        testNotifOptions.expectedNumberOfNotifsAfterPushing
      )
    }
  })

  it('should be able to be pushed to greedy group only ones', function() {
    var greedyGroupName = 'some greedy group'
    var greedyGroupOptions = {
      id: greedyGroupName,
      greedy: true,
    }
    mnModule.createEmptyGroup(greedyGroupOptions)

    var testNotifsOptions = [
      {
        groupId: greedyGroupName,
        expectedNumberOfNotifsAfterPushing: 1,
        isResultNull: false,
      },
      {
        groupId: greedyGroupName,
        expectedNumberOfNotifsAfterPushing: 1,
        isResultNull: true,
      },
    ]

    for (var i = 0; i < testNotifsOptions.length; i++) {
      var testNotifOptions = testNotifsOptions[i]
      //push notif
      var notif = mnModule.pushNotification(testNotifOptions)
      //check the size of the group
      expect(mnModule._getGroup(testNotifOptions.groupId)._getLength()).toEqual(
        testNotifOptions.expectedNumberOfNotifsAfterPushing
      )
      //check returned result
      expect(notif == null).toEqual(testNotifOptions.isResultNull)
    }
  })

  it('should be able to be pulled', function() {
    var numberOfNotifsToCreate = 10
    for (var i = 0; i < numberOfNotifsToCreate.length; i++) {
      //push notif
      var notif = mnModule.pushNotification({ closeInMS: false })
      //check the number of notifs after pushing
      var expectedNumberOfNotifsAfterPushing = 1
      expect(mnModule.notificationsCount).toEqual(
        expectedNumberOfNotifsAfterPushing
      )
      //remove notif
      notif.remove()
      //check the number of notifs after pulling
      var expectedNumberOfNotifsAfterPulling = 0
      expect(mnModule.notificationsCount).toEqual(
        expectedNumberOfNotifsAfterPulling
      )
    }
    expect(mnModule.notificationsCount).toEqual(0)
  })

  function pushNotifs(notifsCount, groupId, module) {
    for (var i = 0; i < notifsCount; i++) {
      module.pushNotification({
        groupId: groupId,
        closeInMS: false,
      })
    }
  }

  it('should be able to be pulled from group', function() {
    var numberOfNotifsInFirstGroup = 10
    var numberOfNotifsInSecondGroup = 20
    var firstGroupName = 'first group'
    var secondGroupName = 'second group'
    const groups = {
      [firstGroupName]: {
        count: numberOfNotifsInFirstGroup,
      },
      [secondGroupName]: {
        count: numberOfNotifsInSecondGroup,
      },
    }
    pushNotifs(numberOfNotifsInFirstGroup, firstGroupName, mnModule)
    pushNotifs(numberOfNotifsInSecondGroup, secondGroupName, mnModule)
    //check total number of notifs
    expect(mnModule.notificationsCount).toEqual(
      numberOfNotifsInFirstGroup + numberOfNotifsInSecondGroup
    )

    //check number of notifs in first group
    for (let group of mnModule._getGroups()) {
      expect(group._getLength()).toEqual(groups[group._getId()].count)
    }

    //remove notifs of first group
    mnModule.removeNotifications(firstGroupName)
    wait(getRemoveWaitingTimeMSByGroupId(mnModule, firstGroupName)).then(() => {
      //check number of notifs of module
      expect(mnModule.notificationsCount).toEqual(numberOfNotifsInSecondGroup)
      //remove notifs of second group
      mnModule.removeNotifications(secondGroupName)
      wait(getRemoveWaitingTimeMSByGroupId(mnModule, secondGroupName)).then(
        () => {
          //check number of notifs of module
          expect(mnModule.notificationsCount).toEqual(0)
        }
      )
    })
  })

  // it('should be able to be pulled from module (all notifs)', async function() {
  //   var numberOfNotifsInFirstGroup = 10
  //   var numberOfNotifsInSecondGroup = 20
  //   var firstGroupName = 'first group'
  //   var secondGroupName = 'second group'

  //   var testModule2Options = {
  //     container: '#notifications-container2',
  //   }
  //   mnModule2 = new MNModule(testModule2Options)

  //   pushNotifs(numberOfNotifsInFirstGroup, firstGroupName, mnModule)
  //   pushNotifs(numberOfNotifsInSecondGroup, secondGroupName, mnModule)
  //   pushNotifs(numberOfNotifsInFirstGroup, firstGroupName, mnModule2)
  //   pushNotifs(numberOfNotifsInSecondGroup, secondGroupName, mnModule2)

  //   //remove notifs from first group
  //   mnModule.removeNotifications()

  //   //check if second group is ok
  //   expect(mnModule2.notificationsCount).toEqual(
  //     numberOfNotifsInFirstGroup + numberOfNotifsInSecondGroup
  //   )

  //   //remove notifs from second group
  //   mnModule2.removeNotifications()

  //   await wait(
  //     Math.max(
  //       getRemoveWaitingTimeMS(mnModule),
  //       getRemoveWaitingTimeMS(mnModule2)
  //     )
  //   )

  //   expect(mnModule.notificationsCount).toEqual(0)
  //   expect(mnModule2.notificationsCount).toEqual(0)
  // })
})
