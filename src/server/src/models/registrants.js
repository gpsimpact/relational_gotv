import { RecordLockedError } from '../errors';

class RegistrantModel {
  updateRegistrantById = async (data, ctx) => {
    let id = data.id;
    data.updated_at = new Date();
    if (id === undefined) {
      // create a new record allow db to assign id
      const insert = await ctx.connectors.registrant.insertRegistrant(data);
      id = insert[0].id;
      // return await ctx.connectors.registrant.registrantByHash.load(hash);
      return await ctx.connectors.registrant.registrantById
        .clear(id)
        .prime(id, insert[0])
        .load(id);
    }
    // does this hash already exist in db?
    const existingRecord = await ctx.connectors.registrant.registrantById.load(id);
    if (existingRecord) {
      // check if updated_at is older than 48 hours
      var FORTY_EIGHT = 48 * 60 * 60 * 1000; /* ms */
      // console.log('!!!!!!', new Date() - existingRecord.updated_at);
      if (new Date() - existingRecord.updated_at >= FORTY_EIGHT) {
        throw new RecordLockedError();
      }
      // yes - do update
      const update = await ctx.connectors.registrant.updateRegistrantById(id, data);
      // record has been mutated, so prime the dataloader with new data and return it
      return await ctx.connectors.registrant.registrantById
        .clear(id)
        .prime(id, update[0])
        .load(id);
    }
    // no - do insert
    const manualInsert = await ctx.connectors.registrant.insertRegistrant(data);
    id = manualInsert[0].id;
    // return await ctx.connectors.registrant.registrantByHash.load(hash);
    return await ctx.connectors.registrant.registrantById
      .clear(id)
      .prime(id, manualInsert[0])
      .load(id);
  };
}

export default RegistrantModel;
