import { QrCodeSchema } from '#database/schema'
import User from './user.ts'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class QrCode extends QrCodeSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  get displayTitle() {
    return this.title || this.content.slice(0, 20) + (this.content.length > 20 ? '...' : '')
  }
}
