import { ReactElement, useState } from "react";
import { useSwipeable } from 'react-swipeable';
import archiveGif from '../assets/icons8-verified-scroll.gif'
import laterGif from '../assets/icons8-time.gif'

interface AnimatedBackgroundProps {
    children: ReactElement
    index: number
    swipedLeft: (index: number, deltaX: number) => void
    swipedRight: (deltaX: number) => void
    size: string
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ children, index, swipedLeft, swipedRight, size }) => {
    const [swipingX, setSwipingX] = useState({index: 0, value: 0});
    
    
    const handleOnSwiped = (event: any, index: number) => {
        if (event.deltaX > 0) {
            swipedRight(event.deltaX)
        }
        if (event.deltaX < 0) {
            swipedLeft(index, event.deltaX)
        }
        setSwipingX({index: index, value: 0})
    }



    var calculatePosition;
    var icon = (<></>)


    switch (size) {
        case "200%":
            calculatePosition = (swipingX.index == index ? 
                (
                    swipingX.value > (window.outerWidth / 1.5) ? window.outerWidth / 1.3 : 
                        swipingX.value < (- window.outerWidth / 1.6) ? 50 : 
                            (- swipingX.value / 1.5) + (swipingX.value > 0 ? window.outerWidth * 1.2 : - window.outerWidth / 3)
                )
                : 0)
            icon = (
                <div className={`${swipingX.value < 0 ? "pr-6": "pl-6"} pt-1 flex justify-center items-center flex-col text-6xl`}>
                    <img src={swipingX.value < 0 ? archiveGif : laterGif} className="invert mix-blend-lighten h-8 w-8" />
                    <div className="text-lg">{swipingX.value < 0 ? "Archive" : "Later"}</div>
                </div>
            )
            break;
        case "cover":
            //swipingX.value > (window.outerWidth / 1.5) ? window.outerWidth / 1.3 : 
            //swipingX.value < (- window.outerWidth / 1.6) ? 50 : 
            calculatePosition = (swipingX.index == index ? 
                (
                            (- swipingX.value * (window.outerHeight * 1.5 / window.outerWidth)) + (swipingX.value > 0 ? window.outerHeight * 2.42 : - window.outerHeight * 2.42)
                )
                : 0)
            icon = (
                <div className="flex justify-center items-center flex-col text-6xl">
                    {
                        (swipingX.value / window.outerWidth) > 1  ? 
                        <span className="pl-48">❤️‍🔥</span> : 
                        (swipingX.value / window.outerWidth) > 0.8  ? 
                        <span className="pl-36">🚀</span> : 
                        (swipingX.value / window.outerWidth) > 0.5  ?
                        <span className="pl-24">🔥</span> :
                        (swipingX.value / window.outerWidth) > 0  ?
                        <span className="pl-12">😊</span> :
                        (swipingX.value / window.outerWidth) < -1  ? 
                        <span className="pr-48">🤮</span> : 
                        (swipingX.value / window.outerWidth) < -0.8  ?
                        <span className="pr-36">🔫</span> :
                        (swipingX.value / window.outerWidth) < -0.5  ?
                        <span className="pr-24">🤔</span> :
                        (swipingX.value / window.outerWidth) < 0  ?
                        <span className="pr-12">🤷</span> : ""
                    }
                </div>
            )
            break;
        default: //same as 200, shouldnt happen
            console.log("incorrect size type on Animated Background, take 200% or cover")
            break;
    }

    return ( <div className="hello">
        <div style={{ background: 'rgba(0, 0, 0, .65) url("https://res.cloudinary.com/deepwave-org/image/upload/c_scale,w_2000/v1680756160/Heye.earth/Projects/withmeaning/withmeaning_mfwwc7.webp")', //'linear-gradient(90deg, green, red)',//
            backgroundBlendMode: "darken", 
            backgroundSize: size,
            backgroundPosition: calculatePosition + "px"}}>
                    <div className={`absolute w-full h-full flex ${swipingX.value > 0 ? "" : "justify-end"} items-center`}>
                        {icon}
                    </div>
                <div {...useSwipeable({onSwiping: (e) => {setSwipingX({index: index, value: e.deltaX})}, onSwiped: (e) => {handleOnSwiped(e, index)}, delta: 20})}
                    style={{ transform: "translateX(" + (swipingX.index == index ? swipingX.value : 0) + "px)"}}
                    className="shadow-xl"
                >
                {children}
            </div>
        </div>
        </div> );
}
 
export default AnimatedBackground;