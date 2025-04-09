import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useSession } from '../../ctx';
import Constants from 'expo-constants';



export default function Inventory() {
    const {session} = useSession();

    useEffect(() => {
        const getInventory = async (username:string | null | undefined) => {
            try {
                const uri =
                Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':8083') ??
                '192.168.0.44:8083';
                const response = await fetch(`http://${uri}/api/user?username=${username}`, {
                    method: 'GET',
                    headers: {"Content-Type": "application/json"}
                })
        
                if (response.ok) {
                    const responseData = await response.json();
                    const inventoryStr = JSON.stringify(responseData['inventory']);
                    console.log(`Inventory: ${inventoryStr}`);
                    return inventoryStr;
                } else {
                    console.error("Failed to get inventory", await response.text());
                }
            } catch (error) {
                console.error("Failed to get inventory", error);
            }
        }

        getInventory(session);
    }, [session]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Inventory</Text>
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
    headerContainer: {
        flex: 1,
        alignItems: 'center'
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
