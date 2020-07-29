describe('Notification', function() {
  beforeEach(function() {
    var testModuleOptions = {
      container: '#notifications-container',
      onNotifsNumberChange: function(number) {
        console.info('Number of notifs = ' + number);
      },
    };
    mnModule = new MNModule(testModuleOptions);
  });

  it('should be able to be pushed to module', function() {
    var testNotifsOptions = [
      {
        title: 'title1',
        message: 'message1',
        icon: 'music',
        closeCond: 5000,
        type: 'info',
        group: 'common',
        template: () => {
          return '<div></div>';
        },
      },
      {
        title: 'title2',
        message: 'message2',
        icon: 'music',
        closeCond: 6000,
        type: 'success',
        group: 'common',
        template: () => {
          return '<div></div>';
        },
      },
      {
        title: 'title3',
        message: 'message3',
        icon: 'ok-sign',
        closeCond: 7000,
        type: 'success',
        group: 'common',
        template: () => {
          return '<div></div>';
        },
      },
    ];

    for (var i = 0; i < testNotifsOptions.length; i++) {
      var testNotifOptions = testNotifsOptions[i];
      //push notif
      var notif = mnModule.pushNotification(testNotifOptions);
      //check if ref is not null
      expect(notif).not.toBeNull();
      //check if notif was pushed with specified params
      // const { mode, ...options } = notif.options;
      // expect(options).toEqual(testNotifOptions);
    }
  });

  it('should be able to be pushed to specified group', function() {
    var testNotifsOptions = [
      {
        group: 'common1',
        expectedNumberOfNotifsAfterPushing: 1,
      },
      {
        group: 'common2',
        expectedNumberOfNotifsAfterPushing: 1,
      },
      {
        group: 'common2',
        expectedNumberOfNotifsAfterPushing: 2,
      },
      {
        group: 'common3',
        expectedNumberOfNotifsAfterPushing: 1,
      },
      {
        group: 'common3',
        expectedNumberOfNotifsAfterPushing: 2,
      },
    ];

    for (var i = 0; i < testNotifsOptions.length; i++) {
      var testNotifOptions = testNotifsOptions[i];
      //push notif
      var notif = mnModule.pushNotification(testNotifOptions);
      //check if notif was pushed to appropriate group
      expect(mnModule.getGroup(testNotifOptions.group).getLength()).toEqual(
        testNotifOptions.expectedNumberOfNotifsAfterPushing
      );
    }
  });

  it('should be able to be pushed to greedy group only ones', function() {
    var greedyGroupName = 'some greedy group';
    var greedyGroupOptions = {
      name: greedyGroupName,
      greedy: true,
    };
    mnModule.createEmptyGroup(greedyGroupOptions);

    var testNotifsOptions = [
      {
        group: greedyGroupName,
        expectedNumberOfNotifsAfterPushing: 1,
        isResultNull: false,
      },
      {
        group: greedyGroupName,
        expectedNumberOfNotifsAfterPushing: 1,
        isResultNull: true,
      },
    ];

    for (var i = 0; i < testNotifsOptions.length; i++) {
      var testNotifOptions = testNotifsOptions[i];
      //push notif
      var notif = mnModule.pushNotification(testNotifOptions);
      //check the size of the group
      expect(mnModule.getGroup(testNotifOptions.group).getLength()).toEqual(
        testNotifOptions.expectedNumberOfNotifsAfterPushing
      );
      //check returned result
      expect(notif == null).toEqual(testNotifOptions.isResultNull);
    }
  });

  it('should be able to be pulled', function() {
    var numberOfNotifsToCreate = 10;
    for (var i = 0; i < numberOfNotifsToCreate.length; i++) {
      //push notif
      var notif = mnModule.pushNotification({ closeCond: false });
      //check the number of notifs after pushing
      var expectedNumberOfNotifsAfterPushing = 1;
      expect(mnModule.numberOfNotifs).toEqual(
        expectedNumberOfNotifsAfterPushing
      );
      //pull notif
      notif.pull();
      //check the number of notifs after pulling
      var expectedNumberOfNotifsAfterPulling = 0;
      expect(mnModule.numberOfNotifs).toEqual(
        expectedNumberOfNotifsAfterPulling
      );
    }
    expect(mnModule.numberOfNotifs).toEqual(0);
  });

  function pushNotifs(notifsCount, groupName, module) {
    for (var i = 0; i < notifsCount; i++) {
      module.pushNotification({
        group: groupName,
        closeCond: false,
      });
    }
  }

  it('should be able to be pulled from group', function() {
    var numberOfNotifsInFirstGroup = 10;
    var numberOfNotifsInSecondGroup = 20;
    var firstGroupName = 'first group';
    var secondGroupName = 'second group';
    // const groupIds = [firstGroupName, ]
    const groups = {
      [firstGroupName]: {
        count: numberOfNotifsInFirstGroup,
      },
      [secondGroupName]: {
        count: numberOfNotifsInSecondGroup,
      },
    };
    pushNotifs(numberOfNotifsInFirstGroup, firstGroupName, mnModule);
    pushNotifs(numberOfNotifsInSecondGroup, secondGroupName, mnModule);
    //check total number of notifs
    expect(mnModule.numberOfNotifs).toEqual(
      numberOfNotifsInFirstGroup + numberOfNotifsInSecondGroup
    );

    //check number of notifs in first group
    for (let group of mnModule.getGroups()) {
      expect(group.getLength()).toEqual(groups[group._getId()].count);
    }

    //pull notifs of first group
    mnModule.pullGroupNotifs(firstGroupName);
    //check number of notifs of module
    expect(mnModule.numberOfNotifs).toEqual(numberOfNotifsInSecondGroup);
    //pull notifs of second group
    mnModule.pullGroupNotifs(secondGroupName);
    //check number of notifs of module
    expect(mnModule.numberOfNotifs).toEqual(0);
  });

  it('should be able to be pulled from module (all notifs)', function() {
    var numberOfNotifsInFirstGroup = 10;
    var numberOfNotifsInSecondGroup = 20;
    var firstGroupName = 'first group';
    var secondGroupName = 'second group';

    var testModule2Options = {
      container: '#notifications-container2',
    };
    mnModule2 = new MNModule(testModule2Options);

    pushNotifs(numberOfNotifsInFirstGroup, firstGroupName, mnModule);
    pushNotifs(numberOfNotifsInSecondGroup, secondGroupName, mnModule);
    pushNotifs(numberOfNotifsInFirstGroup, firstGroupName, mnModule2);
    pushNotifs(numberOfNotifsInSecondGroup, secondGroupName, mnModule2);

    //pull notifs from first group
    mnModule.pullAll();
    expect(mnModule.numberOfNotifs).toEqual(0);
    //check if second group is ok
    expect(mnModule2.numberOfNotifs).toEqual(
      numberOfNotifsInFirstGroup + numberOfNotifsInSecondGroup
    );

    //pull notifs from second group
    mnModule2.pullAll();
    expect(mnModule.numberOfNotifs).toEqual(0);
  });
});
