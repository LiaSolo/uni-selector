import '../scss/settingsPage.scss';
import { useEffect, useState, useRef } from 'react';
import Sortable from 'sortablejs';
import { Link } from 'react-router-dom';
import { allFacs } from '../config';
import { getScore, getSettings, saveScore } from '../services/api';
import Button from '../components/Button';
import cn from 'classnames';
import summurizeServerResponse from '../services/summurizeServerResponse';
import TableRow from '../components/TableRow';
import ScoreTable from '../components/ScoreTable';

const initSettings = {};
Object.keys(allFacs).forEach((fac) => 
    initSettings[fac] = {
        isVoited: true,
        points: {}
    }
);

//  const getZeroPoints = (keys) => {
//     keys.reduce((res, key) => ({
//         ...res,
//         [key]: 0,
//     }), {});
// }


export default function ScoreSettings() {  
    const [serverMessage, setServerMessage] = useState('');
    const [isHideCheckbox, setIsHideCheckbox] = useState(false);
    const [isEnoughData, setIsEnoughData] = useState(false);
     
    const [fins, setFins] = useState([]);
    const [audience, setAudience] = useState({});
    const [judges, setJudges] = useState(initSettings);
    const [facOrder, setFacOrder] = useState(Object.keys(allFacs));

    const rowsRef = useRef(null);
    //const columnsRef = useRef(null); получится ли перетаскивать столбцы с баллами?


    useEffect(() => {
        // выявляем финалистов
        getSettings((rawSettings) => {
            if (!rawSettings.facs) {
                return;
            }

            const finalists = Object.keys(allFacs).filter(fac => rawSettings.facs[fac].isFinal);
            setFins(finalists);
        });
 
    }, []);

    useEffect(() => {
        if (!fins.length) {
            return;
        }

        
        getScore((data) => {

            // вынести как глобальную функцию ??
            const zeroPoints = fins.reduce((res, fin) => ({
                ...res,
                [fin]: 0,
            }), {});

            //const zeroPoints = getZeroPoints(data.fins);

            setAudience({...zeroPoints, ...(data.audience ?? {})});

            const facs = data.facs ?? {...initSettings};

            Object.keys(initSettings).forEach(fac => {
                facs[fac] ??= {} // если вообще нет fac in facs
                facs[fac].isVoited ??= true; // если нет isVoited in fac
                facs[fac].points = {...zeroPoints, ...(facs[fac].points ?? {})} // если нет points in fac или не в полном виде
            });

            setJudges(facs);
            setFacOrder(Object.keys(facs));
            setIsEnoughData(true);
        }); 

    }, [fins]);

    // устанавливаем порядок выступления глашатаев перетаскиванием строк
    useEffect(() => {
        if (!rowsRef.current) return;

        new Sortable(rowsRef.current, {
            animation: 150,
            
            onEnd: () => {
                const items = rowsRef.current.querySelectorAll('tbody > tr');
                const newOrder = Array.from(items).map(item => item.dataset.id);
                setFacOrder(newOrder);        
            },
        });
    }, []);    

    useEffect(() => {
        setTimeout(() => {serverMessage && setServerMessage('')}, 5000);
    }, [serverMessage]);

    const updateOneFacIsVoited = (name, newIsVoited) => {
        setJudges(prev => ({
            ...prev, 
            [name]: {
                ...prev[name],
                ...newIsVoited,
            },
        }));
    };

    const updateOneFacOnePoint = (name, setting) => {
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

    const updateAudienceScore = (fac, newPoints) => {
        setAudience(prev => ({
            ...prev,
            [fac]: newPoints,
        }))
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

        setServerMessage(await summurizeServerResponse(
            saveScore(resultJudges),
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
            saveScore({}),
        ));
    }

    const tableFooterData = [
        ['Итого за жюри', fins.reduce((res, fin) => {
            return {
                ...res, 
                [fin]: judgeSumByFac(fin)
            }}, 
            {})
        ], 
        ['Зрительские', fins.reduce((res, fin) => {
            return {
                ...res, 
                [fin]: <input 
                    type='number'
                    placeholder='0'
                    disabled={false}
                    value={audience[fin]  || ''}
                    onChange={(e) => updateAudienceScore(fin, Number(e.target.value))}
                />
            }}, 
            {})
        ], 
        ['Итоговый итог', fins.reduce((res, fin) => {
            return {
                ...res, 
                [fin]: allPointsByFac(fin)
            }}, 
            {})
        ], 
    ];

    // const rowsData = isHideCheckbox 
    // ? facOrder.reduce((res, fac) => {
    //     console.log(res)
    //     if (judges[fac].isVoited) {
    //         res[fac] = judges[fac]
    //     }
    //     return res;
    // }, {})
    // : judges;

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

            <ScoreTable 
                headerData={fins} // TODO: добавить отображаемые названия
                rowsOrder={facOrder}
                setRowsOrder={setFacOrder}
                bodyRef={rowsRef}
                hideNonActiveRows={isHideCheckbox}
                rowsData={judges} // TODO: добавить отображаемые названия + синхронизировать с rowsOrder на показ неголосующих
                onChangeActive={(rowName, newValue) => updateOneFacIsVoited(rowName, {isVoited: newValue})}
                onChangeCell={(rowName, newSetting) => updateOneFacOnePoint(rowName, newSetting)}
                footerData={tableFooterData}
            />
            

            <div className='footer'>
                <Button type={'primary'} onClick={handleSave}>Сохранить</Button>
                <Link to="/settings">
                    <Button type={'primary__light'}>К настройкам</Button>
                </Link>
                <Button type={'secondary'} onClick={handleReset}>Сбросить всё</Button>
                
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