import {Text, View, StyleSheet, FlatList, Modal, Image} from 'react-native';
import {router, useFocusEffect} from "expo-router";
import React, {useCallback, useState} from "react";
import { StatusBar } from 'expo-status-bar';
import { SERVER_URI } from '@/const';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import {IngredientInventory, SelectListItem, Recipe} from '@/interfaces';
import {useSession} from "@/app/ctx";



export default function RecipeSuggestions() {
    const { user } = useSession();
    const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [inventory, setInventory] = useState<SelectListItem[]>([]);
    const [selected, setSelected] = React.useState("");

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

    const getInventory = async (): Promise<void> => {
        if (!user) return;
        setLoading(true);
        setInventory([]);
        // try {
        //     const uri = Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':8083') ?? SERVER_URI;
        //     await fetch(`http://${uri}/api/user?username=${username}`, {
        //         method: 'GET',
        //         headers: {"Content-Type": "application/json"}
        //     })
        //         .then(res => res.json())
        //         .then((data: any) => {
        //             console.log("Retrieving inventory...");
        //             let ingredients = data.inventory.map((item:IngredientInventory) => {return {key: item.name, value: item.name}})
        //             setInventory(ingredients)
        //
        //             // DEBUG: inventoryStr - for checking the correctness of response data.
        //             const inventoryStr = JSON.stringify(data.inventory);
        //             console.log(`Inventory: ${inventoryStr}`);
        //         });
        //
        //     setLoading(false);
        //
        //     console.log(`Inventory retrieved!`);
        //     console.log(`Table successfully loaded!`);
        // } catch (error) {
        //     console.error("Failed to get inventory", error);
        // }
        let ingredients = user.inventory.map((item:IngredientInventory) => {return {key: item.name, value: item.name}})
        setInventory(ingredients);
        setLoading(false);
    }

    useFocusEffect(
        useCallback(() => {
            if(user) {
                getInventory();
            }
            else{
                router.replace("/sign-in");
            }
        }, [])
    );


    const suggestionSearch = async (ingredients:string) => {
        try {
            setLoading(true);
            console.log(`Ingredients: ${ingredients}`);
            const uri = SERVER_URI;
            await fetch(`${uri}/api/recipe/search`, {
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
            {/*<DismissibleTextInput*/}
            {/*    style={{color: '#fff', width: "auto", height: 50, borderWidth: 1, borderColor: '#ffffff', borderRadius: 10, marginBottom: 5}}*/}
            {/*    placeholder="Ingredients (comma separated, press enter to submit)"*/}
            {/*    placeholderTextColor="#696969"*/}
            {/*    onSubmitEditing={e=>suggestionSearch(e["nativeEvent"]["text"])}*/}
            {/*/>*/}
            <MultipleSelectList
                setSelected={setSelected}
                data={inventory}
                save="value"
                boxStyles={{borderColor: "#FFF",backgroundColor:"#000"}}
                inputStyles={styles.text}
                dropdownStyles={{borderColor: "#FFF",backgroundColor:"#000"}}
                checkBoxStyles={{borderColor: "#FFF", backgroundColor: "#FFF" }}
                badgeStyles={{borderColor: "#FFF", borderWidth:1, backgroundColor: "#000" }}
                labelStyles={{color: "#FFF"}}
                label="Ingredients"
                dropdownTextStyles={styles.text}
                searchicon={<Image
                    source={require('@/assets/images/icons8-search-50.png')}
                    resizeMode='contain'
                    style={{width:20,height:20,marginRight:7}}
                />}
                arrowicon={<Image
                    source={require('@/assets/images/icons8-chevron-30.png')}
                    resizeMode='contain'
                    style={{width:20,height:20,marginRight:7}}
                />}
                closeicon={<Image
                    source={require('@/assets/images/icons8-close-50.png')}
                    resizeMode='contain'
                    style={{width:20,height:20,marginRight:7}}
                />}
                notFoundText='No ingredient found'
                placeholder="Ingredients"
                searchPlaceholder=""
            />
            <Text style={styles.button} onPress={() => suggestionSearch(selected)}>
                Generate Recipes
            </Text>
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
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 10,
        textAlign: 'center',
        textAlignVertical: 'center',
        width: 150,
        height: 40,
        left: "58%",
        padding: 10,
        margin: 10
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
