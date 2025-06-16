import { useState } from 'react'
import {BrowserRouter,Route,Routes} from 'react-router'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import ProblemList from './components/ProblemList'
import Ide from './components/Ide'

function App() {

  return(
    <>
        <Routes>
          <Route path="/" element={<Home/>}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup/>} />
            <Route path="problemlist" element={<ProblemList/>} />
            <Route path="ide" element={<Ide/>} />
          </Route>
      </Routes>
    </>
  )
  
}

export default App
