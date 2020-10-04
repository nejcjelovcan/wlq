import { RestResponseError } from './rest'
import { ValidationError } from '@wlq/wlq-model/src/validation'

export interface WsMessage<T extends object = WsMessageData> {
  action: string
  data: T
}

export const newWsMessage = <T extends object = WsMessageData>(
  action: string,
  data: T,
): WsMessage<T> => ({ action, data })

// TODO We actually need to introduce broadcasting mechanic, since it'll be
// more reliable to send broadcasted messages (to a whole room) in a separate
// queue (see joinRoom how running it concurrently can end up not notifying
// a participant that has joined between getRoomAndParticipants and
// addParticipant)
export interface WsMessageEvent<T extends object = WsMessageData> {
  connectionId: string
  message: WsMessage<T>
}

export const newWsMessageEvent = <T extends object = WsMessageData>(
  connectionId: string,
  action: string,
  data: T,
): WsMessageEvent<T> => ({ connectionId, message: { action, data } })

export type WsMessageData = { [key: string]: any }

// This is the return type of a "async function*", not the function itself
// No real point in having it generic, since usually messages of several
// different types will be yielded from a single iterable
// (we can type those messages properly inside the function though)
export type WsEventIterable = AsyncIterable<
  WsMessageEvent | WsMessageEvent[] | undefined
>

// Iterable function that returns the async iterator
// Use this as return type when defining factories (since args can be inferred)
export type WsEventIterableFunction<T extends object = WsMessageData> = (
  incomingEvent: WsMessageEvent<T>,
) => WsEventIterable

// Do not use this as factory function type, rather use above
// WsEventIterableFunction as return type (better inference of args)
// TODO maybe we don't even need this type
export type WsEventIterableFunctionFactory<T extends object = WsMessageData> = (
  ...args: any[]
) => WsEventIterableFunction<T>

export type WsSendFunction = (event: WsMessageEvent) => Promise<any>

// export type WsEventIterableConsumer<T extends object = WsMessageData> = (
//   incomingEvent: WsMessageEvent<T>,
//   iterableFunction: WsEventIterableFunction<T>,
//   sendFunction: WsSendFunction,
// ) => Promise<void>

export const wsEventConsumer = async <T extends object = WsMessageData>(
  incomingEvent: WsMessageEvent<T>,
  iterableFunction: WsEventIterableFunction<T>,
  sendFunction: WsSendFunction,
) => {
  try {
    for await (const message of iterableFunction(incomingEvent)) {
      if (Array.isArray(message)) {
        await Promise.all(message.map(sendFunction))
      } else if (message) {
        await sendFunction(message)
      }
    }
  } catch (e) {
    console.error('wsEventConsumer error', e)
    let error = 'Internal Server Error'
    if (e instanceof RestResponseError) {
      error = e.message
    } else if (e instanceof ValidationError) {
      error = `${e.field}: ${e.message}`
    }
    await sendFunction({
      connectionId: incomingEvent.connectionId,
      message: { action: 'error', data: { error } },
    })
  }
}
