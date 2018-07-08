import Logger from './utils/logger'

const update = async (enabled) => {
  if (enabled) {
    document.body.classList.add('yao-enabled')
  } else {
    document.body.classList.remove('yao-enabled')
  }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  Logger.log('onMessage', message, sender, sendResponse)

  const { id, data: { enabled } } = message
  switch (id) {
    case 'stateChanged':
      await update(enabled)
      break
  }
})

;(async () => {
  Logger.log('content script loaded')

  chrome.runtime.sendMessage({ id: 'contentLoaded' })
})()
