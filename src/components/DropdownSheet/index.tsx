import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, FlatList } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SheetManager, useSheetPayload } from 'react-native-actions-sheet';
import IOption from '@/types/ui/option';
import Input from '../Input';

interface DropdownPayload {
  options: IOption[];
  onSelect: (option: IOption) => void;
}

const OptionItem = ({ option, onSelect }: { option: IOption, onSelect: (option: IOption) => void }) => {
  return (
    <Pressable onPress={() => onSelect(option)} className="py-4 px-2 border-b border-gray-200 active:bg-gray-100">
      <Text>{option.label}</Text>
    </Pressable>
  )
}

const DropdownSheet = () => {
  const payload = useSheetPayload() as DropdownPayload | null;  
  const options = payload?.options || [];
  const onSelect = payload?.onSelect;

  const [search, setSearch] = useState('');
  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (option: IOption) => {
    if (onSelect && typeof onSelect === 'function') {
      onSelect(option);
    }
    SheetManager.hide('dropdown-sheet');
  };

  return (
    <ActionSheet
      id="dropdown-sheet"
      snapPoints={[50]}
      initialSnapIndex={0}
      backgroundInteractionEnabled={true}
      gestureEnabled={true}
      containerStyle={{ zIndex: 9999999 }}
    >
      <View className="p-4">
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
          Select an option
        </Text>
        <View >
          <Input placeholder="Search" value={search} onChangeText={setSearch} />
        </View>
        <FlatList
          data={filteredOptions}
          renderItem={({ item }) => (
            <OptionItem option={item} onSelect={handleSelect} />
          )}
          keyExtractor={(item) => item.value}
          ListEmptyComponent={<Text className="text-center text-gray-500">No options found</Text>}
        />
      </View>
    </ActionSheet>
  );
};

export default DropdownSheet;
