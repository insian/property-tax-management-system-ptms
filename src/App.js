import './App.css';
import { Route, Routes } from "react-router-dom";

import Navbar from './global_descriptions/Navbar';
import Footer from './global_descriptions/Footer';
import Login from "./pages/Login";
import Terms from "./pages/Terms_and_Conditions";
import Contact from "./pages/Contact";

import Admin from "./pages/admin/Admin";
import AddLb from './pages/admin/add_lb';
import UpdateTax from './pages/admin/updateTax';
import UpdateLB from './pages/admin/update_lb';

import RLB_ULB from "./pages/localbody/RLB_ULB";
import AddPtp from "./pages/localbody/add_ptp";
import UpdatePTP from './pages/localbody/update_ptp';
import ViewTaxLB from './pages/localbody/viewTax';
import GenerateBills from './pages/localbody/generateBills';
import BillPage from './pages/localbody/bill_page';

import Public from "./pages/public/Public"
import PayTax from './pages/public/paytax';
import ViewTaxPublic from './pages/public/viewTaxPublic';
import TaxCalculator from './pages/public/tax_calculator';

function App() {
  return (
    <div>
    <Navbar />
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/terms_and_conditions" element={<Terms />} />
      <Route path="/contact_us" element={<Contact />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/add_lb" element={<AddLb />} />
      <Route path="/update_lb" element={<UpdateLB />} />
      <Route path="/updateTax" element={<UpdateTax />} />
      <Route path="/rlb_ulb" element={<RLB_ULB />}/>
      <Route path="/add_ptp" element={<AddPtp />}/>
      <Route path="/update_ptp" element={<UpdatePTP />}/>
      <Route path="/view_tax_lb" element={<ViewTaxLB />} />
      <Route exact path="/generate_bills" element={<GenerateBills />} />
      <Route path="/generate_bills/:ptpid/:year" element={<BillPage />} />
      <Route path="/public" element={<Public />} />
      <Route path="/pay_tax" element={<PayTax />} />
      <Route path="/view_tax_public" element={<ViewTaxPublic />} />
      <Route path="/tax_calculator" element={<TaxCalculator />}/>
    </Routes>
    <Footer />
    </div>
  );
}

export default App;
