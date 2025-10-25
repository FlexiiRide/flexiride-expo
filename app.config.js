import "dotenv/config";

export default {
  expo: {
    name: "FlexiRide",
    slug: "flexiride-expo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "flexiride",
    userInterfaceStyle: "automatic",
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router"
    ],
    experiments: {
      typedRoutes: true
    }
  },
  extra: {
    API_BASE_URL:
      process.env.API_BASE_URL ||
      "https://flexiride-backend-hdoc.onrender.com/", // replace with your backend IP and port
  },
};
