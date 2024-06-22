import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

  function PostCard({post}) {
    const [title, setTitlt] = useState('some ');
    const [description, setDescription] = useState('dfljdlf');

    useEffect(() => {
        setTitlt(post.title);
        setDescription(post.description);
    },[])
  return (
    <View>
      <Text>{title}</Text>
      <Text>{description}</Text>
    </View>
  )
}

const styles = StyleSheet.create({})