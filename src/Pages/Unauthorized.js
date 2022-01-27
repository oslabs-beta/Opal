import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Unauthorized() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/login');
  });
  return <div>Go Away</div>;
}

export default Unauthorized;
