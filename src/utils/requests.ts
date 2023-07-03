import { AuthContext } from '../AuthContext';
import {backendPath} from "../consts/constants.ts"
import { useContext} from 'react'

// This should be used in NewIteam and AnimatedBackground, etc. but I can't figure out how to get it work

export const addResonance = async (resonance: number, item_uid: string) => {
    const { authToken, refreshCount, setRefreshCount } = useContext(AuthContext);

    try {
        const headers = new Headers();
        headers.append("auth_token", authToken);
        headers.append("Accept", 'application/json');
        headers.append("Content-Type", 'application/json');

        const requestOptions = {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                "content": resonance,
                "link": item_uid,
                "type": "resonance",
            }),
        };
    
        await fetch(backendPath + "/add_item", requestOptions);
        setRefreshCount(refreshCount + 1)
        
    } catch (error) {
        console.error("Error adding item", error);
    }
}