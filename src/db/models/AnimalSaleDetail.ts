import { Model } from '@nozbe/watermelondb'
import { text, field, readonly, date } from '@nozbe/watermelondb/decorators'

export default class AnimalSaleDetail extends Model {
  static table = 'animal_sale_details'

  @text('tenant_id') tenantId!: string
  @text('sale_id') saleId!: string
  @text('animal_id') animalId!: string
  @field('weight_kg') weightKg?: number
  @field('price_per_kg') pricePerKg?: number
  @field('unit_price') unitPrice?: number
  @field('quantity') quantity!: number
  @field('subtotal') subtotal!: number
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
