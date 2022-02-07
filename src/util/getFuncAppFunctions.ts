import axios from "axios";

const baseUrl = `http://localhost:3000/getAllFunctions`;

/**
 *
 * @params  { FunctionAppName, Functions Subscription Id, Functions ResourceGroupName }
 * @function async to fetch a list of all functions under a specific function app
 * @returns a metric data collection
 */

export const getFuncAppFunctions = async ({
  appName,
  subscriptionId,
  resourceGroupName,
}) => {
  try {
    const response = await axios.post(baseUrl, {
      subscription: subscriptionId,
      resourceGroupName,
      appName,
    });

    return response.data;
  } catch (err) {
    console.log(err);
  }
};
