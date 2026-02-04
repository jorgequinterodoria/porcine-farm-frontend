import { Model } from '@nozbe/watermelondb'
import { text, date, readonly } from '@nozbe/watermelondb/decorators'

export default class BreedingService extends Model {
  static table = 'breeding_services'

  @text('tenant_id') tenantId!: string
  @text('female_id') femaleId!: string
  @date('service_date') serviceDate!: number
  @text('service_type') serviceType!: string
  @text('male_id') maleId?: string
  @text('semen_batch') semenBatch?: string
  @text('semen_provider') semenProvider?: string
  @text('heat_detection_method') heatDetectionMethod?: string
  @text('technician_id') technicianId?: string
  @text('notes') notes?: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
