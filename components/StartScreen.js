import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import background from '../assets/background.png';
import { getAuth, signInAnonymously } from 'firebase/auth';

const StartScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [bgColor, setBgColor] = useState('');
  const image = background;
  const colorHandler = (color) => {
    setBgColor(color);
  };
  //anonymous authorization//
  const auth = getAuth();

  //sign in function//
  const signInUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate('ChatScreen', {
          userID: result.user.uid,
          name: name,
          bgColor: bgColor,
        });
        Alert.alert('Signed in Successfully!');
      })
      .catch((error) => {
        Alert.alert('Unable to sign in, try later again.');
      });
  };

  return (
    <ImageBackground source={image} style={styles.image} resizeMode='cover'>
      <Text style={styles.title}>Chat App</Text>
      <View style={styles.container}>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.textInput}
          placeholder='Please enter Username'
          placeholderTextColor='#757083'
        />
        <Text>Choose your background color:</Text>
        <View style={styles.colorContainer}>
          <TouchableOpacity
            style={[styles.colorChooser, styles.color1]}
            onPress={() => colorHandler('#090C08')}
          ></TouchableOpacity>
          <TouchableOpacity
            style={[styles.colorChooser, styles.color2]}
            onPress={() => colorHandler('#474056')}
          ></TouchableOpacity>
          <TouchableOpacity
            style={[styles.colorChooser, styles.color3]}
            onPress={() => colorHandler('#8A95A5')}
          ></TouchableOpacity>
          <TouchableOpacity
            style={[styles.colorChooser, styles.color4]}
            onPress={() => colorHandler('#B9C6AE')}
          ></TouchableOpacity>
        </View>
        <TouchableOpacity
          title='Open Chat'
          onPress={
            /* () =>
             navigation.navigate('ChatScreen', { name: name, bgColor: bgColor })  */
            signInUser
          }
          style={styles.chatButton}
        >
          <Text style={styles.startChatting}>Start Chatting</Text>
        </TouchableOpacity>
      </View>
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView behavior='padding' />
      ) : null}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 20,
    height: '44%',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    marginBottom: 50,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 0.5,
    fontSize: 45,
    color: '#fff',
    width: '100%',
    textAlign: 'center',
    fontWeight: '700',
  },
  textInput: {
    width: '88%',
    padding: 15,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 25,
    backgroundColor: '#fff',
    fontSize: 16,
    opacity: 50,
    borderRadius: 5,
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
  },
  colorChooser: {
    borderRadius: 35,
    margin: 10,
    width: 70,
    height: 70,
  },
  color1: {
    backgroundColor: '#090C08',
  },
  color2: {
    backgroundColor: '#474056',
  },
  color3: {
    backgroundColor: '#8A95A5',
  },
  color4: {
    backgroundColor: '#B9C6AE',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  chatButton: {
    width: '80%',
    height: 65,
    backgroundColor: '#757083',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startChatting: {
    color: '#fff',
    fontSize: 16,
  },
});

export default StartScreen;
