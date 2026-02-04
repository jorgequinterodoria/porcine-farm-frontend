import { Model } from '@nozbe/watermelondb'
import { text, date, readonly } from '@nozbe/watermelondb/decorators'

export default class Pregnancy extends Model {
  static table = 'pregnancies'

  @text('tenant_id') tenantId!: string
  @text('animal_id') animalId!: string
  @text('breeding_service_id') breedingServiceId?: string
  @date('confirmation_date') confirmationDate?: number
  @text('confirmation_method') confirmationMethod?: string
  @date('expected_farrowing_date') expectedFarrowingDate?: number
  @date('actual_farrowing_date') actualFarrowingDate?: number
  @text('pregnancy_status') pregnancyStatus!: string
  @text('notes') notes?: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
