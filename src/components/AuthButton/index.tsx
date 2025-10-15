import React from 'react';
import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/stores/authStore';
import Fontisto from '@react-native-vector-icons/fontisto';
interface AuthButtonProps {
  provider: 'google';
  onPress?: () => void;
}

const AuthButton = ({ provider, onPress }: AuthButtonProps) => {
  const { loginWithGoogle, isLoading } = useAuthStore();

  const handlePress = async () => {
    try {
      await loginWithGoogle();
      onPress?.();
    } catch (error) {
      console.error(`${provider} login error:`, error);
    }
  };

  const getButtonStyle = () => {
    return 'bg-white border border-gray-300';
  };

  const getTextStyle = () => {
    return 'text-gray-700';
  };

  const getProviderText = () => {
    return 'Continue with Google';
  };

  const getProviderIcon = () => {
    return <Fontisto name='google' size={20} color="black" />;
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isLoading}
      className={`flex-row items-center justify-center p-4 rounded-lg ${getButtonStyle()} ${isLoading ? 'opacity-50' : ''
        }`}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={provider === 'google' ? '#374151' : '#ffffff'}
        />
      ) : (
        <>
          <Text className="text-xl mr-3">{getProviderIcon()}</Text>
          <Text className={`text-lg font-semibold ${getTextStyle()}`}>
            {getProviderText()}
          </Text>
        </>
      )}
    </Pressable>
  );
};

export default AuthButton;
