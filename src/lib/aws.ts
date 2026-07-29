import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  ScanCommand, 
  PutCommand, 
  GetCommand, 
  DeleteCommand, 
  UpdateCommand 
} from '@aws-sdk/lib-dynamodb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

let docClient: DynamoDBDocumentClient | null = null;
let s3Client: S3Client | null = null;
let cachedRegion: string | null = null;

export function normalizeAwsRegion(input?: string): string {
  if (!input) return 'us-east-1';
  const trimmed = input.trim();
  
  // Direct match for standard region codes (e.g. us-east-1, us-west-2, eu-west-1, ap-southeast-1)
  if (/^[a-z]{2}(-[a-z]+)+-\d+$/.test(trimmed)) {
    return trimmed;
  }

  const lower = trimmed.toLowerCase();

  // Known AWS Region friendly names mapping
  const regionMap: Record<string, string> = {
    'us west (oregon)': 'us-west-2',
    'us west (n. california)': 'us-west-1',
    'us west (california)': 'us-west-1',
    'us east (n. virginia)': 'us-east-1',
    'us east (virginia)': 'us-east-1',
    'us east (ohio)': 'us-east-2',
    'canada (central)': 'ca-central-1',
    'europe (ireland)': 'eu-west-1',
    'europe (london)': 'eu-west-2',
    'europe (frankfurt)': 'eu-central-1',
    'europe (paris)': 'eu-west-3',
    'europe (stockholm)': 'eu-north-1',
    'europe (milan)': 'eu-south-1',
    'asia pacific (tokyo)': 'ap-northeast-1',
    'asia pacific (seoul)': 'ap-northeast-2',
    'asia pacific (singapore)': 'ap-southeast-1',
    'asia pacific (sydney)': 'ap-southeast-2',
    'asia pacific (mumbai)': 'ap-south-1',
    'south america (são paulo)': 'sa-east-1',
    'south america (sao paulo)': 'sa-east-1',
    'oregon': 'us-west-2',
    'virginia': 'us-east-1',
    'ohio': 'us-east-2',
    'california': 'us-west-1',
    'tokyo': 'ap-northeast-1',
    'london': 'eu-west-2',
    'ireland': 'eu-west-1',
    'frankfurt': 'eu-central-1',
  };

  for (const [key, code] of Object.entries(regionMap)) {
    if (lower.includes(key)) {
      return code;
    }
  }

  // Sanitize: convert non-alphanumeric/hyphen chars to hyphens
  const sanitized = lower.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (/^[a-z0-9-]+$/.test(sanitized) && sanitized.length > 2) {
    return sanitized;
  }

  return 'us-east-1';
}

export function getAwsConfig() {
  const rawRegion = process.env.AWS_REGION || 'us-east-1';
  const region = normalizeAwsRegion(rawRegion);
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const newsTable = process.env.AWS_DYNAMODB_NEWS_TABLE || 'ZeldaNews';
  const submissionsTable = process.env.AWS_DYNAMODB_SUBMISSIONS_TABLE || 'ZeldaSubmissions';
  const s3Bucket = process.env.AWS_S3_BUCKET || '';

  const isConfigured = Boolean(accessKeyId && secretAccessKey);

  return {
    rawRegion,
    region,
    accessKeyId,
    secretAccessKey,
    newsTable,
    submissionsTable,
    s3Bucket,
    isConfigured,
  };
}

export function getDynamoDocClient(): DynamoDBDocumentClient | null {
  const config = getAwsConfig();
  if (!config.isConfigured) {
    return null;
  }

  if (!docClient || cachedRegion !== config.region) {
    const rawClient = new DynamoDBClient({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId!,
        secretAccessKey: config.secretAccessKey!,
      },
    });
    docClient = DynamoDBDocumentClient.from(rawClient, {
      marshallOptions: { removeUndefinedValues: true },
    });
    cachedRegion = config.region;
  }
  return docClient;
}

export function getS3Client(): S3Client | null {
  const config = getAwsConfig();
  if (!config.isConfigured) {
    return null;
  }

  if (!s3Client || cachedRegion !== config.region) {
    s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId!,
        secretAccessKey: config.secretAccessKey!,
      },
    });
    cachedRegion = config.region;
  }
  return s3Client;
}

let lastAwsError: { message: string; code?: string; table?: string; timestamp?: string } | null = null;

export function getLastAwsError() {
  return lastAwsError;
}

export async function scanDynamoTable(tableName: string): Promise<any[] | null> {
  const client = getDynamoDocClient();
  if (!client) return null;

  try {
    const command = new ScanCommand({ TableName: tableName });
    const response = await client.send(command);
    // Clear error if scan succeeds
    lastAwsError = null;
    return response.Items || [];
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    const errCode = err?.name || err?.code || 'DynamoDBError';
    lastAwsError = {
      message: errMsg,
      code: errCode,
      table: tableName,
      timestamp: new Date().toISOString(),
    };
    // Informative log without throwing console warnings that trigger error alerts
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[AWS DynamoDB Sync Info] Table ${tableName}: ${errMsg}`);
    }
    return null;
  }
}

export async function putDynamoItem(tableName: string, item: Record<string, any>): Promise<boolean> {
  const client = getDynamoDocClient();
  if (!client) return false;

  try {
    const command = new PutCommand({ TableName: tableName, Item: item });
    await client.send(command);
    lastAwsError = null;
    return true;
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    const errCode = err?.name || err?.code || 'DynamoDBError';
    lastAwsError = {
      message: errMsg,
      code: errCode,
      table: tableName,
      timestamp: new Date().toISOString(),
    };
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[AWS DynamoDB Sync Info] Put ${tableName}: ${errMsg}`);
    }
    return false;
  }
}

export async function deleteDynamoItem(tableName: string, key: Record<string, any>): Promise<boolean> {
  const client = getDynamoDocClient();
  if (!client) return false;

  try {
    const command = new DeleteCommand({ TableName: tableName, Key: key });
    await client.send(command);
    lastAwsError = null;
    return true;
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    const errCode = err?.name || err?.code || 'DynamoDBError';
    lastAwsError = {
      message: errMsg,
      code: errCode,
      table: tableName,
      timestamp: new Date().toISOString(),
    };
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[AWS DynamoDB Sync Info] Delete ${tableName}: ${errMsg}`);
    }
    return false;
  }
}

export async function uploadToS3(key: string, body: Buffer | Uint8Array | string, contentType: string): Promise<string | null> {
  const s3 = getS3Client();
  const config = getAwsConfig();
  if (!s3 || !config.s3Bucket) return null;

  try {
    const command = new PutObjectCommand({
      Bucket: config.s3Bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });
    await s3.send(command);
    return `https://${config.s3Bucket}.s3.${config.region}.amazonaws.com/${key}`;
  } catch (err: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[AWS S3 Upload Info]:', err?.message || err);
    }
    return null;
  }
}
