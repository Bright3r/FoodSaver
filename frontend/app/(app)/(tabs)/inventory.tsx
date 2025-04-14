import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { useSession } from '../../ctx';
import Constants from 'expo-constants';
import {StatusBar} from "expo-status-bar";
import ReactTable from 'react-data-table-component';

interface Ingredient {
    name: string,
    qty: number,
    purchaseDate: Date,
    expirationDate: Date
}

export default function Inventory() {
    const {session} = useSession();
    const [inventory, setInventory] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        const getInventory = async (username:string | null | undefined): Promise<void> => {
            setLoading(true);
            console.log(`Loading before fetch? ${loading}`);
            console.log(`Table loaded before fetch? ${isLoaded}`);
            if (!isLoaded) {
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
                        data['inventory'].map((item: Ingredient) => {
                            console.log(JSON.stringify(item));
                            inventory.push(item);
                        });

                        // DEBUG: inventoryStr - for checking the correctness of response data.
                        const inventoryStr = JSON.stringify(inventory);
                        console.log(`Inventory: ${inventoryStr}`);
                    });

                    setLoading(false);
                    setIsLoaded(true);
                    console.log(`Loading after fetch? ${loading}`);
                    console.log(`Table loaded after fetch? ${isLoaded}`);

                    console.log(`Inventory retrieved!`);
                    console.log(`Table successfully loaded!`);
                } catch (error) {
                    console.error("Failed to get inventory", error);
                }
            }
        }

        getInventory(session);
    }, []);

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
                                    <View style={styles.headerContainer}>
                                        <Text style={{color: "#fff", marginBottom: 20}}>Name</Text>
                                    </View>
                                    <View style={styles.cellContainer}>
                                        <Text style={{color: "#fff", marginBottom: 0}}>{item.name}</Text>
                                    </View>
                                </View>
                                <View style={{width:90, marginBottom:0, borderWidth: 1, borderColor: "#ffffff"}}>
                                    <View style={styles.headerContainer}>
                                        <Text style={{color: "#fff", marginBottom: 20}}>Quantity</Text>
                                    </View>
                                    <View style={styles.cellContainer}>
                                        <Text style={{color: "#fff", marginBottom: 0}}>{item.qty}</Text>
                                    </View>
                                </View>
                                <View style={{width:90, marginBottom:0, borderWidth: 1, borderColor: "#ffffff"}}>
                                    <View style={styles.headerContainer}>
                                        <Text style={{color: "#fff", marginBottom: 20}}>Purchase Date</Text>
                                    </View>
                                    <View style={styles.cellContainer}>
                                        <Text style={{color: "#fff", marginBottom: 0}}>{item.purchaseDate.toString()}</Text>
                                    </View>  
                                </View>
                                <View style={{width:90, marginBottom:0, borderWidth: 1, borderColor: "#ffffff"}}>
                                    <View style={styles.headerContainer}>
                                        <Text style={{color: "#fff", marginBottom: 20}}>Expiration Date</Text>
                                    </View>
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

