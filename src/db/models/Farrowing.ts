import { Model } from '@nozbe/watermelondb'
import { text, date, field, readonly } from '@nozbe/watermelondb/decorators'

export default class Farrowing extends Model {
  static table = 'farrowings'

  @text('tenant_id') tenantId!: string
  @text('pregnancy_id') pregnancyId!: string
  @text('mother_id') motherId!: string
  @date('farrowing_date') farrowingDate!: number
  @field('piglets_born_alive') pigletsBornAlive!: number
  @field('piglets_born_dead') pigletsBornDead!: number
  @field('piglets_mummified') pigletsMummified!: number
  @field('total_litter_weight') totalLitterWeight?: number
  @field('average_piglet_weight') averagePigletWeight?: number
  @field('assistance_required') assistanceRequired!: boolean
  @text('assistance_type') assistanceType?: string
  @text('complications') complications?: string
  @text('attended_by') attendedBy?: string
  @text('notes') notes?: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
  @date('deleted_at') deletedAt?: number
}
