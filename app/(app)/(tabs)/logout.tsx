import {StyleSheet, Text, View} from 'react-native';

import { useSession } from '../../ctx';

export default function SignOutScreen() {
    const { signOut } = useSession();
    return (
        <View style={styles.container}>
            <Text
                style={styles.text}
                onPress={() => {
                    // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
                    signOut();
                }}>
                Log Out
            </Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
    },
});