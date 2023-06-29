import { Dispatch, ReactElement, SetStateAction, createContext, useMemo, useState } from "react";

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

    return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
}