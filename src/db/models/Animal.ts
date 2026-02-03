
import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class Animal extends Model {
  static table = 'animals'

  @field('tenant_id') tenantId!: string
  @field('code') code!: string
  @field('batch_id') batchId?: string
  @date('birth_date') birthDate!: Date
  @field('gender') gender!: string
  @field('status') status!: string
  @field('location_id') locationId?: string
  
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
  @date('deleted_at') deletedAt?: Date
}
