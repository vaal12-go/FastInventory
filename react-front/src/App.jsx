import { useState } from 'react'
import './App.css'

import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom'
import { IndexPage } from './pages/IndexPage'



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />}>
        <Route path="/index.html" element={<IndexPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
} //function App() {

export default App
