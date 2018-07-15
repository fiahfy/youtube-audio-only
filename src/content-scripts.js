import Logger from './utils/logger'

const className = 'yao-enabled'

const update = (enabled) => {
  if (enabled) {
    document.body.classList.add(className)
  } else {
    document.body.classList.remove(className)
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  Logger.log('chrome.runtime.onMessage', message, sender, sendResponse)

  const { id, data } = message
  switch (id) {
    case 'enabledChanged':
      update(data.enabled)
      break
  }
})

;(() => {
  Logger.log('content script loaded')

  document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ id: 'contentLoaded' })
  })
})()
