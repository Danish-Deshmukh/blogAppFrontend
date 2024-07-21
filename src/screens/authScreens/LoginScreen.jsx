import React, {useContext, useState} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {moderateScale} from 'react-native-size-matters';
import {Formik} from 'formik';
import {object, string, number, date, InferType} from 'yup';
import {ActivityIndicator} from 'react-native-paper';
import Button from '../../components/Button';
import { AuthContext } from '../../context/AuthContext';

const LoginScreen = ({navigation}) => {
  const {isLoading, login, userInfo} = useContext(AuthContext);
  const [showPass, setShowPass] = useState(true);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  let userSchema = object({
    usernameOrEmail: string().required('Please Enter UserName or Email'),
    password: string().required('Please Enter Password'),
  });

  return (
    <View style={styles.container}>
      {loading && (
        <View
          style={{
            flex: 1,
            position: 'absolute',
            zIndex: 1,
            // borderWidth: 1,
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator
            style={{
              alignSelf: 'center',
            }}
            color="black"
            size={'large'}
          />
        </View>
      )}
      <View style={styles.wrapper}>
        <Formik
          validationSchema={userSchema}
          style={styles.wrapper}
          initialValues={{usernameOrEmail: '', password: ''}}
          onSubmit={values => {
            setErr(false);
            setLoading(true);
            login(values.usernameOrEmail, values.password);
            setTimeout(() => {
              setErr(true);
              setLoading(false);
            }, 9000);
          }}>
          {({handleChange, handleBlur, handleSubmit, values, errors}) => (
            <View>
              <TextInput
                placeholder="Enter Username or Email here..."
                style={styles.input}
                onChangeText={handleChange('usernameOrEmail')}
                onBlur={handleBlur('usernameOrEmail')}
                value={values.usernameOrEmail}
              />
              {errors.usernameOrEmail && (
                <Text
                  style={{
                    color: 'red',
                    marginBottom: moderateScale(20),
                    marginTop: moderateScale(-10),
                  }}>
                  {errors.usernameOrEmail}
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
                    // borderWidth: 1,
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

              {err && (
                <Text
                  style={{
                    color: 'red',
                  }}>
                  Email or Password is wrong
                </Text>
              )}

              <Button onPress={handleSubmit} title="Login" />
              
            </View>
          )}
        </Formik>

        {/* <View
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
            placeholder="Enter Password"
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
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
        </View> */}

        {/* <Button
          borderWidth="1"
          color={''}
          borderColor={'black'}
          title="Login"
          onPress={() => {
            login(usernameOrEmail, password);
          }}
        /> */}

        <View style={{flexDirection: 'row', marginTop: 20}}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Register</Text>
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

export default LoginScreen;
