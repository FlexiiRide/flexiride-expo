import { Alert } from 'react-native';

export interface ToastProps {
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'info';
}

export const showToast = ({ title, message, type = 'info' }: ToastProps) => {
  Alert.alert(
    title,
    message,
    [{ text: 'OK', style: 'default' }],
    { cancelable: true }
  );
};

export const showSuccessToast = (title: string, message?: string) => {
  showToast({ title, message, type: 'success' });
};

export const showErrorToast = (title: string, message?: string) => {
  showToast({ title, message, type: 'error' });
};