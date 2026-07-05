import { MessageSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Reaction from '#models/reaction'

export default class Message extends MessageSchema {
  @hasMany(() => Reaction)
  declare reactions: HasMany<typeof Reaction>
}
