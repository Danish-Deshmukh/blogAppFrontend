import {Alert, Image, StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {Formik} from 'formik';
import {object, string, number, date, InferType} from 'yup';

export default function EditeProfile() {
  let userSchema = object({
    title: string()
      .required('Please Enter Title')
      .min(3, 'Title must be 3 or more charactors'),
    description: string()
      .required('Please Enter Description')
      .min(5, 'description should be 5 or more charactors'),
    content: string()
      .required('Please Enter Content')
      .min(10, 'content should not be less then 10 charactors'),
  });
  return (
    <View>
      <Formik
        validationSchema={userSchema}
        style={styles.wrapper}
        
         
        
        onSubmit={values => {
          post
            ? updatePost(
                setTitle(values.title),
                setDescription(values.description),
                setContent(values.content),
              )
            : setTitle(values.title),
            setDescription(values.description),
            setContent(values.content),
            setTimeout(() => {
              submitPost();
            }, 0);
        }}>
        {({handleChange, handleSubmit, values, errors}) => (
          <View>
            <Text style={styles.titleText}>Title : </Text>
            <TextInput
              style={styles.titleText}
              value={values.title}
              onChangeText={handleChange('title')}
              multiline
              placeholder="Enter title here..."
            />
            {errors.title && (
              <Text
                style={{
                  color: 'red',
                  marginBottom: moderateScale(20),
                  marginTop: moderateScale(-10),
                }}>
                {errors.title}
              </Text>
            )}

            {/* Description */}
            <Text style={styles.descriptionText}>Description : </Text>
            <TextInput
              style={styles.descriptionText}
              value={values.description}
              onChangeText={handleChange('description')}
              // onBlur={handleBlur('title')}
              multiline
              placeholder="Enter description here..."
            />
            {errors.description && (
              <Text
                style={{
                  color: 'red',
                  marginBottom: moderateScale(20),
                  marginTop: moderateScale(-10),
                }}>
                {errors.description}
              </Text>
            )}

            {/* Content */}
            <Text style={styles.contentText}>Content : </Text>
            <TextInput
              style={styles.contentText}
              value={values.content}
              onChangeText={handleChange('content')}
              // onBlur={handleBlur('title')}
              multiline
              placeholder="Enter content here..."
            />
            {errors.content && (
              <Text
                style={{
                  color: 'red',
                  marginBottom: moderateScale(20),
                  marginTop: moderateScale(-10),
                }}>
                {errors.content}
              </Text>
            )}

            {/* SELECT CATEGORY */}
            <View
              style={{
                borderWidth: 1,
                padding: moderateScale(10),
                borderRadius: moderateScale(10),
                height: moderateScale(100),
              }}>
              <FlatList
                horizontal={true}
                data={categories}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => {
                      id = item.id;
                      setCategoryId(id);
                    }}
                    style={{
                      borderWidth: 0.8,
                      borderColor: 'black',
                      paddingVertical: moderateScale(6),
                      paddingHorizontal: moderateScale(15),
                      margin: moderateScale(4),
                      marginTop: moderateScale(9),
                      borderRadius: moderateScale(10),
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor:
                        categoryId === item.id ? 'black' : 'white',
                    }}>
                    <Text
                      style={{
                        fontWeight: '600',
                        color: categoryId === item.id ? 'white' : 'black',
                      }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            <Button onPress={handleSubmit} title={post ? 'Update' : 'Post'} />
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({});
