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
            initialRouteName={"recipes"}
            backBehavior={"history"}
        >
            <Tabs.Screen
                name="inventory"
                options={{
                    title: 'Inventory',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'bag' : 'bag-outline'} color={color} size={24}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="inventory-old"
                options={{
                    title: 'null',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'bag' : 'bag-outline'} color={color} size={24}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="scanner"
                options={{
                    title: 'Scanner',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'camera' : 'camera-outline'} color={color} size={24}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="recipes"
                options={{
                    title: 'Recipes',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'book' : 'book-outline'} color={color} size={24}/>
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
