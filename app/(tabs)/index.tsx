import { Image, StyleSheet, Platform, View, TextInput } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";
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

const popularVehicles: Vehicle[] = [
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
];

export default function HomeScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FFFFFF", dark: "#000000ff" }}
      headerImage={
        <Image
          source={{
            uri: "https://www.singaporecarrental.sg/wp-content/uploads/2020/04/lady-enjoying-view-from-rented-car.jpg",
          }}
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={[styles.searchContainer, { backgroundColor }]}>
        <ThemedText type="title">Find Your Perfect Ride, Right Now.</ThemedText>
      </ThemedView>
      <View style={[styles.searchContainer, { backgroundColor }]}>
        <Input
          placeholder="Enter a location"
          icon={<IconSymbol name="magnifyingglass" color={""} />}
        />
        <DateRangePicker />
        <Button title="Search" onPress={() => {}} />
      </View>
      <ThemedView style={styles.popularVehiclesContainer}>
        <ThemedText type="subtitle">Popular Vehicles</ThemedText>
        {popularVehicles.map((vehicle) => (
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
