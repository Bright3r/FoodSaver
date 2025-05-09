import { StyleSheet, View, Text } from 'react-native';

export default function MealPlan() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Meal Plan
            </Text>
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
})