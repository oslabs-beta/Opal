<p style="text-align:center"><img src="assets/images/opalheader.png"></p>

# Opal
An Azure Functions Monitoring Tool

# Table of Contents

- [About Opal](#about-opal)

- [Prerequisites](#prerequisites)

- [Getting Started](#getting-started)

- [Using the App](#using-the-app)

- [Built With](#built-with)

- [Contributing](#contributing)

- [Authors](#authors)

- [License](#license)

## About Opal

Opal is a tool for monitoring Azure Functions. Azure Functions is a leading "serverless" computing solution that allows developers to deploy their code without having to provision and maintain the servers they run on. Opal uses the Azure SDK and Azure REST API to query metrics about your Azure Functions, and displays them in graphs. This gives developers visibility into their Azure Functions in a way that is more pre-configured and cleaner than in the Azure Portal.

## Prerequisites
In all cases, the following are required to use Opal:

[Git](https://git-scm.com/)

[NodeJS](https://nodejs.org/en/)

[NPM](https://www.npmjs.com/)

An active Azure subscription that has Azure Functions deployed in it.

## Getting Started

1. Clone the repo

```
git clone https://github.com/oslabs-beta/Opal
cd Opal
```

2. Install the package dependencies.

```
npm i
```

3. Build the app.

```
npm run build-prod
```

4. Check the below "Using the App" section to confirm how you wish to authenticate to your Azure account.

5. Run the app.

```
npm run start-prod
```

## Using the App

Opal relies on the Default Azure Credential part of the Azure Identity SDK for read access (no write access) to the functions on your account. As such, there are several different ways to use Opal.

1. Without environment variables.

Opal can authenticate to your Azure Account with the Azure Cli or Azure Power Shell as long as at least one is locally installed and you are already logged into it. This is the way to run Opal that involves the least user setup. It grants access to metrics on the Function App level, but does not grant access to metrics on the Function level. To get access to metrics on the Function level, use environment variables.

[Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

[Azure PowerShell](https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-7.2.0)

2. With environment variables

Storing environment variables will allow you to access metrics on the Function App and the Function level.

In Azure CLI run the following command:

```
az ad sp create-for-rbac && az account show --query id -o tsv
```

If you do not have Azure CLI installed locally, [access it through the Azure Portal](https://docs.microsoft.com/en-us/azure/cloud-shell/overview) and then run the above command.

In the .env file in the root directory, store the output of the above command in the following format:
Set CLIENT_ID equal to the outputted appId.
Set CLIENT_SERCRET equal to the outputted password.
Set TENANT_ID equal to the outputted tenant.
Set SUBSCRIPTION_ID equal to the last value outputted (the value outputted outside the object), and wrap it in quotes.

## Built With
Opal was built with the following frameworks / libraries:

* Azure SDK

* Azure REST API

* React

* React Router

* Redux

* TypeScript

* Express

* Postgresql


## Contributing

We welcome contributions and issue submissions for any problems you encounter. To contribute, form the repo and submit pull requests.

Ideas for contributions: Adding AWS Lambda monitoring, to make Opal a more platform neutral serverless monitoring tool.

## Authors
Alma Eyre [Github](https://github.com/aselunar) | [LinkedIn](https://www.linkedin.com/in/alma-eyre/) <br>
Marcel Palmer [Github](https://github.com/Marcelckp)<br>
Hussein Hamade [Github](https://github.com/hhamade98) | [LinkedIn](https://www.linkedin.com/in/hussein-hamade-/) <br>
Bill O'Connell [Github](https://github.com/wdoconnell) | [LinkedIn](https://www.linkedin.com/in/bill-o-connell-6b950177/) <br>

## License
Distributed under the MIT license.
