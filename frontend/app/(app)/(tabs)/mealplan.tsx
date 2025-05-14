import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Dimensions, Touchable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSession } from '../../ctx';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MealPlan, Recipe } from '@/interfaces';
import { Calendar } from 'react-native-calendars';

const screenHeight = Dimensions.get('window').height;

export default function MealPlanner() {
    const [loading, setLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const { getUser, updateUser, hasUser } = useSession();
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const [markedDates, setMarkedDates] = useState({});


    const [modalVisible, setModalVisible] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number|null>(null);
    const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan|null>(null);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe|null>(null);
    const [modalDate, setModalDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [recipes, setRecipes] = useState<Recipe[]>([]);


    const router = useRouter();

    const checkSession = async () => {
        const user = await getUser();
        return user;
    }

    const user = getUser();

    // Utility: Safely parse 'YYYY-MM-DD' or Date to a proper Date object
    const normalizeToDate = (value: any): Date | null => {
        if (value instanceof Date && !isNaN(value.getTime())) return value;

        if (typeof value === 'string') {
            const parsed = new Date(value);
            return isNaN(parsed.getTime()) ? null : parsed;
        }

        return null;
        };

        // Utility: Validate a date object
        const isValidDate = (date: any): date is Date => {
        return date instanceof Date && !isNaN(date.getTime());
    };



    useEffect(() => {
            // if (hasUser()) {
            //     getMealPlans();
            // } else {
            //     router.replace('/sign-in');
            // }
            const fetchRecipes = async () => {
                const user = await getUser();
                if (user?.recipes?.length) {
                    setRecipes(user.recipes);
                    getMealPlans();
                } else if (!user?.recipes?.length) {
                    console.warn("No recipes found.");
                } else {
                    console.warn("User not available");
                    router.replace('/sign-in');
                }
            }

            fetchRecipes();
    }, []);

    useFocusEffect(
        useCallback(() => {
            getMealPlans();
        }, [])
    );

    const getTodayDateString = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

    const openAddModal = () => {
        console.log(`Index: ${editingIndex}`);
        setEditingIndex(null);
        setSelectedRecipe(null);
        setModalDate(parseLocalDate(selectedDate));
        setModalVisible(true);
        console.log(`Index: ${editingIndex}`);
    }

    const openEditModal = (index: number) => {
        console.log(`Index: ${index}`);
        const plan = filteredPlans[index];
        setEditingIndex(index);
        setSelectedRecipe(plan.recipe);
        setModalDate(plan.date instanceof Date ? plan.date : parseLocalDate(plan.date));
        setModalVisible(true);
        console.log(`Index: ${index}`);
    }


    const parseLocalDate = (dateStr: string): Date => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const newDateStr = new Date(year, month-1, day).toISOString();
        return new Date(newDateStr);
    }


    const getMealPlans = async () => {
        try {
            setLoading(true);
            const user = await getUser();
            if (user?.mealPlans) {
                // Formatting meal plan dates here
                console.log(`Formatting meal plans...`);
                const formattedMealPlans: MealPlan[] = [];
                // const formattedMealPlans = user.mealPlans.map((item: any) => ({
                //     ...item,
                //     date: item.date.toString().split('T')[0]
                // }));

                user.mealPlans.forEach((item: any, i: number) => {
                    const parsedDate = normalizeToDate(item.date);

                    if (!parsedDate) {
                        console.log(`Invalid date at index ${i}`);
                        return;
                    }

                    formattedMealPlans.push({
                        ...item,
                        date: parsedDate
                    });
                });

                const marked: any = {};
                formattedMealPlans.forEach(plan => {
                    const dateKey = plan.date.toISOString().split('T')[0];
                    marked[dateKey] = {
                        marked: true,
                        dotColor: '#00ff00'
                    };
                });

                console.log(`Marking calendar...`);

                setMealPlans(formattedMealPlans);
                console.log(`Meal plans updated!`);
                setMarkedDates(marked);
                console.log(`Calendar marked!`);
            }
        } catch (error) {
            console.error("Failed to load meal plans:", error);
            Alert.alert("Error", "Failed to load meal plans");
        } finally {
            setLoading(false);
            setIsLoaded(true);
        }
    };


    const filteredPlans = mealPlans.filter(plan => {
        const planDateStr = plan.date instanceof Date
            ? plan.date.toISOString().split('T')[0]
            : plan.date;
        return planDateStr === selectedDate;
    });


    const saveMeal = async () => {
        const user = await getUser();

        if (!selectedRecipe || !user) return;

        if (!isValidDate(modalDate)) return;

        const newPlan: MealPlan = {
            recipe: selectedRecipe,
            date: modalDate
        };

        console.log(`Adding ${JSON.stringify(newPlan)} to ${user.username}'s meal plans`);

        if (editingIndex != null) {
            const originalPlan = filteredPlans[editingIndex];
            const realIndex = mealPlans.findIndex(p => p.recipe.title === originalPlan.recipe.title && 
                p.date.getTime() === originalPlan.date.getTime());

            if (realIndex !== -1) {
                console.log(`Editing meal plan`);
                user.mealPlans[realIndex] = newPlan;
            }
        } else {
            console.log(`Adding new meal plan`);
            user.mealPlans.push(newPlan);
        }

        try {
            const response = await updateUser(user);
            if (response.success) {
                console.log(`Success! ${user.username}'s meal plans:`)
                console.log(`${JSON.stringify(user.mealPlans)}`);
                console.log(`Saved to ${modalDate}`);
                setMealPlans(user.mealPlans);
                setEditingIndex(null);
                setSelectedRecipe(null);
                setModalVisible(false);
            } else {
                Alert.alert("Error", response.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoaded(false);
            await getMealPlans();
            console.log(`Meal plans retrieved!`);
        }
    };

    const deleteMeal = async (index: number) => {
        const user = await getUser();

        const toDelete = filteredPlans[index];
        const updatedPlans = mealPlans.filter(plan =>
            !(plan.recipe.title === toDelete.recipe.title && 
                plan.date === toDelete.date)
        );

        try {
            if (user) {
                user.mealPlans = updatedPlans;
                const response = await updateUser(user);
                if (response.success) {
                    setMealPlans(user.mealPlans);
                } else {
                    Alert.alert("Error", response.message);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            await getMealPlans();
        }
    }

    const mealsByDate = mealPlans.reduce((acc, plan) => {
        const dateKey = new Date(plan.date).toISOString().split('T')[0];
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(plan);
        return acc;
    }, {} as { [key: string]: MealPlan[] });


    return (
        <View style={styles.container}>
            {loading && !isLoaded ? (
                <Text style={styles.text}>Loading meal plans...</Text>
            ) : (
                <View style={{ width: '100%', flex: 1 }}>
                    <Calendar
                        markedDates={{
                            ...markedDates,
                            [selectedDate]: {
                                ...(markedDates[selectedDate] || {}),
                                selected: true,
                                selectedColor: '#00adf5'
                            }
                        }}
                        onDayPress={day => setSelectedDate(day.dateString)}
                        theme={{
                            backgroundColor: '#000',
                            calendarBackground: '#000',
                            dayTextColor: '#fff',
                            monthTextColor: '#fff',
                            arrowColor: '#fff',
                            selectedDayBackgroundColor: '#00adf5',
                            selectedDayTextColor: '#fff',
                            todayTextColor: '#00adf5',
                            textDisabledColor: '#555',
                            dotColor: '#00ff00',
                            selectedDotColor: '#fff'
                        }}
                    />

                    <Text style={styles.text}>Meals on {selectedDate}</Text>

                    <ScrollView style={{ marginTop: 10 }}>
                        {filteredPlans.length > 0 ? (
                            filteredPlans.map((plan, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.card}
                                    onPress={() => openEditModal(index)}
                                    onLongPress={() => deleteMeal(index)}
                                >
                                    <Text style={styles.title}>{plan.recipe.title}</Text>
                                    <Text style={styles.itemDetail}>Tap to edit. Long tap to delete.</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.text}>No meals planned.</Text>
                        )}
                    </ScrollView>

                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress={openAddModal}
                    >
                        <Text style={styles.addButtonText}>Add Meal Plan</Text>
                    </TouchableOpacity>

                    {/* Add/edit Modal window */}
                    <Modal visible={modalVisible} animationType='slide' transparent={true}>
                        <View style={styles.modalContainer}>
                            <View style={[styles.modalContent, { maxHeight: '90%' }]}>
                                <Text style={styles.modalTitle}>
                                    {editingIndex !== null ? "Edit" : "Add" } Meal Plan
                                </Text>

                                {/* {selectedRecipe && (
                                    <Text style={{ color: '#0f0', marginBottom: 8 }}>
                                        Selected: {selectedRecipe.title}
                                    </Text>
                                )} */}
                                
                                <Text style={styles.text}>Select Recipe:</Text>

                                {recipes.length ? (
                                    <ScrollView style={{ maxHeight: 200, width: '100%' }}>
                                        {recipes.map((recipe, i) => (
                                        <TouchableOpacity
                                            key={i}
                                            onPress={() => {
                                            console.log("Selected:", recipe.title);
                                            setSelectedRecipe(recipe);
                                            }}
                                            style={[
                                            styles.recipeItem,
                                            selectedRecipe?.title?.toLowerCase() === recipe.title.toLowerCase() && { backgroundColor: '#00adf5' }
                                            ]}
                                        >
                                            <Text style={styles.recipeText}>{recipe.title}</Text>
                                        </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                    ) : (
                                    <Text style={{ color: 'red', textAlign: 'center' }}>
                                        No recipes found in your account.
                                    </Text>
                                )}

                                <Text style={styles.recipeText}>Date on {modalDate.toDateString()}</Text>

                                <View style={styles.row}>
                                    <TouchableOpacity style={styles.saveButton} onPress={saveMeal}>
                                        <Text style={styles.addButtonText}>Save</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                        <Text style={styles.addButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </Modal>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    addButton: {
        backgroundColor: '#00adf5',
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        alignSelf: 'center'
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContent: {
        backgroundColor: '#111',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
    },
    
    modalTitle: {
        color: '#fff',
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    recipeItem: {
        padding: 10,
        backgroundColor: '#222',
        borderRadius: 5,
        marginBottom: 10,
        width: '100%',
    },
    recipeText: {
        color: '#fff',
        fontSize: 16,
    },
    cancelText: {
        marginTop: 10,
        color: '#ccc',
        fontSize: 16,
    },
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        position: 'relative',
        padding: 10
    },
    text: {
        fontSize: 18,
        color: '#ffffff',
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
    title: {
        fontSize: 32,
        color:'#ffffff',
        textAlign: 'center',
        width: '100%'
    },
    item: {
        borderColor: '#ffffff',
        borderWidth: 1,
        backgroundColor: '#141414',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        alignItems: 'center',
        color: '#ffffff'
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
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: '#00adf5',
        padding: 10,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: '#888',
        padding: 10,
        borderRadius: 5,
    }
});
