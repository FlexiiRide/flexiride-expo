import { View, StyleSheet, Image } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/date-range-picker";
import { useLocalSearchParams } from "expo-router";
import { Card } from "@/components/ui/card";
import { authenticatedFetch } from "@/lib/authFetch";
import { useAuth } from "@/contexts/auth-context";
import { Vehicle } from "@/types";
import React, { useEffect, useState } from "react";

// This is a mock data source. In a real app, you would fetch this data from an API.
const getVehicleDetails = async (id: string, token: string): Promise<Vehicle | null> => {

  try {
    const response = await authenticatedFetch(`vehicles/${id}`, token, {
      method: 'GET',
      credentials: 'include', // if backend sets cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error getting data:', errorData);
      return null;
    }

    return await response.json();

  } catch (error) {
    console.error('Error calling fetch:', error);
    return null;
  }
};

export default function VehicleDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { refreshToken } = useAuth();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (!id || !refreshToken) return;

    getVehicleDetails(id as string, refreshToken).then(result => setVehicle(result));
  }, [id, refreshToken]);

  if (!vehicle) return null; // or a loader

  return (
    <ThemedView style={styles.container}>
      {vehicle.images?.[0] && (
        <Image source={{ uri: vehicle.images[0] }} style={styles.vehicleImage} />
      )}
      <View style={styles.detailsContainer}>
        <ThemedText type="title">{vehicle.title}</ThemedText>
        <ThemedText style={styles.price}>${vehicle.pricePerDay}/day</ThemedText>
        <ThemedText style={styles.description}>{vehicle.description}</ThemedText>
      </View>
      <Card style={styles.bookingCard}>
        <DateRangePicker />
        <Button title="Request to Book" onPress={() => { }} />
      </Card>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  vehicleImage: {
    width: "100%",
    height: 250,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1D3D47",
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
  },
  bookingCard: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    gap: 20,
  },
});
