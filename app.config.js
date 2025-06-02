import "dotenv/config";

export default {
    expo: {
        name: "MetaRoboLearn",
        slug: "metarobolearn",
        version: "1.0.0",
        orientation: "landscape",
        icon: "./assets/logo-black.png",
        userInterfaceStyle: "light",
        newArchEnabled: true,
        splash: {
            image: "./assets/logo-black.png",
            resizeMode: "contain",
            backgroundColor: "#000",
        },
        android: {
            package: "com.jhajpek.MetaRoboLearn",
            adaptiveIcon: {
                foregroundImage: "./assets/logo-black.png",
            }
        },
        ios: {
            supportsTablet: true
        },
        web: {
            favicon: "./assets/logo-black.png",
        },
        extra: {
            eas: {
                projectId: process.env.PROJECT_ID,
            },
            BACKEND_URL: process.env.BACKEND_URL,
            BACKEND_PORT: process.env.BACKEND_PORT
        }
    }
};
