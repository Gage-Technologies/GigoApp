import React, {Component} from 'react';
import {View, Text, Linking, StyleSheet} from 'react-native';
import HapticTouchableOpacity from '../../Buttons/HapticTouchableOpacity';
import {WebView} from 'react-native-webview';
import {toQuery} from './utils';

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
  containerHeight: number; // Height when expanded
  containerWidth: number; // Width when expanded
  initialHeight: number; // Initial height before expanding
  initialWidth: number; // Initial width before expanding
}

interface LoginGithubState {
  showWebView: boolean;
  url: string;
  isExpanded: boolean;
}

class LoginGithub extends Component<LoginGithubProps, LoginGithubState> {
  static defaultProps: Partial<LoginGithubProps> = {
    buttonText: 'Sign in with GitHub',
    scope: 'user:email',
    onRequest: () => {},
    onSuccess: () => {},
    onFailure: () => {},
  };

  private linkingSubscription: any;

  constructor(props: LoginGithubProps) {
    super(props);
    this.state = {
      showWebView: false,
      url: '',
      isExpanded: false,
    };
  }

  componentDidMount() {
    this.linkingSubscription = Linking.addEventListener(
      'url',
      this.handleDeepLink,
    );
    Linking.getInitialURL().then(url => {
      if (url) {
        this.handleDeepLink({url});
      }
    });
  }

  componentWillUnmount() {
    if (this.linkingSubscription) {
      this.linkingSubscription.remove();
    }
  }

  handleDeepLink = (event: {url: string}) => {
    const {url} = event;
    const getQueryParams = (query: string) => {
      return query
        .substring(1)
        .split('&')
        .reduce((params, pair) => {
          const [key, value] = pair.split('=');
          params[key] = decodeURIComponent(value);
          return params;
        }, {} as Record<string, string>);
    };

    const urlParts = url.split('?');
    if (urlParts.length > 1) {
      const queryParams = getQueryParams(urlParts[1]);
      const code = queryParams.ode;

      if (code) {
        this.setState({showWebView: false, isExpanded: false});
        this.props.onSuccess?.({code});
      } else {
        this.setState({showWebView: false, isExpanded: false});
        this.props.onFailure?.(
          new Error('No authorization code found in the redirect URL'),
        );
      }
    } else {
      this.setState({showWebView: false, isExpanded: false});
      this.props.onFailure?.(
        new Error('No query string found in the redirect URL'),
      );
    }
  };

  onBtnClick = async () => {
    const {clientId, scope, redirectUri} = this.props;
    const query = toQuery({
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
      response_type: 'code',
    });
    const url = `https://github.com/login/oauth/authorize?${query}`;

    this.setState({
      showWebView: true,
      url,
      isExpanded: true, // Expand the view when the button is clicked
    });
  };

  render() {
    const {
      buttonText,
      children,
      initialHeight,
      initialWidth,
      containerHeight,
      containerWidth,
    } = this.props;
    const {showWebView, url, isExpanded} = this.state;

    const containerStyle = isExpanded
      ? [styles.container, {height: containerHeight, width: containerWidth}]
      : [styles.container, {height: initialHeight, width: initialWidth}];

    return (
      <View style={containerStyle}>
        {showWebView ? (
          <WebView
            source={{uri: url}}
            style={styles.webView}
            onNavigationStateChange={this.handleNavigationStateChange}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        ) : (
          <HapticTouchableOpacity onPress={this.onBtnClick} style={styles.button}>
            {children || <Text style={styles.buttonText}>{buttonText}</Text>}
          </HapticTouchableOpacity>
        )}
      </View>
    );
  }

  handleNavigationStateChange = (newNavState: any): boolean => {
    const {url} = newNavState;
    if (url.includes(this.props.redirectUri)) {
      const code = new URL(url).searchParams.get('code');
      if (code) {
        this.setState({showWebView: false, isExpanded: false});
        this.props.onSuccess?.({code});
      } else {
        this.props.onFailure?.(
          new Error('No authorization code found in the redirect URL'),
        );
      }
    }
    return true;
  };
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  webView: {
    flex: 1, // Make the WebView take up the full available space
  },
  button: {
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LoginGithub;
