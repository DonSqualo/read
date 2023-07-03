import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AllItemsContext } from './AllItemsContext';
import { AuthContext } from './AuthContext';
import { DragDropContext, Droppable, Draggable, DroppableProps } from "react-beautiful-dnd";
import NewItem from './NewItem';
import Icon from './components/Icon';
import AnimatedBackground from './components/AnimatedBackground';
import { useNavigate } from "react-router-dom";
import { backendPath } from "./consts/constants.ts";


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
const Stream = () => {
    const { allItems, setAllItems, currentItem, setCurrentItem } = useContext(AllItemsContext);
    const { authToken, refreshCount, setRefreshCount } = useContext(AuthContext);
    const navigate = useNavigate();

    /*     useEffect(() => {
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
        }, []) */
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
        if (allItems && !refreshCount) {
            //setCurrentItem(currentItem)
            //console.log(allItems[currentItem])
            setRefreshCount(1)
            navigate('/item/' + allItems[currentItem].uid)
        }
    }, [allItems])
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
    interface orderItem {
        order: number,
        uid: string,
    }
    interface Order {
        items: Array<orderItem>
    }
    const order = async (order: Order) => {
        try {
            const headers = new Headers();
            headers.append("auth_token", authToken);
            headers.append("Accept", 'application/json');
            headers.append("Content-Type", 'application/json');
            const requestOptions = {
                method: "POST",
                headers: headers,
                body: JSON.stringify(order),
            };

            await fetch(backendPath + "/order", requestOptions)
            setRefreshCount((refreshCount: number) => refreshCount + 1);
        } catch (error) {
            console.error("Error ordering items", error);
        }
    }
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
        var orderedArray: Order = {
            items:
                newlySortedItems.map((element: any, index) => ({ order: index, uid: element.uid }))
        };

        /* allItems.map
        orderedArray.items.push({order: 2, uid: ""}) */

        console.log(allItems[0].done)
        setAllItems(newlySortedItems)
        order(orderedArray)
    }

    const markDone = async (index: number, bool: boolean) => {
        try {
            const headers = new Headers();
            headers.append("auth_token", authToken);
            headers.append("Accept", 'application/json');
            headers.append("Content-Type", 'application/json');
            const requestOptions = {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    "uid": allItems[index]["uid"],
                    "done": bool,
                }),
            };

            await fetch(backendPath + "/done", requestOptions)
            setRefreshCount(refreshCount + 1);
        } catch (error) {
            console.error("Error marking item as done", error);
        }
        /* try {
            const response = await fetch("https://example-json-stream.accounts8547.workers.dev/").then((response) => response.text());
            setAllItems(JSON.parse(response).items)
        } catch (error) {
            console.error("Error fetching JSON feed:", error);
        } */
    }

    const handleDone = (index: number, done: boolean) => {
        if (done) {
            markDone(index, false)
        } else {
            markDone(index, true)
        }
    }

    const archive = async (index: number, bool: boolean) => {
        try {
            const headers = new Headers();
            headers.append("auth_token", authToken);
            headers.append("Accept", 'application/json');
            headers.append("Content-Type", 'application/json');
            const requestOptions = {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    "uid": allItems[index]["uid"],
                    "archived": bool,
                }),
            };

            await fetch(backendPath + "/archive", requestOptions)
            setRefreshCount(refreshCount + 1);
        } catch (error) {
            console.error("Error marking item as archived", error);
        }
    }

    const swipedRight = (deltaX: number) => {
        if (deltaX > 100) {
            console.log("Hello")
        }
    }
    const swipedLeft = (index: number, deltaX: number) => {
        if (deltaX < -100) {
            console.log(!allItems[index]?.archived)
            archive(index, !allItems[index]?.archived)
        }
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
                                                className='select-none w-full relative p-8 text-3xl'
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}>
                                                <AnimatedBackground index={index} swipedLeft={swipedLeft} swipedRight={swipedRight} size="200%">
                                                    <div className={`
                                                        flex bg-secondary p-6 pl-8 border-b border-t border-primary-100 cursor-pointer
                                                        ${index < currentItem ? 'text-primary-100' : ''} ${allItems[index]?.done ? 'text-primary-100' : ''}`}>
                                                        <div className='flex items-center mr-4'>
                                                            <button onClick={() => { handleDone(index, item.done || false) }}>
                                                                <Icon type={item.type} state={item.done || false} size={8} />
                                                            </button>
                                                        </div>
                                                        <Link to={`/item/${item.uid}`} state={item} onClick={() => {
                                                            setCurrentItem(index);
                                                            window.scrollTo(0, 0);
                                                        }} className="w-full">
                                                            <div className='max-w-[80%] pt-1'>
                                                                <h2 className="text-xl font-semibold">
                                                                    {item.title}
                                                                </h2>
                                                                {item.author ?
                                                                    <div className='text-base'>
                                                                        <span className='opacity-60'>from</span> {item.author} <span className='opacity-60'></span> {/* recommended by</span> {item.views[0]?.viewer} */}
                                                                    </div> : ""}
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </AnimatedBackground>
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