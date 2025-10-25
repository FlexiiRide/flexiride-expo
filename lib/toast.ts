import { Alert } from 'react-native';

export const showSuccessToast = (title: string, message: string) => {
  Alert.alert(title, message);
};

export const showErrorToast = (title: string, message: string) => {
  Alert.alert(title, message);
};