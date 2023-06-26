import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
//components
import StartScreen from './components/StartScreen';
import ChatScreen from './components/ChatScreen';
// import navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//creates the navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Screen1'>
        <Stack.Screen name='Start' component={StartScreen} />
        <Stack.Screen name='ChatScreen' component={ChatScreen} />
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
