// --- Imports ---
import React from 'react';
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

import ReactPDFChart from 'react-pdf-charts';

import Configuration from "../external-data/nv24-configuration.json";


// --- Variables ---

// Get the information of each society
const socInfoList = Configuration.details.information["society-information-list"];


// --- Functions ---

// Using the provided integer (see the config file), return the corresponding score to use
function translatePlaceToScore(place) {
    switch (place) {
        case '1':
            return 16
        case '2':
            return 14
        case '3':
            return 12
        case '4':
            return 10
        case '5':
            return 8
        case '6':
            return 6
        case '7':
            return 4
        case '8':
            return 2
        default:
            return 0
    }
}

// Using the provided abbreviation, return the corresponding full society name
function teamAbbreviationToName(abbrev) {
    switch (abbrev) {
        case 'AIRTEC':
            return 'Airsoft x TEC'
        case 'ANI':
            return 'Anime'
        case 'CHLNGR':
            return 'Challengers'
        case 'CRI':
            return 'CRITS'
        case 'WHO':
            return 'Doctor Who'
        case 'FLMCRW':
            return 'Film x Creative Writing'
        case 'GAM':
            return 'Gaming'
        case 'SCF':
            return 'Sci-Fan'
        default:
            return ''
    }
}

// Change the data into the format required
function formatData(data, finalIndex) {
    const graphData = [];

    // Round 0: nothing happens so set everything to 0 - creates a nice origin point
    graphData.push({
        event: '',
        'Airsoft x TEC': 0,
        Anime: 0,
        Challengers: 0,
        CRITS: 0,
        'Doctor Who': 0,
        'Film x Creative Writing': 0,
        Gaming: 0,
        'Sci-Fan': 0
    })

    // starts at 0, ends at finalIndex
    for (let i = 0; i < finalIndex  + 2; i++) {
        let societiesList
        let placesList

        // sometimes it reads more data than present, so when there's no more data, break out of the loop
        try {
            societiesList = data[i].data.societies.split("/");
            placesList = data[i].data.places.split("/");

            if (societiesList[0] === '#' && placesList[0] === '0'){
                societiesList = "AIRTEC/ANI/CHLNGR/CRI/FLMCRW/GAM/SCF/WHO".split("/")
                placesList = "0/0/0/0/0/0/0/0".split("/")
            }

        } catch (e) {
            break;
        }

        graphData.push({
            event: data[i].title.split(": ")[1],
            // one line for each society
            [teamAbbreviationToName(societiesList[0])]: translatePlaceToScore(placesList[0]) + graphData[i][teamAbbreviationToName(societiesList[0])],
            [teamAbbreviationToName(societiesList[1])]: translatePlaceToScore(placesList[1]) + graphData[i][teamAbbreviationToName(societiesList[1])],
            [teamAbbreviationToName(societiesList[2])]: translatePlaceToScore(placesList[2]) + graphData[i][teamAbbreviationToName(societiesList[2])],
            [teamAbbreviationToName(societiesList[3])]: translatePlaceToScore(placesList[3]) + graphData[i][teamAbbreviationToName(societiesList[3])],
            [teamAbbreviationToName(societiesList[4])]: translatePlaceToScore(placesList[4]) + graphData[i][teamAbbreviationToName(societiesList[4])],
            [teamAbbreviationToName(societiesList[5])]: translatePlaceToScore(placesList[5]) + graphData[i][teamAbbreviationToName(societiesList[5])],
            [teamAbbreviationToName(societiesList[6])]: translatePlaceToScore(placesList[6]) + graphData[i][teamAbbreviationToName(societiesList[6])],
            [teamAbbreviationToName(societiesList[7])]: translatePlaceToScore(placesList[7]) + graphData[i][teamAbbreviationToName(societiesList[7])]
        })

    }

    // when all rounds have been played, add one final score thing which deducts points
    if (Configuration.details.information["total-events"] === Configuration.details.information["completed-events"]){
        for (const society of socInfoList){
            graphData[Configuration.details.information["completed-events"]][society[0]] += society[4]
        }
    }

    return graphData
}

