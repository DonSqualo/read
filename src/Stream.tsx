import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AllItemsContext } from './AllItemsContext';
import { DragDropContext, Droppable, Draggable, DroppableProps } from "react-beautiful-dnd";

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

    // THE whole drag and drop logic

    const grid = 8;

    const getItemStyle = (isDragging: any, draggableStyle: any) => ({
        padding: 0,
        // styles we need to apply on draggables
        ...draggableStyle
    });

    const getListStyle = (isDraggingOver: any) => ({
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
                                                    <div
                                                        className={`flex p-4 pl-8 border-b border-primary-100 cursor-pointer ${index < currentItem ? 'opacity-20' : ''}`}
                                                    >
                                                        <div className='self-center h-full mr-3 pr-2'>
                                                            <img
                                                                src="https://nintil.com/favicon-32x32.png" // this should be replaces by an icon, according to the type of item (read, watch, tweet, etc)                                alt="Round Image"
                                                                className="w-8 h-8 rounded-full object-cover"
                                                            />
                                                        </div>
                                                        <div className='max-w-[80%]'>
                                                            <h2 className="text-2xl font-semibold">
                                                                {item.title}
                                                            </h2>
                                                            <span className='text-xl'>
                                                                <span className='opacity-60'>from</span> {item.author} <span className='opacity-60'>recommended by</span> {item.views[0]?.viewer}
                                                            </span>
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
        </div>
    );

};

export default Stream;