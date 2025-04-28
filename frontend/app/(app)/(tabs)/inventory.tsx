import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useSession } from '../../ctx';
import Constants from 'expo-constants';
import {StatusBar} from "expo-status-bar";
import { IngredientInventory } from '../../ingredientInterface'
import {SERVER_URI} from "@/const"
import Ionicons from '@expo/vector-icons/Ionicons';



/**
 * Features to add:
 *  Edit ingredient item
 *  Delete ingredient item
 *  
 */
export default function Inventory() {
    const {session} = useSession();
    const [inventory, setInventory] = useState<IngredientInventory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const { refresh, key } = useLocalSearchParams();
    const router = useRouter();

    const getInventory = async (username:string | null | undefined): Promise<void> => {
        if (!username) return;
        setLoading(true);
        setInventory([]);
        console.log(`Loading before fetch? ${loading}`);
        console.log(`Table loaded before fetch? ${isLoaded}`);
        try {
            const uri = Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':8083') ?? SERVER_URI;
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

    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
    };

    const handleEditItem = (item: IngredientInventory)  => {
      console.log("Editing item...");
      router.push({
        pathname: '../ingredient',
        params: {
          itemData: JSON.stringify(item),
          mode: 'edit'
        },
      });
    };

    const handleDeleteItem = async (item: IngredientInventory) => {
      Alert.alert(
        "Delete Item",
        `Are you sure you want to delete ${item.name}?`,
        [
          {text: "Cancel", style: "cancel"},
          {
            text: "Delete", style: "destructive", onPress: async () => {
              try {
                const uri = Constants.expoConfig?.hostUri?.split(':')?.shift()?.concat(":8083") ?? SERVER_URI;
                console.log(`Deleting item...`);
                const getResponse = await fetch(`http://${uri}/api/user?username=${session}`, {
                  method: 'GET',
                  headers: {"Content-Type": "application/json"}
                });
                const data = await getResponse.json();

                console.log(`Inventory to modify: ${data.inventory}`)

                const updatedInventory = data.inventory.filter((i: IngredientInventory) => i.name !== item.name);

                await fetch(`http://${uri}/api/user`, {
                  method: 'PUT',
                  headers: {"Content-Type": "application/json"},
                  body: JSON.stringify({...data, inventory: updatedInventory})
                });

                getInventory(session);
              } catch (error) {
                console.error("Failed to delete item", error);
              }
            }
          }
        ]
      );
    };
      
    return (
        <View style={styles.container}>
            {loading && !isLoaded ? (
                <Text style={styles.text}>Loading...</Text>
            ) : (
                <FlatList 
                data={inventory}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                contentContainerStyle={{ paddingVertical: 12 }}
                renderItem={({ item }) => {
                  return (
                    <View style={styles.card}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                          <Text style={styles.itemName}>{item.name}</Text>
                          <Text style={styles.itemDetail}>Quantity: {item.qty}</Text>
                          <Text style={styles.itemDetail}>
                            Purchased: {formatDate(item.purchaseDate)}
                          </Text>
                          <Text style={styles.itemDetail}>
                            Expires: {formatDate(item.expirationDate)}
                          </Text>
                        </View>
                        <View style={styles.iconContainer}>
                          <TouchableOpacity onPress={() => handleEditItem(item)} style={{marginBottom:30}}>
                            <Ionicons name={'create'} size={24} color="#ffffff" />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleDeleteItem(item)}>
                            <Ionicons name={'trash-bin'} size={24} color="#ffffff" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
              
            )}
            <StatusBar style="light" backgroundColor={"#000000"}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      paddingTop: 20,
      paddingHorizontal: 16,
    },
    text: {
      color: '#fff',
      fontSize: 18,
      textAlign: 'center',
      marginTop: 20,
    },
    card: {
      backgroundColor: '#1a1a1a',
      borderRadius: 10,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#fff',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    itemName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 8,
    },
    itemDetail: {
      fontSize: 14,
      color: '#ccc',
      marginBottom: 4,
    },
    iconContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around',
      marginLeft: 10,
      marginBottom: 10
    }
});