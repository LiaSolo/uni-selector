import '../scss/mainPage.scss';
import Faculty from "../components/Faculty";
import {allFacs} from "../config";
import {useEffect, useState} from "react";
import { useCustomWebSocket, getData, getRelease } from '../services/api';

export default function SemiFinal() {
    const [released, setReleased] = useState([]);
    const [parts, setParts] = useState([]);

    useEffect(() => {
        getData((data) => {
            setParts(data.parts)});

        getRelease((data) => {
            setReleased([
                ...data.released, 
                ...Array(data.queue.length - data.released.length).fill(null)
            ]);
        });
    }, []);

    const lastJsonMessage = useCustomWebSocket();

    useEffect(() => {
        if (lastJsonMessage && lastJsonMessage.type === 'data-updated') {
            console.log(lastJsonMessage);
            setReleased(lastJsonMessage.data);
        }
    }, [lastJsonMessage]);


    return (
            <div className="App">
                <div className="right">
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
                        released.map((fac, index) => {
                            return (
                                <Faculty 
                                    key={index} 
                                    className={fac ? "winnerReleased" : "lowOpacity"} 
                                    facultyInfo={fac && allFacs[fac]}
                                />
                            )
                        })
                    }
                </div>
            </div>


    )
}
