import Logger from './utils/logger'

const update = (enabled) => {
  if (enabled) {
    document.body.classList.add('yao-enabled')
  } else {
    document.body.classList.remove('yao-enabled')
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
