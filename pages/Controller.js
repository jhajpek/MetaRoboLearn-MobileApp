import { SafeAreaView, View, Text, StyleSheet, Dimensions, Switch, TouchableOpacity } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { Gyroscope } from "expo-sensors";
import ControllerButton from "../components/ControllerButton";

const { height: HEIGHT, width: WIDTH } = Dimensions.get("screen");
const BUTTON_SIZE = 50;


const Controller = () => {
    const [gyroscopeOn, setGyroscopeOn] = useState(false);
    const [pause, setPause] = useState(false);
    const [lastCommand, setLastCommand] = useState("");
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const styles = StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: "row",
            width: WIDTH,
            backgroundColor: "#8AE6E8",
            alignItems: "center",
            justifyContent: "space-between",
        },
        blackView: {
            height: HEIGHT,
            width: insets.left,
            backgroundColor: "black",
        },
        container2: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            width: WIDTH / 2 - insets.left,
        },
        settingItem: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
        },
        controller: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 30,
            height: HEIGHT * 0.9,
            width: HEIGHT * 0.9,
            borderStyle: "solid",
            borderColor: "#33D3D6",
            borderWidth: 3,
            borderRadius: HEIGHT * 0.45
        },
        controllerMidSection: {
            display: "flex",
            flexDirection: "row",
            gap: BUTTON_SIZE + 60,
        },
    });

    useEffect(() => {
        let gyroscopeIncome;
        if(gyroscopeOn) {
            gyroscopeIncome = Gyroscope.addListener(({ x, y, z }) => {
                if(pause) return;

                if(x >= 3.5) {
                    setPause(true);
                    setLastCommand("SKRENI DESNO");
                    setTimeout(() => {
                        setLastCommand("");
                        setPause(false);
                    }, 5000);
                }
                if(x <= -3.5) {
                    setPause(true);
                    setLastCommand("SKRENI LIJEVO");
                    setTimeout(() => {
                        setLastCommand("");
                        setPause(false);
                    }, 5000);
                }
            });
        } else gyroscopeIncome?.remove();

        return () => gyroscopeIncome?.remove();
    }, [gyroscopeOn, pause]);


    return (
        <SafeAreaProvider edges={ ["top", "bottom", "left", "right"] }>
            <SafeAreaView style={ styles.container }>
                <View style={ styles.blackView }></View>
                <View style={ styles.container2 }>
                    <View style={ styles.settingItem }>
                        <Switch
                            trackColor={{ false: '#D7D7D7', true: '#00bbcc' }}
                            thumbColor={ gyroscopeOn ? '#006888' : '#f0f0f0' }
                            onValueChange={ () => setGyroscopeOn(prev => !prev) }
                            value={ gyroscopeOn }
                            style={{ alignSelf: "center" }}
                        />
                        {gyroscopeOn ?
                            <Text>Žiroskop uključen</Text> :
                            <Text>Žiroskop isključen</Text>}
                    </View>
                    <Text style={{ alignSelf: "center", fontSize: 30 }}>{`TRENUTNA NAREDBA:\n${ lastCommand }` }</Text>
                </View>
                <View style={ styles.controller }>
                    <TouchableOpacity onPress={ () => {
                        if(!pause) {
                            setPause(true);
                            setLastCommand("NAPRIJED");
                            setTimeout(() => {
                                setLastCommand("");
                                setPause(false);
                            }, [5000]);
                        }} }>
                        <ControllerButton direction={ "forward" } buttonSize={ BUTTON_SIZE } play={ "#FED857" } bg={ "#33D3D6" } />
                    </TouchableOpacity>
                    <View style={ styles.controllerMidSection }>
                        <TouchableOpacity onPress={ () => {
                            if(!pause) {
                                setPause(true);
                                setLastCommand("SKRENI LIJEVO");
                                setTimeout(() => {
                                    setLastCommand("");
                                    setPause(false);
                                }, [5000]);
                            }} }>
                            <ControllerButton direction={ "turnLeft" } buttonSize={ BUTTON_SIZE } play={ "#33D3D6" } bg={ "#FED857" } />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ () => {
                            if(!pause) {
                                setPause(true);
                                setLastCommand("SKRENI DESNO");
                                setTimeout(() => {
                                    setLastCommand("");
                                    setPause(false);
                                }, [5000]);
                            }} }>
                            <ControllerButton direction={ "turnRight" } buttonSize={ BUTTON_SIZE } play={ "#33D3D6" } bg={ "#FED857" } />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={ () => {
                        if(!pause) {
                            setPause(true);
                            setLastCommand("NAZAD");
                            setTimeout(() => {
                                setLastCommand("");
                                setPause(false);
                            }, [5000]);
                        }} }>
                        <ControllerButton direction={ "backward" } buttonSize={ BUTTON_SIZE } play={ "#FED857" } bg={ "#33D3D6" } />
                    </TouchableOpacity>
                </View>
                <View style={ styles.blackView }></View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Controller;