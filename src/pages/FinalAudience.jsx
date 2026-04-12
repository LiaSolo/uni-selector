import '../scss/mainPage.scss';
import {allFacs} from "../config";
import {motion} from 'framer-motion'
import {useEffect, useLayoutEffect, useState} from "react";;
import Faculty from '../components/Faculty';
import { getData, getRelease, useCustomWebSocket } from '../services/api';
import cn from 'classnames';

const releaseFormatter = (rawReleased) => {
    // const newReleased = Object.assign({}, ...rawReleased);
    // Object.keys(newReleased).forEach(fac => {
    //     newReleased[fac] = newReleased[fac].total;
    // });

    const newReleased = {}
    rawReleased.forEach((fac) => {
        newReleased[fac.name] = fac.total;
    });

    return newReleased;
}

export default function Final() {
    const [finalists, setFinalists] = useState(null);
    const [finsOrdered, setFinsOrdered] = useState([]);
    const [released, setReleased] = useState(null);
    const [curAddedPoints, setCurAddedPoints] = useState('');
    const [pointsAnimation, setPointsAnimation] = useState('');

    const lastJsonMessage = useCustomWebSocket();


    useEffect(() => {
        getData((data) => {
            setFinalists(data.parts);
            setFinsOrdered(Object.keys(data.parts));
        });

        getRelease((data) => {
            setReleased(releaseFormatter(data.released));
        });
    }, [])

    useLayoutEffect(() => {
        if (!finalists || !released) {
            return;
        }

        setFinsOrdered(prev => prev.toSorted((a, b) => (
            (released[b] ?? finalists[b]) - (released[a] ?? finalists[a])
        )));

    }, [released, finalists]);

    useLayoutEffect(() => {
        if (lastJsonMessage && lastJsonMessage.type === 'data-updated') {

            //setReleased(releaseFormatter(lastJsonMessage.data));

            if (!lastJsonMessage.data.length) {
                setCurAddedPoints('');
                setPointsAnimation('');
                setReleased({});

                return;
            }

            const lastReleased = lastJsonMessage.data.at(-1);
            //const facName = Object.keys(lastReleased)[0];
            setReleased(prev => ({
                ...prev,
                [lastReleased.name]: lastReleased.total,
            }))

            setCurAddedPoints(lastReleased.curAdded);
            setPointsAnimation('animatedPoints');
            setTimeout(() => setPointsAnimation(''), 5000);
        }

    }, [lastJsonMessage]);

    return (
            <div className="App">
                <div className="largeSide">
                    <div className="FacultyPointList">
                        {
                            finsOrdered.map((fac) =>
                                <motion.div layout key={fac} transition={{ duration: 1 }}>
                                    <Faculty 
                                        key={fac} 
                                        facultyInfo={allFacs[fac]} 
                                        allPoints={released && released[fac] || finalists[fac]}
                                        className={released && released[fac] ? 'allPoints' : ''}
                                    />
                                </motion.div>
                            )
                        }
                    </div>
                    <div className="addedPointsContainer">
                        <span className={cn('addedPoints', pointsAnimation)}>{curAddedPoints}</span>
                    </div>
                </div>
                <div className="thinSide">
                    <div className="logo"/>
                </div>
            </div>
    )
}
