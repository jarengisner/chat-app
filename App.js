import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View } from 'react-native';
//components
import StartScreen from './components/StartScreen';
import ChatScreen from './components/ChatScreen';
// import navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  enableNetwork,
  disableNetwork,
} from 'firebase/firestore';
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';

// app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCitnuS0IlCgzCwppHVWZeU2NGWffXRZyY',
  authDomain: 'chat-app-60526.firebaseapp.com',
  projectId: 'chat-app-60526',
  storageBucket: 'chat-app-60526.appspot.com',
  messagingSenderId: '850486310116',
  appId: '1:850486310116:web:c4a3580e9171d3a5cea8f1',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//initializes our db//
const db = getFirestore(app);

//creates the navigator
const Stack = createNativeStackNavigator();

//creates connection status variable
const connect = useNetInfo();

//useEffect disabling the app from attempting to connect to db if user does not have internet//
useEffect(() => {
  if (connect.isConnected === false) {
    Alert.alert('Internet Connection Lost');
    disableNetwork(db);
  } else if (connect.isConnected === true) {
    enableNetwork();
  }
}, [connect.isConnected]);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Screen1'>
        <Stack.Screen name='Start' component={StartScreen} />
        <Stack.Screen name='ChatScreen'>
          {(props) => (
            <ChatScreen isConnected={connect.isConnected} db={db} {...props} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
