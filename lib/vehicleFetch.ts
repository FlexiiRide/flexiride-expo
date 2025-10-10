import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
console.log("API_BASE_URL:", API_BASE_URL);

export interface CreateVehicleInput {
  title: string;
  type: "car" | "bike";
  pricePerHour: string;
  pricePerDay: string;
  location: {
    address: string;
    lat: string;
    lng: string;
  };
  images: string[]; // URIs from image picker
  availableRanges: {
    from: string;
    to: string;
  }[];
  description: string;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  title: string;
  type: "car" | "bike";
  pricePerHour: number;
  pricePerDay: number;
  images: string[];
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  availableRanges: {
    from: string;
    to: string;
  }[];
  description: string;
  status: "active" | "inactive";
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Create a new vehicle
 */
export async function createVehicle(
  input: CreateVehicleInput,
  accessToken: string
): Promise<ApiResponse<Vehicle>> {
  try {
    if (!API_BASE_URL) {
      throw new Error("API_BASE_URL is not configured");
    }

    // Create FormData for multipart upload
    const formData = new FormData();
    formData.append("title", input.title);
    formData.append("type", input.type);
    formData.append("pricePerHour", input.pricePerHour);
    formData.append("pricePerDay", input.pricePerDay);
    formData.append("description", input.description);
    formData.append(
      "location",
      JSON.stringify({
        address: input.location.address,
        lat: parseFloat(input.location.lat),
        lng: parseFloat(input.location.lng),
      })
    );
    formData.append("availableRanges", JSON.stringify(input.availableRanges));

    // Append images
    input.images.forEach((imageUri, index) => {
      const uriParts = imageUri.split(".");
      const fileType = uriParts[uriParts.length - 1];

      formData.append("images", {
        uri: imageUri,
        name: `vehicle_image_${index}.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    });

    const response = await fetch(`${API_BASE_URL}vehicles`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      throw new Error(errorData.message || "Failed to create vehicle");
    }

    const vehicle = await response.json();
    return { success: true, data: vehicle };
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create vehicle",
    };
  }
}

/**
 * Get all vehicles owned by current user
 */
export async function getMyVehicles(
  accessToken: string
): Promise<ApiResponse<Vehicle[]>> {
  try {
    if (!API_BASE_URL) {
      throw new Error("API_BASE_URL is not configured");
    }

    const response = await fetch(`${API_BASE_URL}vehicles/owner/my-vehicles`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch vehicles");
    }

    const vehicles = await response.json();
    return { success: true, data: vehicles };
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch vehicles",
    };
  }
}

/**
 * Delete a vehicle
 */
export async function deleteVehicle(
  vehicleId: string,
  accessToken: string
): Promise<ApiResponse<void>> {
  try {
    if (!API_BASE_URL) {
      throw new Error("API_BASE_URL is not configured");
    }

    const response = await fetch(`${API_BASE_URL}vehicles/${vehicleId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete vehicle");
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete vehicle",
    };
  }
}

/**
 * Update vehicle status
 */
export async function updateVehicleStatus(
  vehicleId: string,
  status: "active" | "inactive",
  accessToken: string
): Promise<ApiResponse<Vehicle>> {
  try {
    if (!API_BASE_URL) {
      throw new Error("API_BASE_URL is not configured");
    }

    const formData = new FormData();
    formData.append("status", status);

    const response = await fetch(`${API_BASE_URL}vehicles/${vehicleId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to update vehicle status");
    }

    const vehicle = await response.json();
    return { success: true, data: vehicle };
  } catch (error) {
    console.error("Error updating vehicle status:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update vehicle status",
    };
  }
}
