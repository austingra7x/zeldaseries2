import { MongoClient, Db } from 'mongodb';

let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;
let lastMongoError: { message: string; timestamp: string } | null = null;

export function getMongoConfig() {
  const uri = process.env.MONGODB_URI || '';
  const clusterName = process.env.MONGODB_CLUSTER_NAME || 'atlas-bole-candle';
  const dbName = process.env.MONGODB_DB_NAME || 'zelda_db';
  const isConfigured = Boolean(uri && uri.trim().length > 0);

  return {
    uri: isConfigured ? uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : '',
    clusterName,
    dbName,
    isConfigured,
  };
}

export function getLastMongoError() {
  return lastMongoError;
}

export async function getMongoDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri || !uri.trim()) {
    return null;
  }

  if (mongoDb) return mongoDb;

  try {
    mongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    await mongoClient.connect();
    const dbName = process.env.MONGODB_DB_NAME || 'zelda_db';
    mongoDb = mongoClient.db(dbName);
    lastMongoError = null;
    console.log(`[MongoDB Atlas] Successfully connected to cluster atlas-bole-candle, db: ${dbName}`);
    return mongoDb;
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    lastMongoError = {
      message: errMsg,
      timestamp: new Date().toISOString(),
    };
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[MongoDB Atlas Info] ${errMsg}`);
    }
    return null;
  }
}

export async function mongoFind(collectionName: string): Promise<any[] | null> {
  const db = await getMongoDb();
  if (!db) return null;
  try {
    const docs = await db.collection(collectionName).find({}).toArray();
    lastMongoError = null;
    return docs;
  } catch (err: any) {
    lastMongoError = {
      message: err?.message || String(err),
      timestamp: new Date().toISOString(),
    };
    return null;
  }
}

export async function mongoUpsert(collectionName: string, doc: any): Promise<boolean> {
  const db = await getMongoDb();
  if (!db) return false;
  try {
    const filter = doc.id ? { id: doc.id } : { _id: doc._id };
    await db.collection(collectionName).replaceOne(filter, doc, { upsert: true });
    lastMongoError = null;
    return true;
  } catch (err: any) {
    lastMongoError = {
      message: err?.message || String(err),
      timestamp: new Date().toISOString(),
    };
    return false;
  }
}

export async function mongoDelete(collectionName: string, id: string): Promise<boolean> {
  const db = await getMongoDb();
  if (!db) return false;
  try {
    await db.collection(collectionName).deleteOne({ id });
    lastMongoError = null;
    return true;
  } catch (err: any) {
    lastMongoError = {
      message: err?.message || String(err),
      timestamp: new Date().toISOString(),
    };
    return false;
  }
}
