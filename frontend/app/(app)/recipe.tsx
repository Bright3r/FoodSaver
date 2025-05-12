import React, {useCallback, useState} from "react";
import {router, useFocusEffect, useLocalSearchParams} from "expo-router";
import {Modal, StyleSheet, Text, View} from "react-native";
import {ScrollView} from "react-native";
import {StatusBar} from "expo-status-bar";
import {useSession} from "@/app/ctx";



export default function RecipePage() {
    const { title, ingredients, preparationTime, instructions } = useLocalSearchParams();
    const [isModalOpen, setModalOpen] = useState(false);
    const { updateUser, user } = useSession();

    const deleteRecipe = async(recipeTitle:string): Promise<void> => {
        // try {
        //     //set endpoint once it is created
        //     const uri =
        //         Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':8083') ??
        //         SERVER_URI;
        //     const response = await fetch(`http://${uri}/api/user?username=${username}`, {
        //         method: 'GET',
        //         headers: {'Content-Type': 'application/json'}
        //     })
        //
        //     console.log(`OK? ${response.ok}`);
        //     console.log(`Username: ${username}`);
        //
        //     if (response.ok) {
        //         const responseData = await response.json();
        //         let responseStr = JSON.stringify(responseData);
        //
        //
        //         console.log(`Updating recipes...`);
        //         let updatedData = JSON.parse(responseStr);
        //
        //         updatedData['recipes'] = updatedData['recipes'].filter((item: { title: string; }) => item.title !== recipeTitle);
        //         const response2 = await fetch(`http://${uri}/api/user`, {
        //             method: 'PUT',
        //             headers: {"Content-Type": "application/json"},
        //             body: JSON.stringify(updatedData)
        //         })
        //         console.log(`Recipe deleted: ${recipeTitle}`);
        //         console.log(`${username}'s recipes: ${JSON.stringify(updatedData['recipes'])}`);
        //         alert("Recipe deleted!");
        //
        //         console.log(response2.status);
        //         console.log(`OK? ${response2.ok}`);
        //
        //         if (response2.ok) {
        //             console.log(`${username}'s recipes successfully updated`);
        //             router.replace('/recipes');
        //         } else {
        //             console.error("Failed to delete recipe", await response.text());
        //         }
        //
        //         router.replace('/recipes');
        //     } else {
        //         console.error('Failed to delete recipe', await response.text());
        //     }
        // } catch (error) {
        //     console.error("Failed to delete recipe", error);
        // }
        try{
            if (user){
                user.recipes = user.recipes.filter((item: { title: string; }) => item.title !== recipeTitle);
            }

            // send update to server
            const response = await updateUser();
            if (!response.success) {
                console.error("Failed to delete recipe", response.message);
            }

            // refresh inventory
            router.replace('/recipes');
        } catch (error) {
            console.error("Failed to delete recipe", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if(!user){
                router.replace("/sign-in");
            }
        }, [])
    );

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
            <View style={{flexDirection: 'row',justifyContent: 'flex-end'}}>
                <Text
                    style={styles.savebutton}
                    onPress={() => {
                        router.push({
                            pathname: "/(app)/editrecipe",
                            params: { title, ingredients, preparationTime, instructions },
                        });
                    }}
                >
                    Edit
                </Text>
                <Text
                    style={styles.savebutton}
                    onPress={() => {
                        setModalOpen(true);
                    }}
                >
                    Delete
                </Text>
                <Modal transparent={true} visible={isModalOpen} animationType="fade" onRequestClose={() => setModalOpen(false)}>
                    <View style={{flex:1, justifyContent:'center', alignItems: 'center', backgroundColor: "#000000"}}>
                        <View style={{flex:1, justifyContent:'center', alignItems: 'center', backgroundColor: "#000000"}}>
                            <Text style={{color: '#ffffff', fontSize: 24}}>Delete this recipe?</Text>
                        </View>
                        <View style={{flex:1, justifyContent:'center', alignItems: 'center', backgroundColor: "#000000"}}>
                            <Text
                                style={styles.savebuttontext}
                                onPress={() => {
                                    deleteRecipe(title as string);
                                    setModalOpen(false);
                                }}
                            >
                                Confirm
                            </Text>
                            <Text style={styles.savebuttontext} onPress={() => setModalOpen(false)}>
                                Cancel
                            </Text>
                        </View>
                    </View>
                </Modal>
            </View>
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
    savebuttontext: {
        color: '#fff',
        textAlign: 'center',
        textAlignVertical: 'center',
        width: 100,
        fontSize: 30,
        marginBottom: 10
    },
    savebutton: {
        color: '#fff',
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 10,
        textAlign: 'center',
        textAlignVertical: 'center',
        width: 110,
        height: 40,
        padding: 10,
        margin: 10
    },
});

