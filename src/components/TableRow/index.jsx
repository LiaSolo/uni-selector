import './styles.scss'
import { useEffect, useRef, useState } from 'react';

export default function TableRow({
    id,
    rowName, // legend ?
    onChangeCell = val => console.log(val),
    rowData = {},
    isActive = true,
    onChangeActive = val => console.log(val),
}) {
    //console.log(rowName, rowData)
    return(
        <tr>
            <td className='firstColumn'>
                <input 
                    type='checkbox'
                    checked={isActive}
                    onChange={(e) => onChangeActive(e.target.checked)}
                />
                <span className='rowName'>{rowName}</span>
                
            </td>
            {Object.keys(rowData).map((cell) => (
                <td key={cell}>
                    <input 
                        type='number'
                        disabled={cell === id}
                        value={cell !== id ? rowData[cell] : ''}
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