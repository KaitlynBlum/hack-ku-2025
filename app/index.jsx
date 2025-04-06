import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.glassCard}>
        <Text style={styles.heading}>LOST AND FOUND</Text>
        <Text style={styles.title}>📦 Tracked</Text>

        <TouchableOpacity style={styles.glassButton} onPress={() => router.push('/add')}>
          <Text style={styles.buttonText}>➕ Add New Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.glassButton} onPress={() => router.push('/search')}>
          <Text style={styles.buttonText}>🔍 Search Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.glassButton} onPress={() => router.push('/view-all')}>
          <Text style={styles.buttonText}>📦 View All Items</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
    padding: 20,
  },
  glassCard: {
    width: '100%',
    padding: 30,
    borderRadius: 30,
    backgroundColor: 'rgba(31, 196, 133, 0.08)',
    borderColor: 'rgba(31, 196, 133, 0.3)',
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#1fc485',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
  },
  heading: {
    fontSize: 42,
    fontWeight: '900',
    fontFamily: 'SpaceMono',
    color: '#1fc485',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 3,
    textShadowColor: '#1fc485',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'SpaceMono',
    color: '#ffffff',
    marginBottom: 30,
  },
  glassButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#1fc485',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'SpaceMono',
  },
});