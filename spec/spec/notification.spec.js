describe('Notification', function() {
  let modules = {
    module1: null,
    module2: null,
  }

  beforeEach(() => {
    const container1Id = 'notifications-container'
    addHtmlSnippet(container1Id)
    modules.module1 = new MNModule({
      container: `#${container1Id}`,
      onNotificationsCountChange: function(number) {
        console.info('Number of notifs = ' + number)
      },
    })

    const container2Id = 'notifications-container2'
    addHtmlSnippet(container2Id)
    modules.module2 = new MNModule({
      container: `#${container2Id}`,
    })
  })

  it('should be able to be pushed to module', function() {
    const testNotifsOptions = [
      {
        title: 'title1',
        message: 'message1',
        icon: 'music',
        closeInMS: 5000,
        type: 'info',
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
        template: () => {
          return '<div></div>'
        },
      },
    ]

    for (let i = 0; i < testNotifsOptions.length; i++) {
      const testNotifOptions = testNotifsOptions[i]
      //push notif
      const notif = modules.module1.pushNotification(testNotifOptions)
      //check if ref is not null
      expect(notif).not.toBeNull()
      //check if notif was pushed with specified params
      // const { mode, ...options } = notif.options;
      // expect(options).toEqual(testNotifOptions);
    }
  })

  it('should be able to be pushed to specified group', function() {
    const testNotifsOptions = [
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

    for (let i = 0; i < testNotifsOptions.length; i++) {
      const testNotifOptions = testNotifsOptions[i]
      //push notif
      const notif = modules.module1.pushNotification(testNotifOptions)
      //check if notif was pushed to appropriate group
      expect(
        groupUtils
          .getGroupById(modules.module1, testNotifOptions.groupId)
          ._getLength()
      ).toEqual(testNotifOptions.expectedNumberOfNotifsAfterPushing)
    }
  })

  it('should be able to be pushed to greedy group only ones', function() {
    const greedyGroupName = 'some greedy group'
    const greedyGroupOptions = {
      id: greedyGroupName,
      greedy: true,
    }
    modules.module1.createEmptyGroup(greedyGroupOptions)

    const testNotifsOptions = [
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

    for (let i = 0; i < testNotifsOptions.length; i++) {
      const testNotifOptions = testNotifsOptions[i]
      //push notif
      const notif = modules.module1.pushNotification(testNotifOptions)
      //check the size of the group
      expect(
        groupUtils
          .getGroupById(modules.module1, testNotifOptions.groupId)
          ._getLength()
      ).toEqual(testNotifOptions.expectedNumberOfNotifsAfterPushing)
      //check returned result
      expect(notif == null).toEqual(testNotifOptions.isResultNull)
    }
  })

  it('should be able to be pulled', function() {
    const numberOfNotifsToCreate = 10
    for (let i = 0; i < numberOfNotifsToCreate.length; i++) {
      //push notif
      const notif = modules.module1.pushNotification({ closeInMS: false })
      //check the number of notifs after pushing
      const expectedNumberOfNotifsAfterPushing = 1
      expect(modules.module1.notificationsCount).toEqual(
        expectedNumberOfNotifsAfterPushing
      )
      //remove notif
      notif.remove()
      //check the number of notifs after pulling
      const expectedNumberOfNotifsAfterPulling = 0
      expect(modules.module1.notificationsCount).toEqual(
        expectedNumberOfNotifsAfterPulling
      )
    }
    expect(modules.module1.notificationsCount).toEqual(0)
  })

  function pushNotifs(notifsCount, groupId, module) {
    for (let i = 0; i < notifsCount; i++) {
      module.pushNotification({
        groupId: groupId,
        closeInMS: false,
      })
    }
  }

  it('should be able to be pulled from group', function() {
    const numberOfNotifsInFirstGroup = 10
    const numberOfNotifsInSecondGroup = 20
    const firstGroupName = 'first group'
    const secondGroupName = 'second group'
    const groups = {
      [firstGroupName]: {
        count: numberOfNotifsInFirstGroup,
      },
      [secondGroupName]: {
        count: numberOfNotifsInSecondGroup,
      },
    }
    pushNotifs(numberOfNotifsInFirstGroup, firstGroupName, modules.module1)
    pushNotifs(numberOfNotifsInSecondGroup, secondGroupName, modules.module1)
    //check total number of notifs
    expect(modules.module1.notificationsCount).toEqual(
      numberOfNotifsInFirstGroup + numberOfNotifsInSecondGroup
    )

    //check number of notifs in first group
    for (let group of groupUtils.getGroups(modules.module1)) {
      expect(group._getLength()).toEqual(groups[group.__getId()].count)
    }

    //remove notifs of first group
    modules.module1.removeNotifications(firstGroupName)
    wait(getRemoveWaitingTimeMSByGroupId(modules.module1, firstGroupName)).then(
      () => {
        //check number of notifs of module
        expect(modules.module1.notificationsCount).toEqual(
          numberOfNotifsInSecondGroup
        )
        //remove notifs of second group
        modules.module1.removeNotifications(secondGroupName)
        wait(
          getRemoveWaitingTimeMSByGroupId(modules.module1, secondGroupName)
        ).then(() => {
          //check number of notifs of module
          expect(modules.module1.notificationsCount).toEqual(0)
        })
      }
    )
  })

  it('should be able to be pulled from module (all notifs)', function() {
    const numberOfNotifsInFirstGroup = 10
    const numberOfNotifsInSecondGroup = 20
    const firstGroupName = 'first group'
    const secondGroupName = 'second group'

    pushNotifs(numberOfNotifsInFirstGroup, firstGroupName, modules.module1)
    pushNotifs(numberOfNotifsInSecondGroup, secondGroupName, modules.module1)
    pushNotifs(numberOfNotifsInFirstGroup, firstGroupName, modules.module2)
    pushNotifs(numberOfNotifsInSecondGroup, secondGroupName, modules.module2)

    //remove notifs from first group
    modules.module1.removeNotifications()

    //check if second group is ok
    expect(modules.module2.notificationsCount).toEqual(
      numberOfNotifsInFirstGroup + numberOfNotifsInSecondGroup
    )

    //remove notifs from second group
    modules.module2.removeNotifications()

    wait(
      Math.max(
        getRemoveWaitingTimeMS(modules.module1),
        getRemoveWaitingTimeMS(modules.module2)
      )
    ).then(() => {
      expect(modules.module1.notificationsCount).toEqual(0)
      expect(modules.module2.notificationsCount).toEqual(0)
    })
  })
})
