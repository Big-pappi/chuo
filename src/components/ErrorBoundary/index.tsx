import React, {Component, ErrorInfo, ReactNode} from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import {colors, spacing, typography} from '@/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error: Error): State {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({hasError: false, error: null});
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <Button variant="primary" onPress={this.handleReset} style={styles.button}>
            Try Again
          </Button>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.panel,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.fontSize.base,
    color: colors.slate,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  button: {
    minWidth: 150,
  },
});

export default ErrorBoundary;
