export const costEstimator = (data, granularity, timespan) => {
  // Array item [4] is function execution units.
  // Array item [5] is function execution count.


  // Execution Units
  let totalUnitsMBMilli = 0;
  data[4].timeseries.forEach((timeObj) => {
    totalUnitsMBMilli += timeObj.total;
  });


  // Execution Count
  let totalExecutionCount = 0;
  data[5].timeseries.forEach((timeObj) => {
    totalExecutionCount += timeObj.total;
  });

/*
This chart shows a total of 1.11 billion Function Execution Units consumed in a two-hour period, measured in MB-milliseconds. To convert to GB-seconds, divide by 1024000. In this example, the function app consumed 1110000000 / 1024000 = 1083.98 GB-seconds. You can take this value and multiply by the current price of execution time on the Functions pricing page, which gives you the cost of these two hours, assuming you've already used any free grants of execution time.
*/

  // Calculate an estimate of total cost.
  const totalUnitsGBSeconds = totalUnitsMBMilli / 1024000;
  const costPerPeriod = (totalUnitsGBSeconds * 0.000016) + (totalExecutionCount / 1000000 * 0.20);

  return '$' + costPerPeriod.toFixed(2) + ' (' + (costPerPeriod * 100).toFixed(2) + ' cents)';
};
