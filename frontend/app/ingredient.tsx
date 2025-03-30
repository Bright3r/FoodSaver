import React, { useState, useEffect } from 'react';
import { useSession } from './ctx';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface Ingredient {
    name:string;
    description:string;
    nutritionGrade:string;
    imageUrl:string;
}

const fetchIngredientData = async (productCode: number): Promise<Ingredient | null> => {
    // Fetching item data from API.
    try {
        const response = await fetch(`https://us.openfoodfacts.org/api/v0/product/${productCode}`);
        const data = await response.json();

        if (data.status === 1 && data.product) {
            const product = data.product;

            return {
                name: product.product_name || "Unknown",
                description: product.ingredients_text || "Unknown description",
                nutritionGrade: product.nutrition_grades || "Unknown",
                imageUrl: product.image_url || '',
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error: fetch failed.", error);
        return null;
    }
};

export default function IngredientPage() {
    const {session} = useSession(); // For storing ingredients: implement this in the next sprint.
    const [ingredient, setIngredient] = useState<Ingredient | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { scannedData } = useLocalSearchParams();
    const parsedScannedData = scannedData ? parseInt(scannedData as string) : NaN;
    const router = useRouter();
    // Add user inventory funct here.

    useEffect(() => {
        const getIngredient = async () => {
            setLoading(true);
            const fetchedIngredient = await fetchIngredientData(parsedScannedData);
            setIngredient(fetchedIngredient);
            setLoading(false);
        };

        getIngredient();
    }, [scannedData])

    return(
        <View style={styles.container}>
            {loading ? (
                <Text style={styles.text}>Loading...</Text>
            ) : ingredient ? ( // Include more info..?
                <>
                    <Text style={styles.name}>{ingredient.name}</Text>
                    <Image source={{ uri: ingredient.imageUrl }} style={styles.image} />
                    <Text style={styles.description}>{ingredient.description}</Text>
                    <Text style={styles.nutritionGrade}>{ingredient.nutritionGrade}</Text>
                    <Button title="Back" onPress={() => router.back()}/>
                </>
            ) : (
                <>
                    <Text style={styles.name}>Unknown ingredient.</Text>
                    <Button title="Back" onPress={() => router.back()}/>
                </>
            )}
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
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    description: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#ffffff',
        marginBottom: 10,
        textAlign: 'center'
    },
    nutritionGrade: {
        fontSize: 18,
        color: 'green',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        fontSize: 18,
        color: '#ffffff',
    },
});

