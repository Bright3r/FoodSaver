import {useSession} from "@/app/ctx";
import React, {useCallback, useState} from "react";
import {router, useFocusEffect, useLocalSearchParams} from "expo-router";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import DismissibleTextInput from "../components/dismissableTextInput";



export default function EditRecipePage() {
    const { updateUser, user } = useSession();
    const { title, ingredients, preparationTime, instructions } = useLocalSearchParams();
    const [recipeTitle, setRecipeTitle] = useState(title as string);
    const [recipeIngredients, setRecipeIngredients] = useState(ingredients as string);
    const [recipeTime, setRecipeTime] = useState(Number(preparationTime));
    const [recipeInstructions, setRecipeInstructions] = useState(instructions as string);


    const saveRecipe = async(oldTitle:string, recipeTitle:string, recipeTime:number, recipeIngredients:string, recipeInstructions:string): Promise<void> => {
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
        //         for(var i = 0; i<updatedData['recipes'].length; i++){
        //             if(updatedData['recipes'][i].title === oldTitle){
        //                 updatedData['recipes'][i].title = recipeTitle;
        //                 updatedData['recipes'][i].preparationTime = recipeTime;
        //                 if(recipeIngredients === ""){
        //                     updatedData['recipes'][i].ingredients = [];
        //                 }
        //                 else{
        //                     updatedData['recipes'][i].ingredients = recipeIngredients.split("\n");
        //                 }
        //                 if(recipeInstructions === ""){
        //                     updatedData['recipes'][i].instructions = [];
        //                 }
        //                 else {
        //                     updatedData['recipes'][i].instructions = recipeInstructions.split("\n");
        //                 }
        //             }
        //         }
        //         console.log(`Recipe added: ${recipeTitle}`);
        //         console.log(`${username}'s recipes: ${JSON.stringify(updatedData['recipes'])}`);
        //         alert("Recipe edited!");
        //
        //         const response2 = await fetch(`http://${uri}/api/user`, {
        //             method: 'PUT',
        //             headers: {"Content-Type": "application/json"},
        //             body: JSON.stringify(updatedData)
        //         })
        //
        //         console.log(response2.status);
        //         console.log(`OK? ${response2.ok}`);
        //
        //         if (response2.ok) {
        //             console.log(`${username}'s recipes successfully updated`);
        //             router.replace('/recipes');
        //         } else {
        //             console.error("Failed to save recipe", await response.text());
        //         }
        //
        //         router.replace('/recipes');
        //     } else {
        //         console.error('Failed to save recipe', await response.text());
        //     }
        // } catch (error) {
        //     console.error("Failed to save recipe", error);
        // }
        if(user){
            for(var i = 0; i<user.recipes.length; i++){
                if(user.recipes[i].title === oldTitle){
                    user.recipes[i].title = recipeTitle;
                    user.recipes[i].preparationTime = recipeTime;
                    if(recipeIngredients === ""){
                        user.recipes[i].ingredients = [];
                    }
                    else{
                        user.recipes[i].ingredients = recipeIngredients.split("\n");
                    }
                    if(recipeInstructions === ""){
                        user.recipes[i].instructions = [];
                    }
                    else {
                        user.recipes[i].instructions = recipeInstructions.split("\n");
                    }
                }
            }
            console.log(`Recipe edited: ${recipeTitle}`);
            console.log(`${user.username}'s recipes: ${JSON.stringify(user.recipes)}`);
            alert("Recipe edited!");
            const response = await updateUser();
            if (!response.success) {
                console.error("Failed to save item", response.message);
            }
            router.replace('/recipes');
        }
    };

    const onChanged = (text:string) => {
        setRecipeTime(Number(text.replace(/[^0-9]/g, '')));
    }

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
                <DismissibleTextInput
                    style={styles.title}
                    placeholder="Recipe title"
                    onChangeText={val => setRecipeTitle(val)}
                    placeholderTextColor={"#696969"}
                    value={recipeTitle as string}
                >
                </DismissibleTextInput>
            </View>
            <DismissibleTextInput
                style={{borderColor: '#ffffff', borderWidth: 1, backgroundColor: '#141414', borderRadius: 10, marginBottom:10, paddingLeft: 10, color: '#fff', height: 40}}
                placeholder="Preparation time (minutes)"
                inputMode='numeric'
                onChangeText={val => onChanged(val)}
                placeholderTextColor={"#696969"}
                value={String(recipeTime)}
            >
            </DismissibleTextInput>
            <ScrollView
                style={{borderColor: '#ffffff', borderWidth: 1, backgroundColor: '#141414', borderRadius: 10, marginBottom:10, height: 50}}
                contentContainerStyle={{flexGrow: 1}}
            >
                <DismissibleTextInput
                    style={styles.description}
                    placeholder="Recipe ingredients&#10;New line for each ingredient"
                    submitBehavior='newline'
                    multiline={true}
                    onChangeText={val => setRecipeIngredients(val)}
                    placeholderTextColor={"#696969"}
                    textAlignVertical={"top"}
                    value={recipeIngredients as string}
                >
                </DismissibleTextInput>
            </ScrollView>
            <ScrollView
                style={{borderColor: '#ffffff', borderWidth: 1, backgroundColor: '#141414', borderRadius: 10, marginBottom:10, height: '40%'}}
                contentContainerStyle={{flexGrow: 1}}
            >
                <DismissibleTextInput
                    style={styles.description}
                    placeholder="Recipe instructions&#10;New line for each step"
                    submitBehavior='newline'
                    multiline={true}
                    onChangeText={val => setRecipeInstructions(val)}
                    placeholderTextColor={"#696969"}
                    textAlignVertical={"top"}
                    value={recipeInstructions as string}
                >
                </DismissibleTextInput>
            </ScrollView>
            <View style={{flexDirection: 'row',justifyContent: 'flex-end'}}>
                <Text
                    style={styles.savebutton}
                    onPress={() => {
                        // Implement inventory functionality.
                        saveRecipe(title as string, recipeTitle, recipeTime, recipeIngredients, recipeInstructions);
                    }}
                >
                    Save
                </Text>
            </View>
            <StatusBar style="light" backgroundColor={"#000000"}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
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
    },
    description: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#ffffff',
        padding: 10,
        flex: 1,
        width: '80%'
    },
    buttonContainer: {
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
        marginBottom: 10
    },
});

