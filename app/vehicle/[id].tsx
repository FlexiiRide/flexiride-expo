import { View, StyleSheet, Image } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/date-range-picker";
import { useLocalSearchParams } from "expo-router";
import { Card } from "@/components/ui/card";

// This is a mock data source. In a real app, you would fetch this data from an API.
const getVehicleDetails = (id: string) => {
  return {
    id: id,
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
    description:
      "A very good car, with all the modern features. It is well-maintained and regularly serviced.",
    status: "active",
  };
};

export default function VehicleDetailsScreen() {
  const { id } = useLocalSearchParams();
  const vehicle = getVehicleDetails(id as string);

  return (
    <ThemedView style={styles.container}>
      <Image source={{ uri: vehicle.images[0] }} style={styles.vehicleImage} />
      <View style={styles.detailsContainer}>
        <ThemedText type="title">{vehicle.title}</ThemedText>
        <ThemedText style={styles.price}>${vehicle.pricePerDay}/day</ThemedText>
        <ThemedText style={styles.description}>
          {vehicle.description}
        </ThemedText>
      </View>
      <Card style={styles.bookingCard}>
        <DateRangePicker />
        <Button title="Request to Book" onPress={() => {}} />
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
