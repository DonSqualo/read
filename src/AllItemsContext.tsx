import { Dispatch, ReactElement, SetStateAction, createContext, useMemo, useState, useEffect, useContext } from "react";
import { Item } from 'rss-parser';
import { backendPath } from "./consts/constants.ts";
import { AuthContext } from './AuthContext';

export interface MeaningItem extends Item {
    author: string;
    uid: string;
    created_at: number;
    type: string;
    done?: boolean;
    archived?: boolean;
    iframe?: boolean;
    url_title?: string;
}

export interface ItemsContext {
    allItems: MeaningItem[];
    setAllItems: Dispatch<SetStateAction<any>>,
    currentItem: number;
    setCurrentItem: Dispatch<SetStateAction<any>>;
}

const allItemsContextInitialState: ItemsContext = {
	allItems: [],
	setAllItems: () => null,
    currentItem: 0,
    setCurrentItem: () => null,
}

export const AllItemsContext = createContext(allItemsContextInitialState);

export function AllItemsProvider({ children }: {children: ReactElement}) {
	const [allItems, setAllItems] = useState<any>(null);
	const [currentItem, setCurrentItem] = useState<any>(0);
    const { authToken, refreshCount } = useContext(AuthContext);

    const userContext = useMemo(
		() => ({ allItems, setAllItems, currentItem, setCurrentItem }),
		[allItems, currentItem]
	);

    useEffect(() => {
        if (authToken) {
        const getJSON = async () => {
            try {
                const headers = new Headers();
                headers.append("auth_token", authToken);
            
                const requestOptions = {
                    method: "GET",
                    headers: headers,
                };
            
                const response = await fetch(backendPath + "/get_items", requestOptions);
                const responseData = await response.text();
                const items = JSON.parse(responseData).items
                setAllItems(items)
                /* if (response) {
                    if (!refreshCount) {
                        setRefreshCount(1)
                        navigate('/item/' + allItems[0].uid)
                    }
                    else {
                        console.log(refreshCount, "Hello")
                    } */
            } catch (error) {
                console.error("Error fetching JSON feed:", error);
            }
            /* try {
                const response = await fetch("https://example-json-stream.accounts8547.workers.dev/").then((response) => response.text());
                setAllItems(JSON.parse(response).items)
            } catch (error) {
                console.error("Error fetching JSON feed:", error);
            } */
        }
        getJSON();
        }
    }, [refreshCount, authToken]) // here I can add a thing if "submitted new item, or changed order has happened"

    return <AllItemsContext.Provider value={userContext}>{children}</AllItemsContext.Provider>;
}
