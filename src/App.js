import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import AzurePage from './Pages/AzurePage.js';
import GooglePage from './Pages/GooglePage.js';
import AwsPage from './Pages/AwsPage.js';
import HomePage from './Pages/HomePage.js';
import Unauthorized from './Pages/Unauthorized.js';
import NotFound from './Pages/NotFound.js';
import Login from './Pages/LoginPage.js';
import Signup from './Pages/SignupPage.js';
import { useSelector } from 'react-redux';

function App() {
  const user = useSelector((state) => state.user.user);

  return (
    <div className='App bg-transparent'>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          {user ? (
            <>
              <Route path='/azure/:id' element={<AzurePage />} />
              <Route path='/aws' element={<AwsPage />} />
              <Route path='/google' element={<GooglePage />} />
            </>
          ) : (
            <>
              <Route path='/azure' element={<Unauthorized />} />
              <Route path='/aws' element={<Unauthorized />} />
              <Route path='/google' element={<Unauthorized />} />
            </>
          )}
          <Route path='/unauthorized' element={<Unauthorized />} />
          <Route path='/*' element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
