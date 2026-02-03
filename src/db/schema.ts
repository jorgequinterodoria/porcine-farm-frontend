
import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'animals',
      columns: [
        { name: 'tenant_id', type: 'string' },
        { name: 'code', type: 'string' },
        { name: 'batch_id', type: 'string', isOptional: true },
        { name: 'birth_date', type: 'number' },
        { name: 'gender', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'location_id', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ]
    }),
    tableSchema({
      name: 'tasks',
      columns: [
        { name: 'tenant_id', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'due_date', type: 'number' },
        { name: 'status', type: 'string' },
        { name: 'priority', type: 'string' },
        { name: 'assigned_to', type: 'string', isOptional: true },
        { name: 'entity_type', type: 'string', isOptional: true },
        { name: 'entity_id', type: 'string', isOptional: true },
        { name: 'completed_at', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ]
    }),
    tableSchema({
      name: 'feed_consumption',
      columns: [
        { name: 'tenant_id', type: 'string' },
        { name: 'batch_id', type: 'string' },
        { name: 'feed_type_id', type: 'string' },
        { name: 'quantity', type: 'number' },
        { name: 'consumption_date', type: 'number' },
        { name: 'recorded_by', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ]
    }),
  ]
})
