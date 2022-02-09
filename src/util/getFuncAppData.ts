import axios from 'axios';
// We should be able to use the proxy url to get this without referencing localhost:3000.
const baseUrl = 'http://localhost:3000/getAppDetails';

export const getFuncAppData = async (data, timespan = 1, granularity = 3) => {
  try {
    const result = await axios.post(baseUrl, {
      id: data.id,
      name: data.name,
      location: data.location,
      insightId: data.insightId,
      resourceGroupName: data.resourceGroupName,
      resourceGroupId: data.resourceGroupId,
      timespan: timespan,
      granularity: granularity
    });
    return result.data;
  } catch (err) {
    console.log(err);
  };
}