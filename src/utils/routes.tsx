import React from "react";
import { RouteObject } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import FormBuilderPage from "../pages/FormBuilderPage";
import TemplatesPage from "../pages/TemplatesPage";
import Error404 from "../pages/Error404";
import LoginBoxed from "../pages/auth/Login";
import AdminGuard from "../hoc/AdminGuard";
import AuthGuard from "../hoc/AuthGuard";

const routes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginBoxed />,
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        <AdminGuard>
          <MainLayout />
        </AdminGuard>
      </AuthGuard>
    ),
    errorElement: <Error404 />,
    children: [
      {
        path: "formbuilder/:formId",
        element: <FormBuilderPage />,
      },
      {
        path: "/",
        element: <TemplatesPage />,
      },
    ],
  },
];

export default routes;
