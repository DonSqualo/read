import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AllItemsContext } from './AllItemsContext';
import { AuthContext } from './AuthContext';
import { DragDropContext, Droppable, Draggable, DroppableProps } from "react-beautiful-dnd";
import { useSwipeable } from 'react-swipeable';
import NewItem from './NewItem';

interface RSSFeedProps {
    feedUrl: string;
}

export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);
    if (!enabled) {
        return null;
    }
    return <Droppable {...props}>{children}</Droppable>;
};

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
    const { allItems, setAllItems, currentItem, setCurrentItem } = useContext(AllItemsContext);
    const [swipingX, setSwipingX] = useState({index: 0, value: 0});
    const { authToken, refreshCount } = useContext(AuthContext);

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
                const headers = new Headers();
                headers.append("auth_token", authToken);
            
                const requestOptions = {
                    method: "GET",
                    headers: headers,
                };
            
                const response = await fetch("http://localhost:8080/get_items", requestOptions).then((response) => response.text());
                console.log(JSON.parse(response).items)
                setAllItems(JSON.parse(response).items)
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
    }, [feedUrl, refreshCount]) // here I can add a thing if "submitted new item, or changed order has happened"

    // THE whole drag and drop logic

    const getItemStyle = (_isDragging: any, draggableStyle: any) => ({
        padding: 0,
        // styles we need to apply on draggables
        ...draggableStyle
    });

    const getListStyle = (_isDraggingOver: any) => ({
        /*background: isDraggingOver ? "lightblue" : "lightgrey",
        padding: grid,
        width: 250*/
    });

    const reorder = (list: any, startIndex: any, endIndex: any) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    function onDragEnd(result: any): void {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const newlySortedItems = reorder(
            allItems,
            result.source.index,
            result.destination.index
        );
        setAllItems(newlySortedItems);
    }

/*     const handlers = useSwipeable({
        onSwiping: () => {console.log("hello")}
    }); */

    /* const bgImage = {
        background: rgba(0, 0, 0, .65) url('https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_2000/v1680756160/Heye.earth/Projects/withmeaning/withmeaning_mfwwc7.webp');
        background-blend-mode: darken;

         (swipingX.index == index ? - swipingX.value : 0) + "px"
    }; */

    return (
        <div className="space-y-1">
            <h1 className='text-4xl p-4 pl-8'>Today</h1>
            <DragDropContext onDragEnd={onDragEnd}>
                <StrictModeDroppable droppableId="droppable">
                    {(provided: any, snapshot: any) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            {allItems?.map((item, index) => (
                                <>
                                    <Draggable key={item.uid} draggableId={item.uid} index={index}>
                                        {(provided: any, snapshot: any) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className='select-none w-full- p-8 text-3xl'
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}>
                                                <Link to={`/item/${item.uid}`} state={item} onClick={() => {
                                                    setCurrentItem(index);
                                                    window.scrollTo(0, 0);
                                                }}>
                                                    <div style={{ background: 'rgba(0, 0, 0, .65) url("https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_2000/v1680756160/Heye.earth/Projects/withmeaning/withmeaning_mfwwc7.webp")', 
                                                    backgroundBlendMode: "darken", 
                                                    backgroundSize: "200%",
                                                    backgroundPosition: (swipingX.index == index ? 
                                                        (
                                                            swipingX.value > (window.outerWidth / 1.5) ? window.outerWidth / 1.3 : 
                                                                swipingX.value < (- window.outerWidth / 1.6) ? 50 : 
                                                                    (- swipingX.value / 1.5) + (swipingX.value > 0 ? window.outerWidth * 1.2 : - window.outerWidth / 3)
                                                        )
                                                        : 0) + "px"}}>

                                                    <div {...useSwipeable({onSwiping: (e) => {setSwipingX({index: index, value: e.deltaX})}, onSwiped: () => {setSwipingX({index: index, value: 0})}})}
                                                        className={`flex bg-secondary p-4 pl-8 border-b border-primary-100 cursor-pointer ${index < currentItem ? 'text-primary-100' : ''}`}
                                                        style={{ transform: "translateX(" + (swipingX.index == index ? swipingX.value : 0) + "px)"}}
                                                    >
                                                        <div className='self-center h-full mr-4'>
                                                            <img
                                                                src="https://nintil.com/favicon-32x32.png" // this should be replaces by an icon, according to the type of item (read, watch, tweet, etc)                                alt="Round Image"
                                                                className="w-8 h-8 rounded-full object-cover"
                                                            />
                                                        </div>
                                                        <div className='max-w-[80%] mt-2'>
                                                            <h2 className="text-xl font-semibold leading-3">
                                                                {item.title}
                                                            </h2>
                                                            <span className='text-base'>
                                                                <span className='opacity-60'>from</span> {item.author} <span className='opacity-60'></span> {/* recommended by</span> {item.views[0]?.viewer} */}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    </div>
                                                </Link>
                                            </div>
                                        )}
                                    </Draggable>
                                </>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </StrictModeDroppable>
            </DragDropContext>
            <NewItem />
        </div>
    );

};

export default Stream;