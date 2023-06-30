import { Dispatch, ReactElement, SetStateAction, createContext, useMemo, useState, useEffect } from "react";
import Cookies from 'js-cookie';

export interface AuthTokenContext {
    authToken: string;
    setAuthToken: Dispatch<SetStateAction<any>>,
    refreshCount: number;
    setRefreshCount: Dispatch<SetStateAction<any>>,
}

const AuthContextInitialState: AuthTokenContext = {
	authToken: "",
	setAuthToken: () => null,
    refreshCount: 0,
    setRefreshCount: () => null,
}

export const AuthContext = createContext(AuthContextInitialState);


export function AuthProvider ({ children }: {children: ReactElement}) {
	const [authToken, setAuthToken] = useState<any>(null);
	const [refreshCount, setRefreshCount] = useState<any>(null);
    const authContext = useMemo(
		() => ({ authToken, setAuthToken, refreshCount, setRefreshCount }),
		[authToken, refreshCount]
	);
    useEffect(() => {
        const key = Cookies.get('meaning_user_key')
        if (!key) {
          // redirect user back to login page, 
          // or handle the missing key error in some other ways
          navigate("/");
        }
        else {
            console.log(key)
            setAuthToken(key);
        }
    }, [])
    return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
}