import { router } from 'expo-router';
import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';

import { useSession } from './ctx';
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import DismissibleTextInput from './components/dismissableTextInput';

export default function SignIn() {
    const { signIn } = useSession();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>FoodSaver</Text>
            <Text style={styles.subtitle}>Sign In</Text>

            <DismissibleTextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#ffffff"
                onChangeText={val => setUsername(val)}
            />
            <DismissibleTextInput
                style={styles.input}
                secureTextEntry={true}
                placeholder="Password"
                placeholderTextColor="#ffffff"
                onChangeText={val => setPassword(val)}
            />

            <Text
                style={styles.button}
                onPress={async () => {
                    Keyboard.dismiss();
                    const result = await signIn(username, password);
                    if (!result.success) {
                        setErrorMessage(result.message || 'Sign in failed. Please try again.');
                    } else {
                        setErrorMessage('');
                    }
                }}
            >
                Login
            </Text>

            <Text
                style={styles.button}
                onPress={() => router.navigate('/sign-up')}
            >
                Signup
            </Text>

            {errorMessage !== '' && (
                <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            <StatusBar style="light" backgroundColor={"#000000"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
    },
    title: {
        color: '#ffffff',
        fontSize: 50,
        marginBottom: 80,
        marginTop: 100,
    },
    subtitle: {
        color: '#ffffff',
        fontSize: 30,
    },
    input: {
        color: '#fff',
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 10,
        marginBottom: 20,
        width: 250,
        height: 50,
        paddingHorizontal: 10,
    },
    button: {
        color: '#fff',
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 10,
        textAlign: 'center',
        textAlignVertical: 'center',
        width: 110,
        height: 40,
        marginBottom: 10,
        lineHeight: 40,
    },
    errorText: {
        color: 'red',
        marginTop: 20,
        paddingHorizontal: 20,
        textAlign: 'center',
    },
});