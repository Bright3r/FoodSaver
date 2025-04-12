import {Text, View, StyleSheet, FlatList, TextInput} from 'react-native';
import { useSession } from '@/app/ctx';
import Constants from "expo-constants";
import {router} from "expo-router";
import React from "react";
import { StatusBar } from 'expo-status-bar';



export default function Recipes() {
    const { session } = useSession();

    //sample recipe data
    //just a title and description for each recipe for now
    const DATA = {"recipes": [
            {
                title: "Parsled clams served over Machiavelli noodles",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sapien risus, convallis sit amet finibus in, faucibus a dui. Cras sit amet nunc lectus. Vestibulum sed urna commodo, sodales sapien non, euismod diam. Etiam iaculis ut felis eget pulvinar. Phasellus ex odio, porta eu diam a, tempor dapibus metus. Suspendisse accumsan faucibus elit id lobortis. Ut posuere faucibus arcu a volutpat. Morbi aliquet lectus ex, eu venenatis lacus sagittis nec. Curabitur tincidunt porttitor odio, at egestas nisl faucibus at. Morbi ex leo, placerat vulputate lectus et, eleifend malesuada diam. Ut a ipsum eu dui varius fermentum. Morbi eu sem nisi. Ut convallis ultricies quam ac fringilla. Nunc mollis sapien turpis, sit amet fringilla orci rhoncus fermentum. Ut nunc turpis, ullamcorper quis consequat ut, lacinia vitae lacus.\n" +
                    "\n" +
                    "Maecenas eu neque ipsum. Nullam bibendum bibendum ultricies. Vestibulum dictum diam consequat justo maximus blandit. Nullam risus mi, fermentum id diam et, mollis maximus orci. Aenean in urna vitae risus euismod molestie. Aenean fringilla cursus urna vitae cursus. Phasellus ut semper nulla, sit amet congue lorem. Fusce eros nunc, cursus ac auctor nec, laoreet ut dui. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin vitae mollis magna.\n" +
                    "\n" +
                    "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean egestas aliquet risus, vitae ullamcorper arcu volutpat vel. Aenean at porta turpis. Aliquam erat volutpat. Pellentesque sit amet diam tortor. Curabitur faucibus volutpat velit vitae eleifend. Aliquam erat volutpat. Integer nec magna tempor, ultricies nisi nec, accumsan enim. Nam vel nulla vitae dolor venenatis ultrices sit amet ac quam. Morbi eget justo quis elit volutpat pretium eu in tortor. Ut cursus elementum pellentesque. Praesent efficitur velit a dui accumsan bibendum. Vivamus pharetra accumsan nunc, vitae cursus dolor pulvinar cursus.\n" +
                    "\n" +
                    "Praesent hendrerit ligula ac nisl sodales, at sodales enim rutrum. Donec quis arcu dolor. Morbi malesuada diam a augue ornare imperdiet. Nullam commodo turpis odio, vel consectetur neque ornare quis. Morbi ligula ante, sagittis at gravida mattis, consectetur nec sapien. Ut elementum sit amet felis condimentum efficitur. Etiam volutpat felis sed auctor eleifend. Integer ut imperdiet enim. Nullam vel diam risus. Maecenas metus felis, vestibulum eu scelerisque eu, sodales sed leo. Ut ac suscipit odio. Integer rutrum nunc ut nisi condimentum, id aliquam ipsum dapibus. In imperdiet vitae leo sit amet lacinia. Nulla lobortis neque quis arcu vulputate laoreet.\n" +
                    "\n" +
                    "Etiam eget purus in est hendrerit ultricies sit amet feugiat diam. Nam convallis mi at imperdiet pharetra. Sed vel dolor ut tellus aliquam iaculis. Ut mollis erat enim, at vestibulum leo tincidunt at. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque egestas dapibus nisi eu sollicitudin. Curabitur efficitur volutpat diam. Integer nec fermentum sem. Donec mi velit, lacinia commodo feugiat ut, posuere vitae purus. Aenean placerat nisi est. Aenean vestibulum eu elit vitae mollis. Integer non nunc eu neque varius mattis. Donec feugiat dolor eu metus finibus semper. Vivamus suscipit odio arcu. Donec placerat enim et tellus tincidunt, ornare luctus tortor sagittis. Duis at ultrices nisl, non laoreet quam.\n" +
                    "\n" +
                    "Morbi quis magna accumsan, placerat dolor ac, gravida orci. Mauris sed vestibulum purus. Aenean eget velit feugiat, efficitur dui non, dapibus metus. Sed et ex orci. Pellentesque eget elementum enim. Vivamus ut lorem euismod, eleifend felis eu, cursus ante. Nam leo risus, iaculis ut lacinia id, aliquam ac dui.\n" +
                    "\n" +
                    "Duis at quam dui. Duis at consectetur velit. Sed sed vulputate elit. Praesent ultrices, nulla non imperdiet porta, est neque bibendum erat, et fringilla risus nibh a nisl. In aliquet libero ut justo viverra pulvinar. Donec quis sodales lorem. Aliquam nec arcu pretium, dignissim massa nec, efficitur sem. Aenean blandit dolor ut elit interdum, sit amet mattis neque aliquam. Donec ac ipsum at lectus ornare euismod. Duis magna diam, dignissim sit amet augue sit amet, ornare pellentesque arcu. Ut eu sodales lectus. Proin et neque fringilla, sollicitudin tellus sed, cursus risus. Ut pulvinar posuere vestibulum."
            },
            {
                title: "Apple",
                description: "2025-04-12T09:29:03.496+00:00"
            },
            {
                title: "Milk1",
                description: "2025-04-12T09:29:03.496+00:00"
            },
            {
                title: "Apple1",
                description: "2025-04-12T09:29:03.496+00:00"
            },
            {
                title: "Milk2",
                description: "2025-04-12T09:29:03.496+00:00"
            },
            {
                title: "Apple2",
                description: "2025-04-12T09:29:03.496+00:00"
            },
            {
                title: "Milk3",
                description: "2025-04-12T09:29:03.496+00:00"
            },
            {
                title: "Apple3",
                description: "2025-04-12T09:29:03.496+00:00"
            },
            {
                title: "Milk4",
                description: "2025-04-12T09:29:03.496+00:00"
            },
            {
                title: "Apple4",
                description: "2025-04-12T09:29:03.496+00:00"
            },
            {
                title: "Milk5",
                description: "2025-04-12T09:29:03.496+00:00"
            },
            {
                title: "Apple5",
                description: "2025-04-12T09:29:03.496+00:00"
            },
        ]}

    type ItemProps = {title: string, description: string};

    const Item = ({title,description}: ItemProps) => (
        <View style={styles.item}>
            <Text
                style= {styles.title}
                onPress={() => {
                    router.push({
                        pathname: "/recipe",
                        params: { title, description },
                    });
                }}>
                {title}
            </Text>
        </View>
    );

    //implement recipe endpoint
    const getRecipes = async (username:string | null | undefined)  => {
        // try {
        //     const uri =
        //         Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':8083') ??
        //         '192.168.0.44:8083';
        //     const response = await fetch(`http://${uri}/api/user?username=${username}`, {
        //         method: 'GET',
        //         headers: {"Content-Type": "application/json"}
        //     })
        //
        //     if (response.ok) {
        //         const responseData = await response.json();
        //         const inventoryStr = JSON.stringify(responseData['inventory']);
        //         console.log(`Inventory: ${inventoryStr}`);
        //         return inventoryStr;
        //     } else {
        //         console.error("Failed to get inventory", await response.text());
        //     }
        // } catch (error) {
        //     console.error("Failed to get inventory", error);
        // }
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={{color: '#fff', width: "auto", height: 50, borderWidth: 1, borderColor: '#ffffff', borderRadius: 10, marginBottom: 5}}
                placeholder="Search"
                placeholderTextColor="#696969"
                onChangeText={()=>{}}
            />
            <FlatList
                //data={getRecipes(session)}
                data={DATA.recipes}
                renderItem={({item}) => <Item title={item.title} description={item.description}/>}
                keyExtractor={item => item.title}
            />
            <Text
                style={styles.button}
                onPress={() => router.navigate('/addrecipe')}>
                {"+"}
            </Text>
            <StatusBar style="light" backgroundColor={"#000000"}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    text: {
        color: '#fff',
    },
    item: {
        borderColor: '#ffffff',
        borderWidth: 1,
        backgroundColor: '#141414',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        color:'#ffffff'
    },
    buttonContainer: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 10,
        marginBottom: 10,
    },
    button: {
        color: '#fff',
        textAlign: 'center',
        textAlignVertical: 'center',
        width: 50,
        height: 50,
        fontSize: 30,
        position: "absolute",
        top: 0,
        right: 15,
    },
});
