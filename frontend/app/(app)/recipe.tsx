import React from "react";
import {useLocalSearchParams} from "expo-router";
import {StyleSheet, Text, View} from "react-native";
import {ScrollView} from "react-native";
import {StatusBar} from "expo-status-bar";

export default function RecipePage() {
    const { title, ingredients, preparationTime, instructions } = useLocalSearchParams();

    return(
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Text style={styles.title} adjustsFontSizeToFit={true} numberOfLines={2}>{title}</Text>
                <Text style={styles.time}>{preparationTime} minutes</Text>
            </View>
            <Text style={styles.ingredients}>Ingredients</Text>
            <ScrollView style={{borderColor: '#ffffff', borderWidth: 1, backgroundColor: '#141414', borderRadius: 10, maxHeight: 100, marginBottom: 5}}>
                <Text style={styles.description}>{ingredients}</Text>
            </ScrollView>
            <Text style={styles.ingredients}>Instructions</Text>
            <ScrollView style={{borderColor: '#ffffff', borderWidth: 1, backgroundColor: '#141414', borderRadius: 10}}>
                <Text style={styles.description}>{instructions}</Text>
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
        borderRadius: 10,
        padding: 10,
        flex: 1,
        height: 78,
    },
    description: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#ffffff',
        paddingTop: 5,
        padding: 10,

    },
    time: {
        fontSize: 18,
        color: '#ffffff',
        marginLeft: 10,
        marginBottom: 5,
    },
    ingredients: {
        fontSize: 20,
        color: '#ffffff',
        marginLeft: 10,
        marginBottom: 5,
    },
    buttonContainer: {
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 10,
        marginBottom: 5,
        height: 90,
    },
    button: {
        color: '#fff',
        textAlign: 'center',
        textAlignVertical: 'center',
        width: 50,
        fontSize: 30
    },
});

