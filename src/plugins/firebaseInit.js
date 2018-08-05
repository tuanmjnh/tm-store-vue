import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'
import 'firebase/database'
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAwMnmy7tyvDjIt283Tnp1-u9T7OubwDhs",
  authDomain: "tm-store-4576e.firebaseapp.com",
  databaseURL: "https://tm-store-4576e.firebaseio.com",
  projectId: "tm-store-4576e",
  storageBucket: "tm-store-4576e.appspot.com",
  messagingSenderId: "45492650401"
};
!firebase.apps.length ? firebase.initializeApp(config) : ''
 const settings = {
   timestampsInSnapshots: true
 } // your settings...
export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const FBAuth = firebase.auth()
export const FBStorage = firebase.storage()
export const FBDB = firebase.database()
export const FBStore = firebase.firestore()
export const timestamp = firebase.firestore.FieldValue.serverTimestamp()
FBStore.settings(settings)
// export const FBMessaging = firebase.messaging()
// export const FBFuntions = firebase.functions()
export default firebase
