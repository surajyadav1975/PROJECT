import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import ProblemList from './ProblemList'

function Home() {
  return (
    <>
    <Navbar></Navbar>
    <Outlet></Outlet>
    </>

  )
}

export default Home