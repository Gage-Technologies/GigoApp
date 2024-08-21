import React, {Component, useEffect} from 'react';
import {TouchableOpacity, Text, Linking} from 'react-native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import {toQuery} from './utils'; // Ensure this utility handles encoding URI components correctly

interface LoginGithubProps {
  buttonText?: string;
  children?: React.ReactNode;
  clientId: string;
  onRequest?: () => void;
  onSuccess?: (gh: {code: string}) => void;
  onFailure?: (error: Error) => void;
  redirectUri: string;
  scope?: string;
  disabled?: boolean;
}

class LoginGithub extends Component<LoginGithubProps> {
  // static propTypes = {
  //   buttonText: PropTypes.string,
  //   children: PropTypes.node,
  //   clientId: PropTypes.string.isRequired,
  //   onRequest: PropTypes.func,
  //   onSuccess: PropTypes.func,
  //   onFailure: PropTypes.func,
  //   redirectUri: PropTypes.string.isRequired,
  //   scope: PropTypes.string,
  //   disabled: PropTypes.bool,
  // };

  // static defaultProps = {
  //   buttonText: 'Sign in with GitHub',
  //   scope: 'user:email',
  //   onRequest: () => {},
  //   onSuccess: () => {},
  //   onFailure: () => {},
  // };

  static defaultProps: Partial<LoginGithubProps> = {
    buttonText: 'Sign in with GitHub',
    scope: 'user:email',
    onRequest: () => {},
    onSuccess: () => {},
    onFailure: () => {},
  };

  private linkingSubscription: {remove: () => void} | undefined;

  componentDidMount() {
    console.log("made it to mount")
    // Set up the deep link listener when the component mounts
    this.linkingSubscription = Linking.addEventListener(
      'url',
      this.handleDeepLink,
    );
  }

  componentWillUnmount() {
    console.log("hello in unmount")
    // Clean up the deep link listener when the component unmounts
    if (this.linkingSubscription) {
      this.linkingSubscription.remove();
    }
  }

  // Method to handle the deep link when received
  handleDeepLink = (event: {url: string}) => {
    console.log("in deep link")
    const {url} = event;
    const parsedUrl = new URL(url);
    const code = parsedUrl.searchParams.get('code');
    console.log("code is: ", code)
    if (code) {
      this.props.onSuccess?.({code});
    } else {
      this.props.onFailure?.(
        new Error('No authorization code found in the redirect URL'),
      );
    }
  };

  onBtnClick = async () => {
    console.log('made it here');
    const {clientId, scope, redirectUri} = this.props;
    console.log('1');
    const query = toQuery({
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
      response_type: 'code',
    });
    console.log('2');
    const url = `https://github.com/login/oauth/authorize?${query}`;
    console.log('3');

    console.log('4');
    try {
      console.log('5: ', redirectUri);
      const result = await InAppBrowser.openAuth(url, redirectUri, {
        showTitle: true,
        enableUrlBarHiding: false,
        enableDefaultShare: false,
      });
      console.log('6: ', result);
      if (result.type === 'success' && result.url) {
        console.log('7: ', result.url);
        const code = new URL(result.url).searchParams.get('code');
        if (code) {
          console.log('Authorization code:', code);
          this.props.onSuccess?.({code}); // Pass the code to onSuccess
        } else {
          throw new Error('No authorization code found in the redirect URL');
        }
      } else {
        console.log('8');
        throw new Error('Authentication was cancelled or failed');
      }
    } catch (error) {
      console.log('9: ', error);
      InAppBrowser.closeAuth();

      if (error instanceof Error) {
        this.props.onFailure?.(error); // Safe to pass the error as it is an instance of Error
      } else {
        // If the error is not an instance of Error, you can create a new Error object or handle it differently
        this.props.onFailure?.(new Error('An unexpected error occurred'));
      }
    }
  };

  render() {
    const {buttonText, children} = this.props;
    return (
      <TouchableOpacity
        onPress={this.onBtnClick}
        // disabled={this.props.disabled}
      >
        {children || <Text>{buttonText}</Text>}
      </TouchableOpacity>
    );
  }
}

export default LoginGithub;
