import { Text, View, StyleSheet } from 'react-native';
import { useSession } from '@/app/ctx';
import {StatusBar} from "expo-status-bar";
import React from "react";

export default function Index() {
    const { session } = useSession();
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home screen</Text>
            <Text style={styles.text}>Currently logged in with: {session}</Text>
            <StatusBar style="light" backgroundColor={"#000000"}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
    },
    button: {
        fontSize: 20,
        textDecorationLine: 'underline',
        color: '#fff',
    },
});
