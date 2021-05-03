import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { DataTable, Divider } from 'react-native-paper';
import { Dropdown, IDropdownItem } from 'src/components/Dropdown';
import { useDistricts } from 'src/hooks/useDistricts';
import { useSlots } from 'src/hooks/useSlots';
import { useStates } from 'src/hooks/useStates';
import {
    AsyncStorageKeys,
    getAsyncStorageItem,
    INotificationStore,
    ISettingsStore,
    setSettingsStore,
} from 'src/utils/asyncStorageUtils';

export const Home = () => {
    const [selectedState, setSelectedState] = useState<IDropdownItem>();
    const [selectedDistrict, setSelectedDistrict] = useState<IDropdownItem>();
    const [hideAbove45, setHideAbove45] = useState(true);
    const [lastChecked, setLastChecked] = useState<string>();
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    const { statesDropdownItems } = useStates();
    const { districtsQuery, districtsDropdownItems } = useDistricts(
        selectedState?.id,
    );
    const slotsQuery = useSlots({
        districtId: selectedDistrict?.id,
        hideAbove45,
    });

    useEffect(() => {
        if (selectedState?.id) {
            districtsQuery.refetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedState]);

    useEffect(() => {
        if (selectedDistrict?.id) {
            slotsQuery.refetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDistrict, hideAbove45]);

    useEffect(() => {
        const setLastCheckedDate = async () => {
            const notificationStore: INotificationStore = await getAsyncStorageItem(
                AsyncStorageKeys.NOTIFICATION,
            );
            setLastChecked(notificationStore.lastChecked);
        };
        setLastCheckedDate();
    }, []);

    useEffect(() => {
        const getSettings = async () => {
            const settingsStore: ISettingsStore = await getAsyncStorageItem(
                AsyncStorageKeys.SETTINGS,
            );
            setSelectedState(settingsStore.state);
            setSelectedDistrict(settingsStore.district);
            setHideAbove45(settingsStore.hideAbove45);
            setNotificationsEnabled(settingsStore.notificationsEnabled);
        };

        getSettings();
    }, []);

    useEffect(() => {
        setSettingsStore({
            state: selectedState,
            district: selectedDistrict,
            hideAbove45,
            notificationsEnabled,
        });
    }, [hideAbove45, notificationsEnabled, selectedDistrict, selectedState]);

    return (
        <>
            <View
                style={{
                    margin: 20,
                    flex: 1,
                }}
            >
                <View style={styles.controlsRow}>
                    <Dropdown
                        containerStyle={{ flex: 0.48 }}
                        label='State'
                        mode='outlined'
                        selectedDropdownItem={selectedState}
                        setValue={setSelectedState}
                        dropdownItems={statesDropdownItems}
                    />
                    <Dropdown
                        containerStyle={{ flex: 0.48 }}
                        label='District'
                        mode='outlined'
                        selectedDropdownItem={selectedDistrict}
                        setValue={setSelectedDistrict}
                        dropdownItems={districtsDropdownItems}
                    />
                </View>
                <ScrollView>
                    <View style={styles.minAgeSwitch}>
                        <Text style={styles.minAgeSwitchText} numberOfLines={1}>
                            Hide results having minimum age 45
                        </Text>
                        <Switch
                            onValueChange={setHideAbove45}
                            value={hideAbove45}
                        />
                    </View>
                    <View style={styles.minAgeSwitch}>
                        <Text style={styles.minAgeSwitchText} numberOfLines={1}>
                            Notify when slots are available
                        </Text>
                        <Switch
                            onValueChange={setNotificationsEnabled}
                            value={notificationsEnabled}
                        />
                    </View>
                    {lastChecked && <Text>Last Checked: {lastChecked} </Text>}
                    <Divider />
                    {slotsQuery?.data?.centers &&
                    slotsQuery.data?.centers?.length > 0 ? (
                        slotsQuery.data?.centers?.map((center, centerIndex) => {
                            return (
                                <View
                                    key={centerIndex.toString()}
                                    style={{ marginVertical: 20 }}
                                >
                                    <Text style={styles.centerName}>
                                        {center.name}
                                    </Text>
                                    <DataTable>
                                        <DataTable.Header>
                                            <DataTable.Title>
                                                Date
                                            </DataTable.Title>
                                            <DataTable.Title numeric>
                                                Min Age
                                            </DataTable.Title>
                                            <DataTable.Title numeric>
                                                Availablity
                                            </DataTable.Title>
                                        </DataTable.Header>

                                        {center.sessions.map(
                                            (session, sessionIndex) => {
                                                return (
                                                    <DataTable.Row
                                                        key={sessionIndex.toString()}
                                                    >
                                                        <DataTable.Cell>
                                                            {session.date}
                                                        </DataTable.Cell>
                                                        <DataTable.Cell numeric>
                                                            {
                                                                session.min_age_limit
                                                            }
                                                        </DataTable.Cell>
                                                        <DataTable.Cell numeric>
                                                            {
                                                                session.available_capacity
                                                            }
                                                        </DataTable.Cell>
                                                    </DataTable.Row>
                                                );
                                            },
                                        )}
                                    </DataTable>
                                </View>
                            );
                        })
                    ) : (
                        <>
                            {slotsQuery?.isFetched && (
                                <Text>No centers available</Text>
                            )}
                        </>
                    )}
                </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    centerName: {
        fontWeight: '700',
        fontSize: 14,
    },
    minAgeSwitch: {
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    minAgeSwitchText: {
        fontSize: 16,
    },
});
