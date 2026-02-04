import { Model } from '@nozbe/watermelondb'
import { text, date, readonly } from '@nozbe/watermelondb/decorators'

export default class Task extends Model {
  static table = 'tasks'

  @text('tenant_id') tenantId!: string
  @text('title') title!: string
  @text('description') description?: string
  @text('task_type') taskType?: string
  @text('priority') priority!: string
  @text('status') status!: string
  @text('assigned_to') assignedTo?: string
  @date('due_date') dueDate?: number
  @date('due_time') dueTime?: number
  @date('completed_date') completedDate?: number
  @text('facility_id') facilityId?: string
  @text('pen_id') penId?: string
  @text('animal_id') animalId?: string
  @text('batch_id') batchId?: string
  @text('recurrence_rule') recurrenceRule?: string
  @text('notes') notes?: string
  @text('created_by') createdBy?: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
