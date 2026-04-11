import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleGuard from "./RoleGuard";
import { routes } from "./routes";

const renderRoutes = (routes) => {
  return routes.map((route, index) => {
    const Element = route.element;

    const wrappedElement = route.role ? (
      <RoleGuard roles={route.role}>
        <Element />
      </RoleGuard>
    ) : (
      <Element />
    );

    return (
      <Route key={index} path={route.path} element={wrappedElement}>
        {route.children && renderRoutes(route.children)}
      </Route>
    );
  });
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>{renderRoutes(routes)}</Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
