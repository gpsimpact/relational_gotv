import DataLoader from 'dataloader';
import { mapTo } from '../utils';
// import knex from 'knex';

class TasksConnector {
  constructor({ sqlDb }) {
    this.sqlDb = sqlDb;
  }

  taskById = new DataLoader(keys =>
    this.sqlDb
      .table('tasks')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id))
  );

  updateTaskById = async (id, data) =>
    this.sqlDb
      .table('tasks')
      .update(data)
      .where({ id })
      .returning('*');

  nextTaskByPvId = new DataLoader(keys =>
    this.sqlDb
      .table('tasks')
      .whereIn('pv_id', keys)
      .whereIn('status', ['INCOMPLETE', 'INPROGRESS'])
      .whereRaw('(not_visible_before <= now() or not_visible_before IS NULL)')
      .whereRaw('(not_visible_after >= now() or not_visible_after IS NULL)')
      .orderBy('pv_id', 'sequence')
      .distinct(this.sqlDb.raw('ON (pv_id) *'))
      .then(mapTo(keys, x => x.pv_id))
  );

  completedTasksCountByPvId = new DataLoader(keys =>
    this.sqlDb
      .table('tasks')
      .count('* as countCompletedTasks')
      .whereIn('pv_id', keys)
      .where({ status: 'COMPLETE' })
      .groupBy('pv_id')
      .select('pv_id')
      .then(mapTo(keys, x => x.pv_id))
  );

  availableTasksCountByPvId = new DataLoader(keys =>
    this.sqlDb
      .table('tasks')
      .count('* as countAvailableTasks')
      .whereIn('pv_id', keys)
      .whereIn('status', ['INCOMPLETE', 'INPROGRESS'])
      .whereRaw('(not_visible_before <= now() or not_visible_before IS NULL)')
      .whereRaw('(not_visible_after >= now() or not_visible_after IS NULL)')
      .groupBy('pv_id')
      .select('pv_id')
      .then(mapTo(keys, x => x.pv_id))
  );

  taskPointsById = new DataLoader(keys =>
    this.sqlDb
      .table('tasks')
      .whereIn('pv_id', keys)
      .where({ status: 'COMPLETE' })
      .select(this.sqlDb.raw('pv_id, SUM(point_value) as total_task_points'))
      .groupBy('pv_id')
      .then(mapTo(keys, x => x.pv_id))
  );
}

export default TasksConnector;
