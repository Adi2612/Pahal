import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, ScrollView, Text, TouchableOpacity, Image } from 'react-native'
import { ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { getAllTopics } from '../utils/firebase'

const CourseScreen = (props) => {

    const subjectDetails = props.navigation.state.params.subjectDetails;
    const [data, setData] = useState([])


    const getTopics = async () => {

        const some = await getAllTopics(subjectDetails.subid)
        console.log("ddddddddd")
        console.log(some)
        setData(some)

    }

    useEffect(() => {
        getTopics()
    }, [])

    const moveToTopics = (topicDetails) => {
        props.navigation.push("Level", { topicDetails, subjectDetails })
    }


    return (
        <SafeAreaView>

            <ScrollView >
                {data.map((item) => {

                    return (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => { moveToTopics(item) }}
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