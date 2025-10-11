import "dotenv/config";

export default {
  extra: {
    API_BASE_URL: process.env.API_BASE_URL || "http://localhost:4000/", // replace with your backend IP and port
  },
};
