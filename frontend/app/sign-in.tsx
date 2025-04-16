import { router } from 'expo-router';
import {StyleSheet, Text, TextInput, View} from 'react-native';

import { useSession } from './ctx';
import React, {useState} from "react";
import {StatusBar} from "expo-status-bar";

export default function SignIn() {
    const { signIn } = useSession();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    return (
        <View style={styles.container}>
            <Text
                style={{color: '#ffffff', fontSize: 50, marginBottom: 80, marginTop: 100}}
            >
                FoodSaver
            </Text>
            <Text
                style={{color: '#ffffff', fontSize: 30}}
            >
                Sign In
            </Text>
            <TextInput
                style={{color: '#fff', borderWidth: 1, borderColor: '#ffffff',borderRadius: 10, marginBottom: 20, width: 250, height: 50}}
                placeholder="Username"
                placeholderTextColor="#ffffff"
                onChangeText={val => setUsername(val)}
            />
            <TextInput
                style={{color: '#fff', borderWidth: 1, borderColor: '#ffffff',borderRadius: 10, marginBottom: 20, width: 250, height: 50}}
                secureTextEntry={true}
                placeholder="Password"
                placeholderTextColor="#ffffff"
                onChangeText={val => setPassword(val)}
            />
            <Text
                style={{color: '#fff', borderWidth: 1, borderColor: '#ffffff',borderRadius: 10, textAlign: 'center', textAlignVertical: 'center', width: 110, height: 40, marginBottom: 10}}
                onPress={() => {
                    signIn(username,password);
                }}>
                Login
            </Text>
            <Text
                style={{color: '#fff', borderWidth: 1, borderColor: '#ffffff',borderRadius: 10, textAlign: 'center', textAlignVertical: 'center', width: 110, height: 40}}
                onPress={() => {
                    router.navigate('/sign-up');
                }}>
                Signup
            </Text>
            <StatusBar style="light" backgroundColor={"#000000"}/>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
    },
});