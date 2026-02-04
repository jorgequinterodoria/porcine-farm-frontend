import { Model } from '@nozbe/watermelondb'
import { text, field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class FeedInventory extends Model {
  static table = 'feed_inventory'

  @text('tenant_id') tenantId!: string
  @text('feed_type_id') feedTypeId!: string
  @field('current_stock_kg') currentStockKg!: number
  @field('minimum_stock_kg') minimumStockKg?: number
  @field('maximum_stock_kg') maximumStockKg?: number
  @date('last_purchase_date') lastPurchaseDate?: number
  @field('last_purchase_price') lastPurchasePrice?: number
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
