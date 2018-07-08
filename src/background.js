import Logger from './utils/logger'
import iconOff from './assets/icon-off48.png'
import iconOn from './assets/icon-on48.png'
import './assets/icon16.png'
import './assets/icon48.png'
import './assets/icon128.png'

const code = `
.yao-enabled ytd-thumbnail,
.yao-enabled yt-img-shadow,
.yao-enabled ytd-playlist-panel-video-renderer #thumbnail-container,
.yao-enabled ytd-watch video.video-stream.html5-main-video,
.yao-enabled ytd-watch .ytp-offline-slate,
.yao-enabled ytd-watch .ytp-spinner,
.yao-enabled ytd-channel-video-player-renderer #player-container,
.yao-enabled app-header .banner-visible-area {
  display: none!important;
}
.yao-enabled ytd-topbar-menu-button-renderer yt-img-shadow {
  display: inherit!important;
}
.yao-enabled ytd-watch .ytp-chrome-bottom {
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
    case 'contentUnloaded':
      chrome.pageAction.hide(tab.id)
      break
  }
})

;(() => {
  Logger.log('background script loaded')
})()
