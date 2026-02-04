import { Model } from '@nozbe/watermelondb'
import { text, date, readonly } from '@nozbe/watermelondb/decorators'

export default class AnimalMovement extends Model {
  static table = 'animal_movements'

  @text('tenant_id') tenantId!: string
  @text('animal_id') animalId!: string
  @text('movement_type') movementType!: string
  @text('from_pen_id') fromPenId?: string
  @text('to_pen_id') toPenId?: string
  @date('movement_date') movementDate!: number
  @text('reason') reason?: string
  @text('notes') notes?: string
  @text('recorded_by') recordedBy?: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
