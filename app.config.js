import "dotenv/config";

export default {
  extra: {
    API_BASE_URL:
      process.env.API_BASE_URL ||
      "https://flexiride-backend-hdoc.onrender.com/", // replace with your backend IP and port
  },
};
