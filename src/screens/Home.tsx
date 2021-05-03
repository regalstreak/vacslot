import React, { useEffect, useState } from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';
import { DataTable, Divider } from 'react-native-paper';
import { Dropdown, IDropdownItem } from 'src/components/Dropdown';
import { colors } from 'src/constants/colors';
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
            try {
                const notificationStore: INotificationStore = await getAsyncStorageItem(
                    AsyncStorageKeys.NOTIFICATION,
                );
                setLastChecked(notificationStore.lastChecked);
            } catch (error) {}
        };
        setLastCheckedDate();
    }, []);

    useEffect(() => {
        const getSettings = async () => {
            try {
                const settingsStore: ISettingsStore = await getAsyncStorageItem(
                    AsyncStorageKeys.SETTINGS,
                );
                setSelectedState(settingsStore.state);
                setSelectedDistrict(settingsStore.district);
                setHideAbove45(settingsStore.hideAbove45);
                setNotificationsEnabled(settingsStore.notificationsEnabled);
            } catch (error) {}
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
            <ScrollView
                style={styles.container}
                keyboardShouldPersistTaps='handled'
            >
                <Text style={styles.title}>vacslot</Text>
                <Text style={styles.subTitle}>
                    The no-nonsense vaccine slot finder
                </Text>
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
                <View style={styles.minAgeSwitch}>
                    <Text style={styles.minAgeSwitchText} numberOfLines={1}>
                        Hide results having minimum age 45
                    </Text>
                    <Switch
                        onValueChange={setHideAbove45}
                        value={hideAbove45}
                        thumbColor={colors.secondaryLight}
                    />
                </View>
                <View style={styles.minAgeSwitch}>
                    <Text style={styles.minAgeSwitchText} numberOfLines={1}>
                        Notify when slots are available
                    </Text>
                    <Switch
                        onValueChange={setNotificationsEnabled}
                        value={notificationsEnabled}
                        thumbColor={colors.secondaryLight}
                    />
                </View>
                {lastChecked && <Text>Last Checked: {lastChecked} </Text>}
                <Divider style={{ marginVertical: 20 }} />
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
                                        <DataTable.Title>Date</DataTable.Title>
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
                                                        {session.min_age_limit}
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
            <Attribution />
        </>
    );
};

const Attribution = () => {
    return (
        <View style={styles.attributionContainer}>
            <Text style={styles.attributionText}>
                <Text
                    onPress={async () => {
                        await Linking.openURL(
                            'https://twitter.com/regalstreak',
                        );
                    }}
                >
                    <Text style={{ fontWeight: '700' }}>{'</>'}</Text> with 💖
                    by{' '}
                    <Text
                        style={{
                            color: colors.secondary,
                            fontWeight: '700',
                            textDecorationLine: 'underline',
                        }}
                    >
                        Neil Agarwal
                    </Text>
                    .
                </Text>{' '}
                <Text
                    onPress={async () => {
                        await Linking.openURL(
                            'https://github.com/regalstreak/vacslot',
                        );
                    }}
                >
                    Code open on{' '}
                    <Text
                        style={{
                            color: colors.textGray,
                            fontWeight: '700',
                            textDecorationLine: 'underline',
                        }}
                    >
                        Github
                    </Text>
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
    },
    subTitle: {
        fontSize: 16,
        marginBottom: 20,
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
    attributionContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    attributionText: {
        fontSize: 14,
    },
});
