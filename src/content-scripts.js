import logger from './utils/logger'
import className from './utils/class-name'

const updateBody = (disabled) => {
  if (disabled) {
    document.body.classList.remove(className.enabled)
  } else {
    document.body.classList.add(className.enabled)
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  logger.log('chrome.runtime.onMessage', message, sender, sendResponse)

  const { id, data } = message
  switch (id) {
    case 'disabledChanged':
      updateBody(data.disabled)
      break
  }
})

document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ id: 'contentLoaded' })
})

logger.log('content script loaded')
