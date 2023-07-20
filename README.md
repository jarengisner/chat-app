# Chat-App

## Summary

The Chat-App will be a fully funtional chat application that will feature smooth UI's, allow users to send messages, images, and more, while also storing conversations for access when offline. The app will allow for users to read messages while offline, but will not allow for the creation of new messages while offline. The app will have access to the device's camera, allowing users to be able to take pictures and send to other users as well.

## Technology

- React-Native
- FireBase (FireStore, Firebase, and Firestore Authentication)
- Gifted Chat (Used for chat functionality)
- Expo

## Development

- FireBase

Google Firebase was used to create a database to house messages sent in the chat.

- Firestore

Google Firestore was used to hold images sent through the chat in a seperate storage.

- Firestore Authentication

Google Firestore anonymous authentication was used as authentication.

- Expo

Expo CLI was used for testing during development, both on a mobile device and a simulated mobile device. To use Expo for your own project, [visit expo here](https://expo.dev/)

## Environment Replication

To replicate the development environment for this app, follow the following steps

- Create a Expo account at the link above
- Globally install Expo CLI
- Download the Expo Mobile application on your mobile device or simulator
- Follow the Expo instructions to set up
- Initialize the project with npx expo start
- scan the project QR code with your phone to link the project to your expo app
