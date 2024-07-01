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
import LoginScreen from './screens/LoginScreen';
import {AuthContext} from './context/AuthContext';
import RegisterScreen from './screens/RegisterScreen';
import SplashLoadingScreen from './screens/SplashLoadingScreen';
import {moderateScale} from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommentsCard from './screens/CommentsCard';
import TestHome from './screens/TestHome';
import ShowPostComments from './screens/ShowPostComments';
import CheatSheet from './forDelete/CheatSheet';

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
            <OcticonsIcon
              name={'home'}
              size={moderateScale(28)}
              color={focused ? 'black' : 'gray'}
            />
          ),
        }}
      />

      {/* THIS WAS TEST HOME */}
      {/* <Tab.Screen
        name="TestHome"
        component={TestHome}
        options={{
          headerShown: false,
          headerTitle: 'Blog App',
          tabBarLabel: () => {},
          tabBarIcon: ({focused}) => (
            <OcticonsIcon
              name={'alert'}
              size={moderateScale(28)}
              color={focused ? 'black' : 'gray'}
            />
          ),
        }}
      /> */}
      {splashLoading ? (
        <Tab.Screen
          name="Splash Screen"
          component={SplashLoadingScreen}
          options={{headerShown: false}}
        />
      ) : userInfo.accessToken ? (
        <>
          {isAdmin ? (
            <Tab.Screen
              name="AddBlog"
              component={AddBlog}
              options={{
                headerShown: true,
                tabBarLabel: () => {},
                tabBarIcon: ({focused}) => (
                  <Ionicons
                    name={'add-circle-outline'}
                    size={moderateScale(40)}
                    color={focused ? 'black' : 'gray'}
                  />
                ),
              }}
            />
          ) : null}
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: false,
              tabBarLabel: () => {},
              tabBarIcon: ({focused}) => (
                <FeatherIcons
                  name={'user'}
                  size={moderateScale(32)}
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
          name="PostDetailScreen"
          component={PostDetailScreen}
          options={{
            headerShown: false,
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
            headerShown: true,
            headerTitle: 'Back',
          }}
        />
        <NativeSTACK.Screen
          name="ShowPostComments"
          component={ShowPostComments}
          options={{
            headerShown: false,
            headerTitle: 'Back',
            animation: 'slide_from_bottom'
          }}
        />
        <NativeSTACK.Screen
          name="CheatSheet"
          component={CheatSheet}
          options={{
            headerShown: true,
            headerTitle: 'Back',
            animation: 'slide_from_bottom'
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
