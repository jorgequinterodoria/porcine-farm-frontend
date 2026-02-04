import { Model } from '@nozbe/watermelondb'
import { text, json, field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class User extends Model {
  static table = 'users'

  @text('tenant_id') tenantId!: string
  @text('email') email!: string
  @text('password_hash') passwordHash!: string
  @text('first_name') firstName!: string
  @text('last_name') lastName!: string
  @text('phone') phone?: string
  @text('avatar_url') avatarUrl?: string
  @text('role') role!: string
  @json('permissions', (raw) => raw) permissions!: any
  @field('email_verified') emailVerified!: boolean
  @date('last_login') lastLogin?: number
  @text('reset_token') resetToken?: string
  @date('reset_token_expires') resetTokenExpires?: number
  @field('is_active') isActive!: boolean
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
