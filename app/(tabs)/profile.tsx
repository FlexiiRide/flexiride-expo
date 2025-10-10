import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { format } from "date-fns";
import { Plus } from "lucide-react-native";
//import { ModalScreen } from '../modal'
import { Booking, User, Vehicle } from "../../types/index";
import { useAuth } from "@/contexts/auth-context";
import { getBookings, getVehicles, getUsers } from "../../lib/api";

export const DashboardClient: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [myVehicles, setMyVehicles] = useState<Vehicle[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [owners, setOwners] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardBackground = useThemeColor({ light: '#eaecf7', dark: 'rgba(43, 44, 44, 1)' }, 'background');
  const borderColor = useThemeColor({ light: '#292828ff', dark: '#b9b2b2ff' }, 'background');
  const backgroundColor = useThemeColor({}, 'background');

  const isOwner = user?.role === "owner";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isOwner) {
          const ownerBookings = await getBookings({ ownerId: user.id });
          setBookings(ownerBookings);

          const vehicles = await getVehicles({ ownerId: user.id });
          setMyVehicles(vehicles);

          const clientsData = await getUsers({ role: "client" });
          setClients(clientsData);
        } else {
          const clientBookings = await getBookings({ clientId: user?.id });
          setBookings(clientBookings);

          const vehicles = await getVehicles();
          setMyVehicles(vehicles);

          const ownersData = await getUsers({ role: "owner" });
          setOwners(ownersData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [user, isOwner]);

  if (!user) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText>Loading user...</ThemedText>
      </ThemedView>
    );
  }

  const handleBookingAction = (bookingId: string, newStatus: string) => {
    console.log(`Booking ${bookingId} -> ${newStatus}`);
    // TODO: call API and update state
  };

  const handleVehicleSubmit = (vehicleData: any) => {
    console.log("Submitting vehicle:", vehicleData);
    // TODO: call API
  };

  const statusColors: Record<string, any> = {
    approved: { bg: "#d1fae5", text: "#065f46" },
    rejected: { bg: "#fee2e2", text: "#991b1b" },
    requested: { bg: "#fef3c7", text: "#92400e" },
    cancelled: { bg: "#e5e7eb", text: "#374151" },
  };

  if (!user) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText>Loading user...</ThemedText>
      </ThemedView>
    );
  }
  return (
    <ThemedView style={[{ flex: 1, backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Card */}
        <ThemedView style={[styles.profileCard, { backgroundColor: cardBackground }]}>
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          <ThemedView>
            <ThemedText type="title" style={styles.welcomeText}>
              Welcome, {user.name.split(" ")[0]}!
            </ThemedText>
            <ThemedText type="default" style={styles.subtitle}>
              Here's a quick overview of your Account.
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Bookings Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            {isOwner ? "Booking Requests" : "Your Bookings"}
          </ThemedText>
          {bookings.filter((b) => b.status !== "cancelled").length === 0 ? (
            <ThemedView style={styles.noBookings}>
              <ThemedText style={styles.noBookingsText}>No bookings available.</ThemedText>
            </ThemedView>
          ) : (
            bookings
              .filter((b) => b.status !== "cancelled")
              .map((booking) => {
                const vehicle = myVehicles.find(
                  (v) => v.id === booking.vehicleId
                );
                const client = clients.find((c) => c.id === booking.clientId);
                const owner = owners.find((o) => o.id === booking.ownerId);

                return (
                  <ThemedView key={booking.id} style={[styles.bookingCard, { backgroundColor: cardBackground }]}>

                    {/* Top Row: Vehicle info + Badge */}
                    <ThemedView style={styles.cardTop}>
                      <Image
                        source={{ uri: vehicle?.images[0] }}
                        style={styles.vehicleImage}
                      />
                      <ThemedView style={{ flex: 1 }}>
                        <ThemedText style={styles.vehicleTitle}>
                          {vehicle?.title}
                        </ThemedText>
                        <ThemedText style={styles.vehicleId}>ID: {vehicle?.id}</ThemedText>
                      </ThemedView>
                      <ThemedView
                        style={[
                          styles.statusBadge,
                          { backgroundColor: statusColors[booking.status]?.bg },
                        ]}
                      >
                        <ThemedText
                          style={{
                            color: statusColors[booking.status]?.text,
                            fontWeight: "500",
                          }}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>

                    {/* Bottom Row: Renter/Owner, Dates, Price */}
                    <ThemedView style={styles.cardBottom}>
                      <ThemedView style={styles.cardBottomColumn}>
                        <ThemedText style={styles.label}>
                          {isOwner ? "Renter" : "Owner"}
                        </ThemedText>
                        <ThemedText style={styles.value}>
                          {isOwner ? client?.name : owner?.name || "Unknown"}
                        </ThemedText>
                      </ThemedView>

                      <ThemedView style={styles.cardBottomColumn}>
                        <ThemedText style={styles.label}>Dates</ThemedText>
                        <ThemedText style={styles.value}>
                          <ThemedText style={{ fontWeight: "500" }}>From: </ThemedText>
                          {format(new Date(booking.from), "PPP p")}
                        </ThemedText>
                        <ThemedText style={styles.value}>
                          <ThemedText style={{ fontWeight: "500" }}>To: </ThemedText>
                          {format(new Date(booking.to), "PPP p")}
                        </ThemedText>
                      </ThemedView>

                      <ThemedView style={styles.cardBottomColumn}>
                        <ThemedText style={styles.label}>Total Price</ThemedText>
                        <ThemedText style={[styles.value, styles.price]}>
                          LKR {booking.totalPrice.toFixed(2)}
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>

                    {/* Actions */}
                    <ThemedView style={styles.actions}>
                      {isOwner &&
                        booking.status === "requested" &&
                        new Date(booking.from) > new Date() && (
                          <>
                            <TouchableOpacity
                              style={[styles.btn, styles.approveBtn]}
                              onPress={() =>
                                handleBookingAction(booking.id, "approved")
                              }
                            >
                              <ThemedText style={styles.btnText}>Approve</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.btn, styles.rejectBtn]}
                              onPress={() =>
                                handleBookingAction(booking.id, "rejected")
                              }
                            >
                              <ThemedText style={styles.btnText}>Reject</ThemedText>
                            </TouchableOpacity>
                          </>
                        )}

                      {!isOwner &&
                        ["approved", "requested"].includes(booking.status) &&
                        new Date(booking.from) > new Date() && (
                          <TouchableOpacity
                            style={[styles.btn, styles.cancelBtn]}
                            onPress={() =>
                              handleBookingAction(booking.id, "cancelled")
                            }
                          >
                            <ThemedText style={styles.btnText}>Cancel</ThemedText>
                          </TouchableOpacity>
                        )}
                    </ThemedView>
                  </ThemedView>
                );
              })
          )}
        </ThemedView>

        {/* Vehicles Section */}
        {isOwner && (
          <ThemedView style={{ marginTop: 24 }}>
            <ThemedText style={styles.sectionTitle}>Your Vehicles</ThemedText>
            <ThemedView style={styles.vehicleGrid}>
              {myVehicles.map((v) => (
                <ThemedView key={v.id} style={styles.vehicleCard}>
                  <Image
                    source={{ uri: v.images[0] }}
                    style={styles.vehicleCardImage}
                  />
                  <ThemedView style={{ padding: 8 }}>
                    <ThemedText style={styles.vehicleTitle}>{v.title}</ThemedText>
                    <ThemedText style={styles.vehiclePrice}>
                      LKR {v.pricePerDay}/day
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              ))}

              {/* Add Vehicle Button */}
              <TouchableOpacity
                style={[styles.addVehicleCard, { borderColor }]}
                onPress={() => setIsModalOpen(true)}
              >
                <Plus size={28} color="#6b7280" />
                <ThemedText
                  style={{
                    marginTop: 8,
                    color: "#374151",
                    textAlign: "center",
                  }}
                >
                  Add New Vehicle
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        )}

        {/* Add Vehicle Modal */}
        {/* <ModalScreen
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleVehicleSubmit}
      /> */}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginRight: 16 },
  welcomeText: { fontSize: 28, fontWeight: "bold" },
  subtitle: { fontSize: 14, marginTop: 4 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  section: {
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  card: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cardBottomColumn: { flex: 1, marginRight: 12 },
  cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 8 },

  vehicleImage: { width: 48, height: 48, borderRadius: 6, marginRight: 12 },
  vehicleTitle: { fontSize: 16, fontWeight: "600" },
  vehicleId: { fontSize: 12 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  label: { fontSize: 10, marginBottom: 2 },
  value: { fontSize: 14 },
  price: { fontWeight: "600" },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    gap: 8,
  },
  btn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  approveBtn: { backgroundColor: "#22c55e" },
  rejectBtn: { backgroundColor: "#ef4444" },
  cancelBtn: { backgroundColor: "#ca8a04" },
  btnText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  vehicleGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  vehicleCard: {
    width: "48%",
    borderRadius: 12,
    marginBottom: 12,
  },
  vehicleCardImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  vehiclePrice: { fontSize: 12, marginTop: 2 },
  addVehicleCard: {
    width: "48%",
    height: 120,
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  noBookings: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  noBookingsText: {
    fontSize: 14,
    fontStyle: "italic",
  },
});
export default DashboardClient;
