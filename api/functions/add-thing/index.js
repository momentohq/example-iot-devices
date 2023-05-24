const { IoTClient, CreateThingCommand, ListThingsCommand } = require("@aws-sdk/client-iot");
const iot = new IoTClient();

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const response = await iot.send(new ListThingsCommand({ attributeName: 'thingName' }));
    const existingThing = response.things.find(t => t.thingName == body.name);
    if (existingThing) {
      return {
        statusCode: 201,
        body: JSON.stringify({ id: existingThing.thingName })
      }
    } else {
      await iot.send(new CreateThingCommand({
        thingName: body.name
      }));
      return {
        statusCode: 201,
        body: JSON.stringify({ id: body.name })
      }
    }
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Something went wrong' })
    }
  }
};
