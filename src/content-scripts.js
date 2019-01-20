import logger from './utils/logger'

const id = chrome.runtime.id

const ClassName = {
  enabled: `${id}-enabled`
}

const update = (disabled) => {
  if (disabled) {
    document.body.classList.remove(ClassName.enabled)
  } else {
    document.body.classList.add(ClassName.enabled)
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  logger.log('chrome.runtime.onMessage', message, sender, sendResponse)

  const { id, data } = message
  switch (id) {
    case 'disabledChanged':
      update(data.disabled)
      break
  }
})

logger.log('content script loaded')

document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ id: 'contentLoaded' })
})
