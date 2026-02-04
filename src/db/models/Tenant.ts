import { Model } from '@nozbe/watermelondb'
import { text, date, field, json, readonly } from '@nozbe/watermelondb/decorators'

export default class Tenant extends Model {
  static table = 'tenants'

  @text('name') name!: string
  @text('subdomain') subdomain!: string
  @text('email') email!: string
  @text('phone') phone?: string
  @text('address') address?: string
  @text('country') country?: string
  @text('state_province') stateProvince?: string
  @text('city') city?: string
  @text('postal_code') postalCode?: string
  @text('subscription_plan') subscriptionPlan!: string
  @text('subscription_status') subscriptionStatus!: string
  @date('subscription_start_date') subscriptionStartDate?: number
  @date('subscription_end_date') subscriptionEndDate?: number
  @field('max_animals') maxAnimals!: number
  @field('max_users') maxUsers!: number
  @text('timezone') timezone!: string
  @text('currency') currency!: string
  @text('language') language!: string
  @json('settings') settings!: any
  @field('is_active') isActive!: boolean
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
