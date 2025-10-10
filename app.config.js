import "dotenv/config";

export default {
  extra: {
    API_BASE_URL: process.env.API_BASE_URL || "http://192.168.1.8:4000/", // replace with your backend IP and port
  },
};
