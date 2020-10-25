/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy
    ? response.ok(report)
    : response.badRequest(report)
})

Route.get('views/:v_name?', async ({ params }) => {
  if (!params.v_name) {
    return { message: 'Welcome to the view page, you need to specify a view of name, e.g (/products)' }
  }

  return Database.query().select('*').from(`${params.v_name}`)
})

Route.get('connections/:con_type?', async ({ params }) => {
  if (!params.con_type) {
    return { message: 'You need to specify a type of connect, e.g (/count)'}
  }

  const queryDB = Database.query().select('*')

  switch(params.con_type) {
    case 'count':
      return queryDB
        .from('sys.dm_os_performance_counters')
        .where('counter_name', 'User Connections')

    case 'centric':
      return queryDB
        .from('sys.dm_exec_connections')

    default:
      return { message: 'Any command is available for this request' }
  }
})

Route.get('/', async () => {
  return { message: 'Welcome to DWH\'s API' }
})
