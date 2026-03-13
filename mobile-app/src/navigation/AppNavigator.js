import React, { useContext } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, Text } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme';

import AuthNavigator from './AuthNavigator';
import GeneratorNavigator from './GeneratorNavigator';
import BuyerNavigator from './BuyerNavigator';
import DriverNavigator from './DriverNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 20, color: colors.text }}>Connecting to Waste2Farm...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.background } }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            {user.role === 'Generator' && (
              <Stack.Screen name="Main" component={GeneratorNavigator} />
            )}
            {user.role === 'Buyer' && (
              <Stack.Screen name="Main" component={BuyerNavigator} />
            )}
            {user.role === 'Driver' && (
              <Stack.Screen name="Main" component={DriverNavigator} />
            )}
            {/* Fallback for unknown roles */}
            {!['Generator', 'Buyer', 'Driver'].includes(user.role) && (
              <Stack.Screen name="Main" component={BuyerNavigator} />
            )}
          </>
        ) : (
          /* Guest mode defaults to BuyerNavigator (Marketplace) */
          <Stack.Screen name="Main" component={BuyerNavigator} />
        )}
        
        {/* Auth stack remains accessible if needed for guest-to-user conversion */}
        <Stack.Screen name="Auth" component={AuthNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
