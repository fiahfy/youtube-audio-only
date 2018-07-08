import Logger from './utils/logger'
import iconOff from './assets/icon-off48.png'
import iconOn from './assets/icon-on48.png'
import './assets/icon16.png'
import './assets/icon48.png'
import './assets/icon128.png'

const className = 'yao-enabled'

const code = `
.${className} ytd-thumbnail,
.${className} yt-img-shadow,
.${className} ytd-playlist-panel-video-renderer #thumbnail-container,
.${className} ytd-watch video.video-stream.html5-main-video,
.${className} ytd-watch .ytp-offline-slate,
.${className} ytd-watch .ytp-spinner,
.${className} ytd-channel-video-player-renderer #player-container,
.${className} app-header .banner-visible-area {
  display: none!important;
}
.${className} ytd-topbar-menu-button-renderer yt-img-shadow {
  display: inherit!important;
}
.${className} ytd-watch .ytp-chrome-bottom {
  opacity: 1!important;
}
`

const enabled = {}

const setIcon = (tabId) => {
  const path = enabled[tabId] ? iconOn : iconOff
  chrome.pageAction.setIcon({ tabId, path })
}

const sendMessage = (tabId) => {
  chrome.tabs.sendMessage(tabId, { id: 'stateChanged', data: { enabled: enabled[tabId] } })
}

chrome.pageAction.onClicked.addListener((tab) => {
  Logger.log('chrome.pageAction.onClicked', tab)

  enabled[tab.id] = !enabled[tab.id]
  setIcon(tab.id)
  sendMessage(tab.id)
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  Logger.log('chrome.runtime.onMessage', message, sender, sendResponse)

  const { id } = message
  const { tab, frameId } = sender
  switch (id) {
    case 'contentLoaded':
      chrome.pageAction.show(tab.id)
      chrome.tabs.insertCSS(tab.id, { frameId, code })
      setIcon(tab.id)
      sendMessage(tab.id)
      break
  }
})

;(() => {
  Logger.log('background script loaded')
})()
