import { Model } from '@nozbe/watermelondb'
import { text, date, field, readonly } from '@nozbe/watermelondb/decorators'

export default class Weaning extends Model {
  static table = 'weanings'

  @text('tenant_id') tenantId!: string
  @text('farrowing_id') farrowingId!: string
  @date('weaning_date') weaningDate!: number
  @field('piglets_weaned') pigletsWeaned!: number
  @field('average_weaning_weight') averageWeaningWeight?: number
  @field('age_at_weaning_days') ageAtWeaningDays?: number
  @field('mortality_during_lactation') mortalityDuringLactation!: number
  @text('notes') notes?: string
  @text('recorded_by') recordedBy?: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
