import React, {useState} from 'react';
import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  Button,
  View,
  Text,
  ScrollView,
} from 'react-native';
import MarkdownDisplay from './MarkdownDisplay';

const MarkdownEditor = () => {
  const [text, setText] = useState('');
  const [selection, setSelection] = useState({start: 0, end: 0});

  const insertText = (prefix, suffix = '') => {
    const start = text.slice(0, selection.start);
    const selectedText = text.slice(selection.start, selection.end);
    const end = text.slice(selection.end);
    setText(`${start}${prefix}${selectedText}${suffix}${end}`);
  };

  const handleBold = () => {
    insertText('**', '**');
  };

  const handleItalic = () => {
    insertText('*', '*');
  };

  const handleHeading = () => {
    insertText('# ');
  };
  const handleSubHeading = () => {
    insertText('## ');
  };
  const handleCode = () => {
    insertText('\n``` \n', '\n ```');
  };

  return (
    <View style={styles.container}>
      <View style={styles.editorContainer}>
        <TextInput
          style={styles.editor}
          multiline
          value={text}
          onChangeText={setText}
          onSelectionChange={({nativeEvent: {selection, text}}) => {
            setSelection(selection);
            console.log(selection);
            console.log(text);
          }}
        />
      </View>
      <MarkdownDisplay style={styles.preview}>{text}</MarkdownDisplay>

      <View style={styles.toolbar}>
        <Button title="B" onPress={handleBold} />
        <Button title="I" onPress={handleItalic} />
        <Button title="H1" onPress={handleHeading} />
        <Button title="H2" onPress={handleSubHeading} />
        <Button title="</>" onPress={handleCode} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  editorContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    height: '40%',
  },
  editor: {
    // flex: 1,
  },
  preview: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
});

export default MarkdownEditor;
