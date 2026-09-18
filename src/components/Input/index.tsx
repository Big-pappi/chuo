import React from 'react';
import {View, Text} from 'react-native';
import {TextInput as PaperTextInput, TextInputProps as PaperTextInputProps} from 'react-native-paper';
import {colors, spacing} from '@/theme';

interface InputProps extends PaperTextInputProps {
  label?: string;
  error?: boolean;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({label, error, helperText, style, ...props}) => {
  return (
    <View>
      <PaperTextInput
        label={label}
        mode="outlined"
        error={error}
        dense
        multiline={false}
        numberOfLines={1}
        style={[{width: '100%', minHeight: 56}, style]}
        theme={{
          colors: {
            primary: colors.blue,
            error: colors.error,
            background: colors.white,
            placeholder: colors.muted,
          },
        }}
        {...props}
      />
      {helperText && (
        <Text style={{fontSize: 12, color: error ? colors.error : colors.slate, marginTop: spacing.xs}}>
          {helperText}
        </Text>
      )}
    </View>
  );
};

export default Input;
