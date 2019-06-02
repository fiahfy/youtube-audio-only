import browser from 'webextension-polyfill'
import className from './constants/class-name'
import stylesheet from './constants/stylesheet'

const updateDocument = (enabled) => {
  if (enabled) {
    document.documentElement.classList.add(className.enabled)
  } else {
    document.documentElement.classList.remove(className.enabled)
  }
}

browser.runtime.onMessage.addListener((message) => {
  const { id, type, data } = message
  if (type === 'SIGN_RELOAD' && process.env.NODE_ENV !== 'production') {
    // reload if files changed
    parent.location.reload()
    return
  }
  switch (id) {
    case 'enabledChanged':
      updateDocument(data.enabled)
      break
  }
})

const style = document.createElement('style')
style.textContent = stylesheet
document.documentElement.append(style)

browser.runtime.sendMessage({ id: 'documentStarted' }).then((data) => {
  updateDocument(data.enabled)
})
