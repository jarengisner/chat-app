import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useEffect, useState } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  DocumentSnapshot,
} from 'firebase/firestore';

const ChatScreen = ({ route, navigation, db }) => {
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

  useEffect(() => {
    //defines our query//
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    //defines our snapshot function to fetch new messages in real-time//
    const creatingNewMessages = onSnapshot(q, (DocumentSnapshot) => {
      let messagesArr = [];
      DocumentSnapshot.forEach((document) => {
        //creates a new message object for each new message fetched from the messages db//
        messagesArr.push({
          id: document.id,
          ...document.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()),
        });
      });
      //constantly updates our messages with the new message objects created//
      setMessages(messagesArr);
    });

    return () => {
      //unsubscribes from the connection if nothing is happening//
      if (creatingNewMessages) creatingNewMessages();
    };
  }, []);

  //custom function to adjust what happens when messages are sent//
  const onSend = (messagesArr) => {
    addDoc(collection(db, 'messages'), messagesArr[0]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        textInputStyle={{ height: 50, marginBottom: 10 }}
        renderBubble={renderBubble}
        user={{
          _id: userID,
          name: name,
        }}
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
});

export default ChatScreen;
