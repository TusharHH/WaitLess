import React from 'react';
import AppRoutes from './Routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './components/Navbar/NavBar';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar/>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
};

export default App;
