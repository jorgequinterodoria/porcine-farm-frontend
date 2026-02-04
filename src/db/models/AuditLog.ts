import { Model } from '@nozbe/watermelondb'
import { text, json, readonly, date } from '@nozbe/watermelondb/decorators'

export default class AuditLog extends Model {
  static table = 'audit_logs'

  @text('tenant_id') tenantId?: string
  @text('user_id') userId?: string
  @text('action') action!: string
  @text('entity_type') entityType?: string
  @text('entity_id') entityId?: string
  @json('old_values', (raw) => raw) oldValues?: any
  @json('new_values', (raw) => raw) newValues?: any
  @text('ip_address') ipAddress?: string
  @text('user_agent') userAgent?: string
  @readonly @date('created_at') createdAt!: number
}
