# settings.json
Технический файлик для настройки
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
    "finsCount": 6,
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
    "queue": ["facName1", "facName2"], // не отправляется на клиент, очередь глашатаев
    "released": {
        "facName1" : {
            "facName2": 0,
            "facName3": 10,
        }
    }, // на клиент через сокет отправляется только last, 
       // при инициализации клиента вытягивается весь released и обновляется порядок
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
        "facName1": 10,
        "facName2": 6
    }, // участники-финалисты в порядке убывания баллов жюри
    "round": 4
}
```
## release.json
```json
{
    "queue": ["facName1", "facName2"], // не отправляется на клиент, объявления баллов зрителей, 
                                       // в порядке возрастания баллов жюри
    "released": {
        "facName1" : {
            "facName2": 0,
            "facName3": 10,
        }
    }, // на клиент через сокет отправляется только last, 
       // при инициализации клиента вытягивается весь released и обновляется порядок
    // если в released хранить только названия, 
    // то как при перезагрузке странички клиент узнает все баллы??

    "round": 4
}
```


# judge.json

```json
{
    //"fins": ["facName1", "facName2", "facName3"],
    "facName1" : {
        "facName2": 0,
        "facName3": 10,
    },
    "facName5" : {
        "facName1": 0,
        "facName3": 10,
    }
}
```