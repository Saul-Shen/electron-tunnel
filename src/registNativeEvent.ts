import { FIRE_CHANNEL, CALLBACK_CHANNEL } from './const'
import { isBrowser } from './util'

interface Arg {
  id: string
  eventName: string
  params: any
}

type EventFunc = (params?: any) => Promise<any>

interface EventsMap {
  [index: string]: EventFunc
}

const eventsMap: EventsMap = {}

let ifIpcMainSetup: boolean = false

function registNativeEvent(eventName: string, fn: EventFunc) {
  eventsMap[eventName] = fn

  if (!ifIpcMainSetup && !isBrowser()) {
    ipcMainSetup()
  }
}

function ipcMainSetup() {
  const { ipcMain } = require('electron')

  ifIpcMainSetup = true

  ipcMain.on(FIRE_CHANNEL, async (event: any, arg: Arg) => {
    const { id, eventName, params } = arg
    const nativeEvent = eventsMap[eventName]

    // not support
    if (!nativeEvent) {
      event.sender.send(CALLBACK_CHANNEL, {
        id,
        error: 'event not support'
      })

      return
    }

    try {
      const result = await nativeEvent(params)

      event.sender.send(CALLBACK_CHANNEL, {
        id,
        payload: result
      })
    } catch (error) {
      event.sender.send(CALLBACK_CHANNEL, {
        id,
        error: error.message
      })
    }
  })
}

export default registNativeEvent
