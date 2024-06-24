import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

interface EditorProps {
  language: string;
  code: string;
  onChange: (newCode: string) => void;
}

const Editor: React.FC<EditorProps> = ({language, code, onChange}) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    // Always use the dark theme URL
    const editorThemeUrl =
      'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/dracula.min.css';

    // HTML content that includes CodeMirror setup
    const initialHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CodeMirror</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css">
        <link rel="stylesheet" href="${editorThemeUrl}">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/${language}/${language}.min.js"></script>
        <style>
          body, html { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; background-color: #282a36; }
          .CodeMirror { height: 100%; width: 100%; border: none; box-sizing: border-box; }
        </style>
      </head>
      <body>
        <textarea id="code" name="code"># Example Python code</textarea>
        <script>
          console.log('Loading scripts and styles...');
          const textarea = document.getElementById('code');
          console.log('Textarea element:', textarea);
          const editor = CodeMirror.fromTextArea(textarea, {
            lineNumbers: true,
            mode: '${language}',
            theme: 'dracula' 
          });
          console.log('Editor initialized:', editor);
          editor.on('change', (cm) => {
            const newCode = cm.getValue();
            window.ReactNativeWebView.postMessage(newCode);
          });
        </script>
      </body>
      </html>
    `;
    setHtmlContent(initialHtml);
  }, [language, code]);

  const handleMessage = (event: any) => {
    const newCode = event.nativeEvent.data;
    onChange(newCode);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 0,
      padding: 0,
    },
    webView: {
      flex: 1,
      margin: 0,
      padding: 0,
    },
  });

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{html: htmlContent}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="always"
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
        }}
        onHttpError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.error('HTTP error status code: ', nativeEvent.statusCode);
        }}
        onMessage={handleMessage}
        style={styles.webView}
      />
    </View>
  );
};

export default Editor;
