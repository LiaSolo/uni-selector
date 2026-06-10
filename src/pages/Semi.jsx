import '../scss/mainPage.scss';
import Faculty from "../components/Faculty";
import {allFacs} from "../config";
import {useEffect, useState} from "react";
import { useCustomWebSocket, getData, getRelease } from '../services/api';

export default function SemiFinal() {
    const [released, setReleased] = useState([]);
    const [parts, setParts] = useState([]);
    const [queue, setQueue] = useState([]);
    const [finsCount, setFinsCount] = useState(0);

    useEffect(() => {
        getData((data) => {
            setParts(data.parts)});

        getRelease((data) => {
            setFinsCount(data.queue.length);
            setReleased(data.released);
        });
    }, []);

    useEffect(() => {
        console.log(finsCount, released.length)
        setQueue([
            ...released,
            ...Array(finsCount - released.length || 0).fill(null)
        ]);
    }, [finsCount, released]);

    useEffect(() => console.log(queue), [queue])

    const lastJsonMessage = useCustomWebSocket();

    useEffect(() => {
        if (lastJsonMessage && lastJsonMessage.type === 'data-updated') {
            console.log(lastJsonMessage);
            setReleased(lastJsonMessage.data);
        }
    }, [lastJsonMessage]);


    return (
            <div className="App background">
                <div className="largeSide">
                    <div className="logo"/>
                    <div className="FacultyList">
                        {
                            parts.map((fac) =>
                                <Faculty 
                                    key={fac} 
                                    className={released.includes(fac) ? 'lowOpacity' : ''} 
                                    facultyInfo={allFacs[fac]}
                                />
                            )
                        }
                    </div>
                </div>
                
                    <div className="winnersList">
                        <h1>Финалисты</h1>
                        {
                            queue.map((fac, index) => {
                                return (
                                    <Faculty 
                                        key={index} 
                                        className={fac ? "winnerReleased" : "lowOpacity"} 
                                        //className={"lowOpacity"} 
                                        facultyInfo={fac && allFacs[fac]}
                                    />
                                )
                            })
                        }
                </div>
                
            </div>


    )
}
