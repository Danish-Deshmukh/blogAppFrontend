<BottomSheet
zIndex={1}
enablePanDownToClose={true}
ref={bottomSheetRef}
index={-1}
snapPoints={snapPoints}>
<View>
  {/* Comments header */}
  <View style={styles.commentsHeadContainer}>
    <Text
      style={{
        fontSize: moderateScale(20),
        color: 'black',
        fontWeight: '700',
      }}>
      Comments
    </Text>
    <TouchableOpacity onPress={() => handleClosePress()}>
      <AntDesign
        name={'close'}
        size={moderateScale(30)}
        color="black"
      />
    </TouchableOpacity>
  </View>

  {/* Comment Input */}
  <View
    style={{
      borderWidth: 1,
      borderRadius: moderateScale(10),
      height: moderateScale(50),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: moderateScale(10),
      width: '95%',
      margin: moderateScale(10),
    }}>
    <View
      style={{
        // borderWidth : 1,
        width: '90%',
      }}>
      <TextInput
        multiline
        placeholder={
          commentError
            ? 'Comment should not be empty...'
            : 'Comment your thoughts...'
        }
        placeholderTextColor={commentError && 'red'}
        value={comment}
        onChangeText={comment => setComment(comment)}
      />
    </View>
    <TouchableOpacity
      onPress={() => {
        if (userInfo.accessToken) {
          const id = post.id;
          const name = userInfo.name;
          const email = userInfo.email;
          const body = comment;

          comment === ''
            ? setCommentError(true)
            : addComment(id, name, email, body);
        } else {
          Alert.alert(
            "didn't hava a account",
            'You need to have an accound for commenting on any post',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Login',
                onPress: () => navigation.navigate('Login'),
              },
            ],
          );
        }
      }}
      style={{borderWidth: 0}}>
      <MaterialCommunityIcons
        name="send"
        size={moderateScale(20)}
        color="black"
      />
    </TouchableOpacity>
  </View>

  {/* Comments Body */}
  <View
    style={{
      borderWidth: 1,
      marginBottom: moderateScale(80),
      padding: moderateScale(10),
      height: '50%',
    }}>
    {commentsLoading && (
      <View>
        <ActivityIndicator color="black" />
      </View>
    )}
    <FlatList
      showsVerticalScrollIndicator={true}
      data={comments}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => (
        // Comment card
        <View
          style={{
            borderWidth: 0.4,
            borderRadius: moderateScale(10),
            flexDirection: 'row',
            marginVertical: moderateScale(5),
            paddingVertical: moderateScale(15),
            paddingRight: moderateScale(65),
            // marginBottom: moderateScale(120)
          }}>
          <Image
            source={require('../assets/images/user.png')}
            style={{
              height: moderateScale(25),
              width: moderateScale(25),
              marginHorizontal: moderateScale(10),
              marginTop: moderateScale(3),
            }}
          />
          <View>
            <Text style={{color: 'gray'}}>{item.name}</Text>
            <Text
              style={{
                fontSize: moderateScale(17),
                textAlign: 'justify',
                color: 'black',
              }}>
              {item.body}
            </Text>
          </View>
        </View>
      )}
    />
  </View>
</View>
<Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                  <Button onPress={openMenu}>
                    <FeatherIcons
                      name={'more-vertical'}
                      size={moderateScale(21)}
                      color="black"
                    />
                  </Button>
                }>
                <View
                  style={{
                    backgroundColor: '#f0f0f0',
                  }}>
                  <Menu.Item
                    onPress={() => {
                      updatePost();
                    }}
                    title={
                      <View
                        style={{
                          // borderWidth: 1,
                          // padding: moderateScale(10),
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <MaterialCommunityIcons
                          name={'update'}
                          size={moderateScale(20)}
                          color="black"
                        />
                        <Text
                          style={{
                            marginLeft: moderateScale(10),
                            fontWeight: '600',
                            fontSize: moderateScale(16),
                          }}>
                          UPDATE
                        </Text>
                      </View>
                    }
                  />
                  <Divider />
                  <Menu.Item
                    onPress={() => {
                      Alert.alert(
                        'Delete Post',
                        'Are you sure you want to Delete this post',
                        [
                          {
                            text: 'Cancel',
                            style: 'cancel',
                          },
                          {
                            text: 'OK',
                            onPress: () => {
                              deletePost();
                            },
                          },
                        ],
                      );
                    }}
                    title={
                      <View
                        style={{
                          // borderWidth: 1,
                          // padding: moderateScale(10),
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <MaterialCommunityIcons
                          name={'delete'}
                          size={moderateScale(20)}
                          color="black"
                        />
                        <Text
                          style={{
                            marginLeft: moderateScale(10),
                            fontWeight: '600',
                            fontSize: moderateScale(16),
                            color: 'tomato',
                          }}>
                          DELETE
                        </Text>
                      </View>
                    }
                  />
                </View>
              </Menu>
</BottomSheet>