import { Model } from '@nozbe/watermelondb'
import { text, field, readonly, date } from '@nozbe/watermelondb/decorators'

export default class Facility extends Model {
  static table = 'facilities'

  @text('tenant_id') tenantId!: string
  @text('code') code!: string
  @text('name') name!: string
  @text('facility_type') facilityType!: string
  @text('parent_facility_id') parentFacilityId?: string
  @field('capacity') capacity?: number
  @field('area_sqm') areaSqm?: number
  @text('description') description?: string
  @text('location_description') locationDescription?: string
  @text('coordinates') coordinates?: string
  @field('is_active') isActive!: boolean
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
