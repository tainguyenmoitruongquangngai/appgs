import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function DetailScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>Detail Screen</Text>
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}
