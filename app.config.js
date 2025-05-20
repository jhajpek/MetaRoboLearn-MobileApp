import "dotenv/config";

export default {
    expo: {
        name: "MetaRoboLearn",
        slug: "MetaRoboLearn",
        version: "1.0.0",
        orientation: "landscape",
        icon: "./assets/logo-black.png",
        userInterfaceStyle: "light",
        newArchEnabled: true,
        extra: {
            BACKEND_URL: process.env.BACKEND_URL,
            BACKEND_PORT: process.env.BACKEND_PORT,
        }
    }
};
