const { CacheClient, Configurations, CredentialProvider, CollectionTtl } = require('@gomomento/sdk');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const secrets = new SecretsManagerClient();
let cacheClient;

exports.handler = async (event) => {
  await initializeCacheClient();

  const thingId = event.pathParameters.thing;
  const input = JSON.parse(event.body);
  await Promise.all([
    await cacheClient.set('iot', thingId, input.status),
    await cacheClient.setAddElement('iot', 'things', thingId, { ttl: new CollectionTtl(3600, true) })
  ]);

  return { statusCode: 204 };
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
}