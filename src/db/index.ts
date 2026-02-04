import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import { mySchema } from './schema'
import * as Models from './models' 

const modelClasses = Object.values(Models).filter(model => {
  const isValidClass = model && typeof model === 'function' && 'table' in model;
  if (!isValidClass) return false;
  const tableExists = !!mySchema.tables[model.table];

  if (!tableExists) {
    console.warn(`⚠️ Omitiendo Modelo '${model.name}' porque la tabla '${model.table}' no está en el esquema local.`);
  }

  return tableExists;
})

const adapter = new LokiJSAdapter({
  schema: mySchema,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
})

export const database = new Database({
  adapter,
  modelClasses: modelClasses,
})