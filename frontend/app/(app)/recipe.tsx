import {useSession} from "@/app/ctx";
import React, {useEffect, useState} from "react";
import {router, useLocalSearchParams, useRouter} from "expo-router";
import {Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View} from "react-native";
import {ScrollView} from "react-native";
import {StatusBar} from "expo-status-bar";

export default function RecipePage() {
    const { title, description } = useLocalSearchParams();
    const router = useRouter();

    return(
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Text style={styles.title}>{title}</Text>
            </View>
            <ScrollView style={{borderColor: '#ffffff', borderWidth: 1, backgroundColor: '#141414', borderRadius: 10}}>
                <Text style={styles.description}>{description}</Text>
            </ScrollView>
            <StatusBar style="light" backgroundColor={"#000000"}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        padding: 10,

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign:'auto',
        height: 78,
        borderRadius: 10,
        padding: 10,
        flex: 1,
    },
    description: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#ffffff',
        padding: 10,

    },
    buttonContainer: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 10,
        marginBottom: 10,
    },
    button: {
        color: '#fff',
        textAlign: 'center',
        textAlignVertical: 'center',
        width: 50,
        fontSize: 30
    },
});

