const getEnabled = async () => {
  const { enabled } = await chrome.storage.local.get(['enabled'])
  return enabled ?? true
}

const setEnabled = async (enabled: boolean) => {
  await chrome.storage.local.set({ enabled })
}

const setIcon = async (tabId: number, enabled: boolean) => {
  const icon = enabled ? 'icon-on.png' : 'icon.png'
  chrome.action.setIcon({ tabId, path: chrome.runtime.getURL(icon) })
}

const contentLoaded = async (tabId: number) => {
  const enabled = await getEnabled()
  await setIcon(tabId, enabled)
  return { enabled }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type } = message
  const { tab } = sender
  switch (type) {
    case 'content-loaded':
      if (tab?.id) {
        contentLoaded(tab.id).then((data) => sendResponse(data))
        return true
      }
      return
  }
})

chrome.action.onClicked.addListener(async () => {
  const enabled = !(await getEnabled())
  await setEnabled(enabled)

  const tabs = await chrome.tabs.query({ url: 'https://www.youtube.com/*' })
  for (const tab of tabs) {
    try {
      if (tab.id) {
        await setIcon(tab.id, enabled)
        await chrome.tabs.sendMessage(tab.id, {
          type: 'enabled-changed',
          data: { enabled },
        })
      }
    } catch {
      // noop
    }
  }
})
