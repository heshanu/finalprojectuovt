import './App.css'
import LoginRegisterPage from './pages/LoginRegisterPage.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <>
    <Toaster  position="top-right"  duration={2000} />
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<LoginRegisterPage />} />
        {/* <Route path="/login" element={<LoginRegisterPage />} /> */}
        <Route path="/*" element={<h1 className="text-center mt-20 text-3xl">404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
