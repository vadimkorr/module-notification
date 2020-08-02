const REMOVE_NOTIFICATION_DELAY_MS = 100

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
  for (let group of module._getGroups()) {
    allNotificationsCount += group._getLength()
  }
  return allNotificationsCount * REMOVE_NOTIFICATION_DELAY_MS
}

const getRemoveWaitingTimeMSByGroupId = (module, groupId) => {
  return module._getGroup(groupId)._getLength() * REMOVE_NOTIFICATION_DELAY_MS
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

window.addHtmlSnippet = {
  addHtmlSnippet,
  getRemoveWaitingTimeMS,
  getRemoveWaitingTimeMSByGroupId,
  wait,
}
