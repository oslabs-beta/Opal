import axios from 'axios';
// We should be able to use the proxy url to get this without referencing localhost:3000.
const baseUrl = 'http://localhost:3000/getAppDetails';

export const getMoreData = async (data) => {
  console.log(data);
  try {
    const result = await axios.post(baseUrl, {
      id: data.id,
      name: data.name,
      location: data.location,
      insightId: data.insightId,
      resourceGroupName: data.resourceGroupName,
      resourceGroupId: data.resourceGroupId,
    });
    console.log('got data from post request');
    console.log(result.data);
    return result.data;
  } catch (err) {
    console.log('error');
    console.log(err);
  };
}