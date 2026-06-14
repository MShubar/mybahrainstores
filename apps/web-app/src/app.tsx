import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/protected-route";
import { UnauthorizedPage } from "./pages/unauthorized";
import { SignupPage } from "./pages/auth/signup";
import { LoginPage } from "./pages/auth/login";
import { ForgotPasswordPage } from "./pages/auth/forgot-password-page";
import { DashboardLayout } from "./layouts/dashboard-layout";
import { CustomerAppLayout } from "./layouts/customer-app-layout";
import { BackofficeLayout } from "./layouts/backoffice/backoffice-layout";
import { BackofficeDashboardPage } from "./pages/backoffice/dashboard";
import { BackofficeCategoriesPage } from "./features/categories/pages/backoffice-categories-page";
import { BackofficeStoresPage } from "./features/stores/pages/backoffice-stores-page";
import { StoreDashboardPage } from "./features/stores/pages/store-dashboard-page";
import { StoreProductsPage } from "./features/products/pages/store-products-page";
import { CustomerBrowsePage } from "./features/customer/pages/customer-browse-page";
import { CustomerSearchPage } from "./features/customer/pages/customer-search-page";
import { CustomerHomePage } from "./features/customer/pages/customer-home-page";
import { CustomerProductDetailPage } from "./features/customer/pages/customer-product-detail-page";
import {
  CustomerProductsPage,
} from "./features/customer/pages/customer-products-page";
import { CategoryProductsPage } from "./features/customer/pages/category-products-page";
import { CelebritiesListPage } from "./features/customer/pages/celebrities-list-page";
import { CelebrityDetailPage } from "./features/customer/pages/celebrity-detail-page";
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
import { BackofficeUsersPage } from "./features/users/pages/backoffice-users-page";
import { BackofficeProductsPage } from "./features/products/pages/backoffice-products-page";
import { AccountSettingsPage } from "./features/account/pages/account-settings-page";
import { AccountPage } from "./features/account/pages/account-page";
import { CustomerSupportPage } from "./features/account/pages/customer-support-page";
import { CustomerPrivacyPage } from "./features/legal/pages/customer-privacy-page";
import { CustomerTermsPage } from "./features/legal/pages/customer-terms-page";
import { BackofficePayoutsPage } from "./features/payouts/pages/backoffice-payouts-page";
import { BackofficeRevenueReportPage } from "./features/reports/pages/backoffice-revenue-report-page";
import { StoreAnalyticsPage } from "./features/reports/pages/store-analytics-page";
import { StorePayoutSettingsPage } from "./features/stores/pages/store-payout-settings-page";
import { SupportPage } from "./features/support/pages/support-page";
import { BackofficeSupportPage } from "./features/support/pages/backoffice-support-page";
import { BackofficeStoreLeadsPage } from "./features/store-leads/pages/backoffice-store-leads-page";
import { BackofficeCelebritiesPage } from "./features/celebrities/pages/backoffice-celebrities-page";
import { BackofficeLaunchMetricsPage } from "./features/launch-metrics/pages/backoffice-launch-metrics-page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/settings"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerAppLayout hideBottomNav>
                <AccountSettingsPage customerMode />
              </CustomerAppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerAppLayout>
                <CustomerHomePage />
              </CustomerAppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/browse"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerAppLayout>
                <CustomerBrowsePage />
              </CustomerAppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/search"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerAppLayout>
                <CustomerSearchPage />
              </CustomerAppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/products"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerAppLayout hideBottomNav>
                <CustomerProductsPage />
              </CustomerAppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/products/:productId"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerAppLayout hideBottomNav>
                <CustomerProductDetailPage />
              </CustomerAppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/categories/:categoryId"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerAppLayout hideBottomNav>
                <CategoryProductsPage />
              </CustomerAppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/celebrities"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerAppLayout>
                <CelebritiesListPage />
              </CustomerAppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/celebrities/:slug"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerAppLayout>
                <CelebrityDetailPage />
              </CustomerAppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/orders"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerAppLayout>
                <CustomerOrdersPage />
              </CustomerAppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/orders/:orderId"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerAppLayout hideBottomNav>
                <CustomerOrderDetailsPage />
              </CustomerAppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/support"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerAppLayout hideBottomNav>
                <CustomerSupportPage />
              </CustomerAppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/legal/privacy"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerAppLayout hideBottomNav>
                <CustomerPrivacyPage />
              </CustomerAppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/legal/terms"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerAppLayout hideBottomNav>
                <CustomerTermsPage />
              </CustomerAppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/cart"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerAppLayout hideBottomNav>
                <CartPage />
              </CustomerAppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/checkout"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerAppLayout hideBottomNav>
                <CheckoutPage />
              </CustomerAppLayout>
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
          path="/support"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SupportPage />
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
          path="/store/analytics"
          element={
            <ProtectedRoute allowedRoles={["store"]}>
              <DashboardLayout>
                <StoreAnalyticsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/payout-settings"
          element={
            <ProtectedRoute allowedRoles={["store"]}>
              <DashboardLayout>
                <StorePayoutSettingsPage />
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
          path="/backoffice/products"
          element={
            <ProtectedRoute allowedRoles={["backoffice"]}>
              <BackofficeLayout>
                <BackofficeProductsPage />
              </BackofficeLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/backoffice/users"
          element={
            <ProtectedRoute allowedRoles={["backoffice"]}>
              <BackofficeLayout>
                <BackofficeUsersPage />
              </BackofficeLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/backoffice/products"
          element={
            <ProtectedRoute allowedRoles={["backoffice"]}>
              <BackofficeLayout>
                <BackofficeProductsPage />
              </BackofficeLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/backoffice/users"
          element={
            <ProtectedRoute allowedRoles={["backoffice"]}>
              <BackofficeLayout>
                <BackofficeUsersPage />
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
          path="/backoffice/payouts"
          element={
            <ProtectedRoute allowedRoles={["backoffice"]}>
              <BackofficeLayout>
                <BackofficePayoutsPage />
              </BackofficeLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/backoffice/reports/revenue"
          element={
            <ProtectedRoute allowedRoles={["backoffice"]}>
              <BackofficeLayout>
                <BackofficeRevenueReportPage />
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
        <Route
          path="/backoffice/support"
          element={
            <ProtectedRoute allowedRoles={["backoffice"]}>
              <BackofficeLayout>
                <BackofficeSupportPage />
              </BackofficeLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/backoffice/store-leads"
          element={
            <ProtectedRoute allowedRoles={["backoffice"]}>
              <BackofficeLayout>
                <BackofficeStoreLeadsPage />
              </BackofficeLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/backoffice/celebrities"
          element={
            <ProtectedRoute allowedRoles={["backoffice"]}>
              <BackofficeLayout>
                <BackofficeCelebritiesPage />
              </BackofficeLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/backoffice/launch-metrics"
          element={
            <ProtectedRoute allowedRoles={["backoffice"]}>
              <BackofficeLayout>
                <BackofficeLaunchMetricsPage />
              </BackofficeLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
} 
