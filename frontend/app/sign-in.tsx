import { router } from 'expo-router';
import {StyleSheet, Text, TextInput, View} from 'react-native';

import { useSession } from './ctx';
import {useState} from "react";

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
                style={{color: '#fff', borderWidth: 1, borderColor: '#ffffff',borderRadius: 10, textAlign: 'center', textAlignVertical: 'center', width: 110, height: 40, marginBottom: 10}}
                onPress={() => {
                    //check username and password against the database
                    //go to the rest of the app if able to login
                    // if(this.state.username.localeCompare('demo')!=0){
                    //     ToastAndroid.show('Invalid UserName',ToastAndroid.SHORT);
                    //     return;
                    // }
                    //
                    // if(this.state.password.localeCompare('demo')!=0){
                    //     ToastAndroid.show('Invalid Password',ToastAndroid.SHORT);
                    //     return;
                    // }
                    signIn();
                    // Navigate after signing in. You may want to tweak this to ensure sign-in is
                    // successful before navigating.
                    router.replace('/');
                }}>
                Login
            </Text>
            <Text
                style={{color: '#fff', borderWidth: 1, borderColor: '#ffffff',borderRadius: 10, textAlign: 'center', textAlignVertical: 'center', width: 110, height: 40}}
                onPress={() => {
                    router.replace('/sign-up');
                }}>
                Signup
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