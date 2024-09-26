import {decodeToken} from 'react-jwt';
import {initialAuthStateUpdate, updateAuthState} from '../reducers/auth';
import Config from 'react-native-config';

const API_URL = Config.API_URL;

export const refreshToken = async (dispatch: any) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/updateToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorMessage = '';
      try {
        errorMessage = await response.json();
      } catch (error) {
        errorMessage = response.statusText;
      }
      throw new Error(
        `Failed to refresh token: ${response.status} : ${errorMessage}`,
      );
    }

    const data = await response.json();
    const decodedToken: any = decodeToken(data.token);

    if (!decodedToken) {
      throw new Error('Failed to decode token');
    }

    let authState = Object.assign({}, initialAuthStateUpdate);
    authState.authenticated = true;
    authState.expiration = decodedToken.exp;
    authState.id = decodedToken.user;
    authState.role = decodedToken.user_status;
    authState.email = decodedToken.email;
    authState.phone = decodedToken.phone;
    authState.userName = decodedToken.user_name;
    authState.thumbnail = decodedToken.thumbnail;
    authState.backgroundColor = decodedToken.color_palette;
    authState.backgroundName = decodedToken.name;
    authState.backgroundRenderInFront = decodedToken.render_in_front;
    authState.exclusiveContent = decodedToken.exclusive_account;
    authState.exclusiveAgreement = decodedToken.exclusive_agreement;
    authState.tier = decodedToken.tier;
    authState.inTrial = decodedToken.in_trial;
    authState.alreadyCancelled = decodedToken.already_cancelled;
    authState.hasPaymentInfo = decodedToken.has_payment_info;
    authState.hasSubscription = decodedToken.has_subscription;
    authState.usedFreeTrial = decodedToken.used_free_trial;
    dispatch(updateAuthState(authState));

    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};
