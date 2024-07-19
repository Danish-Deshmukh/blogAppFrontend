import {
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {AdvancedImage, upload} from 'cloudinary-react-native';
import {cld} from '../service/cloudinary';
import {launchImageLibrary} from 'react-native-image-picker';
import {moderateScale} from 'react-native-size-matters';

const ForTesting = () => {
  const {width} = useWindowDimensions();
  const myImage = cld.image('samples/chair');

  // Add image states and functions
  const [image, setImage] = useState(null);
  const [imageDetail, setImageDetails] = useState(null);
  console.log(imageDetail);
  const openImagePicker = async () => {
    const options = {
      title: 'Select Image',
      type: 'library',
      options: {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        selectionLimit: 1,
        quality: 0.5,
      },
    };

    const image = await launchImageLibrary(options);
    let imageUri = image.uri || image.assets?.[0]?.uri;

    if (image.didCancel === true) {
      setImage(null);
      setImageDetails(null);
    } else {
      setImage(imageUri);
      setImageDetails(image);
    }
  };

  const uploadImage = async () => {
    if (!imageDetail) {
      return;
    }

    const options = {
      upload_preset: 'Default',
      unsigned: true,
    };

    await upload(cld, {
      file: imageDetail,
      options: options,
      callback: (error, response) => {
        console.log('ERROR ----> : ', error);
        console.log('response ----> : ', response);
      },
    });
  };
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
      }}>
      {image && (
        <Image
          source={{uri: image}}
          style={{
            width: '100%',
            height: 200,
            borderRadius: moderateScale(5),
            marginBottom: moderateScale(10),
            // resizeMode: 'contain',
          }}
        />
      )}

      <View>
        <TouchableOpacity
          onPress={openImagePicker}
          style={{
            borderWidth: 1,
            height: moderateScale(40),
            padding: moderateScale(5),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: moderateScale(5),
            marginBottom: moderateScale(10),
          }}>
          <Text
            style={{
              fontSize: moderateScale(20),
              fontWeight: 'bold',
            }}>
            Add Image
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={uploadImage}
          style={{
            borderWidth: 1,
            height: moderateScale(40),
            padding: moderateScale(5),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: moderateScale(5),
            marginBottom: moderateScale(10),
          }}>
          <Text
            style={{
              fontSize: moderateScale(20),
              fontWeight: 'bold',
            }}>
            Upload Image
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForTesting;
