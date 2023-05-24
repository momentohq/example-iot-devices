# example-iot-devices

Welcome to the Momento IoT example app. This repository contains to main folder structures:

* **api** - The AWS serverless infrastructure that powers the back-end application
* **device-dashboard** - A Next.js application that communicates with the API to display IoT device data.

## Deployment

After cloning this repository, you can navigate to the `api` directory and run the following commands:

```
sam build
sam deploy --guided
```

These commands will navigate you through a wizard to gather required deployment parameters. Once complete, the resources will be deployed into your AWS account.

You can then navigate to the `device-dashboard` folder in this directory and run the following command to start the user interface locally.

```
npm run dev
```

This will start the application on port 3000 (if available). To view the application, you can navigate to http://localhost:3000 in a browser.

## Pushing data

If you wish to push data to the web service, you can hit the `POST /things/{thing}/data` endpoint in the API you deployed into your AWS account, where the `thing` path parameter is whatever you wish to call your IoT device (it's not validated).

The request payload must be in the following format:

```json
{
  "status": "my status",
  "latitude": <double>,
  "longitude": <double>
}
```

## More information

For more information, check out the Momento blog walking through the solution and how you can get started caching your IoT data today!