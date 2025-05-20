import "dotenv/config";

export default {
    expo: {
        name: "MetaRoboLearn",
        slug: "MetaRoboLearn",
        version: "1.0.0",
        orientation: "landscape",
        extra: {
            BACKEND_URL: process.env.BACKEND_URL
        }
    }
};
