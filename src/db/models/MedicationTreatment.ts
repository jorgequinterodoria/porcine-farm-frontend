import { Model } from '@nozbe/watermelondb'
import { text, date, readonly } from '@nozbe/watermelondb/decorators'

export default class MedicationTreatment extends Model {
  static table = 'medication_treatments'

  @text('tenant_id') tenantId!: string
  @text('animal_id') animalId?: string
  @text('batch_id') batchId?: string
  @text('health_record_id') healthRecordId?: string
  @text('medication_id') medicationId!: string
  @date('start_date') startDate!: number
  @date('end_date') endDate?: number
  @text('dosage') dosage?: string
  @text('frequency') frequency?: string
  @text('application_route') applicationRoute?: string
  @date('withdrawal_date') withdrawalDate?: number
  @text('administered_by') administeredBy?: string
  @text('notes') notes?: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
