import logger from './utils/logger'
import className from './constants/class-name'
import iconOff from './assets/icon-off48.png'
import iconOn from './assets/icon-on48.png'
import './assets/icon16.png'
import './assets/icon48.png'
import './assets/icon128.png'

const code = `
.${className.enabled} *:not(#animated-yoodle) {
  background-image: none!important;
}
.${className.enabled} video,
.${className.enabled} img {
  display: none!important;
}
.${className.enabled} ytd-topbar-logo-renderer ytd-yoodle-renderer img,
.${className.enabled} ytd-topbar-menu-button-renderer yt-img-shadow img,
.${className.enabled} #links-holder yt-img-shadow img {
  display: inherit!important;
}
.${className.enabled} .html5-video-player {
  background-color: #000;
}
.${className.enabled} .ytp-chrome-bottom {
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
  const disabled = initialDisabled
  disabledTabs[tabId] = disabled

  setIcon(tabId)
  chrome.pageAction.show(tabId)
  chrome.tabs.insertCSS(tabId, { frameId, code })
  chrome.tabs.sendMessage(tabId, {
    id: 'disabledChanged',
    data: { disabled }
  })
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
