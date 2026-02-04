import { Model } from '@nozbe/watermelondb'
import { text, field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class Notification extends Model {
  static table = 'notifications'

  @text('tenant_id') tenantId!: string
  @text('user_id') userId?: string
  @text('notification_type') notificationType!: string
  @text('title') title!: string
  @text('message') message!: string
  @text('priority') priority!: string
  @text('related_entity_type') relatedEntityType?: string
  @text('related_entity_id') relatedEntityId?: string
  @text('action_url') actionUrl?: string
  @field('is_read') isRead!: boolean
  @date('read_at') readAt?: number
  @readonly @date('created_at') createdAt!: number
}
