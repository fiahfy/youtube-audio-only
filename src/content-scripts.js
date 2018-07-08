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
  Logger.log('onMessage', message, sender, sendResponse)

  const { id, data } = message
  switch (id) {
    case 'stateChanged':
      update(data.enabled)
      break
  }
})

;(() => {
  Logger.log('content script loaded')

  chrome.runtime.sendMessage({ id: 'contentLoaded' })
})()
