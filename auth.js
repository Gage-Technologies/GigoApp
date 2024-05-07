import { decodeToken } from "react-jwt";
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config'
import { Buffer } from "buffer"


const API_URL = Config.API_URL; // Ensure this is the correct path to your API

function createBasicAuthHeader(username, password) {
    // Concatenate the username and password in "username:password" format
    const credentials = `${username}:${password}`;

    // Convert to Base64 encoding
    const base64Credentials = Buffer.from(credentials).toString('base64');

    // Format the header string
    return `Basic ${base64Credentials}`;
}

async function makeRequest(endpoint, method, body=null, username=null, password=null) {
  try {
    let header = {
        'Content-Type': 'application/json'
    }
    if (username !== null) {
        header['Authorization'] = createBasicAuthHeader(username, password)
    }
    let response
    if (body !== null){
        response = await fetch(`${API_URL}${endpoint}`, {
          method: method,
          headers: header,
          body: JSON.stringify(body)
        });
    } else {
        response = await fetch(`${API_URL}${endpoint}`, {
          method: method,
          headers: header
        });
    }
    if (!response.ok){
      console.error('API call returned error status:', response.status);
      throw new Error(`HTTP status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error; // Rethrow after logging or handle accordingly
  }
}

export async function authorize(username, password) {
  let res = await makeRequest("/api/auth/login", "POST", null, username, password);

  await AsyncStorage.clear();

  if (res.message && res.message.includes("Too many failed attempts")) {
    Alert.alert("Too many failed login attempts", "Please try again later.");
    return res.message;
  }

  let decodedToken = decodeToken(res.token);
  if (!decodedToken) {
    return false;
  }


  await AsyncStorage.setItem("user", JSON.stringify(decodedToken.user));
  await AsyncStorage.setItem("alive", "true");
//  await AsyncStorage.setItem("loginXP", JSON.stringify(res.xp));

  return decodedToken;
}

export async function authorizeGithub(password) {
  let res = await makeRequest("/api/auth/confirmLoginWithGithub", "POST", { password });

  let decodedToken = decodeToken(res.token);
  if (!decodedToken) {
    return false;
  }

  await AsyncStorage.setItem("user", JSON.stringify(decodedToken.user));
  await AsyncStorage.setItem("alive", "true");

  return decodedToken;
}

export async function authorizeGoogle(externalToken, password) {
  let res = await makeRequest("/api/auth/loginWithGoogle", "POST", { external_auth: externalToken, password });

  if (res.message === 'User not found') {
    return "User not found";
  }

  let decodedToken = decodeToken(res.token);
  if (!decodedToken) {
    return false;
  }

  await AsyncStorage.setItem("user", JSON.stringify(decodedToken.user));
  await AsyncStorage.setItem("alive", "true");

  return decodedToken;
}

export async function validate2FA(code) {
  if (code.length !== 6 || !/^\d+$/.test(code)) {
    let alive = await AsyncStorage.getItem("alive");
    if (alive === "true")
      Alert.alert("Invalid 2FA Code", "Please enter a valid 2FA code.");
  }

  let res = await makeRequest("/api/otp/validate", "POST", { otp_code: code });

  let decodedToken = decodeToken(res.token);
  if (!decodedToken) {
    return false;
  }

  await AsyncStorage.setItem("user", JSON.stringify(decodedToken.user));
  await AsyncStorage.setItem("ip", decodedToken.ip);
  await AsyncStorage.setItem("expires", decodedToken.exp.toString());
  await AsyncStorage.setItem("init_temp", decodedToken.init_temp.toString());
  await AsyncStorage.setItem("alive", "true");

  return {
    auth: res.auth === true,
    initTemp: false,
    otp: true
  };
}

export async function logout() {
  await makeRequest("/api/auth/logout", "POST", {});
  await AsyncStorage.clear();
}