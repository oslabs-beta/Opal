import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import { useAppSelector } from './redux/hooks'

// Components
import { AzurePage, GooglePage, AwsPage, HomePage, NotFoundPage, LoginPage, SignUpPage  } from './Pages/'
import { OverviewPage, FunctionAppPage, AccountPage, FunctionsPage, SummaryPage, FunctionSpecificPage, FunctionAppSpecificPage } from './Components/';

function App() {
  const user = useAppSelector((state) => state?.user.user);
  // console.log(user);
  return (
    <div className='App bg-transparent'>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          {user ? (
            <>
              <Route path='/azure' element={<AzurePage />}>
                <Route path='overview' element={<OverviewPage />} />
                
                <Route path='functionApp' element={<FunctionAppPage />} />
                <Route path='functionApp/:id' element={<FunctionAppSpecificPage />} />

                <Route path='functions' element={<FunctionsPage />} />
                <Route path='functions/:id' element={<FunctionSpecificPage />} />

                <Route path='summary' element={<SummaryPage />} />
                
                <Route path='account' element={<AccountPage />} />
              </Route>

              <Route path='/aws' element={<AwsPage />} />
              <Route path='/google' element={<GooglePage />} />
            </>
          ) : (
            <>
              <Route path='/azure' element={<Navigate to='/login'/>} />
              <Route path='/aws' element={<Navigate to='/login' />} />
              <Route path='/google' element={<Navigate to='/login' />} />
            </>
          )}
          <Route path='/*' element={<NotFoundPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
