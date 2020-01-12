import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, ScrollView, Text, TouchableOpacity, Image } from 'react-native'
import { ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons'
/**
 * 
 * Level Screen
 */
import { getAllLevels } from '../utils/firebase'

const CourseScreen = (props) => {

    const topicDetails = props.navigation.state.params.topicDetails
    const subjectDetails = props.navigation.state.params.subjectDetails

    const [data, setData] = useState([])

    const getLevels = async () => {
        const some = await getAllLevels(subjectDetails.subid, topicDetails.tid)
        setData(some)
    }

    useEffect(() => {
        getLevels()

    }, [])

    const moveToLevel = (levelDetails) => {
        console.log("lvl")
        console.log(levelDetails)
        if (levelDetails.isLocked) {
            // open modal saying u can't access .... contact your teacher...!
        }
        else {
            props.navigation.push("Quiz", { subjectDetails, topicDetails, levelDetails })
        }
    }
    const getLockIcon = (isLocked) => {
        if (isLocked)
            return (
                <Image source={require('../assets/lock.png')} style={{ width: 30, height: 30 }} />
            )
        else
            return null
    }

    return (
        <SafeAreaView>

            <ScrollView >
                {data.map((item) => {

                    return (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => { moveToLevel(item) }}
                        >

                            <ListItem
                                title={item.name}
                                bottomDivider
                            />
                        </TouchableOpacity>)
                })}
            </ScrollView>
        </SafeAreaView>
    )

}


CourseScreen.navigationOptions = {
    title: 'Course'
}


export default CourseScreen