import { useState } from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Home from './Home'
import PaymentSuccess from './PaymentSuccess'
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/paymentSuccess" element={<PaymentSuccess/>}/>
      </Routes>
    </Router>
  )
}

export default App
