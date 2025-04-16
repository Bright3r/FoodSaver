import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useSession } from '../../ctx';
import Constants from 'expo-constants';
import {StatusBar} from "expo-status-bar";
import { IngredientInventory } from '../../ingredientInterface'

export default function Inventory() {
    const {session} = useSession();
    const [inventory, setInventory] = useState<IngredientInventory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const { refresh, key } = useLocalSearchParams();

    const getInventory = async (username:string | null | undefined): Promise<void> => {
        if (!username) return;
        setLoading(true);
        setInventory([]);
        console.log(`Loading before fetch? ${loading}`);
        console.log(`Table loaded before fetch? ${isLoaded}`);
        try {
            const uri =
            Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':8083') ??
            '192.168.0.44:8083';
            await fetch(`http://${uri}/api/user?username=${username}`, {
                method: 'GET',
                headers: {"Content-Type": "application/json"}
            })
            .then(res => res.json())
            .then((data: any) => {
                console.log("Retrieving inventory...");
                setInventory(data.inventory ?? []);

                // DEBUG: inventoryStr - for checking the correctness of response data.
                const inventoryStr = JSON.stringify(data.inventory);
                console.log(`Inventory: ${inventoryStr}`);
            });

            setLoading(false);

            console.log(`Inventory retrieved!`);
            console.log(`Table successfully loaded!`);
        } catch (error) {
            console.error("Failed to get inventory", error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            getInventory(session);
        }, [session, refresh, key])
    );

    return (
        <View style={styles.container}>
            {loading && !isLoaded ? (
                <Text style={styles.text}>Loading...</Text>
            ) : (
                <FlatList 
                data={inventory}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.tableContainer}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{width:90, marginBottom:0, borderWidth: 1, borderColor: "#ffffff"}}>
                                    <View style={styles.cellContainer}>
                                        <Text style={{color: "#fff", marginBottom: 0}}>{item.name}</Text>
                                    </View>
                                </View>
                                <View style={{width:90, marginBottom:0, borderWidth: 1, borderColor: "#ffffff"}}>
                                    <View style={styles.cellContainer}>
                                        <Text style={{color: "#fff", marginBottom: 0}}>{item.qty}</Text>
                                    </View>
                                </View>
                                <View style={{width:90, marginBottom:0, borderWidth: 1, borderColor: "#ffffff"}}>
                                    <View style={styles.cellContainer}>
                                        <Text style={{color: "#fff", marginBottom: 0}}>{item.purchaseDate.toString()}</Text>
                                    </View>  
                                </View>
                                <View style={{width:90, marginBottom:0, borderWidth: 1, borderColor: "#ffffff"}}>
                                    <View style={styles.cellContainer}>
                                        <Text style={{color: "#fff", marginBottom: 0}}>{item.expirationDate.toString()}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    );
                }} />
            )}
            <StatusBar style="light" backgroundColor={"#000000"}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tableContainer: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
        color: '#ffffff'
    },
    cellContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    headerContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    header: {
        flex: 1,
        color: '#fff',
        fontSize: 24
    },
    text: {
        color: '#fff',
    },
});

