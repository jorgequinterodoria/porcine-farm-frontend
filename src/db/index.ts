
import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'

import { schema } from './schema'
import Animal from './models/Animal'
import Task from './models/Task'
import FeedConsumption from './models/FeedConsumption'

// Create the adapter
const adapter = new LokiJSAdapter({
  schema,
  // migrations, // we'll add this later
  useWebWorker: false,
  useIncrementalIndexedDB: true,
  // dbName: 'porcine_farm_db', // optional
  onQuotaExceededError: (error) => {
    // Browser ran out of disk space -- handle appropriately
    console.error('Disk quota exceeded', error)
  },
})

// Create the database
const database = new Database({
  adapter,
  modelClasses: [
    Animal,
    Task,
    FeedConsumption,
  ],
})

export default database
