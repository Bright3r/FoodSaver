import React, { useState, useEffect } from 'react';
import { useSession } from '../ctx';
import { 
    View, 
    Text,
    StyleSheet, 
    Image,
    Button,
    Modal,
    Platform,
    KeyboardAvoidingView } from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {StatusBar} from "expo-status-bar";
import DateTimePicker from '@react-native-community/datetimepicker'
import DismissibleTextInput from '../components/dismissableTextInput';
import { Product } from '@/interfaces';


const fetchIngredientData = async (productCode: number): Promise<Product | null> => {
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
                imageURL: product.image_url || '',
                qty: 1,
                purchaseDate: new Date(),
                expirationDate: new Date(),
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error: item fetch failed.", error);
        return null;
    }
};


export default function IngredientPage() {
    const [ingredient, setIngredient] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { scannedData } = useLocalSearchParams();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isPurchase, setIsPurchase] = useState(false);
    const [isExpiry, setIsExpiry] = useState(false);
    const [formattedPurchase, setFormattedPurchase] = useState("");
    const [formattedExpiry, setFormattedExpiry] = useState("");
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate()+1);
    const router = useRouter();
    const {getUser, updateUser} = useSession();

    const saveIngredient = async (
    ingredient:Product): Promise<void> => {
        const user = await getUser();

        if(ingredient.name !== "") {
            try {
                if (user) {
                    let inventory = user.inventory;

                    // if (isEdit && originalName) {
                    //     inventory = inventory.filter((i: Product) => i.name !== originalName);
                    // }
                    // console.log(expiration);
                    var i = inventory.findIndex(p => p.name === ingredient.name)
                    //item already exists increment quantity
                    if (i > -1) {
                        user.inventory[i].qty++;
                    }
                    //need to add new item
                    else {
                        // console.log(ingredient.imageUrl);
                        inventory.push(ingredient);
                        user.inventory = inventory;
                        console.log(user.inventory);
                    }
                    const response = await updateUser(user);
                    console.log(user.inventory);
                    if (response.success) {
                        alert("Item added to inventory!");
                    } else {
                        console.error("Failed to save item", response.message);
                    }
                } else {
                    console.error('Failed to save item - Internal Error');
                }

            } catch (error) {
                console.error("Failed to save item", error);
            }
            router.replace("./inventory");
        }
        else {
            alert("No name!");
        }
    };

    const formatDate = (date: Date | undefined):string => {
        if(date) {
            return date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            }) as string;
        }
        return "";
    };

    useEffect(() => {
        const getIngredient = async (scannedData: string | string[]) => {
            const user = await getUser();

            if(user) {
                setLoading(true);
                //scanned ingredient
                if(scannedData) {
                    const parsedScannedData = Number(scannedData as string);
                    console.log("Loading ingredient from scannedData " + parsedScannedData);
                    const fetchedIngredient = await fetchIngredientData(parsedScannedData);
                    fetchedIngredient?.expirationDate.setDate(fetchedIngredient?.expirationDate.getDate() + 1);
                    setIngredient(fetchedIngredient);
                    setFormattedPurchase(formatDate(fetchedIngredient?.purchaseDate));
                    setFormattedExpiry(formatDate(fetchedIngredient?.expirationDate));
                }
                //custom ingredient
                else{
                    setIngredient({
                        name: "",
                        description: "",
                        nutritionGrade: "",
                        imageURL: '',
                        qty: 1,
                        purchaseDate: today,
                        expirationDate: tomorrow,
                    })
                    setFormattedPurchase(formatDate(today));
                    setFormattedExpiry(formatDate(tomorrow));
                }
                setLoading(false);
            }
            else{
                router.replace("/sign-in")
            }
        };
        getIngredient(scannedData);
    }, [scannedData])

    const onChanged = (text:string) => {
        if(ingredient) {
            ingredient.qty = Number(text.replace(/[^0-9]/g, ''));
        }
    }

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
                            onChangeText={val => ingredient.name = val}
                            multiline
                            submitBehavior="blurAndSubmit"
                            placeholderTextColor={"#696969"}
                        >
                            {ingredient.name}
                        </DismissibleTextInput >
                    </KeyboardAvoidingView>
                    <KeyboardAvoidingView 
                        style={styles.imageContainer}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 25 : 0}
                    >
                        <Image source={{ uri: ingredient.imageURL }} style={styles.image} />
                    </KeyboardAvoidingView>
                    <KeyboardAvoidingView
                        style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                        <Text
                            style={{marginBottom:10, marginTop:10, marginRight:20, color: '#fff', height: 40, fontSize: 20, fontWeight: "bold", }}>
                            Quantity:
                        </Text>
                        <DismissibleTextInput
                            style={{
                                borderColor: '#ffffff',
                                borderWidth: 1,
                                backgroundColor: '#141414',
                                borderRadius: 10,
                                marginBottom:10,
                                color: '#fff',
                                height: 40,
                                width: 50,
                                textAlign: "center"}}
                            inputMode='numeric'
                            onChangeText={val => onChanged(val)}
                        >
                            {ingredient.qty}
                        </DismissibleTextInput>
                    </KeyboardAvoidingView>
                    <KeyboardAvoidingView 
                        style={styles.descriptionContainer}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 25 : 0}
                    >
                        <DismissibleTextInput
                            style={styles.description}
                            onChangeText={val => ingredient.description = val}
                            multiline={true}
                            textAlignVertical='top'
                            submitBehavior='blurAndSubmit'
                            placeholder="Ingredient description"
                            placeholderTextColor={"#696969"}
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
                            style={styles.datebutton}
                            onPress={() => {
                                setIsPurchase(true);
                                setShowDatePicker(true);
                            }}
                        >
                            Purchased: {formattedPurchase}
                        </Text>
                        <Text
                            style={styles.datebutton}
                            onPress={() => {
                                setIsExpiry(true);
                                setShowDatePicker(true);
                            }}
                        >
                            Expires: {formattedExpiry}
                        </Text>
                        <Button
                            title="Save"
                            onPress={() => {
                                setShowDatePicker(false);
                                setModalOpen(true);
                            }}
                        />

                        {showDatePicker && (
                            Platform.OS === 'android' ? (
                                <>
                                    <DateTimePicker
                                        value={isExpiry ? ingredient.expirationDate : ingredient.purchaseDate}
                                        mode="date"
                                        display="calendar"
                                        //set minimum date based on whether we are dealing with expiration date or purchase date
                                        minimumDate={isExpiry ? tomorrow : new Date(1960, 0, 1)}
                                        maximumDate={isExpiry ? new Date(2100, 0, 1) : today}
                                        onChange={(event, selectedDate) => {
                                            if (selectedDate) {
                                                if(isExpiry) {
                                                    ingredient.expirationDate = selectedDate;
                                                    setFormattedExpiry(formatDate(ingredient.expirationDate) as string);
                                                }
                                                else if(isPurchase) {
                                                    ingredient.purchaseDate = selectedDate;
                                                    setFormattedPurchase(formatDate(ingredient.purchaseDate) as string);
                                                }
                                            }
                                            if(event.type === "dismissed" || event.type === "set") {
                                                if(isExpiry) {
                                                    setIsExpiry(false);
                                                    setShowDatePicker(false);
                                                }
                                                else if(isPurchase) {
                                                    setIsPurchase(false);
                                                    setShowDatePicker(false);
                                                }
                                            }
                                        }}
                                    />
                                </>
                            ) : (
                                <Modal transparent={true} animationType="fade" visible={showDatePicker}>
                                <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#000000aa'}}>
                                    <View style={{ backgroundColor: '#222', margin: 20, borderRadius: 10, padding: 20 }}>
                                    <DateTimePicker
                                        value={isExpiry ? ingredient.expirationDate : ingredient.purchaseDate}
                                        mode="date"
                                        display="spinner"
                                        minimumDate={isExpiry ? tomorrow : new Date(1960, 0, 1)}
                                        maximumDate={isExpiry ? new Date(2100, 0, 1) : today}
                                        onChange={(event, selectedDate) => {
                                            if (selectedDate) {
                                                if(isExpiry) {
                                                    ingredient.expirationDate = selectedDate;
                                                    setFormattedExpiry(formatDate(ingredient.expirationDate) as string);
                                                }
                                                else if(isPurchase) {
                                                    ingredient.purchaseDate = selectedDate;
                                                    setFormattedPurchase(formatDate(ingredient.purchaseDate) as string);
                                                }
                                            }
                                            if(event.type === "dismissed" || event.type === "set") {
                                                if(isExpiry) {
                                                    setIsExpiry(false);
                                                    setShowDatePicker(false);
                                                }
                                                else if(isPurchase) {
                                                    setIsPurchase(false);
                                                    setShowDatePicker(false);
                                                }
                                            }
                                        }}
                                    />
                                    {/*<Button*/}
                                    {/*    title="Done"*/}
                                    {/*    onPress={() => {*/}
                                    {/*        setExpirationDate(tempDate); // Apply date only when confirmed*/}
                                    {/*        setShowDatePicker(false);*/}
                                    {/*        setModalOpen(true); // Open confirmation modal*/}
                                    {/*    }}*/}
                                    {/*/>*/}
                                    {/*<Button*/}
                                    {/*    title="Cancel"*/}
                                    {/*    onPress={() => {*/}
                                    {/*        setShowDatePicker(false);*/}
                                    {/*    }}*/}
                                    {/*    color="#999"*/}
                                    {/*/>*/}
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
                                            if (saving) return;
                                            setSaving(true);
                                            saveIngredient(ingredient);
                                            setSaving(false);
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
        alignItems: 'center',
        padding: 10
    },
    nameContainer: {
        height: 55,
        padding: 10,
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
        height: 30,
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
        padding: 5,
        alignItems: 'center',
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
        padding: 10,
        marginBottom: 10
    },
    datebutton: {
        color: '#fff',
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 10,
        textAlign: 'center',
        textAlignVertical: 'center',
        width: 200,
        height: 40,
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

