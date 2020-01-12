import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import Global from './global'
import _ from 'lodash'

const firebaseConfig = {
    apiKey: "AIzaSyCGoZIukBV-GA5RpVihbDkWuYRSIckk50M",
    authDomain: "klak-daff3.firebaseapp.com",
    databaseURL: "https://klak-daff3.firebaseio.com",
    projectId: "klak-daff3",
    storageBucket: "klak-daff3.appspot.com",
    messagingSenderId: "1006836816577",
    appId: "1:1006836816577:web:2ad914ddd0ec4cc4059240",
    measurementId: "G-BQHN452NXV"
};

const SUBJECT_PATH = "Subjects"
const TOPICS_PATH = "Topics"
const LEVELS_PATH = "Levels"
const QUIZ_PATH = "Quizzes"
const STUDENT_PATH = "Student"
const PERFORMANCE_PATH = "Performances"

let db = firebase.firestore.Firestore;

export const initFirebase = async (setIsAppLoading) => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig)
    }
    const user = await firebase.auth()
        .signInWithEmailAndPassword('er.adi2612@gmail.com', 'something')
    console.log(user.user.uid)
    db = firebase.firestore();
    /** 
     * Get Students Details
     */
    const userDetails = await getStudentDetails(user.user.uid)
    console.log("shit0")
    console.log(userDetails)
    Global.User = userDetails
    const subjectDetails = []
    userDetails.subjects.map(async (data, i) => {
        const some = await getSubjectDetails(data)
        subjectDetails.push(_.assign({}, some, {}))
        if (i === userDetails.subjects.length - 1) {
            Global.Subjects = _.slice(subjectDetails, 0, subjectDetails.length)
            setIsAppLoading(false)
        }
    })

}



export const getStudentDetails = async (sid) => {

    /**
     * will give :-
     *      student details
     *      list of subjects
     */
    try {
        const studDocument = await db.
            collection(STUDENT_PATH)
            .where("sid", "==", sid)
            .get()
        console.log(studDocument)
        const studObject = studDocument.docs[0].data();
        return studObject
    } catch (e) {
        Promise.reject("error ", e)
    }

}

/**
 *  Subjects/ { subId } / Topics / { tid } / Levels / { lid } / Quizzes / { qid } 
 *  Students/ { sid } / Perfomances / { pid } / Quizzes / { qid } / 
 */

/** 
 * subid : array []
 */
export const getSubjectDetails = async (subid) => {
    /**
     * subject details
     * list of topics id
     */
    try {
        const subjectDocumnet = await db.collection(SUBJECT_PATH)
            .doc(subid)
            .get()
        const subjectObject = subjectDocumnet.data();
        return subjectObject
    } catch (e) {
        Promise.reject("error @ getSubjectDetails", e);
    }


}

export const getAllTopics = async (subid) => {
    /**
     * subject details
     * list of topics id
     */
    try {
        const subjectDocumnet = await db.collection(SUBJECT_PATH)
            .doc(subid)
            .collection(TOPICS_PATH)
            .get()
        let subjectArray = []
        subjectDocumnet.docs.forEach(doc => {
            const messageData = doc.data({
                serverTimestamps: "estimate"
            });
            subjectArray.push({
                name: messageData.name,
                tid: messageData.tid
            });
        });
        return subjectArray
    } catch (e) {
        Promise.reject("error @ getSubjectDetails", e);
    }
}

export const getAllLevels = async (subid, tid) => {
    try {
        const subjectDocumnet = await db.collection(SUBJECT_PATH)
            .doc(subid)
            .collection(TOPICS_PATH)
            .doc(tid)
            .collection(LEVELS_PATH)
            .get()
        let subjectArray = []
        subjectDocumnet.docs.forEach(doc => {
            const messageData = doc.data({
                serverTimestamps: "estimate"
            });
            subjectArray.push({
                name: messageData.name,
                lid: messageData.lid
            });
        });
        return subjectArray
    } catch (e) {
        Promise.reject("error @ getSubjectDetails", e);
    }
}

