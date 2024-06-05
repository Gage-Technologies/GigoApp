import { Linking } from 'react-native';
import { NavigationContainerRef } from '@react-navigation/native';

export const handleDeepLink = (navigationRef: React.RefObject<NavigationContainerRef>) => {
    console.log("within deep link")
    Linking.addEventListener('url', async (event) => {
        const url = event.url;
        if (url === 'gigoApp://auth/github/callback') {
            // Navigate to the SignUp screen
            navigationRef.current?.navigate('SignUp');
        }
    });
};
