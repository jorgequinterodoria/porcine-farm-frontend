import { Model } from '@nozbe/watermelondb'
import { text, field, readonly, date } from '@nozbe/watermelondb/decorators'

export default class Disease extends Model {
  static table = 'diseases'

  @text('code') code!: string
  @text('name') name!: string
  @text('scientific_name') scientificName?: string
  @text('category') category?: string
  @text('severity') severity?: string
  @text('symptoms') symptoms?: string
  @text('treatment_protocol') treatmentProtocol?: string
  @text('prevention_measures') preventionMeasures?: string
  @field('is_zoonotic') isZoonotic!: boolean
  @field('is_active') isActive!: boolean
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
