import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "../../types/index";
import { useAuth } from "@/contexts/auth-context";
import { getUserProfile, updateUserProfile } from "../../lib/api";
import { showSuccessToast, showErrorToast } from "../../lib/toast";
import { Edit3, Camera, User as UserIcon, Mail, Phone, FileText } from "lucide-react-native";

export default function ProfileScreen() {
  const { user, token } = useAuth();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<any>(null);

  // Theme colors
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor(
    { light: "#ffffff", dark: "rgba(43, 44, 44, 1)" },
    "background"
  );
  const borderColor = useThemeColor(
    { light: "#e0e0e0", dark: "#404040" },
    "text"
  );
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({ light: "#666", dark: "#ccc" }, "text");

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    if (!user?.id || !token) return;
    
    try {
      setLoading(true);
      const profile = await getUserProfile(user.id, token);
      setProfileData(profile);
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
      });
    } catch (error) {
      showErrorToast("Error", "Failed to load profile data");
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPress = () => {
    setIsEditing(true);
    setSelectedImage(null);
    setImageFile(null);
  };

  const handleDiscardPress = () => {
    Alert.alert(
      "Discard Changes",
      "Are you sure you want to discard all changes?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            setIsEditing(false);
            setSelectedImage(null);
            setImageFile(null);
            // Reset form data to original values
            if (profileData) {
              setFormData({
                name: profileData.name || "",
                phone: profileData.phone || "",
                bio: profileData.bio || "",
              });
            }
          },
        },
      ]
    );
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setSelectedImage(asset.uri);
      
      // Create file object for upload
      const fileExtension = asset.uri.split('.').pop();
      const fileName = `avatar_${Date.now()}.${fileExtension}`;
      setImageFile({
        uri: asset.uri,
        type: `image/${fileExtension}`,
        name: fileName,
      });
    }
  };

  const handleUpdateProfile = async () => {
    if (!user?.id || !token) return;

    try {
      setUpdating(true);
      
      const updatedProfile = await updateUserProfile(
        user.id,
        token,
        formData,
        imageFile
      );
      
      setProfileData(updatedProfile);
      setIsEditing(false);
      setSelectedImage(null);
      setImageFile(null);
      showSuccessToast("Success", "Profile updated successfully!");
      
    } catch (error) {
      showErrorToast("Error", "Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!profileData) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Failed to load profile data</ThemedText>
          <Button title="Retry" onPress={loadUserProfile} />
        </View>
      </ThemedView>
    );
  }

  const displayImage = selectedImage || profileData.avatarUrl;

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Profile</ThemedText>
          {!isEditing && (
            <TouchableOpacity
              style={[styles.editButton, { borderColor }]}
              onPress={handleEditPress}
            >
              <Edit3 size={20} color={iconColor} />
              <ThemedText style={styles.editButtonText}>Edit</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: cardBackground, borderColor }]}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: displayImage }} style={styles.avatar} />
              {isEditing && (
                <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                  <Camera size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.userInfo}>
              <ThemedText style={styles.userName}>{profileData.name}</ThemedText>
              <ThemedText style={[styles.userRole, { color: iconColor }]}>
                {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
              </ThemedText>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            {isEditing ? (
              <>
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholder="Enter your full name"
                  icon={<UserIcon size={20} color={iconColor} />}
                />
                
                <Input
                  label="Phone Number"
                  value={formData.phone}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  icon={<Phone size={20} color={iconColor} />}
                />
                
                <Input
                  label="Bio"
                  value={formData.bio}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
                  placeholder="Tell us about yourself"
                  multiline
                  numberOfLines={3}
                  icon={<FileText size={20} color={iconColor} />}
                />
              </>
            ) : (
              <>
                <View style={styles.fieldContainer}>
                  <View style={styles.fieldHeader}>
                    <UserIcon size={20} color={iconColor} />
                    <ThemedText style={[styles.fieldLabel, { color: iconColor }]}>
                      Full Name
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.fieldValue}>{profileData.name}</ThemedText>
                </View>

                <View style={styles.fieldContainer}>
                  <View style={styles.fieldHeader}>
                    <Mail size={20} color={iconColor} />
                    <ThemedText style={[styles.fieldLabel, { color: iconColor }]}>
                      Email
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.fieldValue}>{profileData.email}</ThemedText>
                </View>

                <View style={styles.fieldContainer}>
                  <View style={styles.fieldHeader}>
                    <Phone size={20} color={iconColor} />
                    <ThemedText style={[styles.fieldLabel, { color: iconColor }]}>
                      Phone Number
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.fieldValue}>
                    {profileData.phone || "No phone number added"}
                  </ThemedText>
                </View>

                <View style={styles.fieldContainer}>
                  <View style={styles.fieldHeader}>
                    <FileText size={20} color={iconColor} />
                    <ThemedText style={[styles.fieldLabel, { color: iconColor }]}>
                      Bio
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.fieldValue}>
                    {profileData.bio || "No bio added"}
                  </ThemedText>
                </View>
              </>
            )}
          </View>

          {/* Action Buttons */}
          {isEditing && (
            <View style={styles.actionButtons}>
              <Button
                title="Discard"
                onPress={handleDiscardPress}
                variant="secondary"
                style={styles.discardButton}
              />
              <Button
                title={updating ? "Updating..." : "Update"}
                onPress={handleUpdateProfile}
                style={styles.updateButton}
                disabled={updating}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  editButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  profileCard: {
    margin: 20,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    fontWeight: "500",
  },
  formSection: {
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  fieldValue: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  discardButton: {
    flex: 1,
  },
  updateButton: {
    flex: 1,
  },
});