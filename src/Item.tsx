import { useContext, useState, useEffect } from "react";
import { AllItemsContext } from "./AllItemsContext";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";
import Icon from "./components/Icon";
import { AuthContext } from './AuthContext';
import {backendPath} from "./consts/constants.ts"
import { useParams } from "react-router-dom";
import AnimatedBackground from "./components/AnimatedBackground.tsx";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


const Item = () => {
    const { allItems, currentItem, setCurrentItem } = useContext(AllItemsContext);
    const navigate = useNavigate();
    const [isHidden, setHidden] = useState(true);
    const { authToken, refreshCount, setRefreshCount } = useContext(AuthContext);
    const currentId = useParams().id;
    //const [thisItem, setThisItem] = useState<MeaningItem>()
    useEffect(() => {
        if (allItems) {
            console.log(currentId)
            //setThisItem(allItems.find(item => item.uid === currentId));
            setCurrentItem(allItems.findIndex(item => item.uid === currentId));
            //console.log(thisItem)
        }
    }, [allItems, currentId])
    const addResonance = async (resonance: number, item_uid: string) => {
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

    const nextItem = (deltaX: number, confirmedResonance: boolean) => {
        var percentageSwiped = deltaX / window.outerWidth;
        // do this with this cool mapping function from Math
        percentageSwiped = Math.floor(percentageSwiped * 50) + 50
        percentageSwiped > 100 ? percentageSwiped = 100 : percentageSwiped
        percentageSwiped < 0 ? percentageSwiped = 0 : percentageSwiped
        console.log(percentageSwiped)
        confirmedResonance ? addResonance(percentageSwiped, allItems[currentItem].uid) : ""
        const idx = currentItem
        idx < (allItems.length - 1) ? navigate('/item/' + allItems[idx + 1].uid) : navigate('/item/' + allItems[0].uid);

    }

    const swipedRight = (deltaX: number) => {
        if (deltaX > 100 ) { // small range in wich the swipe is cancelled

            // navigate to the next item
            nextItem(deltaX, true)

            //const idx = currentItem
            //idx > 0 ? navigate('/item/' + allItems[idx - 1].uid) : navigate('/item/' + allItems[allItems.length - 1].uid);
            window.scrollTo(0, 0);
        }
    }
    const swipedLeft = (index: number, deltaX: number) => {
        index
        console.log(deltaX / window.outerWidth + "%")
        if (deltaX < -100 ) {    
            nextItem(deltaX, true)
            //const idx = currentItem
            //currentItem < (allItems.length - 1) ? setCurrentItem(currentItem + 1) : setCurrentItem(0);
            //idx < (allItems.length - 1) ? navigate('/item/' + allItems[idx + 1].uid) : navigate('/item/' + allItems[0].uid);
            //navigate('/item/' + allItems[currentItem].uid)
            window.scrollTo(100, 0);
        }
        //window.history.replaceState(null, "New Page Title", "/item/" + allItems[currentItem].uuid)
    }
    
    const swipedDown = (event: any) => {
        if (window.scrollY == 0 && event.deltaX < 10 && event.deltaX > -10) {
            navigate('/stream');
            window.scrollTo(0, 0);
        }
    }


    // THIS SHOULD BE REFACTORED, away from duplicate in bot Item and Stream, mabe into Icon ? or as a helper class
    // mainly because "refreshCount" actually doesn't propagate back to the useEffect Hook of Stream

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
            setRefreshCount(refreshCount + 1)
            
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

    // TILL HERE REFACTOR


    const topHandler = useSwipeable({
        onSwipedDown: swipedDown,
    });
    const tapHandler = useSwipeable({
        onTap: () => {nextItem(0, false)}
    });
    const tapHandler2 = useSwipeable({
        onTap: () => {nextItem(0, false)}
    });

    //var date =  // should be an actual Date newDate().toDateString()
    return (
        <>
{allItems ?                                                 
    <AnimatedBackground index={0} swipedLeft={swipedLeft} swipedRight={swipedRight} size="cover">
            <div {...topHandler} id="current-card" className="w-full bg-secondary">
                <div className="h-screen flex flex-col items-center justify-center px-8 flex-wrap text-center">
                    <div {...tapHandler2} className="w-full flex-grow"></div>
                    <div className="w-full"></div>
                    <div>
                        <h1 className="text-5xl py-4">{allItems[currentItem]?.title}</h1>
                        {allItems[currentItem]?.author ? <div className="text-xl pb-4"><span className="opacity-60">By</span> {allItems[currentItem]?.author}</div> : ""}
                        {(allItems[currentItem]?.type == "do") ? 
                        <button onClick={() => {handleDone(currentItem, allItems[currentItem]?.done || false)}} className="w-full flex justify-center">
                            <Icon type={allItems[currentItem]?.type} state={allItems[currentItem]?.done || false} size={12}/>
                        </button>
                        : ""}
                    </div>
                    <div {...tapHandler} className="flex-grow w-full">
                    </div>
                    <div className="text-right w-full mb-5 justify-end text-primary">
                        <div onClick={() => {setHidden(!isHidden)}}>{isHidden ? "i" : "v"}</div>
                        <div className={`${isHidden ? "hidden" : ''}`}>
                        {allItems[currentItem]?.created_at}<br></br>
{/*                         <span className="opacity-60">From</span> {allItems[currentItem]?.views[0].viewer}: {allItems[currentItem]?.views[0].comment} 
 */}                        </div>
                    </div>
                </div>
                <div className="w-[90%] mx-auto text-xl relative pb-6">
                    {allItems[currentItem]?.summary ? <div>{allItems[currentItem]?.summary}</div> : ''}
                    {allItems[currentItem]?.content ? <div className="pb-6"><ReactMarkdown className="markdown" children={allItems[currentItem].content || "" } remarkPlugins={[remarkGfm]} /></div> : ''}
                    {allItems[currentItem]?.iframe ? 
                        <iframe className="mx-auto -mt-3 h-screen pb-6"
                            title="My iframe example"
                            width="100%"
                            height="100%"
                            src={allItems[currentItem]?.link}
                        ></iframe>
                    : ''}
                    {allItems[currentItem]?.url_title ? 
                        <><span className="text-primary-100">See also </span><a className="text-link" href={allItems[currentItem]?.link}>{allItems[currentItem]?.url_title}</a></>
                    : (allItems[currentItem]?.link ? <><span className="text-primary-100">See also </span><a className="text-link" href={allItems[currentItem]?.link}>{allItems[currentItem]?.link}</a></>: '')}
                </div>
                </div>
            </AnimatedBackground>
            : ""}
        </>
    );
};

export default Item;

