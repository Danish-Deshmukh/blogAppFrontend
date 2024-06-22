import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { moderateScale } from 'react-native-size-matters'

const Button = ({title, onPress}) => {
  return (
    <TouchableOpacity
    onPress={() => {onPress()}}
    style={{
        borderWidth: 1,
        padding: moderateScale(5),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        borderRadius: moderateScale(4),
        marginVertical: moderateScale(20)
    }}>
      <Text style={{
        color : 'white',
        fontWeight: '700',
        fontSize: moderateScale(18)
      }}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({})