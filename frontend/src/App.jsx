// import { useEffect,useState } from 'react';
import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AddUser from './pages/AddUser';
import EditHabit from './pages/EditHabit';
import './App.css';

function App() {

  return (
    <>
        <Routes>
          <Route path="/home" element={<Home />}>Home</Route>
          <Route path="/" element={<Login />}>Login</Route>
          <Route path="/addUser" element={<AddUser />}>Sign Up</Route>
          <Route path="/editHabit/:id" element={<EditHabit />} />
        </Routes>
    </>
  );
    
}

export default App
