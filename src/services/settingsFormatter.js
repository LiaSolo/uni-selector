// semi: settings.json => data.json 
// final: score.json => data.json

// function shuffleArray(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// }

export const settingsFormatter = (rawSettings, round) => {
    // избавиться от lastWinner в настройках
    // вместо этого добавить semi = 0 ? null ?
    const {facs: facSettings, lastWinner} = rawSettings;

    if (!round || !facSettings) {
        return({
            parts: [],
            queue: [],
            round: round,
        });
    }

    //let parts = [], fins = [];

    // semi
    if (round < 3) {

        const parts = Object.keys(facSettings).filter((fac) => 
            facSettings[fac].isParticipant 
            && lastWinner !== fac 
            && round === facSettings[fac].sem
        );
        
        //parts = parts.filter((fac) => round === facSettings[fac].semi);
        const fins = parts.filter(fac => facSettings[fac].isFinal)
        //shuffleArray(queue)

        return ({
            parts: parts,
            queue: fins,
            round: round,
        });
    } 

    

    // final judges
    if (round === 3) {
        //fins.push(lastWinner);
        //console.log(rawSettings)

        // if (!rawSettings.facs) {
        //     return;
        // }

        console.log(rawSettings)

        const parts = rawSettings.fins ?? [];
        const queue = Object.keys(facSettings)
            .filter(fac => facSettings[fac].isVoited)
            .flatMap((fac) => {


                // const first = Object.fromEntries(
                //     Object.entries(facSettings[fac].points).filter(([, value]) => value < 10)
                // );

                // const second = Object.fromEntries(
                //     Object.entries(facSettings[fac].points).filter(([, value]) => value === 10)
                // );

                const first = {}, second = {};

                Object.entries(facSettings[fac].points).forEach(([fin, score]) => {
                    first[fin] = score < 10 ? score : 0;
                    //second[fin] = score;

                    if (score === 10) {
                        second[fin] = score;
                    }

                    //second[fin] = score === 10 ? 10 : 0;
                })

                return ([
                    {name: fac, points: first}, 
                    {name: fac, points: second},
                ])
            })
            //.map((fac) => ({name: fac, ...facSettings[fac]}))

        return ({
            parts: parts,
            queue: queue,
            round: round,
        });
    }

    // final audience
    if (round === 4) {

        // по убыванию баллов жюри
        const finSorted = rawSettings.fins.toSorted((a, b) => rawSettings.sumJudges[b] - rawSettings.sumJudges[a]);
        
        // const parts = finSorted.map((fin) => ({
        //     name: fin,
        //     points: rawSettings.sumJudges[fin],
        // }));
        
        // const queue = finSorted.toReversed().map((fin) => ({
        //     name: fin,
        //     points: rawSettings.audience[fin],
        // }));

        const parts = rawSettings.sumJudges;
        // finSorted.forEach((fin) => {
        //     parts[fin] = rawSettings.sumJudges[fin];
        // });

        // const queue = finSorted.toReversed().map((fin) => ({
        //     [fin]: rawSettings.audience[fin],
        // }));
        
        const queue = finSorted.toReversed().map((fin) => ({
            name: fin,
            curAdded: rawSettings.audience[fin],
            total: rawSettings.audience[fin] + rawSettings.sumJudges[fin],
        }));

        return ({
            parts: parts,
            queue: queue,
            round: round,
        });
    }
}