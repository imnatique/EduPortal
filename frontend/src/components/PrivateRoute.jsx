import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "./Loading";

export default function PrivateRoute() {
  const { currentUser, authChecked } = useAuth();

  if (!authChecked) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <Loading />
        <p className="text-gray-500 text-sm">Verifying your account…</p>
      </div>
    );
  }

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" replace />;
}
