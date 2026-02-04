import { Model } from '@nozbe/watermelondb'
import { text, field, readonly, date } from '@nozbe/watermelondb/decorators'

export default class FeedType extends Model {
  static table = 'feed_types'

  @text('tenant_id') tenantId!: string
  @text('code') code!: string
  @text('name') name!: string
  @text('category') category?: string
  @field('protein_percentage') proteinPercentage?: number
  @field('energy_mcal_kg') energyMcalKg?: number
  @field('crude_fiber_percentage') crudeFiberPercentage?: number
  @text('formula') formula?: string
  @text('manufacturer') manufacturer?: string
  @field('cost_per_kg') costPerKg?: number
  @field('is_active') isActive!: boolean
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
