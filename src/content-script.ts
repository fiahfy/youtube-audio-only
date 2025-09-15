import '~/content-script.css'

const className = 'yao-enabled'

let enabled: boolean

const init = () => {
  if (enabled) {
    document.documentElement.classList.add(className)
  } else {
    document.documentElement.classList.remove(className)
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const { type, data } = message
  switch (type) {
    case 'enabled-changed':
      enabled = data.enabled
      init()
      return sendResponse()
  }
})

chrome.runtime.sendMessage({ type: 'content-loaded' }).then((data) => {
  enabled = data.enabled
  init()
})
