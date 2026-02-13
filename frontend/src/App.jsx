import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CreateInvoice from './pages/CreateInvoice';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import TemplateBuilder from './components/builder/TemplateBuilder';
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
        <Route path="/template-builder" element={<TemplateBuilder />} />        
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;
