import React, { useState } from "react";
import { View, StyleSheet, FlatList, Image } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Vehicle } from "@/types";
import { useThemeColor } from '@/hooks/use-theme-color';
const allVehicles: Vehicle[] = [
  {
    id: "1",
    ownerId: "1",
    title: "Toyota Prius 2019",
    type: "car",
    pricePerHour: 6.5,
    pricePerDay: 50,
    images: [
      "https://tse3.mm.bing.net/th/id/OIP.20PjfVQuasP1aj1VyEqhrwHaFj?rs=1&pid=ImgDetMain&o=7&rm=3",
    ],
    location: {
      address: "Colombo 7, Sri Lanka",
      lat: 6.902,
      lng: 79.865,
    },
    availableRanges: [],
    description: "A very good car",
    status: "active",
  },
  {
    id: "2",
    ownerId: "2",
    title: "Honda Activa 2020",
    type: "bike",
    pricePerHour: 2.5,
    pricePerDay: 20,
    images: [
      "https://images.carandbike.com/cms/articles/2024/2/3211549/Honda_Activa_9f47b6cd52.jpg",
    ],
    location: {
      address: "Colombo 5, Sri Lanka",
      lat: 6.884,
      lng: 79.863,
    },
    availableRanges: [],
    description: "A very good bike",
    status: "active",
  },
  {
    id: "3",
    ownerId: "3",
    title: "Tesla Model 3",
    type: "car",
    pricePerHour: 15.0,
    pricePerDay: 120,
    images: ["https://via.placeholder.com/150"],
    location: {
      address: "Galle, Sri Lanka",
      lat: 6.053,
      lng: 80.221,
    },
    availableRanges: [],
    description: "Electric and stylish",
    status: "active",
  },
  {
    id: "4",
    ownerId: "4",
    title: "Yamaha MT-07",
    type: "bike",
    pricePerHour: 8.0,
    pricePerDay: 70,
    images: ["https://via.placeholder.com/150"],
    location: {
      address: "Kandy, Sri Lanka",
      lat: 7.29,
      lng: 80.633,
    },
    availableRanges: [],
    description: "A powerful and agile bike",
    status: "active",
  },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState(allVehicles);
  const backgroundColor = useThemeColor({}, 'background');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = allVehicles.filter((vehicle) =>
      vehicle.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredVehicles(filtered);
  };

  const renderVehicle = ({ item }: { item: Vehicle }) => (
    <Card style={styles.vehicleCard}>
      <Image source={{ uri: item.images[0] }} style={styles.vehicleImage} />
      <View style={styles.vehicleDetails}>
        <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
        <ThemedText>{item.type}</ThemedText>
        <ThemedText>${item.pricePerHour}/hour</ThemedText>
      </View>
    </Card>
  );

  return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <ThemedText type="title" style={styles.title}>
          Explore
        </ThemedText>
        <Input
          placeholder="Search for a vehicle..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <FlatList
          data={filteredVehicles}
          renderItem={renderVehicle}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  vehicleCard: {
    marginBottom: 16,
  },
  vehicleImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  vehicleDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
