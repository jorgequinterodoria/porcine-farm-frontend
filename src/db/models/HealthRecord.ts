import { Model } from '@nozbe/watermelondb'
import { text, date, field, readonly } from '@nozbe/watermelondb/decorators'

export default class HealthRecord extends Model {
  static table = 'health_records'

  @text('tenant_id') tenantId!: string
  @text('animal_id') animalId?: string
  @text('batch_id') batchId?: string
  @text('record_type') recordType!: string
  @date('record_date') recordDate!: number
  @text('disease_id') diseaseId?: string
  @text('symptoms') symptoms?: string
  @text('diagnosis') diagnosis?: string
  @field('temperature') temperature?: number
  @text('treatment_plan') treatmentPlan?: string
  @text('prognosis') prognosis?: string
  @text('veterinarian_id') veterinarianId?: string
  @text('notes') notes?: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
