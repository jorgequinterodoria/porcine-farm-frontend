import { Model } from '@nozbe/watermelondb'
import { text, date, field, readonly } from '@nozbe/watermelondb/decorators'

export default class AnimalSale extends Model {
  static table = 'animal_sales'

  @text('tenant_id') tenantId!: string
  @date('sale_date') saleDate!: number
  @text('customer_name') customerName!: string
  @text('customer_contact') customerContact?: string
  @field('total_amount') totalAmount!: number
  @text('payment_status') paymentStatus!: string
  @text('payment_method') paymentMethod?: string
  @text('invoice_number') invoiceNumber?: string
  @text('notes') notes?: string
  @text('recorded_by') recordedBy?: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
