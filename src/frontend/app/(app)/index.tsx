import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import {useRouter} from 'expo-router'
import { useSession } from '../ctx';
import {StatusBar} from "expo-status-bar";

export default function Index() {
    const { hasUser } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!hasUser()) {
            router.replace("/sign-in")
        } else {
            router.replace("/inventory");
        }
    })
}

