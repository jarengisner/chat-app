//react-native imports//
import { TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';

//Expo imports//
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { StyleSheet } from 'react-native';

//firebase imports//
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

//component//
const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage }) => {
  //initializes our actionsheet//
  //actionsheet is simply the menu which pops up when our custom actions button is clicked//
  const actionSheet = useActionSheet();

  //callback for pressing button below//
  const onActionPress = () => {
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
          default:
        }
      }
    );
  };

  //get location function//
  /*function asks for permission to get location and then if the permission is granted
  it will wait until it has fetched the location to pass to out object which we are passing in onSend*/
  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        });
      } else Alert.alert('Error occurred while fetching location');
    } else Alert.alert("Permissions haven't been granted.");
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onActionPress}>
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

//generates a random string based off an images data//
//Passed to our upload function to ensure images are stored as seperate entities//
const generateReference = (uri) => {
  const timeStamp = new Date().getTime();
  const imageName = uri.split('/')[uri.split('/').length - 1];
  return `${userID}-${timeStamp}-${imageName}`;
};

//function that houses the capability of uploading and sending//
//function is used in both individual functions for picking and taking photos//
const uploadAndSendImage = async (imageURI) => {
  const uniqueRefString = generateReference(imageURI);
  const newUploadRef = ref(storage, uniqueRefString);
  const response = await fetch(imageURI);
  const blob = await response.blob();
  uploadBytes(newUploadRef, blob).then(async (snapshot) => {
    const imageURL = await getDownloadURL(snapshot.ref);
    onSend({ image: imageURL });
  });
};

//function allows picking an image from user library//
//blob converts the image to a binary data string//
const pickImage = async () => {
  let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (permissions?.granted) {
    let result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
    else Alert.alert("Permissions haven't been granted.");
  }
};

//function for taking image//
const takePhoto = async () => {
  let permissions = await ImagePicker.requestCameraPermissionsAsync();
  if (permissions?.granted) {
    let result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
    else Alert.alert("Permissions haven't been granted.");
  }
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 10,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;
