import logger from './utils/logger'
import iconOff from './assets/icon-off48.png'
import iconOn from './assets/icon-on48.png'
import './assets/icon16.png'
import './assets/icon48.png'
import './assets/icon128.png'

const id = chrome.runtime.id

const ClassName = {
  enabled: `${id}-enabled`
}

const code = `
.${ClassName.enabled} *:not(#animated-yoodle) {
  background-image: none!important
}
.${ClassName.enabled} video,
.${ClassName.enabled} img {
  display: none!important;
}
.${ClassName.enabled} ytd-topbar-logo-renderer ytd-yoodle-renderer img,
.${ClassName.enabled} ytd-topbar-menu-button-renderer yt-img-shadow img,
.${ClassName.enabled} #links-holder yt-img-shadow img {
  display: inherit!important;
}
.${ClassName.enabled} .html5-video-player {
  background-color: #000;
}
.${ClassName.enabled} .ytp-chrome-bottom {
  opacity: 1!important;
}
`

let initialDisabled = false
const disabledTabs = {}

const setIcon = (tabId) => {
  const path = disabledTabs[tabId] ? iconOff : iconOn
  chrome.pageAction.setIcon({ tabId, path })
}

const contentLoaded = (tabId, frameId) => {
  chrome.tabs.insertCSS(tabId, { frameId, code })
  const disabled = initialDisabled
  disabledTabs[tabId] = disabled
  setIcon(tabId)
  chrome.tabs.sendMessage(tabId, {
    id: 'disabledChanged',
    data: { disabled }
  })
  chrome.pageAction.show(tabId)
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  logger.log('chrome.runtime.onMessage', message, sender, sendResponse)

  const { id } = message
  const { tab, frameId } = sender
  switch (id) {
    case 'contentLoaded':
      contentLoaded(tab.id, frameId)
      break
  }
})

chrome.pageAction.onClicked.addListener((tab) => {
  logger.log('chrome.pageAction.onClicked', tab)

  const disabled = !disabledTabs[tab.id]
  initialDisabled = disabled
  disabledTabs[tab.id] = disabled
  setIcon(tab.id)
  chrome.tabs.sendMessage(tab.id, {
    id: 'disabledChanged',
    data: { disabled }
  })
})

logger.log('background script loaded')
