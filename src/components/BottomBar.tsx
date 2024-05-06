import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import Login from "../pages/Login";
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const BottomBar: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'ios-information-circle-outline';
          if (route.name === 'Home') {
            iconName = focused ? 'ios-home' : 'ios-home-outline';
          } else if (route.name === 'Login') {
            iconName = focused ? 'ios-log-in' : 'ios-log-in-outline';
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Tab.Screen name="Login" component={Login} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default BottomBar;
