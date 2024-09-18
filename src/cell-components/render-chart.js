// --- Imports ---
import React from 'react';
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

import ReactPDFChart from 'react-pdf-charts';

import Configuration from "../configuration.json";

import { translatePlaceToScore } from "../functions/translatePlaceToScore";
import { teamAbbreviationToName } from '../functions/teamAbbreviationToName';


// --- Variables ---
const socInfoList = Configuration.details["society-information-list"];


// --- Functions ---
// Change the data into the format required
function formatData(data, finalIndex) {
    const graphData = [];

    graphData.push({
        'event': '',
        'Airsoft x TEC': 0,
        'Anime': 0,
        'Challengers': 0,
        'CRITS': 0,
        'Doctor Who': 0,
        'Film x Creative Writing': 0,
        'Gaming': 0,
        'Sci-Fan': 0
    })

    for (let i = 0; i < finalIndex + 2; i++) {
        let societiesList
        let placesList

        try {
            societiesList = data[i].data.societies.split("/");
            placesList = data[i].data.places.split("/");

            if (societiesList[0] === '#' && placesList[0] === '0'){
                societiesList = ["AIRTEC", "ANI", "CHLNGR", "CRI", "FLMCRW", "GAM", "SCF", "WHO"]
                placesList = ["0", "0", "0", "0", "0", "0", "0", "0"]
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

    if (Configuration.details["total-events"] >= Configuration.details["completed-events"]){
        for (const society of socInfoList){
            graphData[Configuration.details["completed-events"]][society[0]] += society[4]
        }
    }

    return graphData
}

function fetchData(finalEventIndex) {
    const scoresSoFarData = []

    const pageIncrementModifier = Configuration.details['first-event-page'];

    for (let i = pageIncrementModifier; i <= finalEventIndex + pageIncrementModifier - 1; i++) {
        scoresSoFarData.push({
            title: Configuration.pages[`page-${i}`].title,
            type: Configuration.pages[`page-${i}`].type,
            data: Configuration.pages[`page-${i}`].data,
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

    return (
        <ReactPDFChart>
            <LineChart data={newData} width={width} height={height} margin={{ top: 20, bottom: 20, right: 100, left: 5 }}>
                <XAxis dataKey="event" axisLine={true} tickLine={true} stroke={"#ffffff"} />
                
                <YAxis axisLine={true} tickLine={true} domain={[0, 16*modifier]} stroke={"#ffffff"}
                    ticks={[0, 2*modifier, 4*modifier, 6*modifier, 8*modifier, 10*modifier, 12*modifier, 14*modifier, 16*modifier]} />

                <Legend />

                <CartesianGrid vertical={false} strokeDasharray="3" stroke={"#ffffff"} />

                <Line dataKey="Airsoft x TEC" 
                fill={"#405508"} isAnimationActive={false} type="monotone" stroke={"#405508"} dot={{ stroke: "#405508", strokeWidth: 2 }} label={{ fill: '#ffffff', position: 'top' }} />
                
                <Line dataKey="Anime" 
                fill={"#F59307"} isAnimationActive={false} type="monotone" stroke={"#F59307"} dot={{ stroke: "#F59307", strokeWidth: 2 }} label={{ fill: '#ffffff', position: 'top' }} />
                
                <Line dataKey="Challengers"
                fill={"#A0A0A0"} isAnimationActive={false} type="monotone" stroke={"#A0A0A0"} dot={{ stroke: "#A0A0A0", strokeWidth: 2 }} label={{ fill: '#ffffff', position: 'top' }} />
                
                <Line dataKey="CRITS"
                fill={"#DE1F41"} isAnimationActive={false} type="monotone" stroke={"#DE1F41"} dot={{ stroke: "#DE1F41", strokeWidth: 2 }} label={{ fill: '#ffffff', position: 'top' }} />
                
                <Line dataKey="Doctor Who"
                fill={"#01A0E2"} isAnimationActive={false} type="monotone" stroke={"#01A0E2"} dot={{ stroke: "#01A0E2", strokeWidth: 2 }} label={{ fill: '#ffffff', position: 'top' }} />
                
                <Line dataKey="Film x Creative Writing"
                fill={"#56FD06"} isAnimationActive={false} type="monotone" stroke={"#56FD06"} dot={{ stroke: "#56FD06", strokeWidth: 2 }} label={{ fill: '#ffffff', position: 'top' }} />
                
                <Line dataKey="Gaming"
                fill={"#F70089"} isAnimationActive={false} type="monotone" stroke={"#F70089"} dot={{ stroke: "#F70089", strokeWidth: 2 }} label={{ fill: '#ffffff', position: 'top' }} />
                
                <Line dataKey="Sci-Fan"
                fill={"#0265CD"} isAnimationActive={false} type="monotone" stroke={"#0265CD"} dot={{ stroke: "#0265CD", strokeWidth: 2 }} label={{ fill: '#ffffff', position: 'top' }} />
            </LineChart>
        </ReactPDFChart>
     )
}