// Using the provided integer (total completed events), get all the data up to and including this page
function fetchData(finalEventIndex) {
    //console.log("// Function: fetchData //")
    const scoresSoFarData = []

    // Should be equivalent to the 'page-n' of the first event
    const pageIncrementModifier = 4;

    for (let i = pageIncrementModifier; i <= finalEventIndex + pageIncrementModifier - 1; i++) {
        scoresSoFarData.push({
            title: Configuration.details.pages[0][`page-${i}`].title,
            type: Configuration.details.pages[0][`page-${i}`].type,
            data: Configuration.details.pages[0][`page-${i}`].data,
        })
    }

    return formatData(scoresSoFarData, finalEventIndex)
}


// --- The chart ---
export default function RenderChart(props) {

    const width = 4*260;
    const height = 2*300;

    let modifier = props.modifier;

    const newData = fetchData(modifier);

    // if all events are completed, add in an extra 1 fake event to handle the big quiz scores (2* the normal)
    modifier = modifier === Configuration.details.information["total-events"] ? modifier + 1 : modifier

    // chart settings
     return (
         <ReactPDFChart>
             <LineChart data={newData} width={width} height={height}
                        margin={{ top: 20, bottom: 20, right: 100, left: 5 }} >
                 <XAxis dataKey="event" axisLine={true} tickLine={true} stroke={"#ffffff"} />

                 <YAxis axisLine={true} tickLine={true} domain={[0, 16*modifier]} stroke={"#ffffff"}
                        ticks={[0, 2*modifier, 4*modifier, 6*modifier, 8*modifier, 10*modifier, 12*modifier, 14*modifier, 16*modifier]} />

                 <Legend />

                 <CartesianGrid vertical={false} strokeDasharray="3" stroke={"#ffffff"} />

                 <Line dataKey="Airsoft x TEC" fill={"#405508"} isAnimationActive={false} type="monotone" stroke={"#405508"}
                       dot={{ stroke: "#405508", strokeWidth: 2 }} label={{ fill: '#ffffff', position: 'top' }} />
                 <Line dataKey="Anime" fill={"#f59307"} isAnimationActive={false} type="monotone" stroke={"#f59307"}
                       dot={{ stroke: "#f59307", strokeWidth: 2 }} label={{ fill: '#ffffff', position: 'top' }} />
                 <Line dataKey="Challengers" fill={"#a0a0a0"} isAnimationActive={false} type="monotone" stroke={"#a0a0a0"}
                       dot={{ stroke: "#a0a0a0", strokeWidth: 2 }} label={{ fill: '#ffffff', position: 'top' }} />
                 <Line dataKey="CRITS" fill={"#de1f41"} isAnimationActive={false} type="monotone" stroke={"#de1f41"}
                       dot={{ stroke: "#de1f41", strokeWidth: 2 }} label={{ fill: '#ffffff', position: 'top' }} />
                 <Line dataKey="Doctor Who" fill={"#01a0e2"} isAnimationActive={false} type="monotone" stroke={"#01a0e2"}
                       dot={{ stroke: "#01a0e2", strokeWidth: 2 }} label={{ fill: '#ffffff', position: 'top' }} />
                 <Line dataKey="Film x Creative Writing" fill={"#56fd06"} isAnimationActive={false} type="monotone" stroke={"#56fd06"}
                       dot={{ stroke: "#56fd06", strokeWidth: 2 }} label={{ fill: '#ffffff', position: 'top' }} />
                 <Line dataKey="Gaming" fill={"#f70089"} isAnimationActive={false} type="monotone" stroke={"#f70089"}
                       dot={{ stroke: "#f70089", strokeWidth: 2 }} label={{ fill: '#ffffff', position: 'top' }} />
                 <Line dataKey="Sci-Fan" fill={"#0265cd"} isAnimationActive={false} type="monotone" stroke={"#0265cd"}
                       dot={{ stroke: "#0265cd", strokeWidth: 2 }} label={{ fill: '#ffffff', position: 'top' }} />
             </LineChart>
         </ReactPDFChart>
     )
}
