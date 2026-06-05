import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/protected-route";
import { UnauthorizedPage } from "./pages/unauthorized";
import { SignupPage } from "./pages/auth/signup";
import { DashboardLayout } from "./layouts/dashboard-layout";
import { BackofficeLayout } from "./layouts/backoffice/backoffice-layout";
import { BackofficeDashboardPage } from "./pages/backoffice/dashboard";
import { BackofficeCategoriesPage } from "./features/categories/pages/backoffice-categories-page";
import { BackofficeStoresPage } from "./features/stores/pages/backoffice-stores-page";
import { StoreDashboardPage } from "./features/stores/pages/store-dashboard-page";
import { StoreProductsPage } from "./features/products/pages/store-products-page";
import { CustomerHomePage } from "./features/customer/pages/customer-home-page";
import { CategoryStoresPage } from "./features/customer/pages/category-stores-page";
import { CustomerStoreProductsPage } from "./features/customer/pages/customer-store-products-page";
import { CartPage } from "./features/cart/pages/cart-page";
import { CheckoutPage } from "./features/checkout/pages/checkout-page";
import { CustomerOrdersPage } from "./features/orders/pages/customer-orders-page";
import { CustomerOrderDetailsPage } from "./features/orders/pages/customer-order-details-page";
import { StoreOrdersPage } from "./features/orders/pages/store-orders-page";
import { BackofficeOrdersPage } from "./features/orders/pages/backoffice-orders-page";
import { BackofficeSettingsPage } from "./features/settings/pages/backoffice-settings-page";
import { NotificationsPage } from "./features/notifications/pages/notifications-page";
import { BackofficeAuditLogsPage } from "./features/audit-logs/pages/backoffice-audit-logs-page";
import { BackofficeAnalyticsPage } from "./features/analytics/pages/backoffice-analytics-page";
import { BackofficeMonitoringPage } from "./features/monitoring/pages/backoffice-monitoring-page";
function CustomerDashboard() {
  return <div>Customer Dashboard</div>;
}

function StoreDashboard() {
  return <div>Store Dashboard</div>;
}

function BackofficeDashboard() {
  return <div>Backoffice Dashboard</div>;
}

function LoginPage() {
  return <div>Login Page</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <DashboardLayout>
                <CustomerHomePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/categories/:categoryId"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <DashboardLayout>
                <CategoryStoresPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/stores/:storeId"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <DashboardLayout>
                <CustomerStoreProductsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/orders"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <DashboardLayout>
                <CustomerOrdersPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/orders/:orderId"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <DashboardLayout>
                <CustomerOrderDetailsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/cart"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <DashboardLayout>
                <CartPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/checkout"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <DashboardLayout>
                <CheckoutPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <NotificationsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/store/orders"
          element={
            <ProtectedRoute allowedRoles={["store"]}>
              <DashboardLayout>
                <StoreOrdersPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/store"
          element={
            <ProtectedRoute allowedRoles={["store"]}>
              <DashboardLayout>
                <StoreDashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/products"
          element={
            <ProtectedRoute allowedRoles={["store"]}>
              <DashboardLayout>
                <StoreProductsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/backoffice"
          element={
            <ProtectedRoute allowedRoles={["backoffice"]}>
              <BackofficeLayout>
                <BackofficeDashboardPage />
              </BackofficeLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/backoffice/categories"
          element={
            <ProtectedRoute allowedRoles={["backoffice"]}>
              <BackofficeLayout>
                <BackofficeCategoriesPage />
              </BackofficeLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/backoffice/stores"
          element={
            <ProtectedRoute allowedRoles={["backoffice"]}>
              <BackofficeLayout>
                <BackofficeStoresPage />
              </BackofficeLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/backoffice/orders"
          element={
            <ProtectedRoute allowedRoles={["backoffice"]}>
              <BackofficeLayout>
                <BackofficeOrdersPage />
              </BackofficeLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/backoffice/settings"
          element={
            <ProtectedRoute allowedRoles={["backoffice"]}>
              <BackofficeLayout>
                <BackofficeSettingsPage />
              </BackofficeLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/backoffice/audit-logs"
          element={
            <ProtectedRoute allowedRoles={["backoffice"]}>
              <BackofficeLayout>
                <BackofficeAuditLogsPage />
              </BackofficeLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/backoffice/analytics"
          element={
            <ProtectedRoute allowedRoles={["backoffice"]}>
              <BackofficeLayout>
                <BackofficeAnalyticsPage />
              </BackofficeLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/backoffice/monitoring"
          element={
            <ProtectedRoute allowedRoles={["backoffice"]}>
              <BackofficeLayout>
                <BackofficeMonitoringPage />
              </BackofficeLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
} 