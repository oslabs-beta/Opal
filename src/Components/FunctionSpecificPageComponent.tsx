import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Loader, FuncGraph, FuncDelayGraph } from '.';
import { getFuncDetails } from '../util/getFuncDetails';
import { Slider, Button } from '@mui/material';

interface LocationObj {
  state: any;
}

interface SeriesObj {
  timeseries: any;
}

export const FunctionSpecificPage = () => {
  const location: LocationObj = useLocation();
  const [loading, setLoading] = useState(true);

  const [funcData, setFuncData] = useState<null | object>(null);
  const [timeSpan, setTimeSpan] = useState<number>(1);
  const [granularity, setGranularity] = useState<number>(3);
  const [submitClick, setSubmitClick] = useState<boolean>(false);

  const data: [] = [];

  const workSpaceId = sessionStorage.getItem('workSpaceId');

  const timeFrameMarks = [
    { value: 0, label: '1 Hour' },
    { value: 1, label: '24 Hours' },
    { value: 2, label: '48 Hours' },
    { value: 3, label: '1 Week' },
    { value: 4, label: '1 Month' },
  ];
  const granularityMarks = [
    { value: 0, label: '5 Minutes' },
    { value: 1, label: '15 Minutes' },
    { value: 2, label: '30 Minutes' },
    { value: 3, label: '1 Hour' },
    { value: 4, label: '6 Hours' },
    { value: 5, label: '12 Hours' },
    { value: 6, label: '1 Day' },
  ];

  useEffect(() => {
    const details: any = getFuncDetails({
      workSpaceId,
      functionName: location.state.properties.name,
      granularity: granularity,
      timespan: timeSpan,
    });
    Promise.resolve(details).then((res) => {
      setFuncData(res.data);
      setLoading(false);
    });
  }, [location.state.properties.name, workSpaceId, submitClick]);

  function handleTimeSpan(event, value) {
    setTimeSpan(value);
  }

  function handleGranularity(event, value) {
    setGranularity(value);
  }

  function handleSend() {
    submitClick === false ? setSubmitClick(true) : setSubmitClick(false);
  }

  return (
    <>
      {loading ? (
        <Loader theme='azure' />
      ) : (
        <div>
          <div className="w-full flex flex-col justify-center items-center">
            <h1>Select Timespan</h1>
            <Slider
              key={1}
              className='w-full'
              sx={{ width: 2 / 3 }}
              aria-label='TimeSpan'
              value={timeSpan}
              valueLabelDisplay='auto'
              step={null}
              marks={timeFrameMarks}
              max={4}
              onChangeCommitted={handleTimeSpan}
            ></Slider>
            <h1>Select Granularity</h1>
            <Slider
              key={2}
              className='w-full'
              sx={{ width: 2 / 3 }}
              aria-label='Granularity'
              value={granularity}
              valueLabelDisplay='auto'
              step={null}
              marks={granularityMarks}
              max={6}
              onChangeCommitted={handleGranularity}
            ></Slider>
            <br />
            <Button onClick={handleSend}>Update Preferences</Button>
          </div>
          <br />
          <br />
          <FuncGraph data={funcData} format='1h' />
          <br />
          <br />
          <FuncDelayGraph data={funcData} format='1h' />
        </div>
      )}
    </>
  );
};
