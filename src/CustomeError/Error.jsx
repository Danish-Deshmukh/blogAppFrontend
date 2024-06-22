import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";


const navigation = useNavigation();

export const pageNotFoundError = () => {
  Alert.alert(
    'Post Not found',
    'Post is not present in the database you need to restart the application to see the changes ',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
      },
    ],
  );
};
export const tockenExpire = () => {
  Alert.alert(
    'Token Expire',
    'You need to login again to preform this operation, Press "OK" to logout ',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          logout();
          navigation.navigate('Login');
        },
      },
    ],
  );
};
