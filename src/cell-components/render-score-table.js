// --- Imports ---
import React from 'react';
import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";

import Configuration from "../configuration.json";
import {translatePlaceToScore} from "../functions/translatePlaceToScore";


// --- Variables ---
// Styling
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
    noScores: {
        color: '#fff',
        fontSize: 30,
        marginTop: '29%',
        textAlign: 'center'
    },
    ranking: {
        border: 0,
        marginTop: 5,
        textAlign: "center"
    },
});

// Get the information of each society
const socInfoList = Configuration.details.information["society-information-list"];


// --- Functions ---
// Merge the societies and places list into one
function mergeLists(listOne, listTwo){
    let newList = []
    for (let i = 0; i < listOne.length; i++) {

        for (const society of socInfoList) {
            if (society[1] === listOne[i]){
                newList.push({
                    society: society[0],
                    score: translatePlaceToScore(listTwo[i]),
                    colour: `${society[2]}`,
                    icon: society[3]
                })
            }

        }

    }

    return newList
}


// --- The table ---
export default function RenderScoreTable(props) {

    const data = props.data;
    const podiumList = ['N/A', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

    const societiesList = data.societies.split("/");
    const placesList = data.places.split("/");

    let mergedList = mergeLists(societiesList, placesList);

    if (mergedList.length === 0){
        return (
            <View>

                {/* Cell Header */}
                <View style={[styles.headerText, {paddingBottom: 5}]}>
                    <Text>
                        {props.title}
                    </Text>
                </View>

                <View>
                    <Text style={[styles.noScores]}>
                        Scores unavailable
                    </Text>
                </View>

            </View>
        )
    }

    return (
        <View>

            {/* Cell Header */}
            <View style={[styles.headerText]}>
                <Text>
                    {props.title}
                </Text>
            </View>

            {mergedList.map((item, index) => {
                return (
                    <>
                        {/* New line spacer */}
                        <Text> </Text>

                        {/* Icon */}
                        <Text style={[styles.bodyText, styles.event, {color: item.colour, marginLeft: 25, marginTop: 10}]}>
                            <Image src={`./assets/images/${item.icon}.jpg`} style={{ width: 32, height: 32 }} />
                        </Text>

                        {/* Place & Society */}
                        <Text style={[styles.bodyText, styles.event, {color: item.colour, marginLeft: 58, marginTop: -22}]}>
                            &nbsp;&nbsp;&nbsp; {podiumList[placesList[index]] + ': ' + item.society}
                        </Text>

                        {/* Score */}
                        <Text style={[styles.bodyText, styles.event, {color: item.colour, marginRight: 58, textAlign: 'right', transform: 'translateY(-25px)'}]}>
                            {item.score}
                        </Text>

                        {/* New line spacer */}
                        <Text> </Text>
                    </>
                )
            })}

        </View>
    )
}