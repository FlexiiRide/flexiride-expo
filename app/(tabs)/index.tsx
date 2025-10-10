import { Image, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Vehicle } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { DateRangePicker } from "@/components/date-range-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { authenticatedFetch } from "@/lib/authFetch";

const getPopularVehicles = async (token: string): Promise<Vehicle[] | null> => {

  try {
    const response = await authenticatedFetch('vehicles', token, {
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


export default function HomeScreen() {
  const router = useRouter();
  const { token } = useAuth();

  const [popularVehicles, setPopularVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    if (!token) return;

    getPopularVehicles(token).then(result => {
      setPopularVehicles(result || []);
    });
  }
    , [token]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FFFFFF", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={{
            uri: "https://www.singaporecarrental.sg/wp-content/uploads/2020/04/lady-enjoying-view-from-rented-car.jpg",
          }}
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Find Your Perfect Ride, Right Now.</ThemedText>
      </ThemedView>
      <View style={styles.searchContainer}>
        <Input
          placeholder="Enter a location"
          icon={<IconSymbol name="magnifyingglass" color={""} />}
        />
        <DateRangePicker />
        <Button title="Search" onPress={() => { }} />
      </View>
      <ThemedView style={styles.popularVehiclesContainer}>
        <ThemedText type="subtitle">Popular Vehicles</ThemedText>
        {popularVehicles && popularVehicles.map((vehicle) => (
          <Card
            key={vehicle.id}
            onPress={() => router.push(`/vehicle/${vehicle.id}`)}
            style={styles.vehicleCard}
          >
            <Image
              source={{ uri: vehicle.images[0] }}
              style={styles.vehicleImage}
            />
            <View style={styles.vehicleDetails}>
              <ThemedText type="defaultSemiBold">{vehicle.title}</ThemedText>
              <ThemedText>${vehicle.pricePerDay}/day</ThemedText>
            </View>
          </Card>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: "100%",
    height: 250,
  },
  titleContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#F9FAFB",
    gap: 16,
  },
  popularVehiclesContainer: {
    padding: 16,
  },
  vehicleCard: {
    marginBottom: 16,
  },
  vehicleImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  vehicleDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
