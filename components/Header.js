import { View, Text, Image, StyleSheet, Alert, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ALERT_TITLE = "O nama";
const ALERT_MESSAGE = "ZPR projekt u sklopu završnih radova";
const ALERT_CLOSE_TEXT = "Zatvori";
const HEIGHT = Dimensions.get("screen").height * 0.17;

const Header = ({ forLogin }) => {

    const navigation = useNavigation();
    const styles = StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "rgba(0, 200, 204, 0.4)",
            padding: 10,
            zIndex: 1,
            height: HEIGHT,
        },
        left: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
        },
        right: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
        },
        logo: {
            width: 35,
            height: 50,
        },
        logoText: {
            justifyContent: "center",
            marginLeft: 10,
        },
        text: {
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
        },
        button: {
            borderRadius: 10,
            borderWidth: 2.5,
            borderStyle: "solid",
            borderColor: "#FFF",
            height: 40,
            paddingVertical: 5,
            paddingHorizontal: 20,
        },
        buttonText: {
            color: "#FFF",
            fontSize: 18,
            fontWeight: "600",
            textAlign: "center",
        },
        info: {
            width: 50,
            height: 50,
        },
    });

    return (
        <View style={ styles.container }>
            <View style={ styles.left }>
                <Image source={ require("../assets/logo-white.png") } style={ styles.logo } />
                <View style={ styles.logoText }>
                    <Text style={ styles.text }>MetaRoboLearn</Text>
                </View>
            </View>
            <View style={ styles.right }>
                { forLogin && <TouchableOpacity style={ styles.button } onPress={ () => navigation.navigate("Games") }>
                    <Text style={ styles.buttonText }>Prijava</Text>
                </TouchableOpacity> }
                <TouchableOpacity onPress={ () => Alert.alert(ALERT_TITLE, ALERT_MESSAGE, [{ text: ALERT_CLOSE_TEXT }]) }>
                    <Image source={ require("../assets/info-icon.png") } style={ styles.info } />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Header;
