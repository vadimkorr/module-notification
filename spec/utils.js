const REMOVE_NOTIFICATION_DELAY_MS = 100

const groupUtils = {
  getGroupById: (module, groupId) => module.__getGroups().get(groupId),
  getGroups: module => module.__getGroups().values(),
  getGroupsCount: module => module.__getGroups().size,
}

const addHtmlSnippet = containerId => {
  const fixture = `
      <div>
        <div id="${containerId}"></div>
      </div>
    `
  document.body.insertAdjacentHTML('afterbegin', fixture)
}

const getRemoveWaitingTimeMS = module => {
  let allNotificationsCount = 0
  for (let group of groupUtils.getGroups(module)) {
    allNotificationsCount += group._getLength()
  }
  return allNotificationsCount * REMOVE_NOTIFICATION_DELAY_MS
}

const getRemoveWaitingTimeMSByGroupId = (module, groupId) => {
  return (
    groupUtils.getGroupById(module, groupId)._getLength() *
    REMOVE_NOTIFICATION_DELAY_MS
  )
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

window.addHtmlSnippet = {
  addHtmlSnippet,
  getRemoveWaitingTimeMS,
  getRemoveWaitingTimeMSByGroupId,
  wait,
  groupUtils,
}
