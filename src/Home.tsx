import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Dropdown, IDropdownItem } from './components/Dropdown';
import { useDistricts } from './hooks/useDistricts';
import { useStates } from './hooks/useStates';

export const Home = () => {
    const [selectedState, setSelectedState] = useState<IDropdownItem>();
    const [selectedDistrict, setSelectedDistrict] = useState<IDropdownItem>();
    const { statesDropdownItems } = useStates();
    const { districtsQuery, districtsDropdownItems } = useDistricts(
        selectedState?.id,
    );

    useEffect(() => {
        districtsQuery.refetch();
    }, [districtsQuery, selectedState]);

    return (
        <View
            style={{
                margin: 20,
            }}
        >
            <Dropdown
                label='State'
                mode='outlined'
                selectedDropdownItem={selectedState}
                setValue={setSelectedState}
                dropdownItems={statesDropdownItems}
            />
            <Dropdown
                label='District'
                mode='outlined'
                selectedDropdownItem={selectedDistrict}
                setValue={setSelectedDistrict}
                dropdownItems={districtsDropdownItems}
            />
        </View>
    );
};
