import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useSession } from '../../ctx';
import Constants from 'expo-constants';
import {StatusBar} from "expo-status-bar";
import { IngredientInventory } from '../../ingredientInterface'
import {SERVER_URI} from "@/const"
import Ionicons from '@expo/vector-icons/Ionicons';



export default function Inventory() {
    const { updateUser, refreshUser, user } = useSession();
    const [inventory, setInventory] = useState<IngredientInventory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
      if (user) {
        console.log("User changed, refreshing inventory", user);
        setInventory(user.inventory);
      }
    }, [user]);    

    useFocusEffect(
      useCallback(() => {
        const load = async () => {
          await refreshUser();
          getInventory();
        };
        load();
      }, [])
    );    
    

    const getInventory = () => {
      if (user) {
        setInventory(user.inventory);
      }
    }

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
      try {
        // update inventory
        if (user) {
          user.inventory = user.inventory.filter((i: IngredientInventory) => i.name !== item.name);
        }

        // send update to server
        const response = await updateUser();
        if (!response.success) {
          console.error("Failed to delete item", response.message);
        }

        // refresh inventory
        getInventory();
      } catch (error) {
        console.error("Failed to delete item", error);
      }

      // Alert.alert(
      //   "Delete Item",
      //   `Are you sure you want to delete ${item.name}?`,
      //   [
      //     {text: "Cancel", style: "cancel"},
      //     {
      //       text: "Delete", style: "destructive", onPress: async () => {
      //         try {
      //           // update inventory
      //           if (user) {
      //             user.inventory = user.inventory.filter((i: IngredientInventory) => i.name !== item.name);
      //           }

      //           // send update to server
      //           const response = await updateUser();
      //           if (!response.success) {
      //             console.error("Failed to delete item", response.message);
      //           }

      //           // refresh inventory
      //           getInventory();
      //         } catch (error) {
      //           console.error("Failed to delete item", error);
      //         }
      //       }
      //     }
      //   ]
      // );
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