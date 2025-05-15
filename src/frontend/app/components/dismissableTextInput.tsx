import React from 'react';
import {
  TextInput,
  InputAccessoryView,
  View,
  Text,
  Pressable,
  Platform,
  Keyboard,
  TextInputProps,
} from 'react-native';

export default function DismissibleTextInput(props: TextInputProps) {
  // Generate a unique ID for each InputAccessoryView
  const accessoryID = `dismissKeyboardAccessory-${props.placeholder || Math.random().toString(36)}`;

  return (
    <>
      <TextInput
        {...props}
        inputAccessoryViewID={Platform.OS === 'ios' ? accessoryID : undefined}
      />
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={accessoryID}>
          <View
            style={{
              backgroundColor: '#eaeaea',
              paddingVertical: 10,
              paddingHorizontal: 15,
              alignItems: 'flex-end',
              borderTopWidth: 0.5,
              borderColor: '#bbb',
            }}
          >
            <Pressable
              onPress={() => Keyboard.dismiss()}
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#d1d1d1' : 'transparent',
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 8,
              })}
            >
              <Text style={{ fontSize: 16, color: '#007aff', fontWeight: '600' }}>
                Done
              </Text>
            </Pressable>
          </View>
        </InputAccessoryView>
      )}
    </>
  );
}