// mirage.js
import { Room, RoomParticipant } from '@wlq/wlq-model/src'
import { Registry } from 'miragejs'
import { ModelDefinition } from 'miragejs/-types'
import Schema from 'miragejs/orm/schema'

export type ServerRegistry = Registry<
  {
    room: ModelDefinition<Room>
    participant: ModelDefinition<RoomParticipant>
  },
  {}
>
export type ServerSchema = Schema<ServerRegistry>
