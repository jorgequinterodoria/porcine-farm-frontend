import { Model } from '@nozbe/watermelondb'
import { text, date, field, json, readonly } from '@nozbe/watermelondb/decorators'

export default class Animal extends Model {
  static table = 'animals'

  @text('tenant_id') tenantId!: string
  @text('internal_code') internalCode!: string
  @text('electronic_id') electronicId?: string
  @text('visual_id') visualId?: string
  @text('breed_id') breedId?: string
  @text('sex') sex!: string
  @date('birth_date') birthDate!: Date
  @field('birth_weight') birthWeight?: number
  @text('mother_id') motherId?: string
  @text('father_id') fatherId?: string
  @text('genetic_line') geneticLine?: string
  @text('current_status') currentStatus!: string
  @text('stage') stage!: string
  @text('current_pen_id') currentPenId?: string
  @date('entry_date') entryDate?: Date
  @text('purpose') purpose?: string
  @text('origin') origin?: string
  @field('acquisition_cost') acquisitionCost?: number
  @text('notes') notes?: string
  @json('custom_fields') customFields!: any
  @field('is_active') isActive!: boolean
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
  @date('deleted_at') deletedAt?: Date
}
