import axios from 'axios';

// We should be able to use the proxy url to get this without referencing localhost:3000.
const baseUrl = 'http://localhost:3000/executionOnly';

export const getExecOnlyData = async () => {
  try {
    const { data } = await axios.get(baseUrl);
    return data;
  } catch (err) {
    console.log(err);
  }
};
