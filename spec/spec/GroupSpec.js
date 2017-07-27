describe("Group", function() {
  var mnModule;

  beforeEach(function() {
    var testModuleOptions = {
      container: "#notifications-container",
      direction: "fromTop",
      onNotifsNumberChange: function(number) {
        console.info("Number of notifs = " + number);
      }
    }
    mnModule = new MNModule(testModuleOptions);	
  });
  
  it("should be able to detect existance of the group", function() {
    var testGroupsOptions = [{
      name: "group1",
      greedy: false
    }, {
      name: "group2",
      greedy: false
    }];
    var nonExustingGroup = "non_existing_group";
    for (var i=0; i<testGroupsOptions.length; i++) {
      var testGroupOptions = testGroupsOptions[i];
      //create group
      mnModule.createEmptyGroup(testGroupOptions);
      //check if group exist
      expect(mnModule.isGroupExist(testGroupOptions.name)).toBeTruthy();
    }
    //check if non existing group is not exist
    expect(mnModule.isGroupExist(nonExustingGroup)).toBeFalsy();
  });

  it("should be able to create groups", function() {
    var testGroupsOptions = [{
      name: "group1",
      greedy: false
    }, {
      name: "group2",
      greedy: false
    }, {
      name: "group3",
      greedy: false
    }, {
      name: "group4",
      greedy: true
    }, {
      name: "group5",
      greedy: true
    }];

    for (var i=0; i<testGroupsOptions.length; i++) {
      var testGroupOptions = testGroupsOptions[i];
      //create group
      var result = mnModule.createEmptyGroup(testGroupOptions);
      //check result
      expect(result).toBeTruthy();
      //check if options were applied
      expect(mnModule.groups[testGroupOptions.name].groupOptions).toEqual(testGroupOptions);
      //check the amount of groups
      expect(Object.keys(mnModule.groups).length).toEqual(i + 1);
    }
  });
  
  it("should not create groups with the same name", function() {
    var testGroupsOptions = [{
      name: "group1",
      greedy: false,
      expectedResult: true,
      expectedCount: 1
    }, {
      name: "oneName",
      greedy: false,
      expectedResult: true,
      expectedCount: 2
    }, {
      name: "oneName",
      greedy: false,
      expectedResult: false,
      expectedCount: 2
    }, {
      name: "oneMoreGroup",
      greedy: false,
      expectedResult: true,
      expectedCount: 3
    }];

    for (var i=0; i<testGroupsOptions.length; i++) {
      var testGroupOptions = testGroupsOptions[i];
      //create group
      var result = mnModule.createEmptyGroup({
        name: testGroupOptions.name,
        greedy: testGroupOptions.greedy
      });
      //check result
      expect(result).toEqual(testGroupOptions.expectedResult);
      //check the amount of groups
      expect(Object.keys(mnModule.groups).length).toEqual(testGroupOptions.expectedCount);
    }
  });
});