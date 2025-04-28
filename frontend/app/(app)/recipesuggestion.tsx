import {Text, View, StyleSheet, FlatList, TextInput, Modal} from 'react-native';
import {router} from "expo-router";
import React, {useState} from "react";
import { StatusBar } from 'expo-status-bar';
import Constants from "expo-constants";
import { SERVER_URI } from '@/const';



export default function RecipeSuggestions() {
    const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([]);
    const [isLoading, setLoading] = useState(false);

    //sample recipe data
    //just a title and description for each recipe for now
    interface Recipe {
        title:string;
        ingredients:string[];
        preparationTime:number;
        instructions:string[];
    }

    type ItemProps = {title: string, ingredients: string, preparationTime: number, instructions: string, };


    const SuggestedItem = ({title, ingredients, preparationTime, instructions}: ItemProps) =>
        <View style={styles.item}>
            <Text
                style= {styles.title}
                onPress={() => {
                    router.push({
                        pathname: "/addsuggestedrecipe",
                        params: { title, ingredients, preparationTime, instructions },
                    });
                }}>
                {title}
            </Text>
        </View>
    ;


    const suggestionSearch = async (ingredients:string) => {
        try {
            setLoading(true);
            console.log(`Ingredients: ${ingredients}`);
            const uri =
                Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':8083') ??
                SERVER_URI;
            await fetch(`http://${uri}/api/recipe/search`, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(ingredients)
            })
                .then(res => res.json())
                .then((data: any) => {
                    console.log("Retrieving recipes...");
                    setSuggestedRecipes(data ?? []);

                    const recipesStr = JSON.stringify(data);
                    console.log(`Recipes: ${recipesStr}`);
                });
            setLoading(false);
        } catch (error) {
            console.error("Failed to get recipes", error);
            setLoading(false);
        }

    };

    return (
        <View style={styles.container}>
            <TextInput
                style={{color: '#fff', width: "auto", height: 50, borderWidth: 1, borderColor: '#ffffff', borderRadius: 10, marginBottom: 5}}
                placeholder="Ingredients (comma separated, press enter to submit)"
                placeholderTextColor="#696969"
                onSubmitEditing={e=>suggestionSearch(e["nativeEvent"]["text"])}
            />
            <FlatList
                data={suggestedRecipes}
                renderItem={({item}) => <SuggestedItem title={item.title} ingredients={item.ingredients.join("\n")} preparationTime={item.preparationTime} instructions={item.instructions.join("\n")}/>}
            />
            <StatusBar style="light" backgroundColor={"#000000"}/>
            <Modal transparent={true} visible={isLoading} animationType="fade">
                <View style={styles.container}>
                    <Text
                        style={{color: '#fff',fontSize: 30,textAlign: 'center', textAlignVertical: 'center',}}>
                        {"Processing..."}
                    </Text>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    text: {
        color: '#fff',
    },
    item: {
        borderColor: '#ffffff',
        borderWidth: 1,
        backgroundColor: '#141414',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        color:'#ffffff',
        textAlign: 'center',
        width: '100%'
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
        height: 50,
        fontSize: 30,
        position: "absolute",
        top: 60,
        right: 15,
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
    suggestionbutton: {
        color: '#fff',
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 10,
        textAlign: 'center',
        textAlignVertical: 'center',
        width: "auto",
        height: 50,
        padding: 10,
        marginBottom: 10,
        fontSize: 25
    },
});
