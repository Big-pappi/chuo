import React from 'react';
import {Button as PaperButton} from 'react-native-paper';
import {colors} from '@/theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
  style?: any;
  children?: React.ReactNode;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  mode,
  style,
  children,
  onPress,
  loading,
  disabled,
  ...props
}) => {
  const getButtonMode = () => {
    switch (variant) {
      case 'primary':
        return 'contained';
      case 'secondary':
        return 'contained';
      case 'outline':
        return 'outlined';
      case 'text':
        return 'text';
      default:
        return 'contained';
    }
  };

  const getButtonStyle = () => {
    const baseStyle = {};
    switch (variant) {
      case 'primary':
        return {...baseStyle, backgroundColor: colors.blue};
      case 'secondary':
        return {...baseStyle, backgroundColor: colors.sky};
      case 'outline':
        return {...baseStyle, borderColor: colors.blue};
      case 'text':
        return baseStyle;
      default:
        return baseStyle;
    }
  };

  return (
    <PaperButton
      mode={mode || getButtonMode()}
      style={[getButtonStyle(), style]}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      {...props}>
      {children}
    </PaperButton>
  );
};

export default Button;
