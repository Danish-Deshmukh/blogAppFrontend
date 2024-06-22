import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Button, Menu, Divider} from 'react-native-paper';
import {moderateScale} from 'react-native-size-matters';

import FeatherIcons from 'react-native-vector-icons/Feather';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
export default function EditeProfile() {
  const [visible, setVisible] = React.useState(false);
  const navigation = useNavigation();
  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  return (
    <>
      <View style={styles.headerContainer}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // borderWidth: 1,
            width: moderateScale(90),
            justifyContent: 'space-between',
          }}>
          <FeatherIcons
            name={'arrow-left'}
            size={moderateScale(22)}
            color="black"
          />
          <Text
            style={{
              fontWeight: '600',
              fontSize: moderateScale(20),
              color: 'black',
            }}>
            Back
          </Text>
        </Pressable>

        {/* UPDATE AND DELETE USER */}

        <View>
          {/* <TouchableOpacity
            style={{
              color: 'red',
              // borderWidth: 0.5,
              borderRadius: 5,
              padding: moderateScale(5),
              backgroundColor: 'red',
              marginHorizontal: moderateScale(2),
            }}>
            <Text style={{color: 'white', fontWeight: '600'}}>DELETE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              color: 'red',
              // borderWidth: 0.5,
              borderRadius: 5,
              padding: moderateScale(5),
              backgroundColor: 'black',
              marginHorizontal: moderateScale(2),
            }}>
            <Text style={{color: 'white', fontWeight: '600'}}>UPDATE</Text>
          </TouchableOpacity> */}

          <View>
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <Button
                  onPress={openMenu}
                  style={{
                    backgroundColor: 'white',
                    // padding: moderateScale(5),
                  }}>
                  <FeatherIcons
                    name={'more-vertical'}
                    size={moderateScale(20)}
                    color="black"
                  />
                </Button>
              }>
              <Menu.Item onPress={() => {}} title="UPDATE" />
              <Divider />
              <Menu.Item onPress={() => {}} title="DEELTE" />
            </Menu>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    // backgroundColor: 'gray',
    height: moderateScale(50),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(10),
    borderBottomWidth: 0.2,
  },
});
