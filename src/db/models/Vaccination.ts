import { Model } from '@nozbe/watermelondb'
import { text, date, readonly } from '@nozbe/watermelondb/decorators'

export default class Vaccination extends Model {
  static table = 'vaccinations'

  @text('tenant_id') tenantId!: string
  @text('animal_id') animalId?: string
  @text('batch_id') batchId?: string
  @text('vaccine_id') vaccineId!: string
  @date('application_date') applicationDate!: number
  @text('dosage') dosage?: string
  @text('application_route') applicationRoute?: string
  @text('batch_number') batchNumber?: string
  @date('expiration_date') expirationDate?: number
  @date('next_dose_date') nextDoseDate?: number
  @text('administered_by') administeredBy?: string
  @text('notes') notes?: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
