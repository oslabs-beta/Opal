<p style="text-align:center"><img src="assets/images/opalheader.png"></p>

# Opal
An Azure Functions Monitoring Tool

# Table of Contents

- [About Opal](#about-opal) 

- [Prerequisites](#prerequisites)

- [Getting Started](#getting-started)

- [Connecting to Azure](#connecting-to-azure)

- [Built With](#built-with)

- [More Information](#more-information)

- [Contributing](#contributing)

- [Authors](#authors)

- [License](#license)

## About Opal

Opal is a tool for monitoring Microsoft Azure Functions. Azure Functions are a leading "serverless" computing solution that allows developers to deploy code on-the-fly without the need to provision or maintain their own servers. Opal's code leverages a combination of Microsoft Azure JavaScript SDKs and REST APIs to query metrics associated with the user's Azure Functions, and visualizes those metrics through graphs rendered with the JS Recharts library. 

Opal provides pre-configured, clean visualizations, permitting developers to efficiently analyze the current state of their Azure Function deployments without the learning curve or setup associated with the Azure Portal. Azure also permits users to programatically browse all Azure Function Applications and Functions with a single click. 

Opal's currently supported metrics include, among other things, function invocations, success and error rates, response times, and estimated billing from selected Azure Functions.

## Prerequisites
Users must have NodeJS and the Node Package Manage installed in their local environment before installing Opal.

[NodeJS](https://nodejs.org/en/)

[NPM](https://www.npmjs.com/)

Opal requires an active [Azure subscription](https://azure.microsoft.com/en-us/free/) with deployed [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-function-app-portal).

## Getting Started

1. Clone the repo.

```
git clone https://github.com/oslabs-beta/Opal
cd Opal
```

2. Install dependencies.

```
npm install
```

3. Build the app.

```
npm run build-prod
```

4. Authenticate to your Azure account. (See 'Connecting to Azure.')

5. Run the app.

```
npm run start
```

## Connecting to Azure

If you already have a service principal configured with 'contributor' access to the subscriptions containing your Azure Functions, skip to step two.

1. Create a service principal.

In Azure CLI, use 'az login' to login. Create a new service principal "contributor" (or comparable) access to your subscriptions. If you have more than one subscription, all subscriptions must be listed in the grant of access rights. (If you do not have Azure CLI installed locally, you can also [access it through the Azure Portal](https://docs.microsoft.com/en-us/azure/cloud-shell/overview).)

```
az login
az account list --query "[].{id:id}" --output tsv
az ad sp create-for-rbac --role contributor --scope subscriptions/subcription1 subscriptions/subscription2 subscriptions/subscription3
```
These commands will display the credentials to log in through this service principal.


2. Set up environmental variables.

Create a .env file in the root directory in which Opal was installed. These variables should be set to the following values from the created service principal.

```
AZURE_CLIENT_ID=<appId>
AZURE_CLIENT_SECRET=<password>
AZURE_TENANT_ID=<tenant>
```

## More Information

Opal accesses function metrics using Azure SDK's DefaultAzureCredential and Azure REST APIs. The Azure SDK supports [multuple authentication methods,](https://docs.microsoft.com/en-us/dotnet/api/azure.identity.defaultazurecredential?view=azure-dotnet). 

Opal does not interfere with the user's Azure deployment, and does not write data to the user's account. However, queries made through Opal utilize Azure SDKs and REST APIs, and may be subject to size or billing limitations imposed by the user's account. For more information, please refer to [Azure's Cost Management and Billing documentation](https://docs.microsoft.com/en-us/azure/cost-management-billing/) for the rules that may govern your subscription.


## Built With

Opal was built with the following frameworks / libraries:

* Azure JavaScript SDKs

* Azure REST API

* Kusto Query Language (KQL) 

* React

* React Router

* RechartJS

* Redux

* TypeScript

* Express

* PostgreSQL


## Contributing

We welcome contributions to the project, and encourage submissions for any problems you encounter. To contribute, please fork the repo and submit a pull request.

Ideas for future developments and contributions include:

* Adding AWS Lambda or Google Cloud monitoring, to make Opal a more platform-neutral serverless monitoring tool.
* Updating the Opal server as Microsoft continues to release updates to its Azure SDKs.
* Allowing for the display of additional metrics for function applications or functions.

## Authors
Alma Eyre [Github](https://github.com/aselunar) | [LinkedIn](https://www.linkedin.com/in/alma-eyre/) <br>
Marcel Palmer [Github](https://github.com/Marcelckp)<br>
Hussein Hamade [Github](https://github.com/hhamade98) | [LinkedIn](https://www.linkedin.com/in/hussein-hamade-/) <br>
Bill O'Connell [Github](https://github.com/wdoconnell) | [LinkedIn](https://www.linkedin.com/in/bill-o-connell-6b950177/) <br>

## License
Distributed under the MIT license.
