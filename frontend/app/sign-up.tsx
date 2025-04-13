import {Text, View, StyleSheet, TextInput} from 'react-native';
import React, {useState} from "react";
import {router} from "expo-router";
import Constants from "expo-constants";
import {StatusBar} from "expo-status-bar";

const handleSubmit = async (firstname:string,lastname:string,username:string,password:string) => {

    try {
        //need to find the ip of the localhost since the backend is not running on the same device
        const uri =
            Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':8083') ??
            '192.168.0.44:8083';
        const response = await fetch(`http://${uri}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password, firstName: firstname, lastName: lastname })
        });

        if (response.ok) {
            const userData = await response.json();
            console.log("Signup response: ", userData);
            router.navigate('/sign-in');
        } else {
            console.error('Signup failed', await response.text());
            return null;
        }
    } catch (error) {
        console.error('Signup failed', error);
        return null;
    }
};

export default function SignUp() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    return (
        <View style={styles.container}>
            <Text
                style={{color: '#ffffff', fontSize: 30, marginTop: 100}}
            >
                Sign Up
            </Text>
            <TextInput
                style={{color: '#fff', borderWidth: 1, borderColor: '#ffffff',borderRadius: 10, margin: 10, width: 250, height: 50}}
                placeholder="First Name"
                placeholderTextColor="#ffffff"
                onChangeText={val => setFirstname(val)}
            />
            <TextInput
                style={{color: '#fff', borderWidth: 1, borderColor: '#ffffff',borderRadius: 10, marginBottom: 20, width: 250, height: 50}}
                placeholder="Last Name"
                placeholderTextColor="#ffffff"
                onChangeText={val => setLastname(val)}
            />
            <TextInput
                style={{color: '#fff', borderWidth: 1, borderColor: '#ffffff',borderRadius: 10, marginBottom: 10, width: 250, height: 50}}
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
            <View style={{flex: 1, flexDirection:'row'}}>
                <Text
                    style={{color: '#fff', borderWidth: 1, borderColor: '#ffffff',borderRadius: 10, marginRight: 10, textAlign: 'center', textAlignVertical: 'center', width: 110, height: 40}}
                    onPress={() => {
                        router.back();
                    }}>
                    Cancel
                </Text>
                <Text
                    style={{color: '#fff', borderWidth: 1, borderColor: '#ffffff',borderRadius: 10, textAlign: 'center', textAlignVertical: 'center', width: 110, height: 40}}
                    onPress={() => {
                        //username and password checking handled on the frontend
                        if(username=="") {
                            console.error('Signup failed: No Username');
                        }
                        else if(password=="") {
                            console.error('Signup failed: No Password');
                        }
                        else {
                            handleSubmit(firstname, lastname, username, password).then();
                        }
                    }}>
                    Create Account
                </Text>
            </View>
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
