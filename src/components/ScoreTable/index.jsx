import './styles.scss'
import cn from 'classnames';
import TableRow  from '../TableRow';
import { allFacs } from '../../config';
import { useEffect, useState } from 'react';
import Sortable from 'sortablejs';

export default function ScoreTable({
    headRef,
    bodyRef,
    headerData,
    rowsOrder,
    setRowsOrder,
    hideNonActiveRows,
    rowsData,
    footerData,

    onChangeCell = val => console.log(val),
    onChangeActive = val => console.log(val),

}) {
    // console.log('rowsOrder', rowsOrder)
    // console.log('headerData', headerData)
    // console.log('rowsData', rowsData)
    // console.log('footerData', footerData)

    const [activeColumn, setActiveColumn] = useState('');

    // устанавливаем порядок выступления глашатаев перетаскиванием строк
    useEffect(() => {
        if (!bodyRef.current) return;

        new Sortable(bodyRef.current, {
            animation: 150,
            
            onEnd: () => {
                const items = bodyRef.current.querySelectorAll('tbody > tr');
                const newOrder = Array.from(items).map(item => item.dataset.id);
                setRowsOrder(newOrder);        
            },
        });
    }, [bodyRef, setRowsOrder]); 


    return(
        <table>
            <thead>
                <tr ref={headRef}>
                    <th className='firstColumn'></th>
                    {headerData.map((fin) => (
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
            <tbody ref={bodyRef} className='mainContent'>
                {rowsOrder.map((rowName) => {
                    //console.log(herald, allFacs[herald])
                    return (!hideNonActiveRows || rowsData[rowName].isVoited) && 
                        <TableRow
                            key={rowName}
                            id={rowName}
                            rowName={allFacs[rowName].name}
                            isActive={rowsData[rowName].isVoited}
                            onChangeActive={(newValue) => onChangeActive(rowName, newValue)}
                            rowData={rowsData[rowName].points}
                            onChangeCell={(newSetting) => onChangeCell(rowName, newSetting)}
                            activeColumn={activeColumn}
                            setActiveColumn={setActiveColumn}
                        />
                
                })}
            </tbody>
            <tfoot>
                {footerData.map(row => (
                    <tr key={row[0]} className='total'>
                        <td className='firstColumn'>{row[0]}</td>
                        {headerData.map((fin) => (
                            <td key={fin}>{row[1][fin]}</td>
                        ))}
                    </tr> 
                ))}
            </tfoot>
        </table>
    );
}

// добавить итог (сумма баллов за жюри) 
// + инпут для зрительских
// + итоговый итог