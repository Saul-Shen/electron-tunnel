import { FIRE_CHANNEL, CALLBACK_CHANNEL } from './const'
import { isBrowser } from './util'

interface Arg {
  id: string
  payload?: any
  error?: string
}

interface EventsStack {
  [index: string]: {
    resolve: (payload: object) => void
    reject: (error: Error) => void
  }
}

const eventsStack: EventsStack = {}

let id: number = 0

let ifIpcRenderSetUp: boolean = false

// call native event
function callNativeEvent(eventName: string, params: any = {}) {
  const { ipcRenderer } = require('electron')

  id++

  if (!ifIpcRenderSetUp && isBrowser()) {
    ipcRendererSetup()
  }

  return new Promise((resolve, reject) => {
    const event = {
      id: String(id),
      eventName,
      params
    }

    eventsStack[id] = { resolve, reject }

    ipcRenderer.send(FIRE_CHANNEL, event)
  })
}

// start ipcRenderer
function ipcRendererSetup() {
  const { ipcRenderer } = require('electron')

  ifIpcRenderSetUp = true

  ipcRenderer.on(CALLBACK_CHANNEL, (_e: any, arg: Arg) => {
    const { id, error, payload } = arg

    const eventHandler = eventsStack[id]

    if (!eventHandler) {
      return
    }

    if (arg.error) {
      eventHandler.reject(new Error(error))
    } else {
      eventHandler.resolve(payload)
    }

    delete eventsStack[id]
  })
}

export default callNativeEvent
