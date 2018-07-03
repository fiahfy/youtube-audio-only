import Storage from './utils/storage'
import Logger from './utils/logger'

const update = async () => {
  const settings = (await Storage.get()).settings
  if (settings.enabled) {
    document.body.classList.add('yvh-enabled')
  } else {
    document.body.classList.remove('yvh-enabled')
  }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  Logger.log('onMessage', message, sender, sendResponse)

  const { id } = message
  switch (id) {
    case 'stateChanged':
      await update()
      break
  }
})

;(async () => {
  Logger.log('content script loaded')

  await update()

  chrome.runtime.sendMessage({ id: 'contentLoaded' })
})()
