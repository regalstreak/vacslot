import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Dropdown } from './components/Dropdown';

const listItems = [
    { label: 'Others', value: 'others' },
    { label: 'Apples', value: 'apples' },
    { label: 'Oranges', value: 'oranges' },
];

export const Home = () => {
    const [fruit, setFruit] = useState<string>();
    return (
        <View
            style={{
                margin: 20,
            }}
        >
            <Text>testing</Text>
            <Dropdown
                label='Fruit'
                mode='outlined'
                value={fruit}
                setValue={value => {
                    setFruit(value as string);
                }}
                listItems={listItems}
            />
            <TextInput label='testing label' mode='outlined' />
            <TextInput label='testing label' mode='outlined' />
        </View>
    );
};
