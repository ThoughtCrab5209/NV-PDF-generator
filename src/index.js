// --- Imports ---
import React from 'react';
import { Document, Image, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer';

import Configuration from "./external-data/nv24-configuration.json";

import RenderChart from "./cell-components/render-chart";
import RenderScoreTable from "./cell-components/render-score-table";
import RenderLeaderboard from "./cell-components/render-leaderboard";

import {createRoot} from "react-dom/client";


// --- Variables ---

// Styling
const styles = StyleSheet.create({
    cell: {
        alignSelf: 'stretch',
        backgroundColor: 'rgba(26,25,25,0.48)',
        border: '2px solid #ffffff',
        borderRadius: 3,
        flexBasis: 'auto',
        flexGrow: 1,
        flexShrink: 1,
        marginHorizontal: 10,
        width: '25%',
    },
    cellWrapper: {
        marginTop: -2,
        height: '88vh',
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        width: '100%',
    },
    doubleData: {
        height: '94vh',
    },
    data: {
        backgroundColor: '#ffffff',
        height: '45vh',
    },
    footerText: {
        alignItems: 'center',
        backgroundColor: "rgba(0,0,0,.03)",
        fontSize: 50,
        marginTop: 20
    },
    header: {
        backgroundColor: '#ffffff',
        paddingTop: 0
    },
    headerText: {
        alignItems: 'center',
        backgroundColor: "rgba(0,0,0,.03)",
        borderBottom: '1px solid #ffffff',
        color: '#ffffff',
        fontSize: 14,
        margin: 0,
        paddingBottom: 10,
        paddingTop: 5
    },
    imageContainer: {
        alignSelf: 'center',
        height: 350,
        margin: 30,
        width: 350
    },
    maxXCell: {
        width: '100%',
    },
    maxYCell: {
        height: '100%',
    },
    page: {
        backgroundColor: '#1a1919',
        flexDirection: 'row'
    },
    pageFooter: {
        backgroundColor: '#1a1919',
        color: '#ffffff',
        fontSize: 10,
        height: 18,
        paddingTop: 2,
        textAlign: 'center',
        width: '100vw',
        position: 'absolute',
        transform: 'translate(0%, 36%)',
    },
    pageHeader: {
        backgroundColor: '#1a1919',
        color: '#ffffff',
        fontSize: 10,
        height: 18,
        marginTop: 2,
        textAlign: 'center',
        width: '100vw',
        position: 'absolute',
        transform: 'translate(0%, -20%)',
    },
    row: {
        alignContent: 'stretch',
        alignItems: 'stretch',
        display: 'flex',
        flexBasis: 35,
        flexDirection: 'row',
        flexGrow: 0,
        flexShrink: 0,
        flexWrap: 'nowrap',
        justifyContent: 'space-around',
    },
    table: {
        alignContent: 'stretch',
        alignItems: 'stretch',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        height: '100%',
        justifyContent: 'flex-start',
        width: '100%'
    },
    tableText: {
        fontSize: 12,
        marginLeft: 10,
        padding: 2,
    },
    tableWrapper: {
        marginTop: 20,
    },
    view: {
        alignContent: 'left',
        flexGrow: 1,
    },
    wrapper: {
        alignSelf: 'center',
        height: '95vh',
        width: '100%'
    },
});

// Self-explanatory; startPage is the first page to show, endPage is the last page to show
const startPage = Configuration.details.information["pages-to-show"][0];
const endPage = Configuration.details.information["pages-to-show"][1];

// Get the information of each society
const socInfoList = Configuration.details.information["society-information-list"];

// Data arrays
let baseData = [];
let formattedData = [];


// --- Functions ---

// Using the given abbreviation, return the corresponding array
function getSocietyDataArray(abbrev){
    for (const array of socInfoList){
        if (array[1] === abbrev){
            return array
        }
    }
    return ['N/A', 'N/A', 'ffffff', 'Unspecified']
}

// Return cell framework based on type
function determineCell(item) {

    switch (item.type) {
        case "chart":
            return (
                <View style={[styles.cell, styles.maxXCell, styles.maxYCell, styles.doubleData]}>
                    <View style={[styles.headerText]}>
                        <Text>{item.title}</Text>
                    </View>
                    <View style={[styles.chartContainer]}>
                        <RenderChart data={item.data} title={item.title} modifier={Configuration.details.information["completed-events"]} />
                    </View>
                </View>
            )
        case "image":
            const data = getSocietyDataArray(item.data)
            console.log(data);
            return (
                <View style={[styles.cell, styles.maxXCell, styles.maxYCell, styles.doubleData]}>
                    <View style={[styles.headerText]}>
                        <Text>{item.title}</Text>
                    </View>
                    <View style={[styles.imageContainer]}>
                        <Image src={`./assets/images/${data[3]}.jpg`} />
                    </View>
                    <View style={[styles.footerText, {color: `#${data[2]}`}]}>
                        <Text>{data[0].toUpperCase()}</Text>
                    </View>
                </View>
            )
        case "leaderboard":
            return (
                <View style={[styles.cell, styles.maxXCell, styles.maxYCell, styles.doubleData]}>
                    <View style={[styles.tableText]}>
                        <RenderLeaderboard data={item.data} title={item.title} />
                    </View>
                </View>
            )
        case "table":
            return (
                <View style={[styles.cell, styles.maxXCell, styles.maxYCell, styles.doubleData]}>
                    <View style={[styles.tableText]}>
                        <RenderScoreTable data={item.data} title={item.title} />
                    </View>
                </View>
            )
    }

}

// Using the base data from config, format it into a usable context
function formatData(){

    for (let i = startPage; i <= (endPage); i++) {
        // console.log("element:", baseData[0][`page-${i}`])
        formattedData.push({
            title: baseData[0][`page-${i}`].title,
            type: baseData[0][`page-${i}`].type,
            data: baseData[0][`page-${i}`].data,
        })
    }

    console.log("Formatted data: ", formattedData);
}


// --- The PDF ---

// Make document
const MyDocument = () => {

    baseData = Configuration.details.pages;
    console.log("Base data: ", baseData);

    formatData();

    return (
        <Document>
            {formattedData.map((item, index) => {
                return (
                    <Page orientation='landscape' size='A4' style={[styles.page]}>
                        <View style={[styles.tableWrapper]}>

                            {/* Page Header */}
                            <View>
                                <Text style={[styles.pageHeader]}>
                                    {Configuration.name}
                                </Text>
                            </View>

                            {/* Page Cell */}
                            <View style={[styles.cellWrapper]}>
                                <View style={[styles.row]}>
                                    {determineCell(item)}
                                </View>
                            </View>

                            {/* Page Footer */}
                            <View>
                                <Text style={[styles.pageFooter]}>
                                    Page {index + 1} / {endPage - startPage + 1}
                                </Text>
                            </View>
                        </View>

                    </Page>
                )
            })}
        </Document>
    )
};

// View wrap document
const ViewWrapper = () => {
    return (
        <PDFViewer style={styles.wrapper}>
            <MyDocument />
        </PDFViewer>
    )
}

const MOUNT_ELEMENT = document.createElement('div');
document.body.appendChild(MOUNT_ELEMENT);
const root = createRoot(MOUNT_ELEMENT);
root.render(<ViewWrapper />);
