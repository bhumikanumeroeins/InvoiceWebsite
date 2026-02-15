import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

// Layout

// Pages inside layout
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Customers from "./pages/Customers";
import Users from "./pages/Users";
import Subscriptions from "./pages/Subscriptions";
import InvoiceDetail from "./components/lists/InvoiceDetail";
import AdminLayout from "./components/layout/AdminLayout";
import AdminPlans from "./pages/Plans";

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN ROUTES WITH SIDEBAR */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoices/:id" element={<InvoiceDetail />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/users" element={<Users />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/plans" element={<AdminPlans />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
