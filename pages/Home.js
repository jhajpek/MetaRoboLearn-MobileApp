import { SafeAreaView, View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../components/Header";
import Triangles from "../components/Triangles";
import Footer from "../components/Footer";

const { height: HEIGHT, width: WIDTH } = Dimensions.get("screen");

const Home = () => {

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            width: WIDTH + getStatusBarHeight() + 1,
            backgroundColor: "rgba(0, 200, 204, 0.4)",
        },
        body: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            position: "relative",
            height:  HEIGHT * 0.745,
            paddingLeft: getStatusBarHeight(),
            margin: 0,
        },
        titleContainer: {
            alignItems: "center",
        },
        title: {
            fontSize: 48,
            fontWeight: "bold",
            textAlign: "center",
            color: "#FFF",
            marginBottom: 20,
            textShadowColor: "rgba(0, 0, 0, 0.8)",
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4
        },
        image: {
            width: HEIGHT * 0.8,
            height: HEIGHT * 0.8,
        },
    });

    return (
        <SafeAreaProvider edges={ ["top", "bottom", "left", "right"] }>
            <SafeAreaView style={ styles.container }>
                <Header forLogin={ true } />
                <View style={ styles.body }>
                    <Triangles trianglesHeight={ HEIGHT * 0.745 } />
                    <View style={ styles.titleContainer }>
                        <Text style={ styles.title }>
                            {"Dobrodošli u\nMetaRoboLearn\nsvijet!"}
                        </Text>
                    </View>
                    <Image source={ require("../assets/robot.png") } style={ styles.image } />
                </View>
                <Footer forLogin={ true } />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Home;