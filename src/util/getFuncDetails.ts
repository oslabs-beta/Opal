import axios from "axios";

const baseUrl = "http://localhost:3000/getSpecificFunctionMetrics";


export const getFuncDetails = async (data) => {
  try {
    const details = await axios.post(baseUrl, data);
    return details;
  } catch (e) {
    console.log(e);
    return e;
  }
};
