import { StyleSheet, View, Text } from 'react-native';
import { useEffect } from 'react';

const ChatScreen = ({ route, navigation }) => {
  const { name, bgColor } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bgColor,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    ></View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;
