import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';

import { useSession } from '../ctx';

export default function AppLayout() {
    const { hasUser } = useSession();

    // Only require authentication within the (app) group's layout as users
    // need to be able to access the (auth) group and sign in again.
    if (!hasUser()) {
        // On web, static rendering will stop here as the user is not authenticated
        // in the headless Node process that the pages are rendered in.
        return <Redirect href="/sign-in" />;
    }

    // This layout can be deferred because it's not the root layout.
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#000000',
                },
                headerShadowVisible: false,
                headerTintColor: '#fff',
            }}
        >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="+not-found"
            />
            <Stack.Screen
                name="addrecipe"
                options={{
                    title: 'Add Recipe',
                }}
            />
            <Stack.Screen
                name="ingredient"
                options={{
                    title: 'Add Ingredient',
                }}
            />
            <Stack.Screen
                name="recipe"
                options={{
                    title: 'Recipe',
                }}
            />
            <Stack.Screen
                name="editrecipe"
                options={{
                    title: 'Edit Recipe',
                }}
            />
            <Stack.Screen
                name="addsuggestedrecipe"
                options={{
                    title: 'Add Suggested Recipe',
                }}
            />
            <Stack.Screen
                name="recipesuggestion"
                options={{
                    title: 'Recipe Suggestions',
                }}
            />
            <Stack.Screen
                name="editingredient"
                options={{
                    title: 'Edit Ingredient',
                }}
            />
        </Stack>
    );
}
