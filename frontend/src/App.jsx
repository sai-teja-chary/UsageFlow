import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Toaster } from "sonner";
import { AppLayout } from "./components/layout/AppLayout";
import ApiKeys from "./pages/ApiKeys";
import Billing from "./pages/Billing";
import { Upgrade } from "./pages/Upgrade";
import { CreateApi } from "./pages/CreateApi";
import MyApis from "./pages/MyApis";
import { InvoicesPage } from "./pages/InvoicePage";
import ExploreApis from "./pages/ExploreApis";
import { InvoiceDetailPage } from "./pages/InvoiceDetailPage";

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />

      <Routes>
        {/* Public */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/keys" element={<ApiKeys />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/upgrade" element={<Upgrade />} />
            <Route path="/create-api" element={<CreateApi />} />
            <Route element={<ProtectedRoute requiredRole="owner" />}>
              <Route path="/my-apis" element={<MyApis />} />
            </Route>
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/explore-apis" element={<ExploreApis />} />
            <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
