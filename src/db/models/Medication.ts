import { Model } from '@nozbe/watermelondb'
import { text, field, readonly, date } from '@nozbe/watermelondb/decorators'

export default class Medication extends Model {
  static table = 'medications'

  @text('code') code!: string
  @text('commercial_name') commercialName!: string
  @text('generic_name') genericName?: string
  @text('category') category?: string
  @text('presentation') presentation?: string
  @field('withdrawal_period_days') withdrawalPeriodDays?: number
  @text('dosage_instructions') dosageInstructions?: string
  @text('manufacturer') manufacturer?: string
  @field('is_active') isActive!: boolean
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
