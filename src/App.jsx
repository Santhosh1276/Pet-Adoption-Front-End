import "./App.css";
import { ColorProvider } from "./context/ColorContext";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./components/ForgotPassword";
import VerifyString from "./components/VerifyString";
import ConfirmationPassword from "./components/ConfirmationPassword";
import { SignUpForm } from "./components/SignUpForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { PetFilterProvider } from "./context/PetFilterContext";
import ProfileCard from "./components/ProfileCard";
import { AuthProvider } from "./context/AuthContext";
import Favorites from "./pages/Favorites";
import Messages from "./pages/Messages";
import Footer from "./components/Footer";

function App() {
  const isAuthorized = localStorage.getItem("accessToken") ? true : false;
  let current_user_id = localStorage.getItem("user_id");
  let current_user_role = localStorage.getItem("user_role");

  return (
      <AuthProvider>
        <PetFilterProvider>
          <ColorProvider>
            <Router>
              <div style={{ paddingBottom: "60px" }}>
                <Routes>
                  <Route path="/log-in" element={<LoginPage />} />
                  <Route exact path="/forgot-password" element={<ForgotPassword />} />
                  <Route exact path="/sign-up" element={<SignUpForm />} />

                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute allowed={isAuthorized} />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<ProfileCard />} />
                    <Route path="/favourites" element={<Favorites />} />
                    <Route path="/dash-board" element={<Dashboard />} />
                    <Route path="/validateString" element={<VerifyString />} />
                    <Route path="/confirmation-password" element={<ConfirmationPassword />} />
                    <Route path="/messages" element={<Messages userId={current_user_id} userRole={current_user_role} />} />
                  </Route>

                  {/* Fallback Route */}
                  <Route path="*" element={<h2>404 Not Found</h2>} />
                </Routes>
              </div>

              {/* Footer should be outside of <Routes> */}
              <Footer />
            </Router>
          </ColorProvider>
        </PetFilterProvider>
      </AuthProvider>
    
  );
}

export default App;
