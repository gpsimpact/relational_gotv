import { generateDeterministicCacheId } from '../utils';

class OrganizationInfoModel {
  orgMultiSearch = async ({ where, orderBy, limit, after }, ctx) => {
    const fetchPayload = {
      table: {
        name: 'organizations',
        uniqueColumn: 'id',
      },
      where,
      orderBy,
      limit,
      after,
      ttl: 120,
    };

    return await ctx.connectors.page.pageLoader.load(generateDeterministicCacheId(fetchPayload));
  };

  orgSingle = async ({ where }, ctx) => {
    if (where.id) {
      return await ctx.connectors.organization.organizationById.load(where.id);
    } else if (where.slug) {
      return await ctx.connectors.organization.organizationBySlug.load(where.slug);
    }
  };
}

export default OrganizationInfoModel;
