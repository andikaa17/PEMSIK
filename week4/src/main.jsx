import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./App.css";

import { AuthProvider } from "@/Utils/Contexts/AuthContext";

import AuthLayout from "@/Pages/Auth/AuthLayout";
import AdminLayout from "@/Pages/Admin/AdminLayout";
import ProtectedRoute from "@/Pages/Admin/Components/ProtectedRoute";

import Login from "@/Pages/Auth/Login/Login";
import Dashboard from "@/Pages/Admin/Dashboard/Dashboard";
import Mahasiswa from "@/Pages/Admin/Mahasiswa/Mahasiswa";
import MahasiswaDetail from "@/Pages/Admin/MahasiswaDetail/MahasiswaDetail";
import Dosen from "@/Pages/Admin/Dosen/Dosen";
import DosenDetail from "@/Pages/Admin/DosenDetail/DosenDetail";
import Matakuliah from "@/Pages/Admin/Matakuliah/Matakuliah";
import MatakuliahDetail from "@/Pages/Admin/MatakuliahDetail/MatakuliahDetail";
import Kelas from "@/Pages/Admin/Kelas/Kelas";
import KelasDetail from "@/Pages/Admin/KelasDetail/KelasDetail";
import PageNotFound from "@/Pages/Error/PageNotFound";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "mahasiswa",
        children: [
          {
            index: true,
            element: <Mahasiswa />,
          },
          {
            path: ":id",
            element: <MahasiswaDetail />,
          },
        ],
      },
      {
        path: "dosen",
        children: [
          {
            index: true,
            element: <Dosen />,
          },
          {
            path: ":id",
            element: <DosenDetail />,
          },
        ],
      },
      {
        path: "matakuliah",
        children: [
          {
            index: true,
            element: <Matakuliah />,
          },
          {
            path: ":id",
            element: <MatakuliahDetail />,
          },
        ],
      },
      {
        path: "kelas",
        children: [
          {
            index: true,
            element: <Kelas />,
          },
          {
            path: ":id",
            element: <KelasDetail />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
