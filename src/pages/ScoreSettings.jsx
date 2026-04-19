import '../scss/settingsPage.scss';
import { useCallback, useEffect, useLayoutEffect, useState, useRef } from 'react';
import Sortable from 'sortablejs';
import { Link } from 'react-router-dom';
import { allFacs } from '../config';
import { getJudges, getSettings, saveJudges } from '../services/api';
import Button from '../components/Button';
import cn from 'classnames';
import summurizeServerResponse from '../services/summurizeServerResponse';
import TableRow from '../components/TableRow';

const initSettings = {};
Object.keys(allFacs).forEach((fac) => 
    initSettings[fac] = {
        isVoited: true,
        points: {}
    }
);

 const getZeroPoints = (keys) => {
    keys.reduce((res, key) => ({
        ...res,
        [key]: 0,
    }), {});
}


export default function ScoreSettings() {  
    const [serverMessage, setServerMessage] = useState('');
    const [activeColumn, setActiveColumn] = useState('');
    const [isHideCheckbox, setIsHideCheckbox] = useState(false);
    const [isEnoughData, setIsEnoughData] = useState(false);
     
    const [fins, setFins] = useState([]);
    const [audience, setAudience] = useState({});
    //const [sumJudges, setSumJudges] = useState({});
    const [judges, setJudges] = useState(initSettings);
    const [facOrder, setFacOrder] = useState(Object.keys(allFacs));

    const rowsRef = useRef(null);
    const columnsRef = useRef(null);


    useEffect(() => {
        // выявляем финалистов
        getSettings((rawSettings) => {
            if (!rawSettings.facs) {
                return;
            }

            // прошлогодний победитель + финалисты пф
            
            // const finalists = [
            //     rawSettings.lastWinner,
            //     ...Object.keys(allFacs).filter(fac => rawSettings.facs[fac].isFinal),
            // ]

            //console.log(rawSettings[rawSettings.lastWinner])

            const finalists = Object.keys(allFacs).filter(fac => rawSettings.facs[fac].isFinal);

            setFins(finalists);
        });
 
    }, []);

    useEffect(() => {
        //console.log(111, fins)
        if (!fins.length) {
            return;
        }

        

        getJudges((data) => {
            // if (!data.fins) {
            //     getSettings()
            // }

            // вынести как глобальную функцию с аргументом array
            const zeroPoints = fins.reduce((res, fin) => ({
                ...res,
                [fin]: 0,
            }), {});

            //const zeroPoints = getZeroPoints(data.fins);

            setAudience({...zeroPoints, ...(data.audience ?? {})});

            const facs = data.facs ?? {...initSettings};

            //const newSettings = {...initSettings};

            Object.keys(initSettings).forEach(fac => {
                //console.log(fac, newJudges[fac])

                facs[fac] ??= {} // если вообще нет fac in facs
                facs[fac].isVoited ??= true; // если нет isVoited in fac
                facs[fac].points = {...zeroPoints, ...(facs[fac].points ?? {})} // если нет points in fac или не в полном виде

                // if (fac in facs) {
                //     facs[fac].isVoited ??= true;
                //     facs[fac].points = {...zeroPoints, ...facs[fac].points}
                // } else {
                //     facs[fac] = {isVoited: true, points: zeroPoints}
                // }
                
                // fins.forEach((fin) => {
                //     newSettings[fac].points[fin] = data[fac] && data[fac].points && data[fac].points[fin] || 0;
                // });
            });

            console.log('new judjes', facs)
            setJudges(facs);
            setFacOrder(Object.keys(facs));
            setIsEnoughData(true);
        }); 

    }, [fins]);

    // устанавливаем порядок выступления глашатаев перетаскиванием строк
    useLayoutEffect(() => {
        if (!rowsRef.current) return;

        new Sortable(rowsRef.current, {
            animation: 150,
            
            onEnd: () => {
                const items = rowsRef.current.querySelectorAll('tbody > tr');
                const newOrder = Array.from(items).map(item => item.dataset.id);
                setFacOrder(newOrder);        
            },
        });

        // if (!columnsRef.current) return;

        // new Sortable(columnsRef.current, {
        //     animation: 150,
            
        //     onEnd: () => {
        //         const items = columnsRef.current.querySelectorAll('th.rotatedHeader');
        //         const newOrder = Array.from(items).map(item => item.dataset.id);
        //         setFins(newOrder);   
        //         //console.log(newOrder)     
        //     },
        // });

        //return () => sortable.destroy();
    }, []);    

    useLayoutEffect(() => {
        //console.log(serverMessage)
        setTimeout(() => {serverMessage && setServerMessage('')}, 5000);
    }, [serverMessage]);

    const updateAudienceScore = (fac, newPoints) => {
        setAudience(prev => ({
            ...prev,
            [fac]: newPoints,
        }))
    }

    const updateOneFacIsVoited = (name, newIsVoited) => {
        //console.log(name, newIsVoited)
        setJudges(prev => ({
            ...prev, 
            [name]: {
                ...prev[name],
                ...newIsVoited,
            },
        }));
    };

    const updateOneFacOnePoint = (name, setting) => {
        // setting: {fin: points}
        // const fin = Object.keys(setting)[0]
        // const diffSum = setting[fin] - judges[name].points[fin]

        // setSumJudges(prev => ({
        //     ...prev,  
        //     [fin]: prev[fin] + diffSum
        // }));

        setJudges( prev => ({
            ...prev, 
            [name]: {
                isVoited: prev[name].isVoited,
                points: {
                    ...prev[name].points,
                    ...setting,
                }
            },
        }));
    };

    const judgeSumByFac = (fac) => {
        let sumPoints = 0;
        

        isEnoughData && Object.keys(judges).forEach((herald) => {
            sumPoints += judges[herald].points[fac]
        });

        return sumPoints;
    }

    const allPointsByFac = (fac) => {
        return judgeSumByFac(fac) + (audience[fac] ?? 0)
    }



    const handleSave = async() => {
        
        const resultJudges = {
            fins: fins,
            facs: facOrder.reduce((res, fac) => ({...res, [fac]: judges[fac]}), {}),
            sumJudges: fins.reduce((res, fac) => ({...res, [fac]: judgeSumByFac(fac)}), {}),
            audience: audience
        };

        console.log(resultJudges)
        setServerMessage(await summurizeServerResponse(
            saveJudges(resultJudges),
        ));
    }

    const handleReset = async () => {
        const zeroPoints = fins.reduce((res, fin) => ({
            ...res,
            [fin]: 0,
        }), {});

        setJudges(initSettings);
        setAudience(zeroPoints)
        setFacOrder(Object.keys(initSettings));
        setIsHideCheckbox(false);

        setServerMessage(await summurizeServerResponse(
            saveJudges({}),
        ));
    }

    return (
        <div className='settingsPage'>
            <div className='header'>
                    <label className='hideCheckbox'>
                        <input 
                        type='checkbox' 
                        checked={isHideCheckbox}
                        onChange={(e) => setIsHideCheckbox(e.target.checked)}
                    />
                        скрыть неголосующих
                    </label>

            </div>
            <table>
                <thead>
                    <tr ref={columnsRef}>
                        <th className='firstColumn'></th>
                        {fins.map((fin) => (
                            <th 
                                data-id={fin}
                                key={fin} 
                                className={cn('rotatedHeader', activeColumn === fin && 'activeColumn')}
                                onMouseEnter={() => setActiveColumn(fin)}
                                onMouseLeave={() => setActiveColumn(null)}
                            >
                                <div className='headerText'>{allFacs[fin].name}</div>
                            </th>
                        ))}
                    </tr> 
                </thead>
                <tbody ref={rowsRef} className='mainContent'>
                    {facOrder.map((herald) => {
                        //console.log(herald, allFacs[herald])
                        return (!isHideCheckbox || judges[herald].isVoited) && <TableRow
                            key={herald}
                            id={herald}
                            rowName={allFacs[herald].name}
                            isActive={judges[herald].isVoited}
                            onChangeActive={(newValue) => updateOneFacIsVoited(herald, {isVoited: newValue})}
                            rowData={judges[herald].points}
                            onChangeCell={(newSetting) => updateOneFacOnePoint(herald, newSetting)}
                            activeColumn={activeColumn}
                            setActiveColumn={setActiveColumn}
                        />
                        })}
                </tbody>
                <tfoot>
                     <tr className='total'>
                        <td className='firstColumn'>Итого за жюри</td>
                        {fins.map((fin) => (
                            <td key={fin}>{judgeSumByFac(fin)}</td>
                        ))}
                    </tr> 
                     <tr className='total'>
                        <td className='firstColumn'>Зрительские</td>
                        {fins.map((fin) => (
                            <td key={fin}>
                                <input 
                                    type='number'
                                    placeholder='0'
                                    disabled={false}
                                    value={audience[fin]  || ''}
                                    onChange={(e) => updateAudienceScore(fin, Number(e.target.value))}
                                />
                            </td>
                        ))}
                    </tr> 
                     <tr className='total'>
                        <td className='firstColumn'>Итоговый итог</td>
                        {fins.map((fin) => (
                            <td key={fin}>{allPointsByFac(fin)}</td>
                        ))}
                    </tr> 
                </tfoot>
            </table>
            

            <div className='footer'>
                <Button type={'primary'} onClick={handleSave}>Сохранить</Button>
                <Link to="/settings">
                    <Button type={'primary__light'}>К настройкам</Button>
                </Link>
                <Button type={'secondary'} onClick={handleReset}>Сбросить всё на#уй</Button>
                
                <Link to="/settings/release">
                    <Button type={'dangerous'}>К релизу</Button>
                </Link>
            </div>
            {
                serverMessage && <span className={cn('serverMessage', serverMessage)}>{serverMessage}</span>
            }

        </div>
    )

};