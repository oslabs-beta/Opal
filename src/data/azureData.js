import axios from 'axios';

const baseUrl = 'http://localhost:3000/executionOnly';

export const getAzureData = async () => {
  try {
    const { data } = await axios.get(baseUrl);
    console.log(data);
    return data;
  } catch (err) {
    throw err;
  }
};

// getAzureData();
