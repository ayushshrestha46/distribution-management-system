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
} from "./components";
import { StrictMode } from "react";
import AuthLayout from "./routes/AuthLayout";

import { HomePage } from "./pages";
import AdminDashboardPage from "./pages/AdminDashboardPage";

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

      // {
      //   path: "/dashboard",
      //   element: (
      //     <AuthLayout authentication={true}>
      //       <DashboardPage />
      //     </AuthLayout>
      //   ),
      // },
      // {
      //   path: "/suppliers",
      //   element: (
      //     <AuthLayout authentication={true}>
      //       <SupplierPage />
      //     </AuthLayout>
      //   ),
      // },

      {
        path: "/admin",
        element: <AdminDashboardPage />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "suppliers",
            element: (
              // <AdminLayout>
              <SupplierList />
              // </AdminLayout>
            ),
          },
          {
            path: "add-supplier",
            element: <AddSupplier />,
          },
          {
            path: "products",
            element: (
            // <AdminLayout>
            <AddProduct/>
            // </AdminLayout>
          ),
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
