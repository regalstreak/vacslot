import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Dropdown, IDropdownItem } from './components/Dropdown';
import { useDistricts } from './hooks/useDistricts';
import { useStates } from './hooks/useStates';

export const Home = () => {
    const [selectedState, setSelectedState] = useState<IDropdownItem>();
    const [selectedDistrict, setSelectedDistrict] = useState<IDropdownItem>();
    const { statesDropdownItems } = useStates();
    const { districtsDropdownItems } = useDistricts(selectedDistrict?.id);

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
            <View style={{ marginTop: 200 }}>
                {/* <Dropdown
                    label='District'
                    mode='outlined'
                    selectedDropdownItem={selectedDistrict}
                    setValue={setSelectedDistrict}
                    dropdownItems={districtsDropdownItems}
                /> */}
                <Dropdown
                    label='State'
                    mode='outlined'
                    selectedDropdownItem={selectedState}
                    setValue={setSelectedState}
                    dropdownItems={statesDropdownItems}
                />
            </View>
        </View>
    );
};
