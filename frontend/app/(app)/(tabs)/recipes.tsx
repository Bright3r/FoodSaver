import {Text, View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { useSession } from '@/app/ctx';
import {router, useFocusEffect} from "expo-router";
import React, {useCallback, useState} from "react";
import { StatusBar } from 'expo-status-bar';
import Ionicons from "@expo/vector-icons/Ionicons";
import DismissibleTextInput from "@/app/components/dismissableTextInput";
import {Recipe} from "@/interfaces"



export default function Recipes() {
    const { getUser, hasUser } = useSession();
    const [recipeList, setRecipeList] = useState<Recipe[]>([]);
    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
    const [searchText, setSearchText] = useState("");



    type ItemProps = {title: string, ingredients: string, preparationTime: number, instructions: string, };

    const Item = ({title, ingredients, preparationTime, instructions}: ItemProps) =>
        <View style={styles.item}>
            <Text
                style= {styles.title}
                onPress={() => {
                    router.push({
                        pathname: "/recipe",
                        params: { title, ingredients, preparationTime, instructions, readonly: "false" },
                    });
                }}>
                {title}
            </Text>
        </View>
    ;


    //implement recipe endpoint
    const getRecipes = async () => {
        // try {
        //     const uri =
        //         Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':8083') ??
        //         SERVER_URI;
        //     await fetch(`http://${uri}/api/user?username=${username}`, {
        //         method: 'GET',
        //         headers: {'Content-Type': 'application/json'}
        //     })
        //     .then(res => res.json())
        //     .then((data: any) => {
        //         console.log("Retrieving recipes...");
        //         setRecipeList(data.recipes ?? []);
        //         setAllRecipes(data.recipes ?? []);
        //
        //         // DEBUG: inventoryStr - for checking the correctness of response data.
        //         const recipesStr = JSON.stringify(data.recipes);
        //         console.log(`Recipes: ${recipesStr}`);
        //     });
        // } catch (error) {
        //     console.error("Failed to get recipes", error);
        // }
        let user = await getUser();
        if(user){
            setRecipeList(user.recipes);
            setAllRecipes(user.recipes);
        }

    };

    //implement recipe endpoint
    const searchRecipes = async (searchText:string) => {
        //searches based on substrings in the title or ingredients
        setRecipeList(allRecipes.filter((item: { title: string; ingredients: string[]; }) => item.title.toLowerCase().includes(searchText) || item.ingredients.some(e => e.toLowerCase().includes(searchText))));
    };


    useFocusEffect(
        useCallback(() => {
            setSearchText("");
            if(hasUser()){
                getRecipes();
            }
            else{
                router.replace("/sign-in");
            }
        }, [])
    );

    return (
        <View style={styles.container}>
            <DismissibleTextInput
                style={{color: '#fff', width: "auto", height: 50, borderWidth: 1, borderColor: '#ffffff', borderRadius: 10, marginBottom: 5, backgroundColor: '#1a1a1a'}}
                placeholder="Search"
                placeholderTextColor="#696969"
                onChangeText={val=>{
                    setSearchText(val);
                    searchRecipes(val);
                }}
                value={searchText}
            />
            <FlatList
                data={recipeList}
                renderItem={({item}) => <Item title={item.title} ingredients={item.ingredients.join("\n")} preparationTime={item.preparationTime} instructions={item.instructions.join("\n")}/>}
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.navigate("/addrecipe")}
            >
                <Ionicons name="add-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.navigate("/recipesuggestion")}
            >
                <Ionicons name="bulb-outline" size={24} color="#ffffff" />
                <Text style={styles.fabText}>Suggestions</Text>
            </TouchableOpacity>
            <StatusBar style="light" backgroundColor={"#000000"}/>
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
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        padding: 20,
        marginVertical: 5,
        alignItems: 'center',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
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
        top: "0%",
        right: "5%",
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
        width: 70,
        height: 70,
        position: "absolute",
        top: "87%",
        right: "10%",
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#1a1a1a',
        borderRadius: 30,
        paddingHorizontal: 17,
        paddingVertical: 17,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    fab: {
        position: 'absolute',
        left: 20,
        bottom: 20,
        backgroundColor: '#1a1a1a',
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 17,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    fabText: {
        color: '#ffffff',
        marginLeft: 8,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
