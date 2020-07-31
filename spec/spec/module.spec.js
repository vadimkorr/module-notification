describe('Module', function() {
  it('should be able to create module', function() {
    var testValue = 100
    var testModuleOptions = {
      container: '#notifications-container',
      direction: 'fromTop',
      onNotificationsCountChange: function(number) {
        return testValue
      },
    }
    var mnModule = new MNModule(testModuleOptions)
    //check if options were applied succesfully
    expect(mnModule.options).toEqual(testModuleOptions)
    //check if onNotificationsCountChange works correct
    expect(mnModule.options.onNotificationsCountChange()).toEqual(testValue)
  })
})
