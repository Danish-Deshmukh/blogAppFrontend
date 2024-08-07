import React, {useContext, useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Home from './screens/Home';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AddBlog from './screens/AddBlog';
import Profile from './screens/Profile';
import EditeProfile from './screens/EditeProfile';
import PostDetailScreen from './screens/PostDetailScreen';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/authScreens/LoginScreen';
import RegisterScreen from './screens/authScreens/RegisterScreen';
import {AuthContext} from './context/AuthContext';
import SplashLoadingScreen from './screens/SplashLoadingScreen';
import {moderateScale} from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommentsCard from './screens/CommentsCard';
import ShowPostComments from './screens/ShowPostComments';
import CheatSheet from './forDelete/CheatSheet';
import AddUrlScreen from './screens/AddUrlScreen';
import ForTesting from './forDelete/ForTesting';
import AddCategory from './screens/AddCategory';
import PreviewScreen from './screens/PreviewScreen';
import TemplateForMarkdown from './screens/TemplateForMarkdown';
import AddContent from './screens/AddContent';
import Bookmark from './screens/Bookmark';
import FinalPrivewScreen from './screens/FinalPrivewScreen';

const NativeSTACK = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export function BottomTab() {
  const {userInfo, splashLoading, isAdmin} = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          headerTitle: 'Blog App',
          tabBarLabel: () => {},
          tabBarIcon: ({focused}) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={moderateScale(28)}
              color={focused ? 'black' : 'gray'}
            />
          ),
        }}
      />

      {splashLoading ? (
        <Tab.Screen
          name="Splash Screen"
          component={SplashLoadingScreen}
          options={{headerShown: false}}
        />
      ) : userInfo.accessToken ? (
        <>
          <Tab.Screen
            name="Bookmark"
            component={Bookmark}
            options={{
              headerShown: false,
              tabBarLabel: () => {},
              tabBarIcon: ({focused}) => (
                <Ionicons
                  name={focused ? 'bookmarks' : 'bookmarks-outline'}
                  size={moderateScale(25)}
                  color={focused ? 'black' : 'gray'}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: false,
              tabBarLabel: () => {},
              tabBarIcon: ({focused}) => (
                <FontAwesome
                  // name={'user'}
                  name={focused ? 'user' : 'user-o'}
                  size={moderateScale(30)}
                  color={focused ? 'black' : 'gray'}
                />
              ),
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
              tabBarLabel: () => {},
              tabBarIcon: ({focused}) => (
                <MaterialCommunityIcons
                  name={'login'}
                  size={moderateScale(28)}
                  color={focused ? 'black' : 'gray'}
                />
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const {userInfo, splashLoading} = useContext(AuthContext);
  return (
    <NavigationContainer>
      <NativeSTACK.Navigator>
        <NativeSTACK.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <NativeSTACK.Screen
          name="BottomTab"
          component={BottomTab}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <NativeSTACK.Screen
          name="EditeProfile"
          component={EditeProfile}
          options={{
            headerShown: true,
            animation: 'slide_from_right',
          }}
        />
        <NativeSTACK.Screen
          name="ForTesting"
          component={ForTesting}
          options={{
            headerShown: true,
            animation: 'slide_from_right',
          }}
        />
        <NativeSTACK.Screen
          name="TemplateForMarkdown"
          component={TemplateForMarkdown}
          options={{
            headerShown: true,
            headerTitle: 'Template For Markdown',
            animation: 'slide_from_right',
          }}
        />
        <NativeSTACK.Screen
          name="PostDetailScreen"
          component={PostDetailScreen}
          options={{
            headerShown: false,
            animation: 'flip',
            headerTitle: 'Back',
          }}
        />
        <NativeSTACK.Screen
          name="AddUrlScreen"
          component={AddUrlScreen}
          options={{
            headerShown: true,
            animation: 'flip',
            headerTitle: 'Back',
          }}
        />
        <NativeSTACK.Screen
          name="CommentCard"
          component={CommentsCard}
          options={{
            headerShown: false,
          }}
        />
        <NativeSTACK.Screen
          name="AddBlog"
          component={AddBlog}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <NativeSTACK.Screen
          name="AddConent"
          component={AddContent}
          options={{
            headerShown: false,
            animation: 'slide_from_right'
          }}
        />
        <NativeSTACK.Screen
          name="AddCategory"
          component={AddCategory}
          options={{
            headerShown: true,
            headerTitle: 'Back',
            animation: 'slide_from_right',
          }}
        />
        <NativeSTACK.Screen
          name="PreviewScreen"
          component={PreviewScreen}
          options={{
            headerShown: true,
            headerTitle: 'Preview of the Post',
            animation: 'slide_from_right',
          }}
        />
        <NativeSTACK.Screen
          name="FinalPrivewScreen"
          component={FinalPrivewScreen}
          options={{
            headerShown: true,
            headerTitle: 'Final preview screen',
            animation: 'slide_from_right'
          }}
        />
        <NativeSTACK.Screen
          name="ShowPostComments"
          component={ShowPostComments}
          options={{
            headerShown: false,
            headerTitle: 'Back',
            animation: 'slide_from_bottom',
          }}
        />
        <NativeSTACK.Screen
          name="CheatSheet"
          component={CheatSheet}
          options={{
            headerShown: true,
            headerTitle: 'Back',
            animation: 'slide_from_bottom',
          }}
        />
        {splashLoading ? (
          <NativeSTACK.Screen
            name="Splash Screen"
            component={SplashLoadingScreen}
            options={{headerShown: false}}
          />
        ) : userInfo.accessToken ? (
          <NativeSTACK.Screen name="Profile" component={Profile} />
        ) : (
          <>
            <NativeSTACK.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: true}}
            />
            <NativeSTACK.Screen
              name="Register"
              component={RegisterScreen}
              options={{headerShown: true}}
            />
          </>
        )}
      </NativeSTACK.Navigator>
    </NavigationContainer>
  );
}
