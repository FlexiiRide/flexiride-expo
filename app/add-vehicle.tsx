import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  Car,
  Bike,
  MapPin,
  Calendar,
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  ArrowLeft,
  ArrowRight,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/contexts/auth-context";
import { createVehicle } from "@/lib/vehicleFetch";

type VehicleFormData = {
  title: string;
  type: "car" | "bike";
  pricePerHour: string;
  pricePerDay: string;
  location: {
    address: string;
    lat: string;
    lng: string;
  };
  images: string[];
  availableRanges: {
    from: string;
    to: string;
  }[];
  description: string;
};

const steps = [
  { id: 1, name: "Basic Info", icon: Car },
  { id: 2, name: "Pricing", icon: MapPin },
  { id: 3, name: "Location", icon: MapPin },
  { id: 4, name: "Images", icon: ImageIcon },
  { id: 5, name: "Availability", icon: Calendar },
  { id: 6, name: "Description", icon: Check },
];

export default function AddVehicleScreen() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor(
    { light: "#eaecf7", dark: "rgba(43, 44, 44, 1)" },
    "background"
  );
  const borderColor = useThemeColor(
    { light: "#e5e7eb", dark: "#374151" },
    "tint"
  );
  const textColor = useThemeColor(
    { light: "#111827", dark: "#f9fafb" },
    "text"
  );
  const mutedColor = useThemeColor(
    { light: "#6b7280", dark: "#9ca3af" },
    "text"
  );

  const [formData, setFormData] = useState<VehicleFormData>({
    title: "",
    type: "car",
    pricePerHour: "",
    pricePerDay: "",
    location: {
      address: "",
      lat: "",
      lng: "",
    },
    images: [],
    availableRanges: [{ from: "", to: "" }],
    description: "",
  });

  const updateField = (field: keyof VehicleFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateLocation = (
    field: keyof VehicleFormData["location"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  const addAvailabilityRange = () => {
    setFormData((prev) => ({
      ...prev,
      availableRanges: [...prev.availableRanges, { from: "", to: "" }],
    }));
  };

  const removeAvailabilityRange = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      availableRanges: prev.availableRanges.filter((_, i) => i !== index),
    }));
  };

  const updateAvailabilityRange = (
    index: number,
    field: "from" | "to",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      availableRanges: prev.availableRanges.map((range, i) =>
        i === index ? { ...range, [field]: value } : range
      ),
    }));
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow access to your photos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow access to your camera");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      const newImage = result.assets[0].uri;
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage],
      }));
    }
  };

  const pickImageWeb = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/jpg,image/webp";
    input.multiple = true;

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;

      if (files) {
        const newImages: string[] = [];
        let filesProcessed = 0;

        Array.from(files).forEach((file) => {
          const reader = new FileReader();

          reader.onload = (event) => {
            if (event.target?.result) {
              newImages.push(event.target.result as string);
            }

            filesProcessed++;

            // Update state when all files are processed
            if (filesProcessed === files.length) {
              setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...newImages],
              }));
            }
          };

          reader.readAsDataURL(file);
        });
      }
    };

    input.click();
  };

  const showImagePickerOptions = () => {
    // For web platform, directly open file picker
    if (Platform.OS === "web") {
      pickImageWeb();
      return;
    }

    // For mobile platforms, show the alert with camera/gallery options
    Alert.alert(
      "Add Photos",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: takePhoto,
        },
        {
          text: "Choose from Gallery",
          onPress: pickFromGallery,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.title.trim().length > 0;
      case 2:
        return (
          formData.pricePerHour.trim().length > 0 &&
          parseFloat(formData.pricePerHour) > 0 &&
          formData.pricePerDay.trim().length > 0 &&
          parseFloat(formData.pricePerDay) > 0
        );
      case 3:
        return formData.location.address.trim().length > 0;
      case 4:
        return formData.images.length > 0;
      case 5:
        return formData.availableRanges.some((range) => range.from && range.to);
      case 6:
        return formData.description.trim().length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(steps.length, currentStep + 1));
    } else {
      Alert.alert("Required", "Please fill in all required fields");
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      Alert.alert("Required", "Please complete all fields");
      return;
    }

    if (!accessToken) {
      Alert.alert("Error", "You must be logged in to add a vehicle");
      router.push("/sign-in");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createVehicle(formData, accessToken);

      if (result.success) {
        Alert.alert("Success", "Vehicle added successfully!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert(
          "Error",
          result.error || "Failed to add vehicle. Please try again."
        );
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ThemedView style={styles.stepContent}>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>
                Vehicle Title <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: cardBackground,
                    borderColor,
                    color: textColor,
                  },
                ]}
                value={formData.title}
                onChangeText={(text) => updateField("title", text)}
                placeholder="e.g., Toyota Prius 2019"
                placeholderTextColor={mutedColor}
              />
            </ThemedView>

            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>
                Vehicle Type <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <ThemedView style={styles.typeButtons}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    { borderColor },
                    formData.type === "car" && styles.typeButtonActive,
                  ]}
                  onPress={() => updateField("type", "car")}
                >
                  <Car
                    size={32}
                    color={formData.type === "car" ? "#3b82f6" : mutedColor}
                  />
                  <ThemedText style={styles.typeButtonText}>Car</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    { borderColor },
                    formData.type === "bike" && styles.typeButtonActive,
                  ]}
                  onPress={() => updateField("type", "bike")}
                >
                  <Bike
                    size={32}
                    color={formData.type === "bike" ? "#3b82f6" : mutedColor}
                  />
                  <ThemedText style={styles.typeButtonText}>Bike</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        );

      case 2:
        return (
          <ThemedView style={styles.stepContent}>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>
                Price Per Hour (LKR){" "}
                <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <ThemedView style={styles.priceInputContainer}>
                <ThemedText style={styles.currencyLabel}>LKR</ThemedText>
                <TextInput
                  style={[
                    styles.priceInput,
                    {
                      backgroundColor: cardBackground,
                      borderColor,
                      color: textColor,
                    },
                  ]}
                  value={formData.pricePerHour}
                  onChangeText={(text) => updateField("pricePerHour", text)}
                  placeholder="650"
                  placeholderTextColor={mutedColor}
                  keyboardType="decimal-pad"
                />
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>
                Price Per Day (LKR){" "}
                <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <ThemedView style={styles.priceInputContainer}>
                <ThemedText style={styles.currencyLabel}>LKR</ThemedText>
                <TextInput
                  style={[
                    styles.priceInput,
                    {
                      backgroundColor: cardBackground,
                      borderColor,
                      color: textColor,
                    },
                  ]}
                  value={formData.pricePerDay}
                  onChangeText={(text) => updateField("pricePerDay", text)}
                  placeholder="4500"
                  placeholderTextColor={mutedColor}
                  keyboardType="decimal-pad"
                />
              </ThemedView>
            </ThemedView>

            {formData.pricePerHour &&
              formData.pricePerDay &&
              parseFloat(formData.pricePerHour) > 0 &&
              parseFloat(formData.pricePerDay) > 0 && (
                <ThemedView style={styles.savingsCard}>
                  <ThemedText style={styles.savingsText}>
                    Daily rate savings: LKR{" "}
                    {(
                      parseFloat(formData.pricePerHour) * 24 -
                      parseFloat(formData.pricePerDay)
                    ).toFixed(2)}{" "}
                    (
                    {(
                      ((parseFloat(formData.pricePerHour) * 24 -
                        parseFloat(formData.pricePerDay)) /
                        (parseFloat(formData.pricePerHour) * 24)) *
                      100
                    ).toFixed(0)}
                    % off)
                  </ThemedText>
                </ThemedView>
              )}
          </ThemedView>
        );

      case 3:
        return (
          <ThemedView style={styles.stepContent}>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>
                Address <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <ThemedView style={styles.textAreaContainer}>
                <MapPin size={20} color={mutedColor} style={styles.inputIcon} />
                <TextInput
                  style={[
                    styles.textArea,
                    {
                      backgroundColor: cardBackground,
                      borderColor,
                      color: textColor,
                    },
                  ]}
                  value={formData.location.address}
                  onChangeText={(text) => updateLocation("address", text)}
                  placeholder="e.g., Colombo 7, Sri Lanka"
                  placeholderTextColor={mutedColor}
                  multiline
                  numberOfLines={3}
                />
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.row}>
              <ThemedView
                style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}
              >
                <ThemedText style={styles.label}>Latitude</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: cardBackground,
                      borderColor,
                      color: textColor,
                    },
                  ]}
                  value={formData.location.lat}
                  onChangeText={(text) => updateLocation("lat", text)}
                  placeholder="6.9149"
                  placeholderTextColor={mutedColor}
                  keyboardType="decimal-pad"
                />
              </ThemedView>

              <ThemedView
                style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}
              >
                <ThemedText style={styles.label}>Longitude</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: cardBackground,
                      borderColor,
                      color: textColor,
                    },
                  ]}
                  value={formData.location.lng}
                  onChangeText={(text) => updateLocation("lng", text)}
                  placeholder="79.8615"
                  placeholderTextColor={mutedColor}
                  keyboardType="decimal-pad"
                />
              </ThemedView>
            </ThemedView>

            <ThemedView
              style={[styles.tipCard, { backgroundColor: cardBackground }]}
            >
              <ThemedText style={styles.tipText}>
                💡 Tip: Use Google Maps to find exact coordinates
              </ThemedText>
            </ThemedView>
          </ThemedView>
        );

      case 4:
        return (
          <ThemedView style={styles.stepContent}>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>
                Vehicle Images{" "}
                <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>

              <TouchableOpacity
                style={[styles.uploadButton, { borderColor }]}
                onPress={showImagePickerOptions}
              >
                <ImageIcon size={32} color={mutedColor} />
                <ThemedText style={styles.uploadButtonText}>
                  Tap to add photos/ images
                </ThemedText>
                <ThemedText
                  style={[styles.uploadButtonSubtext, { color: mutedColor }]}
                >
                  PNG, JPG, WEBP
                </ThemedText>
              </TouchableOpacity>

              {formData.images.length > 0 && (
                <ThemedView style={styles.imageGrid}>
                  {formData.images.map((uri, index) => (
                    <ThemedView key={index} style={styles.imageContainer}>
                      <Image source={{ uri }} style={styles.imageThumb} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <Trash2 size={16} color="#fff" />
                      </TouchableOpacity>
                      <ThemedView style={styles.imageNumber}>
                        <ThemedText style={styles.imageNumberText}>
                          {index + 1}
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>
                  ))}
                </ThemedView>
              )}
            </ThemedView>
          </ThemedView>
        );

      case 5:
        return (
          <ThemedView style={styles.stepContent}>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>
                Availability Periods{" "}
                <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>

              {formData.availableRanges.map((range, index) => (
                <ThemedView
                  key={index}
                  style={[
                    styles.rangeCard,
                    { backgroundColor: cardBackground, borderColor },
                  ]}
                >
                  <ThemedView style={styles.rangeHeader}>
                    <ThemedText style={styles.rangeTitle}>
                      Period {index + 1}
                    </ThemedText>
                    {formData.availableRanges.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeAvailabilityRange(index)}
                      >
                        <Trash2 size={18} color="#ef4444" />
                      </TouchableOpacity>
                    )}
                  </ThemedView>

                  <ThemedView style={styles.dateInputGroup}>
                    <ThemedText
                      style={[styles.dateLabel, { color: mutedColor }]}
                    >
                      From
                    </ThemedText>
                    <TextInput
                      style={[
                        styles.dateInput,
                        { backgroundColor, borderColor, color: textColor },
                      ]}
                      value={range.from}
                      onChangeText={(text) =>
                        updateAvailabilityRange(index, "from", text)
                      }
                      placeholder="YYYY-MM-DD HH:MM"
                      placeholderTextColor={mutedColor}
                    />
                  </ThemedView>

                  <ThemedView style={styles.dateInputGroup}>
                    <ThemedText
                      style={[styles.dateLabel, { color: mutedColor }]}
                    >
                      To
                    </ThemedText>
                    <TextInput
                      style={[
                        styles.dateInput,
                        { backgroundColor, borderColor, color: textColor },
                      ]}
                      value={range.to}
                      onChangeText={(text) =>
                        updateAvailabilityRange(index, "to", text)
                      }
                      placeholder="YYYY-MM-DD HH:MM"
                      placeholderTextColor={mutedColor}
                    />
                  </ThemedView>
                </ThemedView>
              ))}

              <TouchableOpacity
                style={[styles.addRangeButton, { borderColor }]}
                onPress={addAvailabilityRange}
              >
                <Plus size={20} color="#3b82f6" />
                <ThemedText style={styles.addRangeButtonText}>
                  Add Another Period
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        );

      case 6:
        return (
          <ThemedView style={styles.stepContent}>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>
                Vehicle Description{" "}
                <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <TextInput
                style={[
                  styles.textArea,
                  styles.descriptionInput,
                  {
                    backgroundColor: cardBackground,
                    borderColor,
                    color: textColor,
                  },
                ]}
                value={formData.description}
                onChangeText={(text) => updateField("description", text)}
                placeholder="Describe your vehicle, its features, condition..."
                placeholderTextColor={mutedColor}
                multiline
                numberOfLines={6}
              />
              <ThemedText style={[styles.charCount, { color: mutedColor }]}>
                {formData.description.length} characters
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.summaryCard}>
              <ThemedText style={styles.summaryTitle}>Summary</ThemedText>
              <ThemedView style={styles.summaryRow}>
                <ThemedText
                  style={[styles.summaryLabel, { color: mutedColor }]}
                >
                  Vehicle:
                </ThemedText>
                <ThemedText style={styles.summaryValue}>
                  {formData.title || "Not set"}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.summaryRow}>
                <ThemedText
                  style={[styles.summaryLabel, { color: mutedColor }]}
                >
                  Type:
                </ThemedText>
                <ThemedText style={styles.summaryValue}>
                  {formData.type.charAt(0).toUpperCase() +
                    formData.type.slice(1)}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.summaryRow}>
                <ThemedText
                  style={[styles.summaryLabel, { color: mutedColor }]}
                >
                  Pricing:
                </ThemedText>
                <ThemedText style={styles.summaryValue}>
                  LKR {formData.pricePerHour || "0"}/hr · LKR{" "}
                  {formData.pricePerDay || "0"}/day
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.summaryRow}>
                <ThemedText
                  style={[styles.summaryLabel, { color: mutedColor }]}
                >
                  Images:
                </ThemedText>
                <ThemedText style={styles.summaryValue}>
                  {formData.images.length} uploaded
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor }]}
    >
      {/* Header */}
      <ThemedView style={[styles.header, { borderBottomColor: borderColor }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedView style={{ flex: 1 }}>
          <ThemedText style={styles.headerTitle}>Add New Vehicle</ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: mutedColor }]}>
            Step {currentStep} of {steps.length}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Progress Bar */}
      <ThemedView style={styles.progressContainer}>
        <ThemedView
          style={[styles.progressBar, { backgroundColor: borderColor }]}
        >
          <ThemedView
            style={[
              styles.progressFill,
              { width: `${(currentStep / steps.length) * 100}%` },
            ]}
          />
        </ThemedView>
      </ThemedView>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
      </ScrollView>

      {/* Footer */}
      <ThemedView style={[styles.footer, { borderTopColor: borderColor }]}>
        <TouchableOpacity
          style={[
            styles.footerButton,
            styles.backFooterButton,
            { borderColor },
            currentStep === 1 && styles.disabledButton,
          ]}
          onPress={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          <ThemedText style={styles.backButtonText}>Previous</ThemedText>
        </TouchableOpacity>

        {currentStep === steps.length ? (
          <TouchableOpacity
            style={[
              styles.footerButton,
              styles.submitButton,
              (!validateStep(currentStep) || isSubmitting) &&
                styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!validateStep(currentStep) || isSubmitting}
          >
            <ThemedText style={styles.submitButtonText}>
              {isSubmitting ? "Creating..." : "Create Vehicle"}
            </ThemedText>
            {!isSubmitting && <Check size={20} color="#fff" />}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.footerButton,
              styles.nextButton,
              !validateStep(currentStep) && styles.disabledButton,
            ]}
            onPress={handleNext}
            disabled={!validateStep(currentStep)}
          >
            <ThemedText style={styles.nextButtonText}>Next</ThemedText>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  stepContent: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  required: {
    color: "#ef4444",
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    fontSize: 16,
  },
  typeButtons: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    gap: 8,
  },
  typeButtonActive: {
    borderColor: "#3b82f6",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencyLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    fontSize: 16,
  },
  savingsCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  savingsText: {
    fontSize: 14,
  },
  textAreaContainer: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 12,
    top: 12,
    zIndex: 1,
  },
  textArea: {
    paddingHorizontal: 16,
    paddingLeft: 40,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  descriptionInput: {
    minHeight: 120,
    paddingLeft: 16,
  },
  charCount: {
    fontSize: 12,
    textAlign: "right",
  },
  row: {
    flexDirection: "row",
  },
  tipCard: {
    padding: 12,
    borderRadius: 8,
  },
  tipText: {
    fontSize: 14,
  },
  uploadButton: {
    padding: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  uploadButtonSubtext: {
    fontSize: 14,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  imageContainer: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  imageThumb: {
    width: "100%",
    height: "100%",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#ef4444",
    padding: 6,
    borderRadius: 6,
  },
  imageNumber: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  imageNumberText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  rangeCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginBottom: 12,
  },
  rangeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rangeTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  dateInputGroup: {
    gap: 4,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  dateInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
  },
  addRangeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    gap: 8,
    marginTop: 8,
  },
  addRangeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3b82f6",
  },
  summaryCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    gap: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    gap: 12,
  },
  footerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  backFooterButton: {
    borderWidth: 2,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: "#3b82f6",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#22c55e",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
