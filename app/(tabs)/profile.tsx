import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'expo-router';

const ClientProfile = ({ user, signOut }) => (
    <ThemedView style={styles.container}>
        <View style={styles.header}>
            <Image
                source={{ uri: user.avatarUrl }}
                style={styles.avatar}
            />
            <ThemedText type="title" style={styles.name}>Welcome back, {user.name.split(' ')[0]}!</ThemedText>
            <ThemedText type="subtitle">Here's what's happening with your account.</ThemedText>
        </View>

        <Card style={styles.card}>
            <ThemedText type="defaultSemiBold">Your Bookings</ThemedText>
            <View style={styles.bookingContainer}>
                <View style={styles.bookingItem}>
                    <View>
                        <ThemedText>Vehicle ID: v_100</ThemedText>
                        <ThemedText style={styles.bookingDate}>September 22nd, 2025 9:00 AM - 3:00 PM</ThemedText>
                    </View>
                    <View style={styles.bookingStatusContainer}>
                        <ThemedText style={[styles.bookingStatus, styles.approved]}>Approved</ThemedText>
                        <ThemedText style={styles.bookingPrice}>$39.00</ThemedText>
                    </View>
                </View>
                <View style={styles.bookingItem}>
                    <View>
                        <ThemedText>Vehicle ID: v_102</ThemedText>
                        <ThemedText style={styles.bookingDate}>September 27th, 2025 10:00 AM - 6:00 PM</ThemedText>
                    </View>
                    <View style={styles.bookingStatusContainer}>
                        <ThemedText style={[styles.bookingStatus, styles.rejected]}>Rejected</ThemedText>
                        <ThemedText style={styles.bookingPrice}>$70.00</ThemedText>
                    </View>
                </View>
            </View>
        </Card>

        <Button title="Logout" onPress={signOut} variant='secondary' />
    </ThemedView>
);

const OwnerProfile = ({ user, signOut }) => (
    <ThemedView style={styles.container}>
        <View style={styles.header}>
            <Image
                source={{ uri: user.avatarUrl }}
                style={styles.avatar}
            />
            <ThemedText type="title" style={styles.name}>Welcome back, {user.name.split(' ')[0]}!</ThemedText>
            <ThemedText type="subtitle">Here's what's happening with your account.</ThemedText>
        </View>

        <Card style={styles.card}>
            <ThemedText type="defaultSemiBold">Your Booking Requests</ThemedText>
            <View style={styles.bookingContainer}>
                <View style={styles.bookingItem}>
                    <View>
                        <ThemedText>Vehicle ID: v_100</ThemedText>
                        <ThemedText style={styles.bookingDate}>September 22nd, 2025 9:00 AM - 3:00 PM</ThemedText>
                    </View>
                    <View style={styles.bookingStatusContainer}>
                        <ThemedText style={[styles.bookingStatus, styles.approved]}>Approved</ThemedText>
                        <ThemedText style={styles.bookingPrice}>$39.00</ThemedText>
                    </View>
                </View>
                <View style={styles.bookingItem}>
                    <View>
                        <ThemedText>Vehicle ID: v_102</ThemedText>
                        <ThemedText style={styles.bookingDate}>September 27th, 2025 10:00 AM - 6:00 PM</ThemedText>
                    </View>
                    <View style={styles.bookingStatusContainer}>
                        <ThemedText style={[styles.bookingStatus, styles.rejected]}>Rejected</ThemedText>
                        <ThemedText style={styles.bookingPrice}>$70.00</ThemedText>
                    </View>
                </View>
                <View style={styles.bookingItem}>
                    <View>
                        <ThemedText>Vehicle ID: v_100</ThemedText>
                        <ThemedText style={styles.bookingDate}>September 25th, 2025 11:00 AM - 1:00 PM</ThemedText>
                    </View>
                    <View style={styles.bookingStatusContainer}>
                        <ThemedText style={[styles.bookingStatus, styles.cancelled]}>Cancelled</ThemedText>
                        <ThemedText style={styles.bookingPrice}>$13.00</ThemedText>
                    </View>
                </View>
            </View>
        </Card>

        <Card style={styles.card}>
            <ThemedText type="defaultSemiBold">Your Vehicles</ThemedText>
            <View style={styles.vehicleContainer}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1520342868574-5fa3804e551c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=6ff92caffcdd63681a35134a6770ed3b&auto=format&fit=crop&w=1951&q=80' }} style={styles.vehicleImage} />
                <Image source={{ uri: 'https://images.unsplash.com/photo-1522205408450-add114ad53fe?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=368f45b0888aeb0b7b08e3a1084d3ede&auto=format&fit=crop&w=1950&q=80' }} style={styles.vehicleImage} />
                <Image source={{ uri: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=94a1e718d89ca60a6337a6008341ca50&auto=format&fit=crop&w=1950&q=80' }} style={styles.vehicleImage} />
            </View>
        </Card>

        <Button title="Logout" onPress={signOut} variant='secondary' />
    </ThemedView>
);

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    if (!user) {
        return (
            <ThemedView style={styles.unauthenticatedContainer}>
                <ThemedText style={styles.unauthenticatedText}>You are not logged in</ThemedText>
                <View style={styles.buttonContainer}>
                    <Button title="Sign In" onPress={() => router.push('/sign-in')} />
                    <Button title="Sign Up" onPress={() => router.push('/sign-up')} variant='secondary' />
                </View>
            </ThemedView>
        );
    }

    return user.role === 'client' ? <ClientProfile user={user} signOut={signOut} /> : <OwnerProfile user={user} signOut={signOut} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    card: {
        marginBottom: 16,
    },
    bookingContainer: {
        marginTop: 8,
    },
    bookingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    bookingDate: {
        fontSize: 12,
        color: '#666',
    },
    bookingStatusContainer: {
        alignItems: 'flex-end',
    },
    bookingStatus: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    approved: {
        backgroundColor: 'blue',
    },
    rejected: {
        backgroundColor: 'red',
    },
    cancelled: {
        backgroundColor: 'gray',
    },
    bookingPrice: {
        marginTop: 4,
    },
    vehicleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    vehicleImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    unauthenticatedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    unauthenticatedText: {
        marginBottom: 16,
        fontSize: 18,
    },
    buttonContainer: {
        gap: 16,
        width: '100%',
    },
});
