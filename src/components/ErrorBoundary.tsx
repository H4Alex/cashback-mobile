import { Component, type ErrorInfo, type ReactNode } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production: send to Sentry
    // Sentry.captureException(error, { extra: { componentStack: info.componentStack } });
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <View className="flex-1 items-center justify-center bg-white px-6">
          <Text className="text-5xl mb-4">!</Text>
          <Text className="text-xl font-bold text-center mb-2">Algo deu errado</Text>
          <Text className="text-gray-500 text-center mb-6">
            Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.
          </Text>

          <TouchableOpacity
            className="bg-green-500 rounded-xl py-3.5 px-8 mb-3"
            onPress={this.handleRetry}
            accessibilityLabel="Tentar novamente"
            accessibilityRole="button"
          >
            <Text className="text-white font-semibold text-base">Tentar novamente</Text>
          </TouchableOpacity>

          {__DEV__ && this.state.error && (
            <ScrollView className="mt-4 max-h-40 w-full bg-red-50 rounded-lg p-3">
              <Text className="text-red-700 text-xs font-mono">{this.state.error.message}</Text>
            </ScrollView>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}
