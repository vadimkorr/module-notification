describe("Module", function() {
  it("should be able to create module", function() {
    var testValue = 100;
    var testModuleOptions = {
      container: "#notifications-container",
      direction: "fromTop",
      onNotifsNumberChange: function(number) {
        return testValue;
      }
    }
    var mnModule = new MNModule(testModuleOptions);
    //check if options were applied succesfully
    expect(mnModule.moduleOptions).toEqual(testModuleOptions);
    //check if onNotifsNumberChange works correct
    expect(mnModule.moduleOptions.onNotifsNumberChange()).toEqual(testValue);	
  });
})