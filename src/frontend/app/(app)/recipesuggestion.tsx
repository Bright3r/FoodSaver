import {Text, View, StyleSheet, FlatList, Modal, Image} from 'react-native';
import {router, useFocusEffect} from "expo-router";
import React, {useCallback, useState} from "react";
import { StatusBar } from 'expo-status-bar';
import { SERVER_URI } from '@/const';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import {SelectListItem, Recipe, Product} from '@/interfaces';
import {useSession} from "@/app/ctx";



export default function RecipeSuggestions() {
    const { getUser, hasUser } = useSession();
    const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [inventory, setInventory] = useState<SelectListItem[]>([]);
    const [selected, setSelected] = useState<string[]>([]);

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
        let user = await getUser();
        if (!user) return;

        setLoading(true);
        setInventory([]);
        let ingredients = user.inventory.map((item:Product) => {return {key: item.name, value: item.name}})
        setInventory(ingredients);
        setLoading(false);
    }

    useFocusEffect(
        useCallback(() => {
            if(hasUser()) {
                getInventory();
            }
            else{
                router.replace("/sign-in");
            }
        }, [])
    );


    const suggestionSearch = async (ingredients: string[]) => {
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
            
            // reset search ingredients
            setSelected([]);
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
            <StatusBar style="light" backgroundColor={"#000000"} translucent={false}/>
            <Modal transparent={true} visible={isLoading} animationType="fade">
                <View style={styles.container}>
                    <Text
                        style={{color: '#fff',fontSize: 30,textAlign: 'center', textAlignVertical: 'center',}}>
                        {"Generating Recipes..."}
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
