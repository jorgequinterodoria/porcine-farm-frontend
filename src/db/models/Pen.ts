import { Model } from '@nozbe/watermelondb'
import { text, field, date, relation, readonly } from '@nozbe/watermelondb/decorators'
import Facility from './Facility'

export default class Pen extends Model {
  static table = 'pens'

  @text('tenant_id') tenantId!: string
  @text('facility_id') facilityId!: string
  @text('code') code!: string
  @text('name') name!: string
  @field('capacity') capacity!: number
  @field('area_sqm') areaSqm!: number
  @field('has_feeder') hasFeeder!: boolean
  @field('has_waterer') hasWaterer!: boolean
  @field('has_climate_control') hasClimateControl!: boolean
  @text('notes') notes?: string
  @field('is_active') isActive!: boolean
  
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
  @date('deleted_at') deletedAt?: Date

  @relation('facilities', 'facility_id') facility!: Facility
}
