# settings.json

Файлик с настройками, кто где участвует
Example:
```json
{
    "facs": {
        "facName1": {
            "semi": 1,
            "isFinal": false,
            "isParticipant": true
        },
        "facName2": {
            "semi": 2,
            "isFinal": true,
            "isParticipant": true
        },
        "facName3": {
            "semi": 2,
            "isFinal": true,
            "isParticipant": true
        }
    },
    "lastWinner": "facName3"
}
```
`facs` --- все возможные факультеты (в том числе не участвующие), в порядке выступления на полуфиналах (сначала 1пф, потом 2пф)
`lastWinner` --- победитель прошлого года, не участвует в полуфиналах, автоматически выходит в финал

# judges.json (TODO: score.json)

Файлик с баллами (и жюри, и зрителей) для финала
Example:
```json
{
    "fins": ["facName2", "facName3", "facName4", "facName5", "facName6", "facName7",
             "facName8", "facName9", "facName10", "facName11", "facName12",
             ],
    "facs": {
        "facName1": {
            "isVoited": true,
            "points": {
                "facName2": 0,
                "facName3": 1,
                "facName4": 2,
                "facName5": 3,
                "facName6": 4,
                "facName7": 5,
                "facName8": 6,
                "facName9": 8,
                "facName10": 10,
                "facName11": 0,
                "facName12": 0,
            }
        },
        "facName2":  {
            "isVoited": false,
            "points": {}
        },
    },
    "sumJudges": {
        "facName2": 0,
        "facName3": 1,
        "facName4": 2,
        "facName5": 3,
        "facName6": 4,
        "facName7": 5,
        "facName8": 6,
        "facName9": 8,
        "facName10": 10,
        "facName11": 0,
        "facName12": 0,
    },
    "audience": {
        "facName2": 0,
        "facName3": 1,
        "facName4": 2,
        "facName5": 3,
        "facName6": 4,
        "facName7": 5,
        "facName8": 6,
        "facName9": 8,
        "facName10": 10,
        "facName11": 0,
        "facName12": 0,
    }
}
```
`fins` --- финалисты в порядке выступления в финале (TODO: а почему я это не из settings беру??)
`facs` --- все возможные факультеты (в том числе не голосовавшие), в порядке выступления глашатаев
`sumJudges` --- сумма баллов жюри
`audience` --- баллы зрителей





# data.json
TODO: подумать, а оно мне вообще надо?
Файл для нединамических данных (список участников, начальные данные). Не должен меняться в течение показа.

WARNING! Номер раунда должен совпадать с номер в release-файле(#release.json), иначе все данные сбросятся и установится раунд релиза!

Examples:

## semi
```json
{
    "parts": ["facName1", "facName2", "facName3"],
    "round": 1
}
```
`parts` --- все участники полуфинала в порядке выступления
`round` --- номер полуфинала (1 или 2)

## final (judge)
```json
{
    "parts": ["facName1", "facName2"],
    "round": 3
}
```
`parts` --- все участники финала (опционально: в порядке выступления)
`round = 3` --- раунд показа глашатаев

## final (audience)


```json
{
    "parts": {
        "facName1": 100,
        "facName2": 60,
    },
    "round": 4
}
```
`parts` --- все участники финала в порядке убываниия баллов жюри
`round = 4` --- раунд показа зрительских голосов


# release.json
Файл для динамических данных (очередь выпуска, выпущенные). Обновляется с каждым выпущенным факультетом.

Examples:

## semi
```json
{
    "queue": ["facName1", "facName2"],
    "released": ["facName1"],
    "round": 1
}
```
`queue` --- финалисты в порядке вывода на экран (можно менять в процессе)
`released` --- кто из финалистов уже показан
`round` --- номер полуфинала (1 или 2)

## final (judge)

```json
{
    "queue": [
        {
            "name": "facName1",
            "points": {
                "facName2": 2,
                "facName3": 1,
                "facName4": 0,
                "facName5": 0,
            },
        },
        {
            "name": "facName1",
            "points": {
                "facName4": 10,
            }
        }
    ],
                                       
    "released": [
            {
            "name": "facName1",
            "points": {
                "facName2": {
                    "curAdded": 2,
                    "total": 2,
                },
                "facName3": {
                    "curAdded": 1,
                    "total": 1,
                },
                "facName4": {
                    "curAdded": 0,
                    "total": 0,
                },
                "facName5": {
                    "curAdded": 0,
                    "total": 0,
                },
            },
        },
        {
            "name": "facName1",
            "points": {
                "facName2": {
                    "curAdded": 0,
                    "total": 2,
                },
                "facName3": {
                    "curAdded": 0,
                    "total": 1,
                },
                "facName4": {
                    "curAdded": 10,
                    "total": 10,
                },
                "facName5": {
                    "curAdded": 0,
                    "total": 0,
                },
            },
        }
    ],
    "round": 3
}
```
`queue` --- очередь показа глашатаев с выставляемыми баллыми (в том числе нулевыми). Нельзя менять во время показа. Подряд два элемента одного факультета: сначала стандартные баллы, потом отдельно десятка
`released` --- список показанных глашатаев с выставляемыми и суммой баллов по факультетов после показа
`round = 3` --- раунд показа глашатаев




## final (audience)

```json
{
    "queue": [
        {
            "name": "facName1",
            "curAdded": 50,
            "total": 150,
            
        },
        {
            "name": "facName2",
            "curAdded": 35,
            "total": 95,
        },
    ],
    "released": [
        {
            "name": "facName1",
            "curAdded": 50,
            "total": 150,
            
        },
    ],

    "round": 4
}
```

`queue` --- порядок показа зрительских баллов факультетам (по умолчанию в порядке возрастания баллов жюри, менять порядок не рекомендуется), с указанием сколько получено от зрителей и суммой всех баллов
`released` --- кто из финалистов уже получил зрительские баллы
`round = 4` --- раунд показа зрительских голосов
