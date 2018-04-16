import { InsufficientPermissionsError } from '../errors';

class TaskModel {
  updateTask = async ({ id, status, form_data }, ctx) => {
    // load the full task record
    const taskRecord = await ctx.connectors.tasks.taskById.load(id);
    // from task pv_id, grab the pv record
    const pvRecord = await ctx.connectors.potentialVoters.pvByUserById.load(taskRecord.pv_id);
    // verify that this pv is assigned to the requesting user. Throw error if not
    if (pvRecord.user_email !== ctx.user.email) {
      throw new InsufficientPermissionsError();
    }
    // proceed with update
    const editedTaskRecord = await ctx.connectors.tasks.updateTaskById(id, { status, form_data });
    const newTaskStatus = await ctx.connectors.tasks.taskById
      .clear(id)
      .prime(id, editedTaskRecord[0])
      .load(id);
    // this may be unnecesarry, but might delete the cache of pvRecord to force new nextTask query
    // todo
    return { ...newTaskStatus, potential_voter: pvRecord.id };
  };
}

export default TaskModel;
