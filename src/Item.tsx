import { useContext, useState } from "react";
import { AllItemsContext } from "./AllItemsContext";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";
import Icon from "./components/Icon";
import { AuthContext } from './AuthContext';
import {backendPath} from "./consts/constants.ts"

const Item = () => {
    const { allItems, currentItem, setCurrentItem } = useContext(AllItemsContext);
    const navigate = useNavigate();
    const [isHidden, setHidden] = useState(true);
    const { authToken, refreshCount, setRefreshCount } = useContext(AuthContext);

    const swipedLeft = () => {
        currentItem < (allItems.length - 1) ? setCurrentItem(currentItem + 1) : setCurrentItem(0);
        navigate('/item/' + allItems[currentItem].uid)
        window.scrollTo(0, 0);
        //window.history.replaceState(null, "New Page Title", "/item/" + allItems[currentItem].uuid)
    }
    const swipedRight = () => {
        currentItem > 0 ? setCurrentItem(currentItem - 1) : setCurrentItem(allItems.length - 1);
        navigate('/item/' + allItems[currentItem].uid)
        window.scrollTo(0, 0);
    }
    const swipedDown = () => {
        if (window.scrollY == 0) {
            navigate('/stream');
            window.scrollTo(0, 0);
        }
    }


    // THIS SHOULD BE REFACTORED, away from duplicate in bot Item and Stream, mabe into Icon ? or as a helper class
    // mainly because "refreshCount" actually doesn't propagate back to the useEffect Hook of Stream

    const markDone = async (index, bool) => {
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
            const response = await fetch(backendPath + "/done", requestOptions).then(
                setRefreshCount(refreshCount + 1));
            
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

    const handleDone = (index, done) => {
        console.log(index, done)
        switch (done) {
            case 0:
                markDone(index, true)
                break;
            case 1:
                markDone(index, false)
                break;
            default:
                break;
        }
    }

    // TILL HERE REFACTOR


    const handlers = useSwipeable({
        onSwipedLeft: swipedLeft,
        onSwipedRight: swipedRight,
        onSwipedDown: swipedDown,
    });
    
    var date = allItems[currentItem]?.created_at // should be an actual Date newDate().toDateString()
    return (
        <>

            <div {...handlers} id="current-card" className="w-full">
                <div className="h-screen flex items-center justify-center px-8 flex-wrap text-center">
                    <div className="w-full"></div>
                    <div>
                        <h1 className="text-5xl py-4">{allItems[currentItem]?.title}</h1>
                        {allItems[currentItem]?.author ? <div className="text-xl pb-4"><span className="opacity-60">By</span> {allItems[currentItem]?.author}</div> : ""}
                        {(allItems[currentItem]?.type == "do") ? 
                        <button onClick={() => {handleDone(currentItem, allItems[currentItem]?.done)}} className="w-full flex justify-center">
                            <Icon type={allItems[currentItem]?.type} state={allItems[currentItem]?.done} size={12}/>
                        </button>
                        : ""}
                    </div>
                    <div className="text-right w-full mb-5 self-end text-primary">
                        <div onClick={() => {setHidden(!isHidden)}}>{isHidden ? "i" : "v"}</div>
                        <div className={`${isHidden ? "hidden" : ''}`}>
                        {date}<br></br>
{/*                         <span className="opacity-60">From</span> {allItems[currentItem]?.views[0].viewer}: {allItems[currentItem]?.views[0].comment} 
 */}                        </div>
                    </div>
                </div>
                {allItems[currentItem]?.summary ? <div>{allItems[currentItem]?.summary}</div> : ''}
                {allItems[currentItem]?.content ? <div className="mb-6 w-[90%] mx-auto text-xl relative">{allItems[currentItem]?.content}</div> : ''}
                {allItems[currentItem]?.link ? 
                    <iframe className="mx-auto -mt-3 h-screen"
                        title="My iframe example"
                        width="90%"
                        height="100%"
                        src={allItems[currentItem]?.link}
                    ></iframe>
                : ''}
            </div>
        </>
    );
};

export default Item;

