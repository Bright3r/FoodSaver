import {Text, View, StyleSheet, FlatList, TextInput} from 'react-native';
import { useSession } from '@/app/ctx';
import {router, useFocusEffect} from "expo-router";
import React, {useCallback, useState} from "react";
import { StatusBar } from 'expo-status-bar';
import Constants from "expo-constants";



export default function Recipes() {
    const { session } = useSession();
    const [recipeList, setRecipeList] = useState<Recipe[]>([]);

    //sample recipe data
    //just a title and description for each recipe for now
    interface Recipe {
        title:string;
        ingredients:string[];
        preparationTime:number;
        instructions:string[];
    }

    type ItemProps = {title: string, ingredients: string, preparationTime: number, instructions: string, };

    const Item = ({title, ingredients, preparationTime, instructions}: ItemProps) =>
        <View style={styles.item}>
            <Text
                style= {styles.title}
                onPress={() => {
                    router.push({
                        pathname: "/recipe",
                        params: { title, ingredients, preparationTime, instructions },
                    });
                }}>
                {title}
            </Text>
        </View>
    ;



    //implement recipe endpoint
    const getRecipes = async (username:string | null | undefined) => {
        try {
            const uri =
                Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':8083') ??
                '192.168.0.44:8083';
            await fetch(`http://${uri}/api/user?username=${username}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            })
            .then(res => res.json())
            .then((data: any) => {
                console.log("Retrieving recipes...");
                setRecipeList(data.recipes ?? []);

                // DEBUG: inventoryStr - for checking the correctness of response data.
                const recipesStr = JSON.stringify(data.recipes);
                console.log(`Recipes: ${recipesStr}`);
            });
        } catch (error) {
            console.error("Failed to get recipes", error);
        }

    };

    useFocusEffect(
        useCallback(() => {
            getRecipes(session);
        }, [session])
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={{color: '#fff', width: "auto", height: 50, borderWidth: 1, borderColor: '#ffffff', borderRadius: 10, marginBottom: 5}}
                placeholder="Search"
                placeholderTextColor="#696969"
                onChangeText={()=>{}}
            />
            <FlatList
                data={recipeList}
                renderItem={({item}) => <Item title={item.title} ingredients={item.ingredients.join("\n")} preparationTime={item.preparationTime} instructions={item.instructions.join("\n")}/>}
            />
            <Text
                style={styles.button}
                onPress={() => router.navigate('/addrecipe')}>
                {"+"}
            </Text>
            <StatusBar style="light" backgroundColor={"#000000"}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
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
        top: 0,
        right: 15,
    },
});
