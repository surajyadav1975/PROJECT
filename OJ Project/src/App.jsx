import { useState } from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import ProblemList from './components/ProblemList'
import Ide from './components/Ide'
import CreateProblem from './components/CreateProblem'
import Firstpage from './components/Firstpage'

function App() {

  return(
    <>
        <Routes>
          <Route path="/" element={<Home/>}>
            <Route path="/" element={<Firstpage />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup/>} />
            <Route path="problemlist" element={<ProblemList/>} />
            <Route path="ide/:id" element={<Ide/>} />
            <Route path="createproblem" element={<CreateProblem/>} />
          </Route>
      </Routes>
    </>
  )
  
}

export default App
