import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../modules/auth/authSlice";

const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, token, isLoading,isError,isSuccess,message } = useSelector((state) => state.auth);
    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    }
    const isAdmin = user?.role ==="admin";
    const isManager = user?.role === "manager";
    const isCashier = user?.role === "cashier";
    return {
        user,
        token,
        isLoading,
        isError,
        isSuccess,
        message,
        isAdmin,
        isManager,
        isCashier,
        logout: handleLogout
    }
}

export default useAuth;