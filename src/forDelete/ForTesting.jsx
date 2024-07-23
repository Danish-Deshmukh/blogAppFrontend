import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MarkdownEditor from './MarkdownEditor';
import {WebView} from 'react-native-webview';
export default function ForTesting() {
  return (
    <View style={styles.container}>
      <MarkdownEditor />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
