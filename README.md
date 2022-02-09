# Opal

# An Azure Functions Monitoring Tool
<p style="text-align:center"><img src="assets/images/opalheader.png"></p>

# Table of Contents

- [About Opal](#about-opal)

- [Prerequisites](#prerequisites)

- [Getting Started](#getting-started)

- [Using the App](#using-the-app)

- [How It Works](#how-it-works)

- [Contributing](#contributing)

- [Authors](#authors)

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

4. Run the app.

```
npm run start-prod
```

## Using the App

Opal relies on the Default Azure Credential part of the Azure Identity SDK to access the functions on your account. As such, there are several different ways to use Opal.

1. Without environment variables.

Opal can authenticate to your Azure Account with the Azure Cli or Azure Power Shell as long as at least one is locally installed and you are already logged into it. This is the way to run Opal that involves the least user setup. It grants access to metrics on the Function App level, but does not grant access to metrics on the Function level. To get access to metrics on the Function level, use environment variables.

[Azure Account Visal Studio Code extension](ms-vscode.azure-account)



## Contributing

We'd love for you to test Opal out and submit any issues you encounter. Also feel free to fork to your own repo and submit pull requests!

## Authors
Alma Eyre<br>
Marckjhêl Palmer<br>
Hussein Hamade<br>
Bill O'Connell<br>
