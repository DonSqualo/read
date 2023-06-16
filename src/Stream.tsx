import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AllItemsContext } from './AllItemsContext';

interface RSSFeedProps {
    feedUrl: string;
}


/* interface MeaningItem extends Item {
    link?: string;
    uid?: string;
    title?: string;
    pubDate?: string;
    author?: string;
    summary?: string;
    content?: string;
    isoDate?: string;
    categories?: string[];
    contentSnippet?: string;
    thumbnailURL?: string;
    type?: string;
    recommendedBy: string;
    uid: string;
} */
const Stream: React.FC<RSSFeedProps> = ({ feedUrl }) => {
    const { allItems, setAllItems, currentItem, setCurrentItem} = useContext(AllItemsContext);
    //const [feedItems, setFeedItems] = useState<MeaningItem[]>([]);
    /* useEffect(() => {
        const fetchFeed = async () => {
            try {
                const response = await fetch(`/rss?url=${feedUrl}`);
                const feed = await response.json();
                //console.log(feed)
                const itemsWithDefaults: MeaningItem[] = feed.items.map((items: Item) => ({
                    ...items,
                    author: feed.title,
                    imgURL: "https://nintil.com/favicon-32x32.png",
                    recommendedBy: 'Georg',
                    uid: uuidv4().substring(0, 8),
                }));
                setAllItems(itemsWithDefaults);
            } catch (error) {
                console.error("Error fetching RSS feed:", error);
            }
        };
        fetchFeed();
    }, [feedUrl]); */
    useEffect(() => {
        const getJSON = async () => {
            try {
                const response = await fetch("https://example-json-stream.accounts8547.workers.dev/").then((response) => response.text());
                setAllItems(JSON.parse(response).items)
            } catch (error) {
                console.error("Error fetching JSON feed:", error);
            }
        }
        getJSON();
    }, [feedUrl])
    return (
        <div className="space-y-1">
            <h1 className='text-4xl p-4 pl-8'>Today</h1>
            {allItems?.map((item, index) => (
                
                <Link to={`/item/${item.uid}`} state={item} onClick={() => {setCurrentItem(index); 
                    window.scrollTo(0, 0);}}>
                <div
                    key={item.uid}
                    className={`flex p-4 pl-8 border-b border-primary-100 cursor-pointer ${index < currentItem ? 'opacity-20' : ''}`}
                >
                        <div className='self-center h-full mr-3'>
                            <img
                                src="https://nintil.com/favicon-32x32.png"
                                alt="Round Image"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        </div>
                        <div className='max-w-[80%]'>
                            <h2 className="text-xl font-semibold">
                                <a>{item.title}</a>
                            </h2>
                            <span>
                                <span className='opacity-60'>from</span> {item.author} <span className='opacity-60'>recommended by</span> {item.views[0]?.viewer}
                            </span>
                        </div>
                    
                </div>
                </Link>
            ))}
        </div>
    );

};

export default Stream;