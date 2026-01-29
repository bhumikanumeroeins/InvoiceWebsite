import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CreateInvoice from './pages/CreateInvoice';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';


import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create/:type" element={<CreateInvoice />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
