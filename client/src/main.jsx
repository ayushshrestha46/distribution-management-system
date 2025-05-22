import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./app/store";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  Login,
  Register,
  Activate,
  Dashboard,
  SupplierList,
  AddSupplier,
  AddProduct,
  EditSupplier,
  ProductList,
  EditProduct,
  AdminDashboard,
  PageNotFound,
  Distributor,
  Cart,
  Checkout,
  Request,
  ShopOrders,
  Shipments,
  DistributorOrders,
  AdminShipments,
  ProductDetails,
  AdminAllSupplier,
  AdminProduct,
  ViewSupplier,
  TermsOfService,
  PrivacyPolicy1,
  Support,
  DistributorCustomer,
  DistributorPayment,
  AdminPayments,
} from "./components";
import { StrictMode } from "react";
import AuthLayout from "./routes/AuthLayout";

import { DashboardPage, DistributorPage, HomePage } from "./pages";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLayout from "./routes/AdminLayout";
import Profile from "./components/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },

      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },

      {
        path: "/activate",
        element: (
          <AuthLayout authentication={false}>
            <Activate />
          </AuthLayout>
        ),
      },
      {
        path: "/register",
        element: (
          <AuthLayout authentication={false}>
            <Register />
          </AuthLayout>
        ),
      },
      {
        path: "/profile",
        element: (
          <AuthLayout authentication={true}>
            <Profile />
          </AuthLayout>
        ),
      },
      {
        path: "/terms",
        element: (
          <AuthLayout authentication={false}>
            <TermsOfService />
          </AuthLayout>
        ),
      },
      {
        path: "/privacy",
        element: (
          <AuthLayout authentication={false}>
            <PrivacyPolicy1 />
          </AuthLayout>
        ),
      },
      {
        path: "/support",
        element: (
          <AuthLayout authentication={false}>
            <Support />
          </AuthLayout>
        ),
      },

      //Admin
      {
        path: "/admin",
        element: <AdminDashboardPage />,
        children: [
          {
            index: true,
            element: (
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            ),
          },
          {
            path: "inventories",
            element: (
              <AdminLayout>
                <AdminProduct />
              </AdminLayout>
            ),
          },
          {
            path: "suppliers",
            element: (
              <AdminLayout>
                <SupplierList />
              </AdminLayout>
            ),
          },
          {
            path: "add-supplier",
            element: (
              <AdminLayout>
                <AddSupplier />
              </AdminLayout>
            ),
          },
          {
            path: "customers",
            element: (
              <AdminLayout>
                <AdminAllSupplier />
              </AdminLayout>
            ),
          },
          {
            path: "edit-supplier/:id",
            element: (
              <AdminLayout>
                <EditSupplier />
              </AdminLayout>
            ),
          },
          {
            path: "products",
            element: (
              <AdminLayout>
                <ProductList />
              </AdminLayout>
            ),
          },
          {
            path: "add-product",
            element: (
              <AdminLayout>
                <AddProduct />
              </AdminLayout>
            ),
          },
          {
            path: "edit-product/:id",
            element: (
              <AdminLayout>
                <EditProduct />
              </AdminLayout>
            ),
          },
          {
            path: "request",
            element: (
              <AdminLayout>
                <Request />
              </AdminLayout>
            ),
          },
          {
            path: "shipments",
            element: (
              <AdminLayout>
                <AdminShipments />
              </AdminLayout>
            ),
          },
          {
            path: "all-payments",
            element: (
              <AdminLayout>
                <AdminPayments />
              </AdminLayout>
            ),
          },
        ],
      },

      // Distributor
      {
        path: "/distributor",
        element: <DistributorPage />,
        children: [
          {
            index: true,
            element: <Distributor />,
          },
          {
            path: "inventory",
            element: <ProductList />,
          },
          {
            path: "add-product",
            element: <AddProduct />,
          },
          {
            path: "edit-product/:id",
            element: <EditProduct />,
          },
          {
            path: "orders",
            element: <DistributorOrders />,
          },
          {
            path: "shipment",
            element: <Shipments />,
          },
          {
            path: "customers",
            element: <DistributorCustomer />,
          },
          {
            path: "payments",
            element: <DistributorPayment />,
          },
        ],
      },

      //Dashboard
      {
        path: "/dashboard",
        element: <DashboardPage />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "cart",
            element: <Cart />,
          },
          {
            path: "product/:id",
            element: <ProductDetails />,
          },
          {
            path: "checkout",
            element: <Checkout />,
          },
          {
            path: "orders",
            element: <ShopOrders />,
          },
          {
            path: "supplier",
            element: <ViewSupplier />,
          },
        ],
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
