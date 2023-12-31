//react native imports//
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useEffect, useState } from 'react';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';

//firebase imports//
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  DocumentSnapshot,
} from 'firebase/firestore';

//imports our AsyncStorage package//
import AsyncStorage from '@react-native-async-storage/async-storage';

//component imports//
import CustomActions from './CustomActions';

//import statement for our maps which we can send//
import MapView from 'react-native-maps';

//start of component//
const ChatScreen = ({ route, navigation, db, isConnected, storage }) => {
  //params passed from start screen
  const { name, bgColor, userID } = route.params;
  //State
  const [messages, setMessages] = useState([]);
  //styles our chat bubbles//
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
          },
          left: {
            backgroundColor: '#FFF',
          },
        }}
      ></Bubble>
    );
  };

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  let creatingNewMessages;
  useEffect(() => {
    if (isConnected === true) {
      if (creatingNewMessages) creatingNewMessages();
      creatingNewMessages = null;

      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));

      creatingNewMessages = onSnapshot(q, (DocumentSnapshot) => {
        let messagesArr = [];
        DocumentSnapshot.forEach((doc) => {
          //creates a new message object for each new message fetched from the messages db//
          messagesArr.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        //Function to cache new messages//
        cacheNewMessages(messagesArr);
        //sets our new messages state//
        setMessages(messagesArr);
      });
    } else loadCachedMessages();

    return () => {
      //unsubscribes from the connection if nothing is happening//
      if (creatingNewMessages) creatingNewMessages();
    };
  }, [isConnected]);

  //All caching functions below//
  //loadCachedMessages function//
  //This function will fetch our cached messages that we cache with the below function//
  const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem('offline_message' || []);
    setMessages(JSON.parse(cachedMessages));
  };

  //cacheNewMessages function//
  //This function will actually cache messages that we cache from the chat//
  const cacheNewMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem(
        'offline_message',
        JSON.stringify(messagesToCache)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  //custom function to adjust what happens when messages are sent//
  const onSend = (messagesArr) => {
    addDoc(collection(db, 'messages'), messagesArr[0]);
  };

  //All render functions below//
  //renders in our input bar//
  const renderInputToolBar = (props) => {
    if (isConnected === true) {
      return <InputToolbar {...props} containerStyle={styles.chatBar} />;
    }
  };

  //renders in a custom map view if the users message contains location data//
  const renderCustomView = (props) => {
    //destructures the current message//
    const { currentMessage } = props;
    //if message contains a location then...//
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  //render custom actions//
  //props passed to the returned component are able to be used within our + button component/menu//
  const renderCustomActions = (props) => {
    return (
      <CustomActions
        {...props}
        storage={storage}
        containerStyle={styles.customButton}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        textInputStyle={{ height: 70, marginBottom: 10, paddingBottom: 10 }}
        //renders custom bubbles//
        renderBubble={renderBubble}
        //renders the input bar//
        renderInputToolbar={renderInputToolBar}
        //passes the user to our chat//
        user={{
          _id: userID,
          name: name,
        }}
        //renders custom input button +//
        renderActions={renderCustomActions}
        //simply adds the users name to the message that they send//
        renderUsernameOnMessage={true}
        //calls our custom view function for our map//
        renderCustomView={renderCustomView}
        containerStyle={styles.chatContainer}
      />
      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior='height' />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatBar: {
    height: 52,
    paddingBottom: 10,
    paddingRight: 5,
    paddingLeft: 6,
  },
  customButton: {
    marginBottom: 10,
    paddingBottom: 20,
  },
  chatContainer: {
    marginBottom: 60,
  },
});

export default ChatScreen;
