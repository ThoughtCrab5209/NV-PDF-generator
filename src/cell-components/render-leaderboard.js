// --- Imports ---
import React from 'react';
import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";

import Configuration from "../configuration.json";

import { translatePlaceToScore } from "../functions/translatePlaceToScore";
import { teamAbbreviationToName } from '../functions/teamAbbreviationToName';


// --- Variables ---
const styles = StyleSheet.create({
    bodyText: {
        fontSize: 30,
        color: '#ffffff'
    },
    headerText: {
        alignItems: 'center',
        backgroundColor: "rgba(0,0,0,.03)",
        borderBottom: '2px solid #ffffff',
        borderTop: '2px solid #ffffff',
        color: '#ffffff',
        fontSize: 14,
        margin: '-2 -2 0 -12',
        paddingBottom: 20,
        paddingTop: 7,
        transform: 'translateY(-2px)',
    },
    event: {
        border: 0,
    },
    rankingIcon: {
        border: 0,
        marginTop: 5,
        textAlign: "center"
    },
    rankingText: {
        border: 0,
        textAlign: "center"
    },
});

const socInfoList = Configuration.details["society-information-list"];


// --- Functions ---
function sortList(unsortedList){
    const sortedList = [];

    for (const element of unsortedList) {
        sortedList.push(element.score + '/' + element.society + '/' + element.colour + '/' + element.icon);
    }
    sortedList.sort((a,b) => b.split('/')[0] - a.split('/')[0]);

    return sortedList
}

function formatData(data, finalIndex) {
    let leaderboardData = [];

    leaderboardData.push({
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

    // For every following round, push the relevant data
    for (let i = 0; i < finalIndex  + 2; i++) {
        let societiesList
        let placesList

        // sometimes it reads more data than present, so when there's no more data, break out of the loop
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

        leaderboardData.push({
            event: data[i].title.split(": ")[1],
            // one line for each society
            [teamAbbreviationToName(societiesList[0])]: translatePlaceToScore(placesList[0]) + leaderboardData[i][teamAbbreviationToName(societiesList[0])],
            [teamAbbreviationToName(societiesList[1])]: translatePlaceToScore(placesList[1]) + leaderboardData[i][teamAbbreviationToName(societiesList[1])],
            [teamAbbreviationToName(societiesList[2])]: translatePlaceToScore(placesList[2]) + leaderboardData[i][teamAbbreviationToName(societiesList[2])],
            [teamAbbreviationToName(societiesList[3])]: translatePlaceToScore(placesList[3]) + leaderboardData[i][teamAbbreviationToName(societiesList[3])],
            [teamAbbreviationToName(societiesList[4])]: translatePlaceToScore(placesList[4]) + leaderboardData[i][teamAbbreviationToName(societiesList[4])],
            [teamAbbreviationToName(societiesList[5])]: translatePlaceToScore(placesList[5]) + leaderboardData[i][teamAbbreviationToName(societiesList[5])],
            [teamAbbreviationToName(societiesList[6])]: translatePlaceToScore(placesList[6]) + leaderboardData[i][teamAbbreviationToName(societiesList[6])],
            [teamAbbreviationToName(societiesList[7])]: translatePlaceToScore(placesList[7]) + leaderboardData[i][teamAbbreviationToName(societiesList[7])]
        })

    }

    if (Configuration.details["total-events"] === Configuration.details["completed-events"]){
        for (const society of socInfoList){
            leaderboardData[Configuration.details["completed-events"]][society[0]] += society[4]
        }
    }

    leaderboardData = leaderboardData[finalIndex];

    const formattedLeaderboardData = [];

    for (const society of socInfoList){
        formattedLeaderboardData.push({
            score: leaderboardData[society[0]],
            society: society[0],
            colour: `${society[2]}`,
            icon: society[3]
        })
    }

    return sortList(formattedLeaderboardData)
}

function fetchData(){
    const societyList = [];
    const finalEventIndex = Configuration.details["completed-events"]

    const pageIncrementModifier = Configuration.details['first-event-page'];

    for (let i = pageIncrementModifier; i <= finalEventIndex + pageIncrementModifier - 1; i++) {
        societyList.push({
            title: Configuration.pages[`page-${i}`].title,
            type: Configuration.pages[`page-${i}`].type,
            data: Configuration.pages[`page-${i}`].data,
        })
    }

    return formatData(societyList, finalEventIndex)
}


// --- The table ---
export default function RenderLeaderboard(props) {

    const leaderboardList = fetchData();

        return (
            <View>

                {/* Cell Header */}
                <View style={[styles.headerText]}>
                    <Text>
                        {props.title}
                    </Text>
                </View>

                {/* item format: 0=score, 1=society, 2=colour 3=icon */}
                {leaderboardList.map((item) => {
                    return (
                        <div>
                            
                            {/* Icon */}
                            <Text style={[styles.bodyText, styles.rankingIcon, {
                                color: item.split('/')[2],
                                transform: 'translate(-315px, 10px)'
                            }]}>
                                <Image src={`./assets/images/${item.split('/')[3]}`}
                                    style={{width: 32, height: 32}}
                                />
                            </Text>

                            {/* Society + score */}
                            <Text style={[styles.bodyText, styles.rankingText, {
                                color: item.split('/')[2],
                                marginBottom: 30
                            }]}>
                                {item.split('/')[1]} - {item.split('/')[0]}
                            </Text>

                            {/* Icon */}
                            <Text style={[styles.bodyText, styles.rankingIcon, {
                                color: item.split('/')[2],
                                transform: 'translate(305px, -40px)'
                            }]}>
                                <Image src={`./assets/images/${item.split('/')[3]}`}
                                    style={{width: 32, height: 32}}/>
                            </Text>

                        </div>
                    )
                })}
            </View>
        )
}