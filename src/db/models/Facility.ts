import { Model } from '@nozbe/watermelondb'
import { text, field, date, readonly, children } from '@nozbe/watermelondb/decorators'
import Pen from './Pen'

export default class Facility extends Model {
  static table = 'facilities'

  @text('tenant_id') tenantId!: string
  @text('code') code!: string
  @text('name') name!: string
  @text('facility_type') facilityType!: string
  @text('parent_facility_id') parentFacilityId?: string
  @field('capacity') capacity!: number
  @field('area_sqm') areaSqm!: number
  @text('description') description?: string
  @text('location_description') locationDescription?: string
  @text('coordinates') coordinates?: string
  @field('is_active') isActive!: boolean
  
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
  @date('deleted_at') deletedAt?: Date

  @children('pens') pens!: Pen[]
}
