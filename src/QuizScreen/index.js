import React, { useEffect, useState, useRef } from 'react'
import {
    View, SafeAreaView, ScrollView, Text, TouchableOpacity, Image, StyleSheet, Dimensions,
} from 'react-native'
import { ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons'
import CountdownCircle from 'react-native-countdown-circle'
import { NavigationActions } from 'react-navigation';

const TOTAL_TIMER_WIDTH = Math.round(Dimensions.get('window').width * 0.98)

import { getAllQuizes, submitQuiz } from '../utils/firebase'

import NextQuestionModal from './modal'

import Report from '../Report'

/**
 * Delay func 
 */

const delay = ms => new Promise(res => setTimeout(res, ms));

const bg = ['#E8B07D', '#72F441', '#EA51BC'];

const QuizScreen = (props) => {

    const topicDetails = props.navigation.state.params.topicDetails
    const subjectDetails = props.navigation.state.params.subjectDetails
    const levelDetails = props.navigation.state.params.levelDetails
    const [quizData, setQuizData] = useState([])
    const [currentElem, setCurrentElem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [maxQ, setMaxQ] = useState(0);
    const [cQ, setCQ] = useState(0);
    const [modalShow, setModalShow] = useState(false)
    const [modalData, setModalData] = useState({})
    const [showReport, setShowReport] = useState(false)

    const timeA = useRef(null)
    const timeB = useRef(null)



    const getQuizes = async () => {
        const qData = await getAllQuizes(subjectDetails.subid, topicDetails.tid, levelDetails.lid)
        console.log("qdta")
        console.log(qData)
        setQuizData(qData)
        setMaxQ(qData.length - 1)
        setLoading(false)
        setCurrentElem((
            <CountdownCircle
                seconds={qData[0].timer}
                radius={30}
                borderWidth={8}
                color="#ff003f"
                bgColor="#fff"
                textStyle={{ fontSize: 20 }}
                onTimeElapsed={() => onTimeOut()}
            />
        ))
        const temp_ = new Date()
        timeA.current = temp_.getTime();
    }

    useEffect(() => {
        getQuizes()
    }, [])


    const submitAns = (item) => {
        /**
         * get correct option :
         * match the id 
         * and see if its correct
         */
        const temp_ = new Date()
        timeB.current = temp_.getTime();
        if (item.oid === quizData[cQ].ans[0]) {
            console.log("shits")

            submitQuiz(subjectDetails.subid, topicDetails.tid, levelDetails.lid, quizData[cQ].qid, 'RA', timeB.current - timeA.current)
            setModalData({
                ans: 'RA',
                time: 5,
            })
        }
        else {
            submitQuiz(subjectDetails.subid, topicDetails.tid, levelDetails.lid, quizData[cQ].qid, 'WA', timeB.current - timeA.current)
            setModalData({
                ans: 'WA',
                time: 5,
            })
        }
        setModalShow(true)

    }

    const onTimeOut = () => {
        submitQuiz(subjectDetails.subid, topicDetails.tid, levelDetails.lid, quizData[cQ].qid, 'NA', quizData[cQ].timer)
        setModalData({
            ans: 'RA',
            time: quizData[cQ].timer,
        })
        setModalShow(true)

    }

    const onNextButtonClick = () => {
        /**
         * show next question
         *      if no next question :
         *      show charts
         */
        if (cQ === maxQ) {
            // show fucking score screen
            setShowReport(true)

        }
        else {
            let r = cQ + 1
            setCQ(r)
            setModalData({})
            setModalShow(false)
            setCurrentElem((
                <CountdownCircle
                    seconds={quizData[r].timer}
                    radius={30}
                    borderWidth={8}
                    color="#ff003f"
                    bgColor="#fff"
                    textStyle={{ fontSize: 20 }}
                    onTimeElapsed={() => onTimeOut()}
                />
            ))

        }
    }



    const getElm = () => {

        if (showReport) {
            return (
                <Report
                    levelDetails={levelDetails}
                    subjectDetails={subjectDetails}
                    topicDetails={topicDetails}
                />
            )
        }

        if (modalShow) {
            return (
                <NextQuestionModal
                    nextButton={onNextButtonClick}
                    modalData={modalData}
                />
            )
        }

        if (loading) {
            return (
                <View>

                </View>

            )
        }
        else {
            return (
                <SafeAreaView style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                    {currentElem}
                    <ScrollView >

                        <View style={Styles.container}>
                            {/* 
                    1. background image
                    2. question
                    3. options
                    4. timer
                */}
                            {/* <Image source={require('../assets/bgnumber.png')} style={Styles.image} /> */}
                            <Text style={Styles.question}>
                                {quizData[cQ].question}
                            </Text>
                            <View style={Styles.optionsContainer}>

                                {quizData[cQ].options.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => { submitAns(item) }}
                                            key={item.oid}>
                                            <View
                                                style={{ ...Styles.option, backgroundColor: bg[index % 3] }} >
                                                <Text style={Styles.optionText}>
                                                    {item.text}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>

                        </View>
                    </ScrollView>
                </SafeAreaView>
            )
        }
    }



    return (
        <View>
            {getElm()}
        </View>
    )


}



const Styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
        padding: 3
    },
    image: {
        width: Math.round(Dimensions.get('window').width * 0.8),
        height: Math.round(Dimensions.get('window').width * 0.5),
        marginTop: 10,
        resizeMode: 'contain'
    },
    question: {
        fontSize: 35,
        fontWeight: '300',
        textAlign: 'center'
    },
    timer: {
        height: 9,
        borderWidth: 0,
        marginLeft: Math.round(Dimensions.get('window').width * 0.005),
        marginRight: Math.round(Dimensions.get('window').width * 0.015),
        marginTop: 10,
        backgroundColor: '#F78AD6',
        borderRadius: 5
    },
    optionsContainer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'black',
        display: 'flex',
        flexDirection: 'row',
        width: Math.round(Dimensions.get('window').width * 0.98),
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: 10
    },
    option: {
        width: Math.round(Dimensions.get('window').width * 0.46),
        height: Math.round(Dimensions.get('window').width * 0.46),
        borderColor: StyleSheet.hairlineWidth,
        borderColor: 'black',
        marginLeft: Math.round(Dimensions.get('window').width * (0.06 / 3)),
        marginTop: Math.round(Dimensions.get('window').width * (0.06 / 3)),
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3

    },
    optionText: {
        fontSize: 25,
        textAlignVertical: 'center',
        textAlign: 'center'
    },
    modal: {
        height: 130,
        paddingLeft: 15,
        width: Math.round(Dimensions.get('window').width * 0.7),
        marginLeft: Math.round(Dimensions.get('window').width * 0.1),
    },
    mcontainer: {
        flex: 1,
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    }

})


QuizScreen.navigationOptions = {
    title: 'Quiz',
}

export default QuizScreen