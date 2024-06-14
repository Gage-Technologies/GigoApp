import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface EditorProps {
  language: string;
  code: string;
  onChange: (newCode: string) => void;
}

const Editor: React.FC<EditorProps> = ({ language, code, onChange }) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    // Load the initial HTML content for the webview
    const initialHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CodeMirror</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/${language}/${language}.min.js"></script>
        <style>
          body { margin: 0; height: 100vh; display: flex; }
          .CodeMirror { flex: 1; }
        </style>
      </head>
      <body>
        <textarea id="code" name="code">${code}</textarea>
        <script>
          const editor = CodeMirror.fromTextArea(document.getElementById('code'), {
            lineNumbers: true,
            mode: '${language}',
          });

          editor.on('change', () => {
            const code = editor.getValue();
            window.ReactNativeWebView.postMessage(code);
          });
        </script>
      </body>
      </html>
    `;
    setHtmlContent(initialHtml);
  }, [language, code]);

  const handleMessage = (event: any) => {
    const newCode = event.nativeEvent.data;
    if (onChange) {
      onChange(newCode);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        javaScriptEnabled
        onMessage={handleMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
  },
});

export default Editor;
