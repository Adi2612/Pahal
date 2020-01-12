import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import { ListItem } from 'react-native-elements'
import Global from './utils/global'
import Modal from './QuizScreen/modal'

// const data = [
//     { name: 'English', id: 0 },

//     { name: 'Maths', id: 1 },

//     { name: 'Social Science', id: 2 },

//     { name: 'Science', id: 3 },

//     { name: 'Hindi', id: 4 }
// ]


const Main = (props) => {

    const moveToSubject = (subjectDetails) => {
        // move to course
        props.navigation.push("Topics", { "subjectDetails": subjectDetails })

    }

    const [data, setData] = useState([]);

    useEffect(() => {
        setData(Global.Subjects)
    }, [])

    return (
        <SafeAreaView>

            <ScrollView >
                {data.map((item) => {

                    return (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => { moveToSubject(item) }}
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

Main.navigationOptions = {
    title: 'Subjects'
}

export default Main