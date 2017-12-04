/**
 * 监听渲染进程对主进程的调用，执行完任务后通知渲染进程
 */
import * as Electron from 'electron';
import { FIRE_CHANNEL, CALLBACK_CHANNEL } from './const';
const { ipcMain } = Electron;

function isPromise(obj: object) {
  const toString = Object.prototype.toString;
  return toString.call(obj) === '[object Promise]';
}

interface Arg {
  id: string;
  eventName: string;
  params: object;
}

interface EventList {
  [index: string]: (params: object, ...cusParams: Array<object>) => Promise<object>;
}

let eventsList: EventList;
let cusParams: Array<object>;
let ifIpcMainSetUp: boolean = false;

// 监听对原生的调用
export function ipcMainSetup() {
  if (ifIpcMainSetUp) {
    return;
  } else {
    ifIpcMainSetUp = true;
  }

  ipcMain.on(FIRE_CHANNEL, (event: Electron.Event, arg: Arg) => {
    const {id, eventName, params} = arg;
    const nativeEvent = eventsList[eventName];

    // 主进程不支持的事件
    if (!nativeEvent) {
      event.sender.send(CALLBACK_CHANNEL, {
        id,
        err: 'event not support'
      });

      return;
    }

    // 主进程支持的事件
    const result =  nativeEvent(params, ...cusParams);
    if (isPromise(result)) { // 如果返回promise
      result.then(res => {
        event.sender.send(CALLBACK_CHANNEL, {
          id,
          payload: res
        });
      }).catch(err => {
        event.sender.send(CALLBACK_CHANNEL, {
          id,
          err: err.message
        });
      });
    } else {
      event.sender.send(CALLBACK_CHANNEL, {
        id,
        payload: result
      });
    }
  });
}

if (typeof window === 'undefined') {
  ipcMainSetup();
}

export function registEvents(events: EventList, params: Array<object>) {
  eventsList = events;
  cusParams = params;
}
