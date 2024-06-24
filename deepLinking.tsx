import { Linking } from 'react-native';
import { NavigationContainerRef } from '@react-navigation/native';

export const handleDeepLink = (navigationRef: React.RefObject<NavigationContainerRef>) => {
    console.log("within deep link")
    Linking.addEventListener('url', async (event) => {
        const url = event.url;
        if (url === 'gigoApp://auth/github/callback') {
            // Navigate to the SignUp screen
            navigationRef.current?.navigate('SignUp');
            return
        }

        // parse the url manually
        const parsedUrl = new URL(url);
        const path = parsedUrl.hostname; // in our case, 'byte' would be the hostname

        
        if (path === 'byte') {
            // get the byte id from the url
            const byteId = parsedUrl.searchParams.get('id');
            const isJourney = parsedUrl.searchParams.get('isJourney');
            navigationRef.current?.navigate('Byte', { byteId: byteId, isJourney: isJourney });
        }
    });
};
