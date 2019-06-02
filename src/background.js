import browser from 'webextension-polyfill'
import icon from './assets/icon.png'
import iconOn from './assets/icon-on.png'

let initialEnabled = true
const enabledTabs = {}

const setIcon = async (tabId) => {
  const path = enabledTabs[tabId] ? iconOn : icon
  await browser.pageAction.setIcon({ tabId, path })
}

const initTab = async (tabId) => {
  const enabled = initialEnabled
  enabledTabs[tabId] = enabled

  await setIcon(tabId)
  await browser.pageAction.show(tabId)

  return { enabled }
}

const toggleEnabled = async (tabId) => {
  const enabled = !enabledTabs[tabId]
  initialEnabled = enabled
  enabledTabs[tabId] = enabled

  await setIcon(tabId)

  await browser.tabs.sendMessage(tabId, {
    id: 'enabledChanged',
    data: { enabled }
  })
}

browser.runtime.onMessage.addListener(async (message, sender) => {
  const { id } = message
  const { tab, frameId } = sender
  switch (id) {
    case 'documentStarted':
      return await initTab(tab.id, frameId)
  }
})

browser.pageAction.onClicked.addListener((tab) => {
  toggleEnabled(tab.id)
})
