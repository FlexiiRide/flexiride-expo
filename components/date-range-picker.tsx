import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Input } from './ui/input';
import { ThemedText } from './themed-text';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from 'date-fns';

export const DateRangePicker = () => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [datePickerType, setDatePickerType] = useState<'from' | 'to'>('from');
    const [fromDate, setFromDate] = useState<Date | undefined>();
    const [toDate, setToDate] = useState<Date | undefined>();

    const showDatePicker = (type: 'from' | 'to') => {
        setDatePickerType(type);
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        if (datePickerType === 'from') {
            setFromDate(date);
        } else {
            setToDate(date);
        }
        hideDatePicker();
    };

    return (
        <View>
            <ThemedText>Select a date</ThemedText>
            <View style={styles.container}>
                <Pressable onPress={() => showDatePicker('from')} style={styles.input}>
                    <Input
                        placeholder="From"
                        value={fromDate ? format(fromDate, 'yyyy-MM-dd') : ''}
                        editable={false}
                    />
                </Pressable>
                <Pressable onPress={() => showDatePicker('to')} style={styles.input}>
                    <Input
                        placeholder="To"
                        value={toDate ? format(toDate, 'yyyy-MM-dd') : ''}
                        editable={false}
                    />
                </Pressable>
            </View>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                coverScreen={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10
    },
    input: {
        flex: 1,
    },
});
