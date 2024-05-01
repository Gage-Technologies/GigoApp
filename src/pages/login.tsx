import React, { useState, useEffect } from 'react';
import { useTheme } from 'react-native-paper';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import loginImage from "../components/img/login_background_cropped.jpg";
import googleLogo from "../components/Icons/login/google_g.png"
import googleName from "../components/Icons/login/google-logo-white.png";
import githubName from "../components/Icons/login/gh_name_light.png";
import { SvgXml } from 'react-native-svg';


const { width, height } = Dimensions.get('window')

const githubLogo = `
<svg width="100%" height="100%" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd"
          d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
          fill="#fff"/>
</svg>
`

const screenWidth = Dimensions.get('window').width;
const imageWidth = screenWidth * 0.10; // 15% of the screen width


const Login = () => {
    const theme = useTheme();
    // Assuming the use of hooks for state management
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [external, setExternal] = React.useState(false)
    const [externalLogin, setExternalLogin] = React.useState("")
    const [externalToken, setExternalToken] = React.useState("")
    const [showPass, setShowPass] = React.useState(false)
    const [ghConfirm, setGhConfirm] = React.useState(false)

    // Dummy functions for demonstration
    const loginFunction = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            console.log('Login successful');
        }, 2000);
    };

    let renderExternal = () => {
        // Define what renderExternal does or returns
        return <Text>External View</Text>;
    };

    let renderLogin = () => {
        return (
            <View style={styles.box}>
                <Text style={styles.header}>Sign In</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setUsername}
                    value={username}
                    placeholder="Username/Email"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Password"
                    secureTextEntry={true}
                />
                <TouchableOpacity
                  onPress={loginFunction}
                  disabled={loading}
                    style={[styles.buttonExtra, loading ? styles.disabledButton : null]}
                    activeOpacity={0.7}
                >
                  <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
                </TouchableOpacity>
                <View style={styles.accountText}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('ForgotPassword')}

                    >
                      <Text style={styles.buttonTextExtra}>Forgot Password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => navigation.navigate('SignUp')}
                    >
                      <Text style={styles.buttonTextExtra}>No Account? Register</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.signInWith}>or sign in with linked account:</Text>
                    <View style={styles.loginContainer}>
                      <TouchableOpacity onPress={() => console.log("hello1")} style={styles.button}>
                        <View style={styles.innerContainer}>
                          <Image
                            style={styles.logo}
                            source={googleLogo}
                          />
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => console.log("hello2")} style={styles.button}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <SvgXml xml={githubLogo} width={imageWidth} height={imageWidth}/>
                        </View>
                      </TouchableOpacity>
                    </View>
            </View>
        );
    }

    return (
        <ImageBackground
            source={loginImage}
            style={[styles.container, { backgroundColor: theme.colors.background.default }]}
        >
            {external ? renderExternal() : renderLogin()}
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    box: {
        backgroundColor: 'black',
        borderRadius: 10,
        width: width * 0.99,  // 99% of screen width
        height: height * 0.45,  // 70% of screen height
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        color: "white"
    },
    input: {
        width: '80%',
        height: 40,
        marginBottom: 12,
        borderWidth: 1,
        padding: 10,
        color: "white",
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderColor: "gray"
    },
    signInWith: {
        marginVertical: 20,
        fontSize: 16,
        color: "white"
    },
    socialLogin: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    socialIcon: {
        width: 50,
        height: 50,
    },
      loginContainer: {
    flexDirection: 'row',  // Align items in a column
    alignItems: 'even',  // Align items in the center horizontally
    justifyContent: 'space-evenly',
    width: screenWidth * .8
      },
  button: {
    padding: 10,
    alignItems: 'center',  // Center content horizontally
    justifyContent: 'center',  // Center content vertically
    marginVertical: 5  // Provides vertical spacing between buttons
  },
      innerContainer: {
    flexDirection: 'row',  // Align images horizontally
    alignItems: 'center'
      },
      logo: {
        width: imageWidth,
        height: imageWidth,  // This assumes the image is square. Adjust as needed.
        resizeMode: 'contain'
      },
        buttonExtra: {
          backgroundColor: '#007BFF', // A default blue color for button background
          padding: 10,
          borderRadius: 20, // Rounded corners
          alignItems: 'center',
          marginBottom: 10, // Space between buttons
        },
        firstButton: {
          paddingBottom: 50, // Extra padding at the bottom for the first button
        },
        buttonText: {
          color: 'white', // Text color for buttons
          fontSize: 16, // Font size for text
        },
        buttonTextExtra: {
        color: '#007BFF',
        fontSize: 16
        },
        disabledButton: {
          backgroundColor: '#CCCCCC', // Grey out the button when it's disabled
        },
        accountText: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: screenWidth * .8
        }
});

export default Login;
