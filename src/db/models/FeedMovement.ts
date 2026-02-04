import { Model } from '@nozbe/watermelondb'
import { text, field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class FeedMovement extends Model {
  static table = 'feed_movements'

  @text('tenant_id') tenantId!: string
  @text('feed_type_id') feedTypeId!: string
  @text('movement_type') movementType!: string
  @field('quantity_kg') quantityKg!: number
  @date('movement_date') movementDate!: number
  @field('unit_cost') unitCost?: number
  @field('total_cost') totalCost?: number
  @text('supplier') supplier?: string
  @text('invoice_number') invoiceNumber?: string
  @text('notes') notes?: string
  @text('recorded_by') recordedBy?: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
