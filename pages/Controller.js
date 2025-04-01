import { SafeAreaView, View, Text, Button, StyleSheet, Dimensions, Switch } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { Gyroscope } from "expo-sensors";

const { height } = Dimensions.get("window");

const Controller = () => {
    const [gyroComponents, setGyroComponents] = useState({ x: 0, y: 0, z: 0 });
    const [gyroscopeOn, setGyroscopeOn] = useState(false);
    const navigation = useNavigation();
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
            height: height
        },
        gyroscope: {
            width: 150,
            height: 150,
            borderRadius: 75,
            backgroundColor: "darkgrey",
            transform: [
                { translateX: gyroComponents.x * 200 },
                //{ translateY: gyroComponents.y * 200 }
            ],
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
            marginBottom: 20
        }
    });

    useEffect(() => {
        let gyroscopeIncome;
        if(gyroscopeOn) {
            gyroscopeIncome = Gyroscope.addListener(({ x, y, z }) => {
                setGyroComponents({ x: x.toFixed(1), y: y.toFixed(1), z: z.toFixed(1) });
            });
        } else {
            gyroscopeIncome?.remove();
            setGyroComponents({ x: 0, y: 0, z: 0 });
        }

        return () => gyroscopeIncome?.remove();
    }, [gyroscopeOn]);


    return (
        <SafeAreaProvider edges={ ["top", "bottom", "left", "right"] }>
            <SafeAreaView style={ styles.container }>
                <View style={{ display: "flex", flexDirection: "column" }}>
                    <Switch
                        trackColor={{ false: '#D7D7D7', true: '#00bbcc' }}
                        thumbColor={ gyroscopeOn ? '#006888' : '#f0f0f0' }
                        onValueChange={ () => setGyroscopeOn(prev => !prev) }
                        value={ gyroscopeOn }
                        style={{ alignSelf: "center" }}
                    />
                    {gyroscopeOn ?
                        <View style={{ display: "flex", flexDirection: "column" }}>
                            <Text>Lijevo/desno: { gyroComponents.x }</Text>
                            <View style={ styles.gyroscope }>
                                <Text>Pokret</Text>
                            </View>
                        </View> :
                        <Text>Žiroskop isključen</Text>
                    }
                </View>
                <Button title="Nazad na odabir igre" onPress={ () => navigation.navigate("Games") }/>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Controller;