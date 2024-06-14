import React, { useEffect, useRef, useState, CSSProperties } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialIcons } from 'react-native-vector-icons';

interface MergedOutputRow {
    error: boolean;
    content: string;
    timestamp: number;
}

interface OutputState {
    stdout: OutputRow[];
    stderr: OutputRow[];
    merged: string;
    mergedLines: MergedOutputRow[];
}

const ByteTerminal = (
    { output, onClose, onStop, isRunning, onInputSubmit, fontSize }:
    {
        output: OutputState,
        onClose: () => void,
        onStop: () => void,
        isRunning: boolean,
        onInputSubmit: (input: string) => void,
        fontSize?: string
    }
) => {
    const [terminalContent, setTerminalContent] = useState<JSX.Element[]>([]);
    const inputRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();

    // Determine if the theme mode is light or dark
    const isLightMode = theme.dark === false;
    const isMobile = window.innerWidth < 1000

    // Adjust terminal styles based on the theme mode
    const terminalStyle: CSSProperties = {
        backgroundColor: isLightMode ? "#f4f5f4" : "#232a2f",
        color: isLightMode ? "black" : "white",
        fontFamily: "monospace",
        fontSize: fontSize === undefined ? "0.9rem" : fontSize,
        lineHeight: "1rem",
        padding: "10px",
        marginTop: isMobile ? "0" : "20px",
        borderRadius: "5px",
        whiteSpace: "pre-wrap",
        height: "200px",
        overflowY: 'auto',
        wordWrap: 'break-word',
        position: "relative",
        minWidth: '100%',
    };

    const inputStyle: CSSProperties = {
        minHeight: "20px",
        cursor: "text",
        caretColor: isLightMode ? "black" : "white",
        display: "inline",
        backgroundColor: isLightMode ? "#ddd" : "#222",
        color: isLightMode ? "black" : "white",
        padding: "2px 5px",
        borderRadius: "4px",
    };

    useEffect(() => {
        if (!output) return;
        const formattedOutput = output.mergedLines.flatMap((line, index) => {
            // Split the content by new line characters and render each line separately
            return line.content.split("\n").map((content, lineIndex) => (
                <div key={`line-${index}-${lineIndex}`} style={{ color: line.error ? "red" : theme.colors.text }}>
                    {content}
                </div>
            ));
        });
        setTerminalContent(formattedOutput);
    }, [output, theme.colors.text]);

    const handleInputKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (inputRef.current) {
                const inputValue = inputRef.current.innerText;

                setTerminalContent(prevContent => {
                    const updatedContent = [...prevContent];
                    if (updatedContent.length > 0) {
                        const lastLineIndex = updatedContent.length - 1;
                        updatedContent[lastLineIndex] = (
                            <span key={`line-${lastLineIndex}`} style={{ color: theme.colors.text }}>
                                {updatedContent[lastLineIndex].props.children + inputValue}
                            </span>
                        );
                    }
                    updatedContent.push(
                        <span key={`newline-${Date.now()}`} style={{ color: theme.colors.text }}>
                            {"\n"}
                        </span>
                    );
                    return updatedContent;
                });

                inputRef.current.innerText = "";

                if (onInputSubmit) {
                    onInputSubmit(inputValue);
                }
            }
        }
    };

    useEffect(() => {
        if (inputRef.current && isRunning) {
            inputRef.current.focus();
        }
    }, [isRunning]);

    const inputField = (
        <div
            ref={inputRef}
            contentEditable
            spellCheck={false}
            style={inputStyle}
            onKeyPress={handleInputKeyPress}
        />
    );

    const lastLineRequiresInput = output && output.mergedLines.length > 0 && !output.mergedLines[output.mergedLines.length - 1].content.endsWith("\n");

    return (
        <View style={styles.terminal}>
            <TouchableOpacity onPress={isRunning ? onStop : onClose} style={styles.closeButton}>
                <MaterialIcons name={isRunning ? 'stop' : 'highlight-off'} size={24} color="red" />
            </TouchableOpacity>
            <View style={styles.terminalContent}>
                {terminalContent}
                {isRunning && lastLineRequiresInput ? inputField : null}
            </View>
            {isRunning && !lastLineRequiresInput ? inputField : null}
        </View>
    );
};

const styles = StyleSheet.create({
    terminal: {
        flex: 1,
        backgroundColor: '#232a2f',
        padding: 10,
        borderRadius: 5,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    terminalContent: {
        flex: 1,
        color: 'white',
        fontFamily: 'monospace',
        fontSize: 14,
        lineHeight: 18,
    },
});

export default ByteTerminal;
