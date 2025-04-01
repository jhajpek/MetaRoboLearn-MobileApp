import { SafeAreaView, StyleSheet, Dimensions, FlatList, View, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Header from "../components/Header";
import Game from "../components/Game";
import Footer from "../components/Footer";

const { height: HEIGHT, width: WIDTH } = Dimensions.get("screen");
const GAMES = [
    { id: 1, name: "Slobodna vožnja", description: "Pruža kontrolu nad robotom u Vašem i robotovom okruženju!" },
    { id: 2, name: "Križić - Kružić", description: "Zaigrajte igricu koju svi volimo, ali bez olovke i papira! Na kvadratić gdje želite staviti svoj znak dovezite robota te stisnite OK!"},
    { id: 3, name: "Igra s kamerom", description: "Nešto što se doda kad dođe kamera."},
];

const Games = () => {

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            width: WIDTH + getStatusBarHeight(),
        },
        body: {
            flex: 1,
            height:  HEIGHT * 0.745,
            backgroundColor: "#8AE6E8",
        },
        list: {
            gap: WIDTH * 0.2 + 10,
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: WIDTH * 0.2,
            paddingRight: WIDTH * 0.2 + 20,
        },
    });

    return (
        <SafeAreaProvider edges={ ["top", "bottom", "left", "right"] }>
            <SafeAreaView style={ styles.container }>
                <Header forLogin={ false } />
                <View style={ styles.body }>
                    <FlatList data={ GAMES }
                              keyExtractor={ (game) => game.id }
                              horizontal={ true }
                              showsHorizontalScrollIndicator={ false }
                              contentContainerStyle={ styles.list }
                              renderItem={({ item }) => (
                                  <Game name={ item.name } description={ item.description } route={ "Controller" } />
                              )} />
                </View>
                <Footer forLogin={ false } />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Games;