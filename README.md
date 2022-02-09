<p style="text-align:center"><img src="assets/images/opalheader.png"></p>

# Opal
An Azure Functions Monitoring Tool

# Table of Contents

- [About Opal](#about-opal)

- [Prerequisites](#prerequisites)

- [Getting Started](#getting-started)

- [Connecting to Azure](#connecting-to-azure)

- [Built With](#built-with)

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

2. Install the package dependencies.

```
npm install
```

3. Build the app

```
npm run build-prod
```

4. Select a method of authenticaticating to your Azure account. (See 'Connecting to Azure' below.)

5. Run the app

```
npm run start
```

## Connecting to Azure

Opal uses the Azure Identity SDK's DefaultAzureCredential to ensure read access to the functions on your account. Opal does not interfere with the user's Azure deployment, and does not write data to the user's account. Queries made through Opal utilize Azure SDKs and REST APIs, and may be subject to size or billing limitations imposed by the user's account. For more information, refer to [Azure's Cost Management and Billing documentation.](https://docs.microsoft.com/en-us/azure/cost-management-billing/)

Opal accesses function metrics through a combination of Azure SDK's DefaultAzureCredential and Azure REST APIs. The Azure SDK supports a [number of  authentication methods,](https://docs.microsoft.com/en-us/dotnet/api/azure.identity.defaultazurecredential?view=azure-dotnet), including environmental variables, managed identity, Azure powershell, or Azure client. To authenticate to the Azure REST APIs, Opal requires setting environmental variables identifying the user's tenant, and a service principal with access to user's Azure functions.

In Azure CLI, use 'az login' to login and run the following command to create a new service principal with "contributor" access to the account, and display the login credentials for the created service principal. (If you do not have Azure CLI installed locally, you can also [access it through the Azure Portal](https://docs.microsoft.com/en-us/azure/cloud-shell/overview).)

```
az ad sp create-for-rbac --role contributor && az account show --query id -o tsv
```

Save the following information into an .env file in the root directory in which Opal was installed.

```
CLIENT_ID=<appId>
CLIENT_SECRET=<password>
TENANT_ID=<tenant>
```

## Built With
Opal was built with the following frameworks / libraries:

* Azure JavaScript SDKs

* Azure REST API

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
