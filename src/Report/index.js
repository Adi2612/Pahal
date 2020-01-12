import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, ScrollView, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native'
import { ProgressCircle, BarChart, Grid } from 'react-native-svg-charts'
import _ from 'lodash'
import { getReports } from '../utils/firebase'

export const Report = (props) => {


    const getInsight = async () => {
        const dat = await getReports(props.subjectDetails.subid, props.topicDetails.tid, props.levelDetails.lid)
        doComputation(dat)
    }

    const getcount = (arr, str_) => {
        let count = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].ans === str_) {
                count += 1;
            }
        }
        return count;
    }

    const doComputation = (arr) => {

        const correct = getcount(arr, 'RA')
        const incorrect = getcount(arr, 'WA')
        const uncomplete = getcount(arr, 'NA')

        const accuracy = (correct / (correct + incorrect));
        const completion = (correct / arr.length)
        const time = []
        for (var i = 0; i < arr.length; i++) {
            time.push(arr[i].time)
        }

        setAccuracy(accuracy)
        setTimeData(time)
        setCompletion(completion)
        setCorrect(correct)
        setWrong(incorrect)
        setUnattempted(uncomplete)
        setLoading(false)

    }

    useEffect(() => {
        getInsight()
    }, [])
    const [accuracy, setAccuracy] = useState(0.8)
    const [timeData, setTimeData] = useState([])
    const [completion, setCompletion] = useState(0.5)
    const [correct, setCorrect] = useState(5)
    const [wrong, setWrong] = useState(3)
    const [unattempt, setUnattempted] = useState(1)
    const [loading, setLoading] = useState(true)

    const fill = 'rgb(134, 65, 244)'

    const getElm = () => {
        if (loading) {
            return (
                <View>

                </View>)
        }
        else {
            return (
                <SafeAreaView>
                    <ScrollView>
                        <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', marginTop: 15 }}>
                            <ProgressCircle
                                style={{ height: 170, width: 170 }}
                                progress={accuracy}
                                progressColor={'rgb(134, 65, 244)'}
                            >
                                {/* <Text style={{ zIndex: 1 }}>
                            Shit
                        </Text> */}

                            </ProgressCircle>
                            <Text style={{ fontSize: 23, fontWeight: '900', paddingBottom: 10 }}>
                                Accuracy {` ${Math.round(accuracy * 100)}%`}
                            </Text>
                            <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'black', width: '88%', marginTop: 5 }} />
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%', padding: 7, alignItems: 'flex-start' }}>
                                <View style={{
                                    width: Math.round(Dimensions.get('window').width * 0.45),
                                    height: Math.round(Dimensions.get('window').width * 0.40),
                                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                                }}>

                                    <ProgressCircle
                                        style={styles.completioCircle}
                                        progress={completion}
                                        progressColor={'rgb(134, 65, 244)'}
                                    />
                                    <Text style={{ fontSize: 17, fontWeight: '800', paddingBottom: 10 }}>
                                        Completion {`${Math.round(completion * 100)}%`}
                                    </Text>
                                </View>
                                <View style={{
                                    width: Math.round(Dimensions.get('window').width * 0.45),
                                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: 8,
                                    height: Math.round(Dimensions.get('window').width * 0.36)
                                }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Image source={require('../assets/correct.png')} style={{ width: 18, height: 18 }} />
                                        <Text style={{ fontSize: 18, fontWeight: '800' }} > {correct} Correct </Text>
                                    </View>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Image source={require('../assets/wrong.png')} style={{ width: 18, height: 18 }} />
                                        <Text style={{ fontSize: 18, fontWeight: '800' }} > {wrong} Incorrect </Text>
                                    </View>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Image source={require('../assets/wrong.png')} style={{ width: 18, height: 18 }} />
                                        <Text style={{ fontSize: 18, fontWeight: '800' }} > {unattempt} Unanswered </Text>
                                    </View>
                                </View>

                            </View>
                            <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'black', width: '88%', marginTop: 5 }} />
                            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', marginTop: 10, width: '100%', padding: 8 }}>
                                <BarChart
                                    style={{ height: 200, width: 300 }}
                                    data={timeData}
                                    svg={{ fill }}
                                    contentInset={{ top: 0, bottom: 0 }}
                                >
                                    <Grid />
                                </BarChart>
                                <Text style={{ fontSize: 23, fontWeight: '900', paddingBottom: 10, }}>
                                    Time Spent on Each Question
                    </Text>
                            </View>

                        </View>
                    </ScrollView>
                </SafeAreaView >
            )
        }
    }

    return (
        <View>
            {getElm()}
        </View>
    )


}


const styles = StyleSheet.create({

    completioCircle: {
        width: Math.round(Dimensions.get('window').width * 0.3),
        height: Math.round(Dimensions.get('window').width * 0.3)

    }

})

Report.navigationOptions = {
    title: 'Highlights'
}

export default Report