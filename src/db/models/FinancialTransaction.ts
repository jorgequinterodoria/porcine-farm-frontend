import { Model } from '@nozbe/watermelondb'
import { text, date, field, readonly } from '@nozbe/watermelondb/decorators'

export default class FinancialTransaction extends Model {
  static table = 'financial_transactions'

  @text('tenant_id') tenantId!: string
  @date('transaction_date') transactionDate!: number
  @text('transaction_type') transactionType!: string
  @text('category_id') categoryId!: string
  @field('amount') amount!: number
  @text('currency') currency!: string
  @text('description') description!: string
  @text('animal_id') animalId?: string
  @text('batch_id') batchId?: string
  @text('payment_method') paymentMethod?: string
  @text('invoice_number') invoiceNumber?: string
  @text('supplier_customer') supplierCustomer?: string
  @text('notes') notes?: string
  @text('recorded_by') recordedBy?: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
