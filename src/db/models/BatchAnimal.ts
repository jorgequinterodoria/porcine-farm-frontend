import { Model } from '@nozbe/watermelondb'
import { text, date, readonly } from '@nozbe/watermelondb/decorators'

export default class BatchAnimal extends Model {
  static table = 'batch_animals'

  @text('tenant_id') tenantId!: string
  @text('batch_id') batchId!: string
  @text('animal_id') animalId!: string
  @date('join_date') joinDate!: number
  @date('exit_date') exitDate?: number
  @text('exit_reason') exitReason?: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
