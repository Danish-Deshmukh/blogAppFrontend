// Importing Libraries
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import * as Yup from 'yup';

// Yup Validation Schema for Sign Up
const signUpSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email is Invalid')
    .required('Email Cannot Be Empty'),
  password: Yup.string()
    .min(10, 'Password Must have a Minimum if ten Characters')
    .required('Password Cannot Be Empty'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please Enter Password Again!'),
});

// React sign up page
export default function EditeProfile() {
  // Declaring state variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});


  // Sign Up Method
  const signUp = async () => {
    try {
      // Awaiting for Yup to validate text
      await signUpSchema.validate(
        {email, password, confirmPassword},
        {abortEarly: false},
      );

      // Reseting Warnings and displaying success message if all goes well
      setErrors({});
      setSuccess(true);
    } catch (error) {
      // Reseting Succes Message
      setSuccess(false);

      // Setting error messages identified by Yup
      if (error instanceof Yup.ValidationError) {
        // Extracting Yup specific validation errors from list of total errors
        const yupErrors = {};
        error.inner.forEach(innerError => {
          yupErrors[innerError.path] = innerError.message;
        });

        // Saving extracted errors
        setErrors(yupErrors);
      }
    }
  };

  // Sign Up Form Rendering
  return (
    <View style={styles.centered}>
      <Text style={styles.textTitle}>Email</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      {errors.email && <Text style={styles.textWarning}>{errors.email}</Text>}

      <Text style={styles.textTitle}>Password</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password && (
        <Text style={styles.textWarning}>{errors.password}</Text>
      )}

      <Text style={styles.textTitle}>Confirm Password</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {errors.confirmPassword && (
        <Text style={styles.textWarning}>{errors.confirmPassword}</Text>
      )}

      <View style={{padding: 10}} />
      <Button title="SIGN UP" onPress={signUp} />
      {success && <Text style={styles.textSuccess}>Success!</Text>}
    </View>
  );
}

// Style Sheet
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  inputBox: {
    borderBottomWidth: 3,
    borderColor: 'grey',
    fontSize: 20,
    color: 'black',
  },
  textNormal: {
    fontSize: 20,
    color: 'black',
  },
  textTitle: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    paddingBottom: 15,
    paddingTop: 15,
  },
  textWarning: {
    fontSize: 20,
    color: 'red',
    paddingBottom: 5,
    paddingTop: 5,
  },
  textSuccess: {
    fontSize: 24,
    color: 'green',
    fontWeight: 'bold',
    paddingBottom: 5,
    paddingTop: 5,
  },
});
