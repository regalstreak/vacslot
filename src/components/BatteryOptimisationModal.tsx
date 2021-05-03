import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Dialog, Paragraph, Button, Portal } from 'react-native-paper';
import RNDisableBatteryOptimizationsAndroid from '@brandonhenao/react-native-disable-battery-optimizations-android';

export const BatteryOptimisationModal = ({
    modalVisible,
    setModalVisible,
}: {
    modalVisible: boolean;
    setModalVisible: (modalVisible: boolean) => void;
}) => {
    return (
        <Portal>
            <Dialog visible={modalVisible}>
                <Dialog.Title>Battery Optimisation</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>
                        Some devices are known to kill background processes. To
                        make vaccine slot notifications work, go to{' '}
                        <Text style={styles.bold}>
                            Settings {'>'} Battery {'>'} Battery Optimisation{' '}
                            {'>'} All Apps
                        </Text>
                        , click on <Text style={styles.bold}>vacslot</Text> and
                        then <Text style={styles.bold}>Don't Optimise</Text>.{' '}
                        {'\n\n'}
                        Clicking <Text style={styles.bold}>OK</Text> will take
                        you to Settings screen
                    </Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button
                        onPress={() => {
                            setModalVisible(!modalVisible);
                        }}
                        style={styles.okButton}
                    >
                        Dismiss
                    </Button>
                    <Button
                        onPress={() => {
                            setModalVisible(!modalVisible);
                            RNDisableBatteryOptimizationsAndroid.openBatteryModal();
                        }}
                        style={styles.okButton}
                    >
                        OK
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    bold: {
        fontWeight: '700',
    },
    okButton: {
        marginRight: 20,
        transform: [{ translateY: -10 }],
    },
});
