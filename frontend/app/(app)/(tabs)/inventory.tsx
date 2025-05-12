import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Alert, Animated, Modal } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useSession } from '../../ctx';
import {StatusBar} from "expo-status-bar";
import { IngredientInventory } from '@/interfaces';
import {SERVER_URI} from "@/const"
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Inventory() {
    const { updateUser, refreshUser, user } = useSession();
    const [inventory, setInventory] = useState<IngredientInventory[]>([]);
    const [expiredItems, setExpired] = useState<IngredientInventory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
    const [showExpirationModal, setShowExpirationModal] = useState(false);
    const router = useRouter();

    const fetchInventory = async () => {
        try {
            setLoading(true);
            await refreshUser();
            if (user && user.inventory) {
                // Convert string dates to Date objects
                const formattedInventory = user.inventory.map((item: any) => ({
                    ...item,
                    purchaseDate: new Date(item.purchaseDate),
                    expirationDate: new Date(item.expirationDate)
                }));
                setInventory(formattedInventory);
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
            Alert.alert('Error', 'Failed to load inventory');
        } finally {
            setLoading(false);
            setIsLoaded(true);
        }
    };

    // Initial data fetch
    useEffect(() => {
        if(user) {
            fetchInventory();
            getExpiringItems();
        }
        else{
            router.replace("/sign-in");
        }
    }, []);

    // Refresh data when page comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchInventory();
            getExpiringItems();
        }, [])
    );

    const toggleExpand = (itemName: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemName]: !prev[itemName]
        }));
    };

    const getExpiringItems = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const twoDaysFromNow = new Date(today);
        twoDaysFromNow.setDate(today.getDate() + 2);
        if(user) {
            setExpired([...user.inventory, ...user.expired]
                .filter(item => {
                    const expirationDate = new Date(item.expirationDate);
                    expirationDate.setHours(0, 0, 0, 0);
                    return expirationDate <= twoDaysFromNow;
                })
                .sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()))
        }

    };

    const getExpirationStatus = (expirationDate: Date) => {
        const today = new Date();
        const expDate = new Date(expirationDate);
        const diffTime = expDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return { status: 'Expired', color: '#ff4444' };
        } else if (diffDays === 0) {
            return { status: 'Expires today', color: '#ffaa00' };
        } else {
            return { status: `Expires in ${diffDays} days`, color: '#ffaa00' };
        }
    };

    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleEditItem = (item: IngredientInventory) => {
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
            // Update local state
            setInventory(prev => prev.filter(i => i.name !== item.name));
            
            // Update server
            const response = await updateUser();
            if (!response.success) {
                console.error("Failed to delete item", response.message);
                Alert.alert('Error', 'Failed to delete item');
                // Refresh inventory to restore the item
                fetchInventory();
            }
        } catch (error) {
            console.error("Failed to delete item", error);
            Alert.alert('Error', 'Failed to delete item');
            // Refresh inventory to restore the item
            fetchInventory();
        }
    };
      
    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading inventory...</Text>
                </View>
            ) : (
                <>
                    <FlatList 
                        data={inventory}
                        keyExtractor={(item, index) => `${item.name}-${index}`}
                        contentContainerStyle={{ paddingVertical: 12 }}
                        renderItem={({ item }) => {
                            const isExpanded = expandedItems[item.name];
                            return (
                                <TouchableOpacity 
                                    style={styles.card}
                                    onPress={() => toggleExpand(item.name)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.cardHeader}>
                                        <View style={styles.headerContent}>
                                            <Text style={styles.itemName}>{item.name}</Text>
                                            <Text style={styles.itemDetail}>Quantity: {item.qty}</Text>
                                        </View>
                                        <View style={styles.iconContainer}>
                                            <Ionicons 
                                                name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                                                size={24} 
                                                color="#ffffff" 
                                            />
                                        </View>
                                    </View>
                                    
                                    {isExpanded && (
                                        <View style={styles.expandedContent}>
                                            <Text style={styles.itemDetail}>
                                                Purchased: {formatDate(item.purchaseDate)}
                                            </Text>
                                            <Text style={styles.itemDetail}>
                                                Expires: {formatDate(item.expirationDate)}
                                            </Text>
                                            <View style={styles.actionButtons}>
                                                <TouchableOpacity 
                                                    onPress={() => handleEditItem(item)} 
                                                    style={styles.actionButton}
                                                >
                                                    <Ionicons name="create" size={20} color="#ffffff" />
                                                    <Text style={styles.actionButtonText}>Edit</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity 
                                                    onPress={() => handleDeleteItem(item)} 
                                                    style={[styles.actionButton, styles.deleteButton]}
                                                >
                                                    <Ionicons name="trash-bin" size={20} color="#ffffff" />
                                                    <Text style={styles.actionButtonText}>Delete</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        }}
                    />

                    {/* Floating Action Button */}
                    <TouchableOpacity 
                        style={styles.fab}
                        onPress={() => setShowExpirationModal(true)}
                    >
                        <Ionicons name="alert-circle" size={24} color="#ffffff" />
                        <Text style={styles.fabText}>Expiring</Text>
                    </TouchableOpacity>

                    {/* Expiration Modal */}
                    <Modal
                        visible={showExpirationModal}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setShowExpirationModal(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Expiring Items</Text>
                                    <TouchableOpacity 
                                        onPress={() => setShowExpirationModal(false)}
                                        style={styles.closeButton}
                                    >
                                        <Ionicons name="close" size={24} color="#ffffff" />
                                    </TouchableOpacity>
                                </View>

                                {expiredItems.length > 0 ? (
                                    <FlatList
                                        data={expiredItems}
                                        keyExtractor={(item, index) => `${item.name}-${index}`}
                                        renderItem={({ item }) => {
                                            const { status, color } = getExpirationStatus(item.expirationDate);
                                            return (
                                                <View style={styles.expiringItem}>
                                                    <View style={styles.expiringItemContent}>
                                                        <Text style={styles.expiringItemName}>{item.name}</Text>
                                                        <Text style={[styles.expiringItemStatus, { color }]}>
                                                            {status}
                                                        </Text>
                                                    </View>
                                                    <Text style={styles.expiringItemDate}>
                                                        {formatDate(item.expirationDate)}
                                                    </Text>
                                                </View>
                                            );
                                        }}
                                    />
                                ) : (
                                    <View style={styles.noItemsContainer}>
                                        <Text style={styles.noItemsText}>
                                            No items approaching expiration
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </Modal>
                </>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
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
        marginBottom: 12,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    headerContent: {
        flex: 1,
    },
    expandedContent: {
        padding: 16,
        paddingTop: 0,
        borderTopWidth: 1,
        borderTopColor: '#333',
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
        marginLeft: 10,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 12,
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: 8,
        borderRadius: 6,
        gap: 6,
    },
    deleteButton: {
        backgroundColor: '#ff4444',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#1a1a1a',
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 12,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    closeButton: {
        padding: 5,
    },
    expiringItem: {
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    expiringItemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    expiringItemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    expiringItemStatus: {
        fontSize: 14,
        fontWeight: '500',
    },
    expiringItemDate: {
        fontSize: 14,
        color: '#ccc',
    },
    noItemsContainer: {
        padding: 20,
        alignItems: 'center',
    },
    noItemsText: {
        fontSize: 16,
        color: '#ccc',
        textAlign: 'center',
    },
});