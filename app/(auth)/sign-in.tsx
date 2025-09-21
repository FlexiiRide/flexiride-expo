import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';

export default function SignInScreen() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = () => {
        signIn(email, password);
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>Welcome Back</ThemedText>
            <ThemedText style={styles.subtitle}>Sign in to continue</ThemedText>

            <View style={styles.formContainer}>
                <Input 
                    placeholder="Email" 
                    keyboardType="email-address" 
                    value={email} 
                    onChangeText={setEmail} 
                    autoCapitalize="none"
                />
                <Input 
                    placeholder="Password" 
                    secureTextEntry 
                    value={password} 
                    onChangeText={setPassword} 
                />
                <Button title="Sign In" onPress={handleSignIn} />
            </View>

            <View style={styles.footer}>
                <ThemedText>Don't have an account? </ThemedText>
                <TouchableOpacity onPress={() => router.push('/sign-up')}>
                    <ThemedText type="link">Sign Up</ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#F9FAFB',
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 32,
        color: '#6B7280',
    },
    formContainer: {
        gap: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
});
