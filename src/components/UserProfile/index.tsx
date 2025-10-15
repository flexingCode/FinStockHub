import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useAuthStore } from '@/stores/authStore';
import { useNavigation } from '@react-navigation/native';

const UserProfile = () => {
  const { user, logout } = useAuthStore();
  const navigation = useNavigation();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigation.goBack();
  }

  return (
    <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
      <View className="flex-row items-center flex-1">
        {user.picture ? (
          <Image
            source={{ uri: user.picture }}
            className="w-10 h-10 rounded-full mr-3"
            resizeMode="cover"
          />
        ) : (
          <View className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
            <Text className="text-gray-600 font-semibold">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
        )}
        
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800" numberOfLines={1}>
            {user.name || 'Usuario'}
          </Text>
          <Text className="text-sm text-gray-500" numberOfLines={1}>
            {user.email}
          </Text>
        </View>
      </View>
      
      <Pressable
        onPress={handleLogout}
        className="bg-red-500 px-4 py-2 rounded-lg"
      >
        <Text className="text-white font-semibold text-sm">
          Logout
        </Text>
      </Pressable>
    </View>
  );
};

export default UserProfile;
