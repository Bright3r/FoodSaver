import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#ffffff',
                headerStyle: {
                    backgroundColor: '#000000',
                },
                headerShadowVisible: false,
                headerTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor: '#000000',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="about"
                options={{
                    title: 'About',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="Scanner"
                options={{
                    title: 'Scanner',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
                    ),
                }}
            />
            <Tabs.Screen // DEBUGGING ONLY. Move out of (tabs) after UI is implemented.
                name="ingredient"
                options={{
                    title: 'Ingredient',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'document' : 'document-outline'} color={color} size={24}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="logout"
                options={{
                    title: 'Log Out',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'log-out' : 'log-out-outline'} color={color} size={24}/>
                    ),
                }}
            />
        </Tabs>
    );
}
