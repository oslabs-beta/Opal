import axios from "axios";

const baseUrl = `http://localhost:3000/getAllFunctions`;

/**
 *
 * @params  { FunctionAppName, Functions Subscription Id, Functions ResourceGroupName }
 * @function async to fetch a list of all functions under a specific function app
 * @returns a metric data collection
 */

export const getFuncAppFunctions = async ({
  executionObj
}) => {
  try {
    const postObj = {};
    for (let sub in executionObj) {
      postObj[sub] = {};
      for (let resourceGroup in executionObj[sub]) {
        postObj[sub][resourceGroup] = [];
        for (let resource = 0; resource < executionObj[sub][resourceGroup].length; resource++) {
          postObj[sub][resourceGroup].push(executionObj[sub][resourceGroup][resource]);
        }
      }
    }
    const response = await axios.post(baseUrl, postObj);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
