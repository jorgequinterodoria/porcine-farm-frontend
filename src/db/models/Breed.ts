import { Model } from '@nozbe/watermelondb'
import { text, field, readonly, date } from '@nozbe/watermelondb/decorators'

export default class Breed extends Model {
  static table = 'breeds'

  @text('code') code!: string
  @text('name') name!: string
  @text('description') description?: string
  @text('origin_country') originCountry?: string
  @text('typical_weight_range') typicalWeightRange?: string
  @text('characteristics') characteristics?: string
  @field('is_active') isActive!: boolean
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
