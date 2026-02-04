import { Model } from '@nozbe/watermelondb'
import { text, field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class WeightRecord extends Model {
  static table = 'weight_records'

  @text('tenant_id') tenantId!: string
  @text('animal_id') animalId!: string
  @field('weight_kg') weightKg!: number
  @date('measurement_date') measurementDate!: number
  @field('age_days') ageDays?: number
  @text('recorded_by') recordedBy?: string
  @text('notes') notes?: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
