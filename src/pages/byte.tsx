import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {IconButton, useTheme, TextInput} from 'react-native-paper';
import Editor from '../components/IDE/Editor';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Button} from 'react-native-paper';

interface TopBarProps {
  theme: {
    colors: {
      background: string;
      text: string;
      primary: string;
      secondary: string;
    };
  };
  byteData: {
    name?: string;
  };
  executingCode: boolean;
  executeCode: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  theme,
  byteData,
  executingCode,
  executeCode,
}) => (
  <View style={[styles.topBar, {backgroundColor: theme.colors.background}]}>
    <Text style={[styles.title, {color: theme.colors.text}]}>
      {byteData?.name}
    </Text>
    <View style={styles.fileManagement}>
      <TouchableOpacity onPress={() => setNewFilePopup(true)}>
        <Ionicons name="add" size={20} color={theme.colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setDeleteFileRequest(activeFile)}>
        <Ionicons name="close" size={20} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
    <IconButton
      icon="play"
      iconColor={theme.colors.secondary}
      size={30}
      onPress={executeCode}
      disabled={executingCode}
      style={styles.iconButton}
    />
  </View>
);

const SideBar: React.FC<{theme: any}> = ({theme}) => (
  <View style={[styles.sideBar, {backgroundColor: theme.colors.background}]}>
    <Text style={{ color: theme.colors.text }}>SideBar Content</Text>
    {/* Additional buttons or content can be added here */}
  </View>
);

const Byte: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [byteData, setByteData] = useState<{
    name: string;
    description: string;
  } | null>(null);
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
      setByteData({
        name: 'Example Byte',
        description: 'This is a sample byte.',
      });
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
      <View
        style={[
          styles.container,
          // eslint-disable-next-line react-native/no-inline-styles
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <TopBar
        theme={theme}
        byteData={byteData}
        executingCode={executingCode}
        executeCode={executeCode}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContent}>
          <SideBar theme={theme} />
          <View style={styles.editorSection} ref={editorContainerRef}>
            <Editor
              language="python"
              code={code}
              onChange={handleCodeChange}
              theme={theme.dark ? 'dark' : 'light'}
            />
            {output && <Text style={styles.output}>{output}</Text>}
          </View>
        </View>
        <Modal
          visible={newFilePopup}
          transparent={true}
          onRequestClose={() => setNewFilePopup(false)}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Create New File</Text>
            <TextInput
              style={styles.modalInput}
              label="File Name"
              value={newFileName}
              onChangeText={setNewFileName}
            />
            <Button
              onPress={() => {
                setNewFilePopup(false);
                setActiveFile(newFileName);
                setCode('');
              }}>
              Create
            </Button>
            <Button onPress={() => setNewFilePopup(false)}>Cancel</Button>
          </View>
        </Modal>
        <Modal
          visible={deleteFileRequest !== null}
          transparent={true}
          onRequestClose={() => setDeleteFileRequest(null)}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Delete File</Text>
            <Text>
              Are you sure you want to delete the file {deleteFileRequest}?
            </Text>
            <Button
              onPress={() => {
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
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    height: '6%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
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
    fontSize: 12,
    fontWeight: 'bold',
    position: 'absolute',
    top: 8,
    textAlign: 'center',
    width: '100%',
  },
  fileManagement: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 4,
    left: 16,
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
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 0,
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
  iconButton: {
    position: 'absolute',
    right: 4,
    top: 2,
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
  sideBar: {
    width: 30,
    backgroundColor: '#ccc',
    padding: 10,
  },
});

export default Byte;
