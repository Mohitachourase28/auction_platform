import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear user data from localStorage or any other storage
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        // Redirect to login page after logout
        navigate("/login");
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">Logging Out...</h1>
                <p className="text-gray-600">Please wait while we log you out.</p>
            </div>
        </div>
    );
};

export default Logout;