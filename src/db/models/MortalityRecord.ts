import { Model } from '@nozbe/watermelondb'
import { text, date, field, readonly } from '@nozbe/watermelondb/decorators'

export default class MortalityRecord extends Model {
  static table = 'mortality_records'

  @text('tenant_id') tenantId!: string
  @text('animal_id') animalId!: string
  @date('death_date') deathDate!: number
  @field('age_at_death_days') ageAtDeathDays?: number
  @field('weight_at_death') weightAtDeath?: number
  @text('death_cause') deathCause?: string
  @text('disease_id') diseaseId?: string
  @field('necropsy_performed') necropsyPerformed!: boolean
  @text('necropsy_findings') necropsyFindings?: string
  @text('disposal_method') disposalMethod?: string
  @text('recorded_by') recordedBy?: string
  @text('notes') notes?: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
