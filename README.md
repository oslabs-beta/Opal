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

1. Clone this repo. If using [Git](https://git-scm.com/), run:

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

4. Be authenticated to an Azure account (see 'Connecting to Azure')
 


5. Run the app.

```
npm run start-prod
```


## Connecting to Azure

1. Base Functionality

If the user is already logged in to Azure through an existing authentication flow (Managed Identity, Azure CLI, Powershell etc.), Opal's base functionality is accessible out-of-the-box with no configuration. If not currently logged in, use the method you typically use to authenticate to Azure. For example, an Azure CLI user can type `az login`. 

For more information about your options for authenticating to Azure, review the [DefaultAzureCredential docs.](https://docs.microsoft.com/en-us/dotnet/api/azure.identity.defaultazurecredential?view=azure-dotnet).

2. Additional Functionality

Using Opal to access additional metrics, such as those for <em>children</em> of Azure functions requires sending a bearer token to Azure REST APIs. Opal will use HTTPS and OAUTH 2.0 to securely handle the token-generation process for you, as long as you place a .env file in Opal's root directory identifying a service principal that is authorized to access your Azure subscription.

```
AZURE_CLIENT_ID=<appId>
AZURE_CLIENT_SECRET=<password>
AZURE_TENANT_ID=<tenant>
```

If you have not generated a service principal for this account, run the following commands and save the output to a .env file as described above.

`az login` 

`az account list --query "[].{id:id}" --output tsv`

`az ad sp create-for-rbac --role contributor --scope subscriptions/<subscription1> subscriptions/<subscription2> subscriptions/<subscription3>`

Creating a service principal is optional and is not required to use Opal's basic functionality. Regardless, the service principal is used only to <em>read</em>, and never to write, any data to your Azure account. 


## More Information

Opal accesses function metrics using Azure SDK's DefaultAzureCredential and Azure REST APIs. This DefaultAzureCredential supports [multiple authentication methods](https://docs.microsoft.com/en-us/dotnet/api/azure.identity.defaultazurecredential?view=azure-dotnet). 

Opal does not interfere with the user's Azure deployment, does not write data to the user's Azure account, and does not store the data it reads from the user's Azure account. 

Queries made through Opal utilize Azure SDKs and REST APIs, and may be subject to size or billing limitations imposed by the user's account. For more information, please refer to [Azure's Cost Management and Billing documentation](https://docs.microsoft.com/en-us/azure/cost-management-billing/) for the rules that may govern your subscription.


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



## FAQ

* Why can't I see the functions from some of my subscriptions?

By default, service principals are associated with a single subscription. If you did not specify a subscription when creating your service principal (or specified only one), you may not be able to see functions from other subscriptions.

To fix this, replace the data in your .env with the data for a new service principal with access to each of your subscriptions.

`az account list --query "[].{id:id}" --output tsv`

`az ad sp create-for-rbac --role contributor --scope subscriptions/<subscription1> subscriptions/<subscription2> subscriptions/<subscription3>`

* What information do I need to provide to log in to Opal?

On initial login, users only to create a username and password. 

* What information will Opal store about me?

The only information Opal stores is an email address and a (hashed) password.

* Does Opal maintain any information about my Azure account?

No. Opal stores no information about your account. Opal simply acts as a client for a variety of Azure SDKs and endpoints to allow you to retrieve data from your Azure subscriptions in a single location.

* Do I need to enter to use my real email?

No. There are no consequences to creating a dummy email if you prefer not to be identified. But please avoid e-mail addresses that may legitimately be used by others.


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
Distributed under the [MIT License.](https://opensource.org/licenses/MIT)
