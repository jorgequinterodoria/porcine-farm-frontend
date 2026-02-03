
import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class FeedConsumption extends Model {
  static table = 'feed_consumption'

  @field('tenant_id') tenantId!: string
  @field('batch_id') batchId!: string
  @field('feed_type_id') feedTypeId!: string
  @field('quantity') quantity!: number
  @date('consumption_date') consumptionDate!: Date
  @field('recorded_by') recordedBy?: string

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
  @date('deleted_at') deletedAt?: Date
}
