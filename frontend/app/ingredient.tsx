import React, { useState, useEffect } from 'react';
import { useSession } from './ctx';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    Image, 
    Button, 
    Keyboard,
    Platform,
    Dimensions, 
    KeyboardAvoidingView } from 'react-native';
import {useRouter, useLocalSearchParams, router} from 'expo-router';
import Constants from 'expo-constants';
import { ScrollView } from 'react-native-gesture-handler';

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
        console.error("Error: item fetch failed.", error);
        return null;
    }
};


const saveIngredient = async(username:string | null | undefined,  
    ingredient:Ingredient): Promise<void> => {
    try {
        const uri =
            Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':8083') ??
            '192.168.0.44:8083';
        const response = await fetch(`http://${uri}/api/user?username=${username}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })

        console.log(response.status);
        console.log(`OK? ${response.ok}`);
        console.log(`Username: ${username}`);
        
        if (response.ok) {
            const responseData = await response.json();
            let responseStr = JSON.stringify(responseData);
            console.log(`Response Data: ${responseStr}`);

            const today = new Date();
            const expr = new Date(today.getFullYear(), today.getMonth(),
                today.getDate() + 7);

            console.log(`Updating inventory...`);
            let updatedData = JSON.parse(responseStr);
            let objInventory = updatedData['inventory'];
            
            const dupe = objInventory.find((item: { 
                name: string,
                qty: number,
                purchaseDate: Date,
                expirationDate: Date
            }) => {
                if (item.name === ingredient.name) {
                    item.qty += 1;
                    return true;
                }
            });

            if (typeof dupe === 'undefined') {
                updatedData['inventory'].push({
                    name: ingredient.name,
                    qty: 1,
                    purchaseDate: today, // User should be able to set their own purchase date.
                    expirationDate: expr // User should be able to set their own expiration date.
                });
            }

            console.log(`Item added: ${ingredient.name}`);
            console.log(`${username}'s inventory: ${JSON.stringify(updatedData['inventory'])}`);

            const response2 = await fetch(`http://${uri}/api/user`, {
                method: 'PUT',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(updatedData)
            })

            console.log(response2.status);
            console.log(`OK? ${response2.ok}`);

            if (response2.ok) {
                console.log(`${username}'s inventory successfully updated`);
                alert("Item added to inventory!");
                router.replace('/inventory')
            } else {
                console.error("Failed to save item", await response.text());
            }
        } else {
            console.error('Failed to save item', await response.text());
        }

    } catch (error) {
        console.error("Failed to save item", error);
    }
};

export default function IngredientPage() {
    const {session} = useSession(); // For storing ingredients: implement this
    const [ingredient, setIngredient] = useState<Ingredient | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { scannedData } = useLocalSearchParams();
    const [itemName, setItemName] = useState('');
    const [itemDesc, setItemDesc] = useState('');
    const parsedScannedData = scannedData ? parseInt(scannedData as string) : NaN;
    const router = useRouter();

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
                    <KeyboardAvoidingView 
                        style={styles.nameContainer}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        <TextInput 
                            style={styles.name}
                            placeholder="Ingredient name"
                            onChangeText={val => setItemName(val)}
                            multiline
                            submitBehavior="blurAndSubmit"
                        >
                            {ingredient.name}
                        </TextInput>
                    </KeyboardAvoidingView>
                    <KeyboardAvoidingView 
                        style={styles.imageContainer}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 25 : 0}
                    >
                        <Image source={{ uri: ingredient.imageUrl }} style={styles.image} />
                    </KeyboardAvoidingView>
                    <KeyboardAvoidingView 
                        style={styles.descriptionContainer}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 25 : 0}
                    >
                        <TextInput 
                            style={styles.description}
                            onChangeText={val => setItemDesc(val)}
                            multiline={true}
                            textAlignVertical='top'
                            submitBehavior='blurAndSubmit'
                            placeholder="Ingredient description"
                        >
                            {ingredient.description}
                        </TextInput>
                    </KeyboardAvoidingView>
                    <View 
                        style={styles.nutritionGradeContainer}
                    >
                        <Text style={styles.nutritionGrade}>{ingredient.nutritionGrade}</Text>
                    </View>
                    <View
                        style={styles.buttonContainer}
                    >
                        <Text
                            style={styles.button}
                            onPress={() => {
                                // Implement inventory functionality.
                                saveIngredient(session, ingredient);
                            }}
                        >
                            Save
                        </Text>
                        <Text
                            style={styles.button}
                            onPress={() => router.replace('/scanner')}>
                            Back
                        </Text>
                    </View>
                </>
            ) : (
                <>
                    <Text style={styles.name}>Unknown ingredient.</Text>
                    <Text
                        style={styles.button}
                        onPress={() => router.replace('/scanner')}>
                        Back
                    </Text>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        position: 'relative',
        padding: 10
    },
    nameContainer: {
        height: 150,
        padding: 10,
        marginTop: 30,
        justifyContent: 'center',
        borderColor: '#ffffff',
        color: '#ffffff'
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        width: 390,
        height: 140,
        borderColor: '#ffffff',
        borderWidth: 1,
        backgroundColor: '#141414',
        borderRadius: 10
    },
    imageContainer: {
        height: 200,
        marginBottom: 10
    },
    image: {
        width: 1000,
        height: 1000,
        resizeMode: 'contain',
        flex: 1,
        alignItems: 'center',
        borderColor: '#fff',
    },
    descriptionContainer: {
        height: 150,
        rowGap: 20
    },
    description: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#ffffff',
        marginBottom: 5,
        flex: 1,
        rowGap: 0,
        width: 380,
        height: 1000,
        borderColor: '#ffffff',
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#141414',
        borderRadius: 10
    },
    nutritionGradeContainer: {
        height: 150,
        marginTop: 5,
        marginBottom: 5
    },
    nutritionGrade: {
        fontSize: 25,
        color: 'green',
        fontWeight: 'bold',
        flex: 1
    },
    buttonContainer: {
        height: 150,
        padding: 5
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
       bottom: 100,
       left: 0,
       right: 0,
       padding: 10,
    },
    text: {
        fontSize: 18,
        color: '#ffffff',
    },
});