export const getAllQuizes = async (subid, tid, lid) => {
    /**
     * get quiz details
     */
    try {

        console.log(subid, tid, lid)

        const subjectDocumnet = await db.collection(SUBJECT_PATH)
            .doc(subid)
            .collection(TOPICS_PATH)
            .doc(tid)
            .collection(LEVELS_PATH)
            .doc(lid)
            .collection(QUIZ_PATH)
            .get()
        let subjectArray = []
        subjectDocumnet.docs.forEach(doc => {
            const messageData = doc.data({
                serverTimestamps: "estimate"
            });
            subjectArray.push(_.assign({}, messageData, {}));
        });
        return subjectArray
    } catch (e) {
        Promise.reject("error @ getSubjectDetails", e);
    }
}

export const submitQuiz = async (subid, tid, lid, qid, ans, time) => {
    /**
    *      
    */

    const studDocument = await db.
        collection(STUDENT_PATH)
        .where("sid", "==", Global.User.sid)
        .get()
    console.log(studDocument)
    const sid = studDocument.docs[0].id;

    const perfDoc = await db.collection(STUDENT_PATH)
        .doc(sid)
        .collection(PERFORMANCE_PATH)
        .where("lid", "==", lid)
        .where("subid", "==", subid)
        .where("tid", "==", tid)
        .get()

    if (perfDoc.docs.length === 0) {
        // create new
        const perfDocId = db.collection(STUDENT_PATH)
            .doc(sid)
            .collection(PERFORMANCE_PATH)
            .doc().id
        const perfSet = await db.collection(STUDENT_PATH)
            .doc(sid)
            .collection(PERFORMANCE_PATH)
            .doc(perfDocId)
            .set({
                pid: perfDocId,
                subid: subid,
                lid: lid,
                tid: tid
            })
        const quizId = db.collection(STUDENT_PATH)
            .doc(sid)
            .collection(PERFORMANCE_PATH)
            .doc(perfDocId)
            .collection(QUIZ_PATH)
            .doc().id

        return db.collection(STUDENT_PATH)
            .doc(sid)
            .collection(PERFORMANCE_PATH)
            .doc(perfDocId)
            .collection(QUIZ_PATH)
            .doc(quizId)
            .set({
                qid: qid,
                ans: ans,
                time: time
            })
    }
    else {
        const perfDocObj = perfDoc.docs[0].data()
        const perDocId = perfDocObj.pid
        let quizId = db.collection(STUDENT_PATH)
            .doc(sid)
            .collection(PERFORMANCE_PATH)
            .doc(perDocId)
            .collection(QUIZ_PATH)
            .doc().id

        return db.collection(STUDENT_PATH)
            .doc(sid)
            .collection(PERFORMANCE_PATH)
            .doc(perDocId)
            .collection(QUIZ_PATH)
            .doc(quizId)
            .set({
                qid: qid,
                ans: ans,
                time: time
            })
    }

}

export const getReports = async (subid, tid, lid) => {

    console.log("Aa")
    console.log(subid, tid, lid)

    const studDocument = await db.
        collection(STUDENT_PATH)
        .where("sid", "==", Global.User.sid)
        .get()
    console.log(studDocument)
    const sid = studDocument.docs[0].id;

    const perfDoc = await db.collection(STUDENT_PATH)
        .doc(sid)
        .collection(PERFORMANCE_PATH)
        .where("lid", "==", lid)
        .where("subid", "==", subid)
        .where("tid", "==", tid)
        .get()

    const perfDocObj = perfDoc.docs[0].data()
    const pid = perfDocObj.pid

    const reportDoc = await db.collection(STUDENT_PATH)
        .doc(sid)
        .collection(PERFORMANCE_PATH)
        .doc(pid)
        .collection(QUIZ_PATH)
        .get();

    let reportArray = []
    let computation = {}
    reportDoc.docs.forEach((doc, index) => {
        const reportData = doc.data({
            serverTimestamps: "estimate"
        });
        reportArray.push(_.assign({}, reportData, {}));
    });
    return reportArray;

    /**
    *   based on list of qid :- get responses from studentsDetails
    */
}

/**
 * get analysis
 * 
 */

const doComputation = (reportArray) => {
    const correct = _.pick(reportArray, { ans: 'RA' })
    console.log("aaaaaaaaaaaa")
    console.log(correct)
    const incorrect = _.pick(reportArray, { ans: 'WA' })
    const incomplete = _.pick(reportArray, { ans: 'NA' })

    return { correct, incorrect, incomplete }
}