import { Model } from '@nozbe/watermelondb'
import { text, field, readonly, date } from '@nozbe/watermelondb/decorators'

export default class Vaccine extends Model {
  static table = 'vaccines'

  @text('code') code!: string
  @text('name') name!: string
  @text('disease') disease!: string
  @text('type') type?: string
  @text('manufacturer') manufacturer?: string
  @text('application_route') applicationRoute?: string
  @text('dosage') dosage?: string
  @field('booster_required') boosterRequired!: boolean
  @field('booster_interval_days') boosterIntervalDays?: number
  @field('is_active') isActive!: boolean
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
