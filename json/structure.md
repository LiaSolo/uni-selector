# settings.json

Файлик с настройками, кто где участвует (надо удалить баллы)
Example:
```json
{
    "facs": {
        "facName1": {
            "semi": 1,
            "isFinal": false,
            "isParticipant": true,
            "scoreJudge": 0,
            "scoreAudience": 0
        },
        "facName2": {
            "semi": 2,
            "isFinal": true,
            "isParticipant": true,
            "scoreJudge": 0,
            "scoreAudience": 0
        },
        "facName3": {
            "semi": 2,
            "isFinal": true,
            "isParticipant": true,
            "scoreJudge": 0,
            "scoreAudience": 0
        }
    },
    "lastWinner": "facName3"
}
```
`facs` --- все возможные факультеты (в том числе не участвующие), в порядке выступления на полуфиналах (сначала 1пф, потом 2пф)
`lastWinner` --- победитель прошлого года, не участвует в полуфиналах, автоматически выходит в финал

# score.json (judges.json)

Файлик с баллами от жюри и ведущих для финала
Example:
```json
{
    "fins": [],
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
`facs` --- все возможные факультеты (в том числе не голосовавшие), в порядке выступления глашатаев
`audience` --- баллы зрителей





# data.json
Файл для нединамических данных (список участников). Не должен меняться в течение показа.

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
    "parts": {
        "facName1": 19,
        "facName2": 10,
        "facName3": 0
    },
    "round": 3
}
```
`parts` --- все участники финала в порядке убываниия баллов (промежуточное состояние) или выступления (начальное состояние)
`round = 3` --- раунд показа глашатаев

## final (audience)
```json
{
    "parts": {
        "facName1": {
            "judge": 90,
            "audience": 6
        },
        "facName2": {
            "judge": 100,
            "audience": 20
        },
    },
    "round": 4
}
```
`parts` --- все участники финала в порядке убываниия баллов
`round = 4` --- раунд показа зрительских голосов

# release.json
Файл для динамических данных (очередь, выпуск). Обновляется с каждым выпущенным факультетом.

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
    "queue": ["facName8", "facName9", "facName10"],
    "released": ["facName8"],
    "round": 3
}
```
`queue` --- порядок показа глашатаев
`released` --- кто из глашатаев уже выступил
`round = 3` --- раунд показа глашатаев

## final (audience)
```json
{
    "queue": ["facName8", "facName9", "facName10"],
    "released": ["facName8"],
    "round": 4
}
```
`queue` --- порядок показа зрительских баллов факультетам (по умолчанию в порядке возрастания баллов жюри, менять порядок не рекомендуется, хоть и возможно)
`released` --- кто из финалистов уже получил зрительские баллы
`round = 4` --- раунд показа зрительских голосов




alt

# semi

## data.json
```json
{
    "parts": ["facName1", "facName2", "facName3"],
    "round": 1
}
```
## release.json
```json
{
    "queue": ["facName1", "facName2"], // не отправляется на клиент
    "released": ["facName1"], // на клиент через сокет отправляется только last, 
                              // при инициализации клиента вытягивается весь released
    "round": 1
}
```

# final (judge)

## data.json
```json
{
    "parts": ["facName1", "facName2", "facName3"], // участники-финалисты в порядке выступления
    "round": 3
}
```
## release.json
```json
{
    "queue": [
        {
            "facName1" : {
                "facName2": 0,
                "facName3": 10,
            }
        }, {
            "facName5" : {
                "facName2": 0,
                "facName3": 10,
            }
        }, {
            "name": "facName5",
            "facName2": 0,
            "facName3": 10,
        }
    ], // не отправляется на клиент, очередь глашатаев
    "released": [
        {
            "facName1" : {
                "facName2": 0,
                "facName3": 10,
            }
        } // на клиент через сокет отправляется только last, 
    ],  // при инициализации клиента вытягивается весь released и обновляется порядок
    // если в released хранить только названия, 
    // то как при перезагрузке странички клиент узнает все баллы??

    "round": 3
}
```
# final (audience)

## data.json
```json
{
    "parts": {
        "facName1": 100,
        "facName2": 60,


        // {
        //     "name": "facName1",
        //     "points" : 100
        // },
        // {
        //     "name": "facName2",
        //     "points" : 60
        // },
    }, // участники-финалисты в порядке убывания баллов жюри
    "round": 4
}
```
## release.json
```json
{
    "queue": [
        // {"facName1": 50},
        // {"facName2": 35},
4
        {
            "facName1": {
                "curAdded": 50,
                "total": 150,
            }
        },
        {
            "facName2": {
                "curAdded": 35,
                "total": 95,
            }
        },


        // {
        //     "name": "facName1",
        //     "points" : 50
        // },
        // {
        //     "name": "facName2",
        //     "points" : 35
        // },
    ], // не отправляется на клиент, объявления баллов зрителей, 
                                       // в порядке возрастания баллов жюри
    "released": [
        {
            "facName1": {
                "curAdded": 50,
                "total": 150,
            }
        },

        //     {
        //     "name": "facName1",
        //     "points" : 50
        // },
    ], // на клиент через сокет отправляется только last, 
       // при инициализации клиента вытягивается весь released и обновляется порядок
    // если в released хранить только названия, 
    // то как при перезагрузке странички клиент узнает все баллы??

    "round": 4
}
```


alt alt
# final (judge)

## release.json
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
    ], // не отправляется на клиент, в порядке объявления баллов 
    // (только при инициализации для кол-ва глашатаев)
                                       
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
                    "curAdded": 2,
                    "total": 2,
                },
                "facName3": {
                    "curAdded": 1,
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
       // при инициализации клиента вытягивается весь released и обновляется порядок
    // если в released хранить только названия, 
    // то как при перезагрузке странички клиент узнает все баллы??
    
    // после получения клиентом released в finsOrder записывается второе число в массиве баллов -- текущая сумма баллов факультета
    // при получении пустого released (нач состояние или сбросили всех) 
    // finsOrder формируется из финалистов + нули
    // как вернуть последнего?
    // сервер пришлет released без последнего, finsOrder просто установит все значения последнего

    "round": 4
}
```

