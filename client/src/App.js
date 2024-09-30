import React from 'react';
import AppRoutes from './Routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
};

export default App;
