import { Model } from '@nozbe/watermelondb'
import { text, field, readonly, date } from '@nozbe/watermelondb/decorators'

export default class TransactionCategory extends Model {
  static table = 'transaction_categories'

  @text('tenant_id') tenantId!: string
  @text('code') code!: string
  @text('name') name!: string
  @text('type') type!: string
  @text('parent_category_id') parentCategoryId?: string
  @field('is_active') isActive!: boolean
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
