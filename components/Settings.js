import { SafeAreaView, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";


const Settings = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={ styles.container }>
            <Text>U ovo se kasnije ulazi stiskom na Gear Image.</Text>
            <Button title="Nazad na odabir igre" onPress={ () => navigation.navigate("Games") }/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default Settings;