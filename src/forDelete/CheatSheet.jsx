import * as React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Menu, Divider, Provider, IconButton } from 'react-native-paper';

const CommentsList = () => {
  const [menuVisible, setMenuVisible] = React.useState({});

  const comments = [
    { id: '1', name: 'Danish', comment: 'Superficial engagement and Skinner box monetization will be displaced by models that will generate and reward community and emergence. New infrastructure will allow studios to deliver rock solid multiplayer experiences without a AAA budget.' },
    { id: '2', name: 'Danish', comment: 'Wonderfull' },
    { id: '3', name: 'test', comment: 'Good post' },
    { id: '4', name: 'test', comment: 'WonderFull post' }
  ];

  const openMenu = (id) => {
    setMenuVisible((prev) => ({ ...prev, [id]: true }));
  };

  const closeMenu = (id) => {
    setMenuVisible((prev) => ({ ...prev, [id]: false }));
  };

  const handleDelete = (id) => {
    // Add your delete functionality here
    console.log(`Deleted comment: ${id}`);
    closeMenu(id);
  };

  return (
    <Provider>
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.commentAuthor}>{item.name}</Text>
              <Text style={styles.commentBody}>{item.comment}</Text>
            </View>
            <Menu
              visible={menuVisible[item.id] || false}
              onDismiss={() => closeMenu(item.id)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={() => openMenu(item.id)}
                />
              }
            >
              <Menu.Item onPress={() => handleDelete(item.id)} title="Delete" />
              
            </Menu>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </Provider>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentBody: {
    fontSize: 12,
    color: 'gray',
  },
});

export default CommentsList;
