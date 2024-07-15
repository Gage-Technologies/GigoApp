import React, {Component} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import PropTypes from 'prop-types';
import {toQuery} from './utils'; // Ensure this utility handles encoding URI components correctly

class LoginGithub extends Component {
  static propTypes = {
    buttonText: PropTypes.string,
    children: PropTypes.node,
    clientId: PropTypes.string.isRequired,
    onRequest: PropTypes.func,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func,
    redirectUri: PropTypes.string.isRequired,
    scope: PropTypes.string,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    buttonText: 'Sign in with GitHub',
    scope: 'user:email',
    onRequest: () => {},
    onSuccess: () => {},
    onFailure: () => {},
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

    this.props.onRequest();
    console.log('4');
    try {
      console.log('5');
      const result = await InAppBrowser.openAuth(url, redirectUri);
      console.log('6');
      if (result.type === 'success' && result.url) {
        console.log('7: ', result.url);
        this.props.onSuccess(result.url);
      } else {
        console.log('8');
        throw new Error('Authentication was cancelled or failed');
      }
    } catch (error) {
      console.log('9: ', error);
      this.props.onFailure(error);
    }
  };

  render() {
    const {buttonText, children} = this.props;
    return (
      <TouchableOpacity
        onPress={this.onBtnClick}
        disabled={this.props.disabled}>
        {children || <Text>{buttonText}</Text>}
      </TouchableOpacity>
    );
  }
}

export default LoginGithub;
