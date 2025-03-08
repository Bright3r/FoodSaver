import {Text, View, StyleSheet, TextInput} from 'react-native';
import {useState} from "react";
import {router} from "expo-router";

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    return (
        <View style={styles.container}>
            <Text
                style={{color: '#ffffff', fontSize: 30, marginTop: 230}}
            >
                Sign Up
            </Text>
            <TextInput
                style={{color: '#fff', borderWidth: 1, borderColor: '#ffffff',borderRadius: 10, margin: 20, width: 250, height: 50}}
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
                style={{color: '#fff', borderWidth: 1, borderColor: '#ffffff',borderRadius: 10, textAlign: 'center', textAlignVertical: 'center', width: 110, height: 40}}
                onPress={() => {
                    router.replace('/sign-in');
                }}>
                Create Account
            </Text>
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
