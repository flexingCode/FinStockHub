import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, Modal } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import IOption from '@/types/ui/option';
import Input from '../Input';

interface ModalDropdownProps {
  options: IOption[];
  onSelect: (option: IOption) => void;
  value: string;
  placeholder: string;
}

const ModalDropdown = ({ options, onSelect, value, placeholder }: ModalDropdownProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = options.filter((option) => 
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option: IOption) => {
    onSelect(option);
    setIsVisible(false);
    setSearch('');
  };

  return (
    <>
      <Pressable 
        onPress={() => setIsVisible(true)}
        className="border border-gray-300 rounded-md px-4 py-3 flex-row justify-between items-center"
      >
        <Text className={`${value ? 'text-gray-900' : 'text-gray-500'}`}>
          {value || placeholder}
        </Text>
        <Feather name="chevron-down" size={20} color="#6B7280" />
      </Pressable>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <View 
          style={{ 
            flex: 1, 
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 999999,
            elevation: 999999,
          }}
          className="justify-center items-center p-4"
        >
          <View 
            style={{
              backgroundColor: 'white',
              borderRadius: 16,
              width: '100%',
              maxWidth: 400,
              maxHeight: '80%',
              zIndex: 999999,
              elevation: 999999,
            }}
          >
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-gray-800">Select Stock</Text>
              <Pressable 
                onPress={() => setIsVisible(false)}
                className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
              >
                <Feather name="x" size={20} color="#374151" />
              </Pressable>
            </View>

            <View className="p-4 border-b border-gray-200">
              <Input 
                placeholder="Search stocks..." 
                value={search} 
                onChangeText={setSearch}
              />
            </View>

            <FlatList
              data={filteredOptions}
              renderItem={({ item }) => (
                <Pressable 
                  onPress={() => handleSelect(item)}
                  className="px-4 py-3 border-b border-gray-100 active:bg-gray-50"
                >
                  <Text className="text-gray-800">{item.label}</Text>
                  <Text className="text-sm text-gray-500">{item.value}</Text>
                </Pressable>
              )}
              keyExtractor={(item) => item.value}
              style={{ maxHeight: 300 }}
              ListEmptyComponent={
                <View className="p-4">
                  <Text className="text-center text-gray-500">No stocks found</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ModalDropdown;
