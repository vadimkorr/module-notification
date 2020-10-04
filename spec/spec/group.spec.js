describe('Group', function() {
  let mnModule

  beforeEach(function() {
    const containerId = 'notifications-container'
    addHtmlSnippet(containerId)
    const testModuleOptions = {
      container: `#${containerId}`,
      onNotificationsCountChange: function(number) {
        console.info('Number of notifs = ' + number)
      },
    }
    mnModule = new MNModule(testModuleOptions)
  })

  it('should be able to detect existance of the group', function() {
    const testGroupsOptions = [
      {
        id: 'group1',
        greedy: false,
      },
      {
        id: 'group2',
        greedy: false,
      },
    ]
    const nonExustingGroup = 'non_existing_group'
    for (let i = 0; i < testGroupsOptions.length; i++) {
      const testGroupOptions = testGroupsOptions[i]
      //create group
      mnModule.createEmptyGroup(testGroupOptions)
      //check if group exist
      expect(
        groupUtils.getGroupById(mnModule, testGroupOptions.id)
      ).toBeTruthy()
    }
    //check if non existing group is not exist
    expect(groupUtils.getGroupById(mnModule, nonExustingGroup)).toBeFalsy()
  })

  it('should be able to create groups', function() {
    const testGroupsOptions = [
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

    for (let i = 0; i < testGroupsOptions.length; i++) {
      const testGroupOptions = testGroupsOptions[i]
      //create group
      const result = mnModule.createEmptyGroup(testGroupOptions)
      //check result
      expect(result).toBeTruthy()
      //check if options were applied
      expect(
        groupUtils.getGroupById(mnModule, testGroupOptions.id).options
      ).toEqual(testGroupOptions)
      //check the amount of groups
      expect(groupUtils.getGroupsCount(mnModule)).toEqual(i + 1)
    }
  })

  it('should not create groups with the same id', function() {
    const testGroupsOptions = [
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

    for (let i = 0; i < testGroupsOptions.length; i++) {
      const testGroupOptions = testGroupsOptions[i]
      //create group
      const result = mnModule.createEmptyGroup({
        id: testGroupOptions.id,
        greedy: testGroupOptions.greedy,
      })
      //check result
      expect(result).toEqual(testGroupOptions.expectedResult)
      //check the amount of groups
      expect(groupUtils.getGroupsCount(mnModule)).toEqual(
        testGroupOptions.expectedCount
      )
    }
  })
})
