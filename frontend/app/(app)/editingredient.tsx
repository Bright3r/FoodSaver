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
import {StatusBar} from "expo-status-bar";
import DateTimePicker from '@react-native-community/datetimepicker'
import DismissibleTextInput from '../components/dismissableTextInput';
import { Product } from '@/interfaces';


export default function IngredientPage() {
    let [ingredient, setIngredient] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { itemName } = useLocalSearchParams();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isPurchase, setIsPurchase] = useState(false);
    const [isExpiry, setIsExpiry] = useState(false);
    const [formattedPurchase, setFormattedPurchase] = useState("");
    const [formattedExpiry, setFormattedExpiry] = useState("");
    const today = new Date();
    const overmorrow = new Date();
    overmorrow.setDate(overmorrow.getDate()+2);
    const originalName = ingredient?.name;
    const router = useRouter();
    const {user, updateUser} = useSession();


    // const saveIngredient = async (
    // ingredient:Ingredient, expiration:Date, isEdit:boolean, originalName?:string): Promise<void> => {
    //     try {
    //         if (user) {
    //             let inventory = user.inventory;
    //
    //             if (isEdit && originalName) {
    //                 inventory = inventory.filter((i: Product) => i.name !== originalName);
    //             }
    //             console.log(expiration);
    //
    //             inventory.push({
    //                 name: ingredient.name,
    //                 qty: 1,
    //                 purchaseDate: purchased, // User should be able to set their own purchase date.
    //                 expirationDate: expiration,
    //                 purchaseDate: Date,
    //                 expirationDate: Date,
    //             });
    //
    //             user.inventory = inventory;
    //             const response = await updateUser();
    //             if (response.success) {
    //                 alert(isEdit ? "Item updated!" : "Item added to inventory!");
    //                 router.push({
    //                     pathname: './inventory',
    //                     params: { key: Date.now().toString() }
    //                 });
    //             } else {
    //                 console.error("Failed to save item", response.message);
    //             }
    //         } else {
    //             console.error('Failed to save item - Internal Error');
    //         }
    //
    //     } catch (error) {
    //         console.error("Failed to save item", error);
    //     }
    // };

    const saveIngredient = async (
        ingredient:Product, originalName:string): Promise<void> => {
        if(ingredient.name !== "") {
            try {
                if (user) {
                    //find the ingredient and change its attributes
                    for (var i = 0; i < user.inventory.length; i++) {
                        if (user.inventory[i].name === originalName) {
                            user.inventory[i].name = ingredient.name;
                            user.inventory[i].qty = ingredient.qty;
                            user.inventory[i].description = ingredient.description;
                            user.inventory[i].nutritionGrade = ingredient.nutritionGrade;
                            user.inventory[i].purchaseDate = ingredient.purchaseDate;
                            user.inventory[i].expirationDate = ingredient.expirationDate;
                        }
                    }
                    const response = await updateUser();
                    if (response.success) {
                        alert("Item added to inventory!");
                        router.replace("./inventory");
                    } else {
                        console.error("Failed to save item", response.message);
                    }
                } else {
                    console.error('Failed to save item - Internal Error');
                }

            } catch (error) {
                console.error("Failed to save item", error);
            }
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
        return "failed";
    };

    const onChanged = (text:string) => {
        if(ingredient) {
            ingredient.qty = Number(text.replace(/[^0-9]/g, ''));
        }
    }

    useEffect(() => {
        // const getIngredient = async (itemData: string | string[]) => {
        //     setLoading(true);
        //     if(user) {
        //         if (itemData) {
        //             console.log("Loading ingredient from itemData");
        //             const parsedItem = JSON.parse(itemData as string);
        //             setIngredient({
        //                 name: parsedItem.name,
        //                 description: parsedItem.description ?? "Unknown description",
        //                 nutritionGrade: parsedItem.nutritionGrade ?? "Unknown",
        //                 imageUrl: parsedItem.imageUrl ?? ''
        //             });
        //             setItemName(parsedItem.name);
        //             setItemDesc(parsedItem.description);
        //             setExpirationDate(parsedItem.expirationDate);
        //             setPurchased(parsedItem.purchaseDate);
        //         }
        //         else {
        //             console.error("No scannedData or itemData.");
        //         }
        //
        //         setLoading(false);
        //     }
        //     else{
        //         router.replace("/sign-in")
        //     }
        // };
        const getIngredient = async () => {
            if (user) {
                setLoading(true);
                var itemInfo = user.inventory.find((element) => element.name === JSON.parse(itemName as string))
                if(itemInfo) {
                    itemInfo.purchaseDate = new Date(itemInfo.purchaseDate)
                    itemInfo.expirationDate = new Date(itemInfo.expirationDate)
                    setIngredient(itemInfo);
                    setFormattedPurchase(formatDate(itemInfo.purchaseDate));
                    setFormattedExpiry(formatDate(itemInfo.expirationDate));
                }
                setLoading(false);
            } else {
                router.replace("/sign-in")
            }
        }
        getIngredient();
    }, [itemName])

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
                        {formattedPurchase &&
                            <Text
                                style={styles.datebutton}
                                onPress={() => {
                                    setIsPurchase(true);
                                    setShowDatePicker(true);
                                }}
                            >
                                Purchased: {formattedPurchase}
                            </Text>}

                        {formattedExpiry &&
                            <Text
                            style={styles.datebutton}
                            onPress={() => {
                                setIsExpiry(true);
                                setShowDatePicker(true);
                            }}
                        >
                            Expires: {formattedExpiry}
                        </Text>}
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
                                        minimumDate={isExpiry ? overmorrow : new Date(1960, 0, 1)}
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
                                                minimumDate={isExpiry ? overmorrow : new Date(1960, 0, 1)}
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
                                            // const updatedIngredient: Product = {
                                            //     ...ingredient,
                                            //     name: itemName || ingredient.name,
                                            //     description: itemDesc || ingredient.description,
                                            //     imageUrl: ingredient.imageUrl,
                                            //     nutritionGrade: ingredient.nutritionGrade
                                            // };
                                            saveIngredient(ingredient, originalName as string);
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
        height: 150,
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

