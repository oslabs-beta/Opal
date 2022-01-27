import axios from 'axios';

const baseUrl = 'http://localhost:3000/executionOnly';

export const getExecOnlyData = async () => {
  try {
    const { data } = await axios.get(baseUrl);
    return data;
  } catch (err) {
    console.log(err);
  }
};
