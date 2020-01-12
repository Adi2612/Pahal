import React from 'react'
import { StyleSheet, Image, Dimensions, TouchableOpacity, Layout, View, Text, Button } from 'react-native'

import CountdownCircle from 'react-native-countdown-circle'


const NextQuestionModal = (props) => {

    return (
        <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>

            {
                props.modalData.ans === 'NA' && <Image source={require('../assets/timer.png')} style={{ width: 80, height: 80 }} />
            }

            {
                props.modalData.ans === 'WA' && <Image source={require('../assets/wrong.png')} style={{ width: 80, height: 80 }} />
            }

            {
                props.modalData.ans === 'RA' && <Image source={require('../assets/correct.png')} style={{ width: 80, height: 80 }} />
            }
            <TouchableOpacity
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, padding: 5, marginTop: 25, borderRadius: 10 }}
                onPress={() => { props.nextButton() }}
            >
                <CountdownCircle
                    seconds={4}
                    radius={30}
                    borderWidth={8}
                    color="#ff003f"
                    bgColor="#fff"
                    textStyle={{ fontSize: 20 }}
                    onTimeElapsed={() => props.nextButton()}
                />
                <Text style={{ fontSize: 23, fontWeight: '800' }}> Next </Text>
            </TouchableOpacity>


        </View>
    )

}

const styles = StyleSheet.create({
    modal: {
        height: 130,
        paddingLeft: 15,
        width: Math.round(Dimensions.get('window').width * 0.7),
        marginLeft: Math.round(Dimensions.get('window').width * 0.1),
    },
    container: {
        flex: 1,
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    }
});


export default NextQuestionModal