describe('Group', function() {
  let mnModule

  beforeEach(function() {
    const containerId = 'notifications-container'
    addHtmlSnippet(containerId)
    var testModuleOptions = {
      container: `#${containerId}`,
      onNotificationsCountChange: function(number) {
        console.info('Number of notifs = ' + number)
      },
    }
    mnModule = new MNModule(testModuleOptions)
  })

  it('should be able to detect existance of the group', function() {
    var testGroupsOptions = [
      {
        id: 'group1',
        greedy: false,
      },
      {
        id: 'group2',
        greedy: false,
      },
    ]
    var nonExustingGroup = 'non_existing_group'
    for (var i = 0; i < testGroupsOptions.length; i++) {
      var testGroupOptions = testGroupsOptions[i]
      //create group
      mnModule.createEmptyGroup(testGroupOptions)
      //check if group exist
      expect(mnModule._getGroup(testGroupOptions.id)).toBeTruthy()
    }
    //check if non existing group is not exist
    expect(mnModule._getGroup(nonExustingGroup)).toBeFalsy()
  })

  it('should be able to create groups', function() {
    var testGroupsOptions = [
      {
        id: 'group1',
        greedy: false,
      },
      {
        id: 'group2',
        greedy: false,
      },
      {
        id: 'group3',
        greedy: false,
      },
      {
        id: 'group4',
        greedy: true,
      },
      {
        id: 'group5',
        greedy: true,
      },
    ]

    for (var i = 0; i < testGroupsOptions.length; i++) {
      var testGroupOptions = testGroupsOptions[i]
      //create group
      var result = mnModule.createEmptyGroup(testGroupOptions)
      //check result
      expect(result).toBeTruthy()
      //check if options were applied
      expect(mnModule._getGroup(testGroupOptions.id).options).toEqual(
        testGroupOptions
      )
      //check the amount of groups
      expect(mnModule._getGroupsCount()).toEqual(i + 1)
    }
  })

  it('should not create groups with the same id', function() {
    var testGroupsOptions = [
      {
        id: 'group1',
        greedy: false,
        expectedResult: true,
        expectedCount: 1,
      },
      {
        id: 'oneName',
        greedy: false,
        expectedResult: true,
        expectedCount: 2,
      },
      {
        id: 'oneName',
        greedy: false,
        expectedResult: false,
        expectedCount: 2,
      },
      {
        id: 'oneMoreGroup',
        greedy: false,
        expectedResult: true,
        expectedCount: 3,
      },
    ]

    for (var i = 0; i < testGroupsOptions.length; i++) {
      var testGroupOptions = testGroupsOptions[i]
      //create group
      var result = mnModule.createEmptyGroup({
        id: testGroupOptions.id,
        greedy: testGroupOptions.greedy,
      })
      //check result
      expect(result).toEqual(testGroupOptions.expectedResult)
      //check the amount of groups
      expect(mnModule._getGroupsCount()).toEqual(testGroupOptions.expectedCount)
    }
  })
})
