import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from "expo-image-picker";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "../../types/index";
import { useAuth } from "@/contexts/auth-context";
import { getUserProfile, updateUserProfile } from "../../lib/api";

// Toast functions defined inline to avoid import issues
const showSuccessToast = (title: string, message: string) => {
  Alert.alert(title, message);
};

const showErrorToast = (title: string, message: string) => {
  Alert.alert(title, message);
};
import { 
  Edit3, 
  Camera, 
  User as UserIcon, 
  Mail, 
  FileText, 
  Star,
  ArrowLeft
} from "lucide-react-native";

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, accessToken } = useAuth();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<any>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    if (!user?.id || !accessToken) {
      // If no user is logged in, show mock data
      setProfileData({
        id: 'mock_user',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        role: 'client',
        avatarUrl: 'https://picsum.photos/seed/profile/100/100',
        password: '',
        bio: 'A friendly FlexiRide user',
      });
      setFormData({
        name: 'John Doe',
        bio: 'A friendly FlexiRide user',
      });
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const profile = await getUserProfile(user.id, accessToken);
      setProfileData(profile);
      setFormData({
        name: profile.name || "",
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
            setFormData({
              name: profileData?.name || "",
              bio: profileData?.bio || "",
            });
            setSelectedImage(null);
            setImageFile(null);
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
    if (!user?.id || !accessToken) {
      // Mock update for demo
      setUpdating(true);
      setTimeout(() => {
        setProfileData(prev => prev ? { ...prev, ...formData } : null);
        setIsEditing(false);
        setSelectedImage(null);
        setImageFile(null);
        showSuccessToast("Success", "Profile updated successfully!");
        setUpdating(false);
      }, 1500);
      return;
    }

    try {
      setUpdating(true);
      
      const updatedProfile = await updateUserProfile(
        user.id,
        accessToken,
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
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
        </View>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Failed to load profile data</ThemedText>
          <Button title="Retry" onPress={loadUserProfile} />
        </View>
      </View>
    );
  }

  const displayImage = selectedImage || profileData.avatarUrl;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Gradient Background */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>Profile</ThemedText>
            <View style={styles.headerSpacer} />
          </View>
        </LinearGradient>

        {/* Profile Content */}
        <View style={styles.contentContainer}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
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
            </View>

            {/* User Info */}
            <View style={styles.userInfoSection}>
              <ThemedText style={styles.userName}>{profileData.name}</ThemedText>
              <ThemedText style={styles.userRole}>
                {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
              </ThemedText>
              
              {/* Bio Section */}
              {profileData.bio && (
                <View style={styles.bioSection}>
                  <ThemedText style={styles.bioText}>{profileData.bio}</ThemedText>
                </View>
              )}
              
              {/* Rating Section */}
              <View style={styles.ratingSection}>
                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                <ThemedText style={styles.ratingText}>5.0 (234 reviewer)</ThemedText>
              </View>

              {/* Edit Profile Button */}
              {!isEditing ? (
                <TouchableOpacity style={styles.bookButton} onPress={handleEditPress}>
                  <ThemedText style={styles.bookButtonText}>EDIT PROFILE</ThemedText>
                </TouchableOpacity>
              ) : (
                /* Edit Mode - Show form fields */
                <View style={styles.editContainer}>
                  <View style={styles.inputSection}>
                    <Input
                      label="Full Name"
                      value={formData.name}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                      placeholder="Enter your full name"
                      containerStyle={styles.purpleInputContainer}
                      style={styles.purpleInput}
                    />
                  </View>
                  
                  <View style={styles.inputSection}>
                    <Input
                      label="Bio"
                      value={formData.bio}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
                      placeholder="Tell us about yourself..."
                      multiline={true}
                      numberOfLines={3}
                      containerStyle={styles.purpleInputContainer}
                      style={[styles.purpleInput, styles.bioInput]}
                    />
                  </View>
                  
                  <View style={styles.inputSection}>
                    <Input
                      label="Email Address"
                      value={profileData.email}
                      placeholder="Email address"
                      editable={false}
                      containerStyle={[styles.purpleInputContainer, styles.disabledInputContainer]}
                      style={[styles.disabledInput]}
                    />
                    <ThemedText style={styles.helpText}>🔒 Email cannot be changed</ThemedText>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.editActionButtons}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.cancelBtn]}
                      onPress={handleDiscardPress}
                    >
                      <ThemedText style={styles.cancelBtnText}>Cancel</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.saveBtn]}
                      onPress={handleUpdateProfile}
                      disabled={updating}
                    >
                      <ThemedText style={styles.saveBtnText}>
                        {updating ? "Saving..." : "Save Changes"}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  // New Header Styles
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  headerSpacer: {
    width: 40,
  },
  // Content Container
  contentContainer: {
    flex: 1,
    marginTop: -20,
    paddingHorizontal: 20,
  },
  // Profile Card Styles
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#f1f5f9',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#6366f1',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  // User Info Styles
  userInfoSection: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  bioSection: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  bioText: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 6,
  },
  bookButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    width: '100%',
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  // Edit Mode Styles
  editContainer: {
    width: '100%',
    marginTop: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  disabledInput: {
    opacity: 0.6,
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderStyle: 'dashed',
    color: '#1f2937',
  },
  disabledInputContainer: {
    backgroundColor: '#f3e8ff',
    opacity: 0.7,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  helpText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    fontStyle: 'italic',
  },
  editActionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  saveBtn: {
    backgroundColor: '#6366f1',
  },
  cancelBtnText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  purpleInput: {
    backgroundColor: '#f3e8ff',
    color: '#000000',
  },
  purpleInputContainer: {
    backgroundColor: '#f3e8ff',
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});