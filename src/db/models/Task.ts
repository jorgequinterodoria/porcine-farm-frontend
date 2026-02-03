
import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class Task extends Model {
  static table = 'tasks'

  @field('tenant_id') tenantId!: string
  @field('title') title!: string
  @field('description') description?: string
  @date('due_date') dueDate!: Date
  @field('status') status!: string
  @field('priority') priority!: string
  @field('assigned_to') assignedTo?: string
  @field('entity_type') entityType?: string
  @field('entity_id') entityId?: string
  @date('completed_at') completedAt?: Date

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
  @date('deleted_at') deletedAt?: Date
}
