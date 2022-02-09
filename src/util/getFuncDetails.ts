import axios from "axios";

const baseUrl = "http://localhost:3000/getSpecificFunctionMetrics";

/**
 * 
 * @param data { workSpaceId, functionName }
 * @function async to fetch all information about a specific function in there users account
 * @returns an array of all information pertaining to a specific function 
 */

export const getFuncDetails = async (data) => {
  try {
    const details = await axios.post(baseUrl, data);
    return details;
  } catch (e) {
    console.log(e);
    return e;
  }
};
