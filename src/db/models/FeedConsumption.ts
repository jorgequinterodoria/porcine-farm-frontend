import { Model } from '@nozbe/watermelondb'
import { text, date, field, readonly } from '@nozbe/watermelondb/decorators'

export default class FeedConsumption extends Model {
  static table = 'feed_consumption'

  @text('tenant_id') tenantId!: string
  @date('consumption_date') consumptionDate!: number
  @text('pen_id') penId?: string
  @text('batch_id') batchId?: string
  @text('animal_id') animalId?: string
  @text('feed_type_id') feedTypeId!: string
  @field('quantity_kg') quantityKg!: number
  @field('number_of_animals') numberOfAnimals?: number
  @text('recorded_by') recordedBy?: string
  @text('notes') notes?: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
