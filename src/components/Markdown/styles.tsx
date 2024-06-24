import { StyleSheet } from "react-native";
import { MD3Theme } from "react-native-paper";

// styles for the converted elements
export default function getStyles(theme: MD3Theme, textColor: string | undefined) {
  return StyleSheet.create({
    markdownBody: {
      flexShrink: 1,
      borderRadius: 10,
      padding: 0,
      width: '100%',
      backgroundColor: "transparent",
      color: textColor ?? theme.colors.background,
      fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji",
      fontSize: 16,
      lineHeight: 20,
    },
    paragraph: {
      marginBottom: 1,
      color: textColor ?? theme.colors.background,
      lineHeight: 24,
      fontSize: 18,
    },
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      marginVertical: 1,
      color: textColor ?? theme.colors.background,
      paddingBottom: 1,
    },
    h2: {
      fontSize: 28,
      fontWeight: 'bold',
      marginVertical: 1,
      color: textColor ?? theme.colors.background,
      paddingBottom: 1,
    },
    h3: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 1,
      color: textColor ?? theme.colors.background,
    },
    h4: {
      fontSize: 22,
      fontWeight: 'bold',
      marginVertical: 1,
      color: textColor ?? theme.colors.background,
    },
    h5: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 1,
      color: textColor ?? theme.colors.background,
    },
    h6: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 1,
      color: textColor ?? theme.colors.onSurfaceVariant,
    },
    span: {
      color: textColor ?? theme.colors.background,
    },
    link: {
      color: textColor ?? theme.colors.onPrimary,
      textDecorationLine: 'underline',
    },
    bold: {
      fontWeight: 'bold',
    },
    italic: {
      fontStyle: 'italic',
    },
    list: {
      marginVertical: 1,
      paddingLeft: 4,
      flexGrow: 0,
      flexShrink: 0,
    },
    listItem: {
      flexDirection: 'row',
      marginBottom: 1,
    },
    listItemBullet: {
      marginRight: 4,
      color: textColor ?? theme.colors.background,
    },
    listItemText: {
      color: textColor ?? theme.colors.background,
      fontSize: 18,
      lineHeight: 22,
    },
    codeBlock: {
      position: 'relative',
      marginRight: 6,
      paddingTop: 1,
      backgroundColor: theme.colors.background,
      borderRadius: 4,
      padding: 2,
    },
    languageLabel: {
      fontSize: 11,
      position: 'absolute',
      top: 3,
      left: 8,
      zIndex: 1,
      color: textColor ?? theme.colors.background,
    },
    codeActions: {
      position: 'absolute',
      top: 0,
      right: -14,
      zIndex: 1,
      flexDirection: 'row',
    },
    iconButton: {
      padding: 4,
    },
    inlineCode: {
      fontFamily: 'monospace',
      backgroundColor: `${theme.colors.background}26`, // 26 in hex represents 15% opacity
      padding: 2,
      borderRadius: 4,
      color: textColor ?? theme.colors.onPrimary,
      fontSize: 14,
      position: 'relative',
      top: 4,
    },
    blockquote: {
      margin: 0,
      paddingLeft: 4,
      color: textColor ?? theme.colors.background,
      borderLeftWidth: 1,
      borderLeftColor: theme.colors.outline,
    },
    table: {
      borderRadius: 10,
      width: '100%',
    },
    tableCell: {
      padding: 2,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    tableRow: {
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.outline,
    },
    tableRowEven: {
      backgroundColor: theme.colors.surfaceVariant,
    },
  });
}
