// Converts metrics stored in constants file into useable arrays for queries.
const generateMetric1D = function (resObj) {
  let metricArray = [];
  for (let key in resObj) {
    if (resObj[key] === true) {
      metricArray.push(key);
    }
  }
  return metricArray;
};

const generateMetric2D = function (resObj) {
  let metricString = '';
  for (let keyTopLevel in resObj) {
    for (let keyBottomLevel in resObj[keyTopLevel]) {
      if (resObj[keyTopLevel][keyBottomLevel] === true) {
        metricString += keyTopLevel + '/' + keyBottomLevel + ',';
      }
    }
  }
  return (metricString = metricString.slice(0, metricString.length - 1));
};

export {generateMetric1D, generateMetric2D};