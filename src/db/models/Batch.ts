import { Model } from '@nozbe/watermelondb'
import { text, date, field, readonly } from '@nozbe/watermelondb/decorators'

export default class Batch extends Model {
  static table = 'batches'

  @text('tenant_id') tenantId!: string
  @text('code') code!: string
  @text('name') name!: string
  @text('batch_type') batchType!: string
  @date('start_date') startDate!: number
  @date('expected_end_date') expectedEndDate?: number
  @date('actual_end_date') actualEndDate?: number
  @field('initial_count') initialCount?: number
  @field('current_count') currentCount?: number
  @field('target_weight') targetWeight?: number
  @text('notes') notes?: string
  @text('status') status!: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
