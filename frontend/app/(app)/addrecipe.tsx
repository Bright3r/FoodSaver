import {useSession} from "@/app/ctx";
import React, {useState} from "react";
import {router, useRouter} from "expo-router";
import {ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {StatusBar} from "expo-status-bar";

const saveRecipe = async(username:string | null | undefined, recipeName:string, recipeDescription:string): Promise<void> => {
    // try {
    //     //set endpoint once it is created
    //     const uri =
    //         Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':8083') ??
    //         '192.168.0.44:8083';
    //     const response = await fetch(`http://${uri}/api/auth/signup`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ username: username, recipeName: recipeName, recipeDescription: recipeDescription })
    //     });
    //
    //     console.log(response.status);
    //     console.log(`OK? ${response.ok}`);
    //     console.log(`Username: ${username}`);
    //
    //     if (response.ok) {
    //         console.log(`Recipe has been added for ${username}`);
    //         alert("Recipe saved!");
    //         router.replace('/recipes')
    //     } else {
    //         console.error("Failed to save recipe", await response.text());
    //     }
    //
    // } catch (error) {
    //     console.error("Failed to save recipe", error);
    // }
    router.replace('/recipes');
};

export default function AddRecipePage() {
    const {session} = useSession();
    const [recipeName, setRecipeName] = useState('');
    const [recipeDesc, setRecipeDesc] = useState('');



    return(
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TextInput
                    style={styles.title}
                    placeholder="Recipe title"
                    onChangeText={val => setRecipeName(val)}
                    placeholderTextColor={"#696969"}
                />

            </View>
            <ScrollView
                style={{borderColor: '#ffffff', borderWidth: 1, backgroundColor: '#141414', borderRadius: 10,marginBottom:10}}
                contentContainerStyle={{flexGrow: 1}}
            >
                <TextInput
                    style={styles.description}
                    placeholder="Recipe description"
                    onChangeText={val => setRecipeDesc(val)}
                    placeholderTextColor={"#696969"}
                    textAlignVertical={"top"}
                />
            </ScrollView>
            <View style={{flexDirection: 'row',justifyContent: 'flex-end'}}>
                <Text
                    style={styles.savebutton}
                    onPress={() => {
                        // Implement inventory functionality.
                        saveRecipe(session, recipeName, recipeDesc);
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
        flex:1,
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

