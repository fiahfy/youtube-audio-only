import Logger from './utils/logger'
import iconOff from './assets/icon-off48.png'
import iconOn from './assets/icon-on48.png'
import './assets/icon48.png'

const code = `
.yvh-enabled ytd-thumbnail,
.yvh-enabled yt-img-shadow,
.yvh-enabled ytd-playlist-panel-video-renderer #thumbnail-container,
.yvh-enabled ytd-watch video.video-stream.html5-main-video,
.yvh-enabled ytd-watch .ytp-offline-slate,
.yvh-enabled ytd-watch .ytp-spinner,
.yvh-enabled ytd-channel-video-player-renderer #player-container,
.yvh-enabled app-header .banner-visible-area {
  display: none!important;
}
.yvh-enabled ytd-topbar-menu-button-renderer yt-img-shadow {
  display: inherit!important;
}
.yvh-enabled ytd-watch .ytp-chrome-bottom {
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

chrome.pageAction.onClicked.addListener(async (tab) => {
  Logger.log('chrome.pageAction.onClicked', tab)

  enabled[tab.id] = !enabled[tab.id]
  setIcon(tab.id)
  sendMessage(tab.id)
})

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
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

;(async () => {
  Logger.log('background script loaded')
})()
