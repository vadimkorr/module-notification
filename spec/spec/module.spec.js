const containerId = 'notifications-container'

describe('Module', () => {
  beforeEach(() => {
    addHtmlSnippet(containerId)
  })

  it('should be able to create module', () => {
    const notificationsCountValue = 100
    const moduleOptions = {
      container: `#${containerId}`,
      onNotificationsCountChange: number => notificationsCountValue,
    }
    const module = new MNModule(moduleOptions)
    // check if options were applied succesfully
    expect(module.options).toEqual(moduleOptions)
    // check if onNotificationsCountChange works correct
    expect(module.options.onNotificationsCountChange()).toEqual(
      notificationsCountValue
    )
  })
})
