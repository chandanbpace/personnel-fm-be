import { MongoMemoryReplSet } from 'mongodb-memory-server';

// A replica set (not a standalone server) so multi-document transactions work in tests, as in Atlas.
export default async function globalSetup() {
  const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1, storageEngine: 'wiredTiger' } });
  (globalThis as Record<string, unknown>).__MONGO_REPLSET__ = replSet;
  process.env.MONGO_URI_TEST = replSet.getUri();
}
