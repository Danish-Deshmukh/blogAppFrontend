
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Card from '../components/Card';
import {moderateScale} from 'react-native-size-matters';
import axios from 'axios';
import {REST_API_BASE_URL} from '../service/REST_API_BASE_URL';
import FoundationIcon from 'react-native-vector-icons/Foundation';

export default function TestHome() {
  // POSTS states
  const [posts, setPosts] = useState([]);
  const [problem, setProblem] = useState(true);
  const [loading, setLoading] = useState(true);
  const [footerLoading, setFooterLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // CATEGORIES states
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(1);
  const [categoriesLoader, setCategoriesLoader] = useState(false);

  // POSTS BY CATEGORY
  const [postByCategory, setPostByCategory] = useState([]);

  const fetchPost = async () => {
    const url = `${REST_API_BASE_URL}/posts?pageSize=10&pageNo=1&sortBy=id&sortDir=desc`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Failed to fetch Posts');
    }
    const json = await res.data.content;

    return json;
  };
  useEffect(() => {
    getAllCategories();
    getPostsByCategory();
    getAllPosts();
    refresh();
  }, []);
  const refresh = () => {
    // setPosts([]);
    setCurrentPage(0);
    getAllPosts(0);
    getPostsByCategory();
  };
  const getAllCategories = () => {
    setCategoriesLoader(true);
    // console.log('get all cetegory method is callded');
    axios
      .get(`${REST_API_BASE_URL}/categories`)
      .then(res => {
        let categories = res.data;
        setCategories(categories);
        // console.log(categories);
        setCategoriesLoader(false);
      })
      .catch(e => {
        console.log('Error herea ' + e);
        setCategoriesLoader(false);
      });
  };
  const getAllPosts = () => {
    // console.log('getllmethod  called');
    setFooterLoading(true);
    // setLoading(true)
    const nextPage = currentPage;
    // console.log('next page is called =====================');
    // console.log(nextPage);
    axios
      .get(
        `${REST_API_BASE_URL}/posts?pageSize=10&pageNo=${nextPage}&sortBy=id&sortDir=desc`,
      )
      .then(res => {
        let postsArray = res.data.content;
        setPosts([...posts, ...postsArray]);
        // console.log(postsArray);
        setCurrentPage(nextPage + 1);
        setProblem(false);
        setLoading(false);
        setFooterLoading(false);
      })
      .catch(e => {
        console.log('Error herea ' + e);
        setProblem(true);
        setLoading(false);
        setFooterLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    getPostsByCategory();
    setLoading(false);
  }, [selectedCategories]);
  const getPostsByCategory = () => {
    console.log('get posts by id is called ');
    setCategoriesLoader(true);
    const ID = selectedCategories;
    axios
      .get(`${REST_API_BASE_URL}/categories/category/${ID}`)
      .then(res => {
        let categories = res.data;
        setPostByCategory(categories);
        console.log(categories);
        setCategoriesLoader(false);
      })
      .catch(e => {
        console.log('Error herea ' + e);
        setCategoriesLoader(false);
      });
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size={'large'} />}

      {/* HEADER */}
      <View style={styles.headerContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // borderWidth: 1,
            width: moderateScale(90),
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontWeight: '600',
              fontSize: moderateScale(20),
              color: 'black',
            }}>
            Blog App
          </Text>
        </View>

        {/* REFRESH BUTTON */}
        <TouchableOpacity
          onPress={() => {
            refresh();
          }}
          style={{
            marginRight: moderateScale(10),
          }}>
          <FoundationIcon
            name={'refresh'}
            size={moderateScale(30)}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {/* CATEGORYS */}
      <View
        style={{
          minHeight: moderateScale(40),
          width: '100%',
        }}>
        {categoriesLoader && (
          <ActivityIndicator
            color={'black'}
            style={{
              position: 'absolute',
              zIndex: 1,
              alignSelf: 'center',
            }}
            size={'large'}
          />
        )}
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedCategories(item.id);

                console.log('=======================');
                console.log(postByCategory);
                console.log('=======================');
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
                  selectedCategories === item.id ? 'black' : 'white',
              }}>
              <Text
                style={{
                  fontWeight: '600',
                  color: selectedCategories === item.id ? 'white' : 'black',
                }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {problem ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Server Not responding</Text>
          <TouchableOpacity
            onPress={() => {
              setPosts([]);
              getAllPosts();
            }}
            style={{
              // borderWidth: 1,
              backgroundColor: 'black',
              padding: moderateScale(10),
              margin: moderateScale(5),
              borderRadius: 5,
            }}>
            <Text style={{color: 'white'}}>REFRESH</Text>
          </TouchableOpacity>
        </View>
      ) : selectedCategories === 1 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={posts}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => <Card item={item} />}
          onEndReached={getAllPosts}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() => {
            return (
              <View
                style={{
                  width: '90%',
                  height: moderateScale(60),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {footerLoading && (
                  <ActivityIndicator color={'black'} size={'large'} />
                )}
              </View>
            );
          }}
        />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={postByCategory}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => <Card item={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: 'black',
  },
  titleText: {
    fontSize: moderateScale(18),
    fontWeight: '500',
  },
  descText: {
    fontSize: moderateScale(14),
    fontWeight: '300',
  },
  headerContainer: {
    backgroundColor: 'white',
    height: moderateScale(50),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(10),
    elevation: 10,
  },
});
