

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  YellowBox
} from 'react-native';
import { createAppContainer } from "react-navigation"
import { createStackNavigator } from "react-navigation-stack";
import { initFirebase } from './src/utils/firebase'

import Main from './src/Main'
import LevelsScreen from './src/CourseScreen'
import QuizScreen from './src/QuizScreen'
import TopicsScreen from './src/CourseScreen/topicsScreen'
import Modal from './src/QuizScreen/modal'

import Report from './src/Report'


const App = () => {

  const [isAppLoading, setIsAppLoading] = useState(true);
  const [routeName, setRouteName] = useState('Main')
  const AppContainer = createAppContainerWithRoute(routeName)
  const [subjectDetails, setSubjectDetails] = useState([])
  useEffect(() => {
    initFirebase(setIsAppLoading, setSubjectDetails)
    YellowBox.ignoreWarnings(['Setting a timer']);
    console.ignoredYellowBox = ['Setting a timer'];

  }, [])

  return (
    <View style={{ flex: 1 }}>
      {isAppLoading === false && <AppContainer />}
    </View>
  )

}


function createAppContainerWithRoute(initialRouteName) {
  return createAppContainer(
    createStackNavigator(
      {
        Main: {
          screen: Main
        },
        Level: {
          screen: LevelsScreen
        },
        Quiz: {
          screen: QuizScreen
        },
        Topics: {
          screen: TopicsScreen
        },
        Next: {
          screen: Modal
        },
        Report: {
          screen: Report
        }
      },
      {
        initialRouteName,
        defaultNavigationOptions: {
          headerTintColor: "black",
          headerStyle: { backgroundColor: "white", borderBottomColor: 'black', borderBottomWidth: 0, },
          headerTitleStyle: {
            fontSize: 24
          }


        }
      }
    )
  )
}


export default App
