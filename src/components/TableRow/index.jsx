import './styles.scss'
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';

const pointClass = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    8: 'eight',
    10: 'ten',
}

export default function TableRow({
    id,
    rowName, // legend ?
    onChangeCell = val => console.log(val),
    rowData = {},
    isActive = true,
    onChangeActive = val => console.log(val),
    activeColumn,
    setActiveColumn,
}) {
    //console.log(rowName, isActive, rowData)
    return(
        <tr data-id={id}>
            <td className={cn('firstColumn', !isActive && 'disabled')}>
                <input 
                    type='checkbox'
                    checked={isActive}
                    onChange={(e) => onChangeActive(e.target.checked)}
                />
                <span className='rowName'>{rowName}</span>
                
            </td>
            {Object.keys(rowData).map((cell) => (
                <td 
                    key={cell}
                    className={activeColumn === cell ? 'activeColumn' : ''}
                    onMouseEnter={() => setActiveColumn(cell)}
                    onMouseLeave={() => setActiveColumn(null)}
                >
                    <input 
                        type='number'
                        placeholder='0'
                        disabled={!isActive || cell === id}
                        value={rowData[cell] || ''}
                        className={pointClass[rowData[cell]] ?? ''}
                        onChange={(e) => onChangeCell({[cell]: Number(e.target.value)})}
                    />
                </td>
            ))}
        </tr>
    );
}

// добавить итог (сумма баллов за жюри) 
// + инпут для зрительских
// + итоговый итог