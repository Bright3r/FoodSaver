import {StyleSheet, Text, View} from 'react-native';

import { useSession } from '../../ctx';
import {StatusBar} from "expo-status-bar";
import React from "react";

export default function SignOutScreen() {
    const { signOut } = useSession();
    return (
        <View style={styles.container}>
            <Text
                style={{color: '#fff', borderWidth: 1, borderColor: '#ffffff',borderRadius: 10, textAlign: 'center', textAlignVertical: 'center', width: 110, height: 40}}
                onPress={() => {
                    // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
                    signOut();
                }}>
                Log Out
            </Text>
            <StatusBar style="light" backgroundColor={"#000000"} translucent={false}/>
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