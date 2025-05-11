import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router'
import { useSession } from '../../ctx'
import { Meal, MealPlan, Recipe } from '../../../interfaces'
import DateTimePicker from '@react-native-community/datetimepicker'
import Ionicons from '@expo/vector-icons'

export default function MealPlanner() {
    const [loading, setLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const {user, updateUser, refreshUser} = useSession();
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const [allMeals, setAllMeals] = useState<MealPlan[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe|null>();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    type ItemProps = {recipe: Recipe, date: Date, onEdit: () => void, onDelete: () => void}

    type FlattenedMeal = {
        recipe: Recipe,
        date: Date,
        planIndex: number
    }

    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
    };
    
    const Item = ({recipe, date, onEdit, onDelete}: ItemProps) =>
        <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View>
                    <Text style={styles.item}>{recipe.title}</Text>
                    <Text style={styles.itemDetail}>
                        Planned Date: {formatDate(date)}
                    </Text>
                </View>
            </View>
        </View>
    ;

    const flattenedMeals: FlattenedMeal[] = mealPlans.flatMap(plan =>
        plan.meals.map(meal => ({
            recipe: meal.recipe,
            date: new Date(meal.date),
            planIndex: Date.now()
        }))
    );

    const getMealPlans = async () => {
        if (user) {
            if (user) {
                console.log(`${user.username}'s meal plans: ${JSON.stringify(user.mealPlans)}`);
            }
            refreshUser();
            setMealPlans(user.mealPlans);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const load = async() => {
                await refreshUser();
                if (user) {
                    console.log(`${user.username}'s meal plans: ${JSON.stringify(user.mealPlans)}`);
                }
                getMealPlans();
            };
            load();
        }, [])
    );
    
    const addMealPlan = async(meal: Meal) => {
        const newPlan: MealPlan = {
            meals: [meal]
        };
        if (user) {
            const updatedPlans = [...user.mealPlans, newPlan];
            setMealPlans(updatedPlans);
            user.mealPlans = updatedPlans;
            const response = await updateUser();
            console.log(`${user.username}'s meal plans: ${JSON.stringify(user.mealPlans)}`);
            if (!response.success) {
                console.error("Failed to add item", response.message);
            }
            else {
                getMealPlans();
            }
        }
    };

    const editMealPlan = async(planIndex:number, updatedMeals:Meal[]) => {
        const updatedPlans = [...mealPlans];
        updatedPlans[planIndex] = { ...updatedPlans[planIndex], meals: updatedMeals };
        setMealPlans(updatedPlans);
        if (user) {
            user.mealPlans = updatedPlans;
            const response = await updateUser();
            console.log(`${user.username}'s meal plans: ${JSON.stringify(user.mealPlans)}`);
            if (!response.success) {
                console.error("Failed to edit item", response.message);
            }
            else {
                getMealPlans();
            }
        }
    };

    const deleteMealPlan = async(planIndex:number) => {
        const updatedPlans = mealPlans.filter((_, index) => index !== planIndex);
        setMealPlans(updatedPlans);
        if (user) {
            user.mealPlans = updatedPlans;
            const response = await updateUser();
            if (!response.success) {
                console.error("Failed to delete item", response.message);
            }
            console.log(`${user.username}'s meal plans: ${JSON.stringify(user.mealPlans)}`);
            getMealPlans();
        }
    };

    return (
        <View style={styles.container}>
            {loading && !isLoaded ? (
                <Text style={styles.text}>Loading...</Text>
            ) : (
                <View>
                    <FlatList
                    data={flattenedMeals}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={{paddingVertical: 12}}
                    renderItem={({item, index}: {item: Meal, index: number}) => 
                        <Item 
                        recipe={item.recipe} 
                        date={item.date} 
                        onEdit={() => editMealPlan(index, [{recipe: item.recipe, date: item.date}])}
                        onDelete={() => deleteMealPlan(index)}
                        />
                    }
                    />
                    <TouchableOpacity
                    style={{ marginBottom: 10, backgroundColor: '#000000', padding: 10, borderRadius: 10 }}
                    onPress={() => setShowModal(true)}
                    >
                        <Text style={{color: '#ffffff', textAlign: 'center'}}>+</Text>
                    </TouchableOpacity>


                    <Modal
                    visible={showModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowModal(false)}
                    >
                        <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', padding: 20 }}>
                            <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>Select a Recipe:</Text>
                            {user?.recipes.map((recipe) => (
                                <TouchableOpacity key={recipe.title} onPress={() => setSelectedRecipe(recipe)}>
                                    <Text style={{
                                    color: selectedRecipe?.title === recipe.title ? 'lime' : 'white',
                                    marginBottom: 5,
                                    }}>
                                        {recipe.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                            <Text style={{ color: 'white', fontSize: 18, marginTop: 20 }}>Pick a Date:</Text>
                            <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display="default"
                            onChange={(event, date) => {
                                if (date) setSelectedDate(date);
                            }}
                            />
                            <TouchableOpacity
                            style={{ marginTop: 20, padding: 10, backgroundColor: 'green', borderRadius: 10 }}
                            onPress={() => {
                                if (selectedRecipe) {
                                    addMealPlan({ recipe: selectedRecipe, date: selectedDate });
                                    setShowModal(false);
                                    setSelectedRecipe(null);
                                }
                            }}
                            >
                                <Text style={{ color: 'white', textAlign: 'center' }}>Add Meal Plan</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowModal(false)} style={{ marginTop: 10 }}>
                                <Text style={{ color: 'red', textAlign: 'center' }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        position: 'relative',
        padding: 10
    },
    nameContainer: {
        height: 150,
        padding: 10,
        marginTop: 30,
        justifyContent: 'center',
        borderColor: '#ffffff',
        color: '#ffffff'
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
    }
})