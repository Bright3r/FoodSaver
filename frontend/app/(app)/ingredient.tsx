import React, { useState, useEffect } from 'react';
import { useSession } from '../ctx';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    Image, 
    Alert,
    Button, 
    Keyboard,
    Modal,
    Platform,
    Dimensions, 
    KeyboardAvoidingView } from 'react-native';
import {useRouter, useLocalSearchParams, router} from 'expo-router';
import Constants from 'expo-constants';
import {StatusBar} from "expo-status-bar";
import DateTimePicker from '@react-native-community/datetimepicker'
import { Ingredient } from '../ingredientInterface';
import { SERVER_URI } from '@/const';
import DismissibleTextInput from '../components/dismissableTextInput';


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



/*
 * Features to add:
 *  User inputs their purchase date.
 * 
 **/
const saveIngredient = async(username:string | null | undefined,  
    ingredient:Ingredient, expiration:Date): Promise<void> => {
    try {
        const uri =
            Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':8083') ??
            SERVER_URI;
        const getResponse = await fetch(`http://${uri}/api/user?username=${username}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });
        console.log(getResponse.status);
        console.log(`OK? ${getResponse.ok}`);
        console.log(`Username: ${username}`);
        
        if (getResponse.ok) {
            const responseData = await getResponse.json();
            let responseStr = JSON.stringify(responseData);
            console.log(`Response Data: ${responseStr}`);

            const today = new Date();

            console.log(`Updating inventory...`);
            let updatedData = JSON.parse(responseStr);

            updatedData['inventory'].push({
                name: ingredient.name,
                qty: 1,
                purchaseDate: today, // User should be able to set their own purchase date.
                expirationDate: expiration
            });

            console.log(`Item added: ${ingredient.name}`);
            console.log(`${username}'s inventory: ${JSON.stringify(updatedData['inventory'])}`);

            const putResponse = await fetch(`http://${uri}/api/user`, {
                method: 'PUT',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(updatedData)
            })

            console.log(putResponse.status);
            console.log(`OK? ${putResponse.ok}`);

            if (putResponse.ok) {
                console.log(`${username}'s inventory successfully updated`);
                alert("Item added to inventory!");
                router.push({
                    pathname: './inventory',
                    params: { key: Date.now().toString() }
                });
            } else {
                console.error("Failed to save item", await getResponse.text());
            }
        } else {
            console.error('Failed to save item', await getResponse.text());
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
    const [confirmItemSave, setConfirmItemSave] = useState(false);
    const [itemName, setItemName] = useState('');
    const [itemDesc, setItemDesc] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const parsedScannedData = scannedData ? parseInt(scannedData as string) : NaN;
    const { refresh } = useLocalSearchParams();
    const [expirationDate, setExpirationDate] = useState<Date>(new Date());
    const today = new Date();
    const router = useRouter();
    const [tempDate, setTempDate] = useState<Date>(expirationDate)

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
                        <DismissibleTextInput 
                            style={styles.name}
                            placeholder="Ingredient name"
                            onChangeText={val => setItemName(val)}
                            multiline
                            submitBehavior="blurAndSubmit"
                        >
                            {ingredient.name}
                        </DismissibleTextInput >
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
                        <DismissibleTextInput 
                            style={styles.description}
                            onChangeText={val => setItemDesc(val)}
                            multiline={true}
                            textAlignVertical='top'
                            submitBehavior='blurAndSubmit'
                            placeholder="Ingredient description"
                        >
                            {ingredient.description}
                        </DismissibleTextInput >
                    </KeyboardAvoidingView>
                    <View 
                        style={styles.nutritionGradeContainer}
                    >
                        <Text style={styles.nutritionGrade}>
                            Nutrition Score: {ingredient.nutritionGrade}
                        </Text>
                    </View>
                    <View
                        style={styles.buttonContainer}
                    >
                        <Text
                            style={styles.button}
                            onPress={() => {
                                setShowDatePicker(true);
                                console.log("SHOW DATE PICKER")
                                Keyboard.dismiss();
                                // setModalOpen(true);
                            }}
                        >
                            Save
                        </Text>
                        <Text style={styles.button} onPress={() => router.back()}>Back</Text>

                        {showDatePicker && (
                            Platform.OS === 'android' ? (
                                <>
                                    <DateTimePicker
                                        value={expirationDate}
                                        mode="date"
                                        display="calendar"
                                        minimumDate={today}
                                        maximumDate={new Date(2026, 5, 1)}
                                        onChange={(event, selectedDate) => {
                                            if (selectedDate) {
                                                setTempDate(selectedDate);
                                            }
                                        }}
                                    />
                                    <Button
                                        title="Done"
                                        onPress={() => {
                                            setExpirationDate(tempDate);
                                            setShowDatePicker(false);
                                            setModalOpen(true);
                                        }}
                                    />
                                </>
                            ) : (
                                <Modal transparent={true} animationType="fade" visible={showDatePicker}>
                                <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#000000aa' }}>
                                    <View style={{ backgroundColor: '#222', margin: 20, borderRadius: 10, padding: 20 }}>
                                    <DateTimePicker
                                        value={tempDate}
                                        mode="date"
                                        display="spinner"
                                        minimumDate={today}
                                        maximumDate={new Date(2026, 5, 1)}
                                        onChange={(event, selectedDate) => {
                                        if (selectedDate) {
                                            setTempDate(selectedDate); // Only update the temporary date
                                        }
                                        }}
                                    />
                                    <Button
                                        title="Done"
                                        onPress={() => {
                                        setExpirationDate(tempDate); // Apply date only when confirmed
                                        setShowDatePicker(false);
                                        setModalOpen(true); // Open confirmation modal
                                        }}
                                    />
                                    <Button
                                        title="Cancel"
                                        onPress={() => {
                                        setShowDatePicker(false);
                                        }}
                                        color="#999"
                                    />
                                    </View>
                                </View>
                                </Modal>
                            )
                        )}



                        <Modal transparent={true} visible={isModalOpen} animationType="fade" onRequestClose={() => setModalOpen(false)}>
                            <View style={{flex:1, justifyContent:'center', alignItems: 'center', backgroundColor: "#000000"}}>
                                <View style={{flex:1, justifyContent:'center', alignItems: 'center', backgroundColor: "#000000"}}>
                                    <Text style={{color: '#ffffff', fontSize: 24}}>Save this item to inventory?</Text>
                                </View>
                                <View style={{flex:1, justifyContent:'center', alignItems: 'center', backgroundColor: "#000000"}}>
                                    <Text
                                        style={styles.button}
                                        onPress={() => {
                                            saveIngredient(session, ingredient, expirationDate);
                                            router.replace({
                                                pathname: '/(app)/(tabs)/inventory',
                                                params: { 
                                                    key: Date.now.toString()
                                                 }
                                            });
                                            setModalOpen(false);
                                        }}
                                        >
                                            Confirm
                                        </Text>
                                        <Text style={styles.button} onPress={() => setModalOpen(false)}>
                                            Cancel
                                        </Text>
                                </View>
                            </View>
                        </Modal>
                        
                    </View>
                </>
            ) : (
                <>
                    <Text style={styles.name}>Unknown ingredient.</Text>
                    <Text style={styles.button} onPress={() => router.back()}>Back</Text>
                </>
            )}
            <StatusBar style="light" backgroundColor={"#000000"}/>
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
    expirationDateContainer: {
        height: 10,
        rowGap: 0
    },
    expirationDate: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#ffffff',
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
        marginBottom: 10
    },
    modalContainer: {
        marginBottom: 20,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: '#ffffff',
    },
});

