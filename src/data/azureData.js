import axios from 'axios';

const baseUrl = 'http://localhost:3000/baseMetrics';

export const getAzureData = async () => {
  try {
    const data = await axios.get(baseUrl);
  } catch (err) {
    throw err;
  }
};
