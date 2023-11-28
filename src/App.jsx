import { useState, useEffect } from 'react'
import Signup from './Authentication/Signup'
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import Login from './Authentication/Login'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import BudgetApp from './Budget/BudgetApp';
import Signout from './Authentication/Signout';

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
          setAuthenticated(true);
          // ...
        } else {
          // User is signed out
          // ...
          setAuthenticated(false);
        }
      });
     
}, [])

  return (
    <div className='app'>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={authenticated ? <BudgetApp/> : <Login/>}/>
        <Route path="/signup" element={authenticated ? <BudgetApp/> : <Signup />} />
        <Route path="/login" element={authenticated ? <BudgetApp/> : <Login/>}/>
        <Route path="/logout" element={<Signout/>}/>
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
