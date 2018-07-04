import Storage from './utils/storage'
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

const toggleEnabled = async () => {
  const settings = (await Storage.get()).settings
  settings.enabled = !settings.enabled
  await Storage.set({ settings })
}

const updateIcon = async () => {
  const settings = (await Storage.get()).settings
  const path = settings.enabled ? iconOn : iconOff
  chrome.browserAction.setIcon({ path })
}

const sendMessageAll = (data) => {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, data)
    })
  })
}

chrome.browserAction.onClicked.addListener(async (tab) => {
  Logger.log('chrome.browserAction.onClicked', tab)

  await toggleEnabled()
  await updateIcon()
  sendMessageAll({ id: 'stateChanged' })
})

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  Logger.log('chrome.runtime.onMessage', message, sender, sendResponse)

  const { id } = message
  switch (id) {
    case 'contentLoaded':
      chrome.tabs.insertCSS(sender.tab.id, { frameId: sender.frameId, code })
      break
  }
})

;(async () => {
  Logger.log('background script loaded')

  const state = {
    settings: { enabled: true },
    ...(await Storage.get())
  }
  await Storage.set(state)

  await updateIcon()
})()
