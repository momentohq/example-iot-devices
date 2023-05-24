const { CacheClient, Configurations, CredentialProvider, CacheSetFetch, CacheGet } = require('@gomomento/sdk');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const secrets = new SecretsManagerClient();
let cacheClient;

exports.handler = async (event) => {
  try {
    await initializeCacheClient();

    let devices = [];
    const thingResponse = await cacheClient.setFetch('iot', 'things');
    if (thingResponse instanceof CacheSetFetch.Hit) {
      const things = thingResponse.valueArrayString();
      await Promise.all(things.map(async (thing) => {
        const statusResponse = await cacheClient.get('iot', thing);
        if (statusResponse instanceof CacheGet.Hit) {
          devices.push({ name: thing, status: statusResponse.valueString() });
        } else {
          devices.push({ name: thing, status: 'unknown' })
        }
      }));
    }

    return {
      statusCode: 200,
      body: JSON.stringify(devices),
      headers: { 'Access-Control-Allow-Origin': '*' }
    };
  }
  catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Something went wrong' }),
      headers: { 'Access-Control-Allow-Origin': '*' }
    }
  }
};

const initializeCacheClient = async () => {
  if (!cacheClient) {
    const secretResponse = await secrets.send(new GetSecretValueCommand({ SecretId: process.env.SECRET_ID }));
    const secretValue = JSON.parse(secretResponse.SecretString);

    cacheClient = new CacheClient({
      configuration: Configurations.Laptop.latest(),
      credentialProvider: CredentialProvider.fromString({ authToken: secretValue['momento'] }),
      defaultTtlSeconds: 10
    });
  }
};