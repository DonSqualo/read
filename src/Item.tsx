import { useContext, useState } from "react";
import { AllItemsContext } from "./AllItemsContext";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";
const Item = () => {
    const { allItems, currentItem, setCurrentItem } = useContext(AllItemsContext);
    const navigate = useNavigate();
    const [isHidden, setHidden] = useState(true);

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
                        <div className="text-xl"><span className="opacity-60">By</span> {allItems[currentItem]?.author}</div>
                    </div>
                    <div className="text-right w-full mb-5 self-end text-primary">
                        <div onClick={() => {setHidden(!isHidden)}}>{isHidden ? "i" : "v"}</div>
                        <div className={`${isHidden ? "hidden" : ''}`}>
                        {date}<br></br>
{/*                         <span className="opacity-60">From</span> {allItems[currentItem]?.views[0].viewer}: {allItems[currentItem]?.views[0].comment} 
 */}                        </div>
                    </div>
                </div>
                <iframe className="mx-auto -my-3 h-screen"
                    title="My iframe example"
                    width="90%"
                    height="100%"
                    src={allItems[currentItem]?.link}
                ></iframe>
            </div>
        </>
    );
};

export default Item;

