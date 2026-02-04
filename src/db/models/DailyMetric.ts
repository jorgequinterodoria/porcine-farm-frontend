import { Model } from '@nozbe/watermelondb'
import { text, date, field, json } from '@nozbe/watermelondb/decorators'

export default class DailyMetric extends Model {
  static table = 'daily_metrics'

  @text('tenant_id') tenantId!: string
  @date('metric_date') metricDate!: number
  @field('total_animals') totalAnimals?: number
  @json('animals_by_stage') animalsByStage?: any
  @field('births_today') birthsToday?: number
  @field('deaths_today') deathsToday?: number
  @field('sales_today') salesToday?: number
  @field('feed_consumption_kg') feedConsumptionKg?: number
  @field('feed_cost') feedCost?: number
  @field('revenue_today') revenueToday?: number
  @field('expenses_today') expensesToday?: number
  @field('animals_treated') animalsTreated?: number
  @field('vaccinations_applied') vaccinationsApplied?: number
  @date('calculated_at') calculatedAt!: number
}
