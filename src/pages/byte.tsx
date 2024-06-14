import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { Button, Tooltip, useTheme, TextInput } from 'react-native-paper';
import Editor from '../components/IDE/Editor';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Byte: React.FC = () => {
  const theme = useTheme();
  const id = '1750582146235367424';
  const [loading, setLoading] = useState(true);
  const [byteData, setByteData] = useState<{ name: string; description: string } | null>(null);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [newFilePopup, setNewFilePopup] = useState(false);
  const [deleteFileRequest, setDeleteFileRequest] = useState<string | null>(null);
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [executingCode, setExecutingCode] = useState(false);
  const editorContainerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setByteData({ name: 'Example Byte', description: 'This is a sample byte.' });
      setActiveFile('example.py');
      setCode('# Example code...');
    }, 1000);
  }, []);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const executeCode = async () => {
    setTerminalVisible(true);
    setOutput('Running...');
    setExecutingCode(true);

    setTimeout(() => {
      setOutput('Code executed successfully');
      setExecutingCode(false);
    }, 2000);
  };

  const handleCloseTerminal = () => {
    setTerminalVisible(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={{ backgroundColor: theme.colors.background }}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{byteData?.name}</Text>
      </View>
      <View style={styles.mainContent}>
        <View style={styles.chatSection}>
          <Text style={[styles.description, { color: theme.colors.text }]}>{byteData?.description}</Text>
        </View>
        <View style={[styles.editorSection, { borderColor: theme.colors.border }]} ref={editorContainerRef}>
          <View style={styles.languageBadge}>
            <Tooltip title="Python">
              <Text style={[styles.languageText, { color: theme.colors.text }]}>Python</Text>
            </Tooltip>
          </View>
          <Editor language="python" code={code} onChange={handleCodeChange} />
          <TouchableOpacity style={[styles.runButton, { backgroundColor: theme.colors.primary }]} onPress={executeCode}>
            <Text style={styles.runButtonText}>Run</Text>
          </TouchableOpacity>
          {output && <Text style={[styles.output, { color: theme.colors.text }]}>{output}</Text>}
        </View>
      </View>
      <Modal visible={newFilePopup} transparent={true} onRequestClose={() => setNewFilePopup(false)}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Create New File</Text>
          <TextInput
            style={styles.modalInput}
            label="File Name"
            value={newFileName}
            onChangeText={setNewFileName}
          />
          <Button onPress={() => {
            setNewFilePopup(false);
            setActiveFile(newFileName);
            setCode('');
          }}>
            Create
          </Button>
          <Button onPress={() => setNewFilePopup(false)}>Cancel</Button>
        </View>
      </Modal>
      <Modal visible={deleteFileRequest !== null} transparent={true} onRequestClose={() => setDeleteFileRequest(null)}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Delete File</Text>
          <Text>Are you sure you want to delete the file {deleteFileRequest}?</Text>
          <Button onPress={() => {
            setDeleteFileRequest(null);
            setCode('');
            setActiveFile(null);
          }}>
            Delete
          </Button>
          <Button onPress={() => setDeleteFileRequest(null)}>Cancel</Button>
        </View>
      </Modal>
      {terminalVisible && (
        <View style={styles.terminal}>
          <Text style={styles.terminalText}>{output}</Text>
          <Button onPress={handleCloseTerminal}>Close</Button>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  mainContent: {
    flexDirection: 'row',
    flex: 1,
  },
  chatSection: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginRight: 10,
  },
  editorSection: {
    flex: 2,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    position: 'relative',
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  languageBadge: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 5,
    zIndex: 3,
  },
  languageText: {
    fontSize: 12,
  },
  runButton: {
    position: 'absolute',
    right: 16,
    bottom: 60,
    padding: 10,
    borderRadius: 5,
  },
  runButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  output: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalView: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    marginBottom: 10,
  },
  terminal: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    marginTop: 10,
  },
  terminalText: {
    color: '#fff',
  },
});

export default Byte;
