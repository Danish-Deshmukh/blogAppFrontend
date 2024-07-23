import {
  Alert,
  Animated,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import FeatherIcons from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
const AddContent = () => {
  const navigation = useNavigation();
  const scrollConst = verticalScale(50);
  const scrollY = new Animated.Value(0);
  const diffclamp = Animated.diffClamp(scrollY, 0, scrollConst);
  const translateY = diffclamp.interpolate({
    inputRange: [0, scrollConst],
    outputRange: [0, -scrollConst],
  });

  const [errors, setErrors] = useState({});
  const [content, setContent] = useState('');
  const [selection, setSelection] = useState({start: 0, end: 0});
  const insertText = (prefix, suffix = '') => {
    const start = content.slice(0, selection.start);
    const selectedText = content.slice(selection.start, selection.end);
    const end = content.slice(selection.end);
    setContent(`${start}${prefix}${selectedText}${suffix}${end}`);
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
  const handleList = () => {
    insertText('\n-  \n-  \n-  ');
  };
  const handleLink = () => {
    insertText('\n-  \n-  \n-  ');
  };
  const handleSubHeading = () => {
    insertText('## ');
  };
  const handleCode = () => {
    insertText('\n``` \n', '\n \n```\n');
  };
  let userSchema = Yup.object().shape({
    content: Yup.string()
      .required('Please Enter Content')
      .min(10, 'content should not be less then 10 charactors'),
  });
  const nextPage = () => {};
  return (
    <>
      <Animated.View
        style={{
          transform: [{translateY: translateY}],
          height: verticalScale(50),
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          zIndex: 1,
          // borderWidth: 1,
        }}>
        {/* Header */}
        <View
          style={{
            borderBottomWidth: 0.2,
            flexDirection: 'row',
            elevation: 1,
            height: verticalScale(50),
            width: '100%',
            paddingLeft: moderateScale(8),
            backgroundColor: 'white',
          }}>
          <View style={styles.headTitleContainer}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}
              style={{
                // borderWidth: 1,
                alignSelf: 'flex-start',
                flexDirection: 'row',
                columnGap: moderateScale(10),
                alignItems: 'center',
              }}>
              <FeatherIcons
                name={'arrow-left'}
                size={moderateScale(22)}
                color="black"
              />
              <Text style={styles.headTitleText}>Back</Text>
            </Pressable>
          </View>

          {/* Template Button and Post or Update button */}

          <View
            style={{
              // borderWidth: 1,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingRight: moderateScale(8),
            }}>
            {/* Template Button */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('TemplateForMarkdown');
              }}
              style={{
                // borderWidth: 1,
                borderRadius: moderateScale(5),
                paddingVertical: moderateScale(4),
                paddingHorizontal: moderateScale(8),
                backgroundColor: 'lightgreen',
              }}>
              <Text
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                Template
              </Text>
            </TouchableOpacity>

            {/* Add content button */}
            <TouchableOpacity
              onPress={nextPage}
              style={{
                // borderWidth: 1,
                borderRadius: moderateScale(5),
                paddingVertical: moderateScale(4),
                paddingHorizontal: moderateScale(8),
                backgroundColor: 'black',
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>Preview</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
      <View
        style={{
          flex: 1,
          padding: moderateScale(10),
          //   minHeight: moderateScale(500),
        }}>
        <ScrollView
          showsVerticalScrollIndicator={true}
          onScroll={e => {
            scrollY.setValue(e.nativeEvent.contentOffset.y);
          }}>
          {/* Below View is for adjusting with the heading height when scrolling  */}
          <View style={{height: moderateScale(50)}} />
          <View style={styles.CommonClearContainer}>
            {/* <Text style={styles.contentText}>Content : </Text> */}
            {/* Clear button */}
          </View>
          <TextInput
            style={styles.contentText}
            value={content}
            onChangeText={setContent}
            onSelectionChange={({nativeEvent: {selection, text}}) => {
              setSelection(selection);
              console.log(selection);
              console.log(text);
            }}
            // onBlur={handleBlur('title')}
            multiline
            placeholder="Enter content here..."
          />
          {errors.content && (
            <Text style={styles.errorText}>{errors.content}</Text>
          )}
          {/* Below View is for adjusting with the heading height when scrolling  */}
          <View style={{height: moderateScale(30)}} />
        </ScrollView>
      </View>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={handleHeading} style={styles.toolbarButton}>
          <Text style={{color: 'black', fontSize: moderateScale(18)}}>H1</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubHeading}
          style={styles.toolbarButton}>
          <Text style={{color: 'black'}}>H2</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleBold} style={styles.toolbarButton}>
          <FeatherIcons name={'bold'} size={moderateScale(22)} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleItalic} style={styles.toolbarButton}>
          <FeatherIcons
            name={'italic'}
            size={moderateScale(22)}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleList} style={styles.toolbarButton}>
          <FeatherIcons name={'list'} size={moderateScale(22)} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLink} style={styles.toolbarButton}>
          <FeatherIcons name={'link'} size={moderateScale(20)} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCode} style={styles.toolbarButton}>
          <FeatherIcons name={'code'} size={moderateScale(22)} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCode} style={styles.toolbarButton}>
          <FeatherIcons name={'image'} size={moderateScale(22)} color="black" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default AddContent;

const styles = StyleSheet.create({
  headTitleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headTitleText: {
    fontWeight: '600',
    fontSize: moderateScale(20),
    color: 'black',
  },
  errorText: {
    color: 'red',
    marginBottom: moderateScale(20),
    marginTop: moderateScale(-10),
  },
  titleText: {
    // borderWidth: 0.5,
    fontSize: moderateScale(20),
    fontWeight: '700',
  },
  descriptionText: {
    fontSize: moderateScale(15),
    fontWeight: '500',
  },
  contentText: {
    fontSize: moderateScale(15),
  },

  tabsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    padding: moderateScale(10),
    backgroundColor: 'white',
    elevation: 1,
  },
  tab: {
    flex: 1,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabText: {
    fontFamily: 'InterBold',
    fontWeight: 'bold',
  },
  commontSmallText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  commontMediumText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  commontLargeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  CommonClearContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  CommonClearButton: {
    borderWidth: 1,
    padding: moderateScale(3),
    borderRadius: moderateScale(3),
  },
  toolbar: {
    // borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    height: moderateScale(30),
  },
  toolbarButton: {
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
  },
});
