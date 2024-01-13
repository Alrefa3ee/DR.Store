import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();



export function AuthProvider({ children }) {
    const [isAuth, setIsAuth] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            setIsAuth(true);
            setToken(token);
        }
    }, []);


    return (
        <AuthContext.Provider value={{ isAuth, setIsAuth , token ,setToken}}>
        {children}
        </AuthContext.Provider>
    );
    }

function useAuth() {
    return useContext(AuthContext);
}

export default useAuth;