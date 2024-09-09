import { useState } from 'react'

import './App.css'
import inspect from "./assets/inspect.jpg"
function App() {
  const [counter, setCounter] = useState(0)
  const handleclick = ()=>{
    setCounter(counter + 1)
  }
  return (
    <>
    <div className='Container'>
      <h1>Clicks: {counter}</h1>
      <img src = {inspect} onClick={handleclick}></img>
    </div>

    </>
  )
}

export default App
