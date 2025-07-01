import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { QuestionsProvider } from "./context/QuestionsContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CustomerMaster from "./pages/CustomerMaster";
import SurveySettings from "./pages/SurveySettings";
import SurveyResponse from "./pages/SurveyResponse";
import Reports from "./pages/Reports";
import SummaryReport from "./pages/SummaryReport";
import CategoryReport from "./pages/CategoryReport";
import Questions from "./pages/Questions";
import PasswordResetConfirm from "./pages/PasswordResetConfirm";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// App Routes Component
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/kizunavi/login"
        element={
          isAuthenticated ? (
            <Navigate to="/kizunavi/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/kizunavi/password-reset-confirm"
        element={<PasswordResetConfirm />}
      />
      <Route
        path="/kizunavi/survey-response"
        element={
          <ProtectedRoute>
            <SurveyResponse />
          </ProtectedRoute>
        }
      />
      <Route path="/survey-response/:token" element={<SurveyResponse />} />
      <Route
        path="/kizunavi/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/kizunavi/customer-master"
        element={
          <ProtectedRoute>
            <Layout>
              <CustomerMaster />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/kizunavi/survey-settings"
        element={
          <ProtectedRoute>
            <Layout>
              <SurveySettings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/kizunavi/questions"
        element={
          <ProtectedRoute>
            <Layout>
              <Questions />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/kizunavi/reports"
        element={
          <ProtectedRoute>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/kizunavi/summary-report"
        element={
          <ProtectedRoute>
            <Layout>
              <SummaryReport />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/kizunavi/category-report"
        element={
          <ProtectedRoute>
            <Layout>
              <CategoryReport />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/kizunavi/"
        element={<Navigate to="/kizunavi/dashboard" replace />}
      />
    </Routes>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <QuestionsProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </QuestionsProvider>
    </AuthProvider>
  );
};

export default App;
