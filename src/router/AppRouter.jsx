import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "../modules/auth/LoginPage";
import {routes} from "./routes";
import RoleGuard from "./RoleGuard";
const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {routes.map((route, index) => {
                    const Element = route.element;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                route.roles ? (
                                    <RoleGuard roles={route.roles}>
                                        <Element />
                                    </RoleGuard>
                                ) : (
                                    <Element />
                                )
                            }
                        />
                    );
                })}
                ;
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
