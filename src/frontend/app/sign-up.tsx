import {Text, View, StyleSheet, TextInput} from 'react-native';
import React, {useState} from "react";
import {router} from "expo-router";
import {StatusBar} from "expo-status-bar";
import { SERVER_URI } from '@/const';
import DismissibleTextInput from './components/dismissableTextInput';



export default function SignUp() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (firstname:string,lastname:string,username:string,password:string) => {
        try {
            const uri = SERVER_URI;
            const response = await fetch(`${uri}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, password: password, firstName: firstname, lastName: lastname })
            });

            if (response.ok) {
                setErrorMsg('')
                router.navigate('/sign-in');
            } else {
                setErrorMsg('Username is already taken!');
                return null;
            }
        } catch (error) {
            setErrorMsg("Something went wrong. Please try again later.");
            return null;
        }
    };

    return (
        <View style={styles.container}>
            <Text
                style={{color: '#ffffff', fontSize: 30, marginTop: 100, marginBottom: 20}}
            >
                Sign Up
            </Text>
            <DismissibleTextInput
                style={{color: '#fff', borderWidth: 1, borderColor: '#ffffff',borderRadius: 10, marginBottom: 10, width: 250, height: 50}}
                placeholder="First Name"
                placeholderTextColor="#ffffff"
                onChangeText={val => setFirstname(val)}
            />
            <DismissibleTextInput
                style={{color: '#fff', borderWidth: 1, borderColor: '#ffffff',borderRadius: 10, marginBottom: 20, width: 250, height: 50}}
                placeholder="Last Name"
                placeholderTextColor="#ffffff"
                onChangeText={val => setLastname(val)}
            />
            <DismissibleTextInput
                style={{color: '#fff', borderWidth: 1, borderColor: '#ffffff',borderRadius: 10, marginBottom: 10, width: 250, height: 50}}
                placeholder="Username"
                placeholderTextColor="#ffffff"
                onChangeText={val => setUsername(val)}
            />
            <DismissibleTextInput
                style={{color: '#fff', borderWidth: 1, borderColor: '#ffffff',borderRadius: 10, marginBottom: 20, width: 250, height: 50}}
                secureTextEntry={true}
                placeholder="Password"
                placeholderTextColor="#ffffff"
                onChangeText={val => setPassword(val)}
            />
            <View style={{flexDirection:'row', marginBottom: 10}}>
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
                        if (username=="") {
                            setErrorMsg('Signup failed: No Username');
                        }
                        else if (password=="") {
                            setErrorMsg('Signup failed: No Password');
                        }
                        else if (password.length < 8) {
                            setErrorMsg('Signup failed: Password must be at least 8 characters long');
                        }
                        else {
                            setErrorMsg('');
                            handleSubmit(firstname, lastname, username, password).then();
                        }
                    }}>
                    Create Account
                </Text>
            </View>

            {errorMsg !== '' && (
                <Text style={styles.errorText}>{errorMsg}</Text>
            )}

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
    errorText: {
        color: 'red',
        marginTop: 10,
        marginBottom: 10,
        paddingHorizontal: 20,
        textAlign: 'center',
    },
});
