import React, {useContext, useState} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';
import {moderateScale} from 'react-native-size-matters';
import Button from '../components/Button';
import {Formik} from 'formik';
import {object, string} from 'yup';

const RegisterScreen = ({navigation}) => {
  const [showPass, setShowPass] = useState(true);

  const {isLoading, register} = useContext(AuthContext);

  let userSchema = object({
    name: string().required('please enter name'),
    username: string().required('Please enter username'),
    email: string()
      .email('Please Enter valid Email')
      .required('please enter email'),
    password: string()
      .required('plase enter password')
      .min(6, 'Password should be atleast 6 charactors'),
  });
  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <View style={styles.wrapper}>
        <Formik
          validationSchema={userSchema}
          style={styles.wrapper}
          initialValues={{name: '', username: '', email: '', password: ''}}
          onSubmit={values => {
            console.log(
              values.name,
              values.username,
              values.email,
              values.password,
            );
            register(
              values.name,
              values.username,
              values.email,
              values.password,
            );

            navigation.goBack();
          }}>
          {({handleChange, handleBlur, handleSubmit, values, errors}) => (
            <View>
              <TextInput
                placeholder="Enter Your name"
                style={styles.input}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              />
              {errors.name && (
                <Text
                  style={{
                    color: 'red',
                    marginBottom: moderateScale(20),
                    marginTop: moderateScale(-10),
                  }}>
                  {errors.name}
                </Text>
              )}

              <TextInput
                placeholder="Enter Your Username"
                style={styles.input}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
              />
              {errors.username && (
                <Text
                  style={{
                    color: 'red',
                    marginBottom: moderateScale(20),
                    marginTop: moderateScale(-10),
                  }}>
                  {errors.username}
                </Text>
              )}

              <TextInput
                placeholder="Enter Your Email"
                style={styles.input}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              {errors.email && (
                <Text
                  style={{
                    color: 'red',
                    marginBottom: moderateScale(20),
                    marginTop: moderateScale(-10),
                  }}>
                  {errors.email}
                </Text>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderWidth: 1,
                  marginBottom: 12,
                  borderColor: '#bbb',
                  borderRadius: 5,
                  paddingHorizontal: 14,
                  paddingRight: 15,
                }}>
                <TextInput
                  style={{
                    width: '80%',
                    maxWidth: '80%',
                  }}
                  placeholder="Enter Password"
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={showPass && true}
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  {showPass ? <Text>Show</Text> : <Text>Hide</Text>}
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text
                  style={{
                    color: 'red',
                    marginBottom: moderateScale(20),
                    marginTop: moderateScale(-10),
                  }}>
                  {errors.password}
                </Text>
              )}

              <Button onPress={handleSubmit} title="Register" />
            </View>
          )}
        </Formik>

        {/* <TextInput
          style={styles.input}
          value={name}
          placeholder="Enter name"
          onChangeText={text => setName(text)}
        />
        <TextInput
          style={styles.input}
          value={username}
          placeholder="Enter username"
          onChangeText={text => setUsername(text)}
        />

        <TextInput
          style={styles.input}
          value={email}
          placeholder="Enter email"
          onChangeText={text => setEmail(text)}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderWidth: 1,
            marginBottom: 12,
            borderColor: '#bbb',
            borderRadius: 5,
            paddingHorizontal: 14,
            paddingRight: 15,
          }}>
          <TextInput
            style={{
              maxWidth: '80%',
            }}
            value={password}
            placeholder="Enter password"
            onChangeText={text => setPassword(text)}
            secureTextEntry={showPass && true}
          />
          <TouchableOpacity
            onPress={() => setShowPass(!showPass)}
            style={
              {
                // borderWidth: 1
              }
            }>
            {showPass ? <Text>Show</Text> : <Text>Hide</Text>}
          </TouchableOpacity>
        </View>

        <Button
          title="Register"
          onPress={() => {
            register(name, username, email, password);
            navigation.goBack();
          }}
        /> */}

        <View style={{flexDirection: 'row', marginTop: 20}}>
          <Text>Already have an accoutn? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    width: '80%',
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
    paddingHorizontal: 14,
  },
  link: {
    color: 'black',
    fontWeight: '700',
    fontSize: moderateScale(13),
  },
});

export default RegisterScreen;
