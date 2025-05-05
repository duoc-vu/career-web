import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import Manager from "./layouts/manager";
import { additionalRoutes } from "./routes";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      {/* {routes
          .filter((route) => route.layout === "auth")
          .flatMap((route) =>
            route.pages.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={<AuthLayout>{element}</AuthLayout>}
              />
            ))
          )} */}
      <Route path="/manager/*" element={<Manager />} />
      {additionalRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
      {/* <Route path="*" element={<Navigate to="/dashboard/home" replace />} /> */}
      <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}

export default App;
