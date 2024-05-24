import call from "./api-call";
import { Alert } from 'react-native';
import Config from 'react-native-config';
import {decodeToken} from "react-jwt";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Config.API_URL;

export async function authorize(username, password) {
  try {
    const response = await fetch(API_URL + '/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });


    if (!response.ok) {
      throw new Error('Failed to login'); // or handle specific error codes here
    }

    const data = await response.json();

    if (data.message && data.message.includes("Too many failed attempts")) {
      Alert.alert("Too many failed login attempts", "Please try again later.");
      return data.message;
    }

    if (data.message && data.message.includes("attempts left")) {
      Alert.alert("Too many failed login attempts", "Please try again later.");
      return data.message;
    }

    let decodedToken = decodeToken(data.token);
    if (decodedToken === null) {
      return false;
    }

    // Save user data to session storage
    AsyncStorage.setItem("user", decodedToken["user"])
    AsyncStorage.setItem("alive", "true")
//    window.sessionStorage.setItem("loginXP", JSON.stringify(data.xp));

    return decodedToken;
  } catch (error) {
    Alert.alert("Login Error", "Failed to authenticate.");
    console.error('Error authorizing:', error);
    throw error;
  }
}

export async function authorizeGithub(password) {
  try {
    const response = await fetch(API_URL + '/api/auth/confirmLoginWithGithub', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with Github'); // or handle specific error codes here
    }

    const data = await response.json();

    let decodedToken = decodeToken(data.token);
    if (decodedToken === null) {
      return false;
    }

    // Save user data to session storage
    AsyncStorage.setItem("user", decodedToken["user"])
    AsyncStorage.setItem("alive", "true")

    return decodedToken;
  } catch (error) {
    Alert.alert("Error", "Failed to authenticate with Github.");
    console.error('Error authorizing with Github:', error);
    throw error;
  }
}

export async function authorizeGoogle(externalToken, password) {
  try {
    const response = await fetch(API_URL + "/api/auth/loginWithGoogleApp", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        external_auth: externalToken,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with Google'); // or handle specific error codes here
    }

    const data = await response.json();

    if (data.message === 'User not found') {
      return "User not found";
    }

    let decodedToken = decodeToken(data.token);
    if (decodedToken === null) {
      return false;
    }

    AsyncStorage.setItem("user", decodedToken["user"])
    AsyncStorage.setItem("alive", "true")

    return decodedToken;
  } catch (error) {
    Alert.alert("Error", "Failed to authenticate with Google.");
    console.error('Error authorizing with Google:', error);
    throw error;
  }
}

export async function validate2FA(code) {
  try {
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      if (sessionStorage.getItem("alive") === "true") {
        Alert.alert("Invalid 2FA Code", "Please enter a valid 2FA code.");
      }
    }

    const response = await fetch(API_URL + "/api/otp/validate", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otp_code: code,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to validate 2FA'); // or handle specific error codes here
    }

    const data = await response.json();

    let decodedToken = decodeToken(data.token);
    if (decodedToken === null) {
      return false;
    }

    AsyncStorage.setItem("user", decodedToken["user"])
    AsyncStorage.setItem("alive", "true")
    AsyncStorage.setItem("ip", decodedToken["ip"])
    AsyncStorage.setItem("expires", decodedToken["exp"])
    AsyncStorage.setItem("init_temp", decodedToken["init_temp"])

    return {
      auth: !(data === undefined || data["auth"] !== true),
      initTemp: false,
      otp: true,
    };
  } catch (error) {
    Alert.alert("Error", "Failed to validate 2FA.");
    console.error('Error validating 2FA:', error);
    throw error;
  }
}

export async function logout() {
  try {
    const response = await fetch(API_URL + "/api/auth/logout", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to logout'); // or handle specific error codes here
    }

    window.sessionStorage.clear();
  } catch (error) {
    Alert.alert("Error", "Failed to logout.");
    console.error('Error logging out:', error);
    throw error;
  }
}
