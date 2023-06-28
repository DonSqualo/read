import { Dispatch, ReactElement, SetStateAction, createContext, useMemo, useState } from "react";
import { Item } from 'rss-parser';

interface MeaningItem extends Item {
    author: string;
    imgURL: string;
    recommendedBy: string;
    uid: string;
    created_at: number;
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
	const [currentItem, setCurrentItem] = useState<any>(null);
    const userContext = useMemo(
		() => ({ allItems, setAllItems, currentItem, setCurrentItem }),
		[allItems, currentItem]
	);

    return <AllItemsContext.Provider value={userContext}>{children}</AllItemsContext.Provider>;
}
