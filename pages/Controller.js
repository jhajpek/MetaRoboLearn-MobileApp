import { SafeAreaView, View, Text, StyleSheet, Dimensions, Switch, TouchableOpacity } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {useState, useEffect, useRef} from "react";
import { Gyroscope, Accelerometer } from "expo-sensors";
import ControllerButton from "../components/ControllerButton";


const { height: HEIGHT, width: WIDTH } = Dimensions.get("screen");
const BUTTON_SIZE = 75;


const Controller = () => {
    const [gyroscopeOn, setGyroscopeOn] = useState(false);
    const [pause, setPause] = useState(false);
    const [lastCommand, setLastCommand] = useState("");
    const [accelerometerOutput, setAccelerometerOutput] = useState({ x: 0, y: 0, z: 0 });
    const [leftTurnFail, setLeftTurnFail] = useState(false);
    const [rightTurnFail, setRightTurnFail] = useState(false);
    const [duration, setDuration] = useState(1);
    const [moveLength, setMoveLength] = useState(0);
    const [handSide, setHandSide] = useState(true);
    const timeoutRef = useRef(null);
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
        settings: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
            gap: 20,
            width: WIDTH / 2 - insets.left,
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
            justifyContent: "center",
            gap: 30,
        },
        row: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
            alignItems: "center",
        },
        backButton: {
            backgroundColor: "#FE7569",
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 10,
        },
        toggleButton: {
            backgroundColor: "#33D3D6",
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 10,
        },
        backButtonText: {
            color: "#FFF",
            fontWeight: "bold",
            fontSize: 15,
        },
        label: {
            fontWeight: "bold",
            fontSize: 15,
        },
        adjustValuesButton: {
            backgroundColor: "#FED857",
            width: 30,
            height: 30,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center"
        },
        adjustValuesText: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#333",
        },
        currentValueText: {
            fontSize: 15,
            fontWeight: "bold",
            textAlign: "center",
        },
    });

    const executeCommand = (command) => {
        if(command === "STOP") {
            // fetch za stop, ako je uspjesan izvode se iduce naredbe
            clearTimeout(timeoutRef.current);
            setPause(false);
            setLastCommand("");
        } else if(!pause) {
            // fetch za turn ili move, ako je uspjesan izvode se iduce naredbe
            setPause(true);
            setLastCommand(command);
            timeoutRef.current = setTimeout(() => {
                setLastCommand("");
                setPause(false);
            }, duration * 1000);
        }
    };

    useEffect(() => {
        let gyroscopeIncome;
        if(gyroscopeOn) {
            gyroscopeIncome = Gyroscope.addListener(({ x }) => {
                if(pause) return;
                if(Math.abs(accelerometerOutput.x) >= 2 ||
                   Math.abs(accelerometerOutput.y) >= 2 ||
                   Math.abs(accelerometerOutput.z) >= 2) {
                    setAccelerometerOutput({ x: 0, y: 0, z: 0 });
                    setGyroscopeOn(false);
                    return;
                }

                if(x >= 5.5) {
                    if(leftTurnFail) return;
                    setPause(true);
                    setLastCommand("SKRENI DESNO");
                    timeoutRef.current = setTimeout(() => {
                        setLastCommand("");
                        setPause(false);
                    }, duration * 1000);
                } else if(x >= 3.5) {
                    setRightTurnFail(true);
                    setTimeout(() => {
                        setRightTurnFail(false);
                    }, 1000);
                }

                if(x <= -5.5) {
                    if(rightTurnFail) return;
                    setPause(true);
                    setLastCommand("SKRENI LIJEVO");
                    timeoutRef.current = setTimeout(() => {
                        setLastCommand("");
                        setPause(false);
                    }, duration * 1000);
                } else if(x <= -3.5) {
                    setLeftTurnFail(true);
                    setTimeout(() => {
                        setLeftTurnFail(false);
                    }, 1000);
                }
            });
        } else gyroscopeIncome?.remove();

        return () => gyroscopeIncome?.remove();
    }, [accelerometerOutput]);

    useEffect(() => {
        let accelerometerIncome;
        if(gyroscopeOn) {
            accelerometerIncome = Accelerometer.addListener(
                ({ x, y, z }) => setAccelerometerOutput({ x: x, y: y, z: z }));
        } else accelerometerIncome?.remove();

        return () => accelerometerIncome?.remove();
    }, [gyroscopeOn, pause]);

    const renderSettings = () => (
        <View style={ styles.settings }>
            <View style={ styles.row }>
                <TouchableOpacity style={ styles.backButton } onPress={ () => navigation.navigate("Games") }>
                    <Text style={ styles.backButtonText }>Izlaz</Text>
                </TouchableOpacity>
                <TouchableOpacity style={ styles.toggleButton }
                                  onPress={ () => setHandSide(prev => !prev) }>
                    <Text style={ styles.backButtonText }>{ handSide ? "Dešnjak" : "Lijevak" }</Text>
                </TouchableOpacity>
            </View>
            <View style={ styles.row }>
                <Text style={ styles.label }>Trajanje naredbe:</Text>
                <TouchableOpacity style={ styles.adjustValuesButton }
                                  onPress={ () => setDuration(prev => Math.max(1, prev - 1)) }>
                    <View style={ styles.adjustValuesButton }>
                        <Text style={ styles.adjustValuesText }>-</Text>
                    </View>
                </TouchableOpacity>
                <Text style={ styles.currentValueText }>{ duration }</Text>
                <TouchableOpacity style={ styles.adjustValuesButton }
                                  onPress={ () => setDuration(prev => prev + 1) }>
                    <View style={ styles.adjustValuesButton }>
                        <Text style={ styles.adjustValuesText }>+</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={ styles.row }>
                <Text style={ styles.label }>Duljina kretanja:</Text>
                <TouchableOpacity style={ styles.adjustValuesButton }
                                  onPress={ () => setMoveLength(prev => Math.max(0, prev - 1)) }>
                    <View style={ styles.adjustValuesButton }>
                        <Text style={ styles.adjustValuesText }>-</Text>
                    </View>
                </TouchableOpacity>
                <Text style={ styles.currentValueText }>{ moveLength }</Text>
                <TouchableOpacity style={ styles.adjustValuesButton }
                                  onPress={ () => setMoveLength(prev => prev + 1) }>
                    <View style={ styles.adjustValuesButton }>
                        <Text style={ styles.adjustValuesText }>+</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={ styles.row }>
                <Text style={ styles.label }>Žiroskop:</Text>
                <Switch
                    trackColor={{ false: "#D7D7D7", true: "#33D3D6" }}
                    thumbColor={ gyroscopeOn ? "#00B6BA" : "#FFF" }
                    onValueChange={ () => setGyroscopeOn(prev => !prev) }
                    value={ gyroscopeOn }
                    style={{ alignSelf: "center" }}
                />
            </View>
            <Text style={{ alignSelf: "center", fontSize: 30 }}>{`TRENUTNA NAREDBA:\n${ lastCommand }` }</Text>
        </View>
    );

    const renderController = () => (
        <View style={ styles.controller }>
            <TouchableOpacity onPress={ () => executeCommand("NAPRIJED") }>
                <ControllerButton direction={ "forward" } buttonSize={ BUTTON_SIZE } play={ "#FED857" } bg={ "#33D3D6" } />
            </TouchableOpacity>
            <View style={ styles.controllerMidSection }>
                <TouchableOpacity onPress={ () => executeCommand("SKRENI LIJEVO") }>
                    <ControllerButton direction={ "turnLeft" } buttonSize={ BUTTON_SIZE } play={ "#33D3D6" } bg={ "#FED857" } />
                </TouchableOpacity>
                <TouchableOpacity onPress={ () => executeCommand("STOP") }>
                    <ControllerButton direction={ "stop" } buttonSize={ BUTTON_SIZE } play={ "#FE7569" } bg={ "#8AE6E8" } />
                </TouchableOpacity>
                <TouchableOpacity onPress={ () => executeCommand("SKRENI DESNO") }>
                    <ControllerButton direction={ "turnRight" } buttonSize={ BUTTON_SIZE } play={ "#33D3D6" } bg={ "#FED857" } />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={ () => executeCommand("NAZAD") }>
                <ControllerButton direction={ "backward" } buttonSize={ BUTTON_SIZE } play={ "#FED857" } bg={ "#33D3D6" } />
            </TouchableOpacity>
        </View>
    );


    return (
        <SafeAreaProvider edges={ ["top", "bottom", "left", "right"] }>
            <SafeAreaView style={ styles.container }>
                <View style={ styles.blackView }></View>
                {
                    handSide ?
                        <>
                            { renderSettings() }
                            { renderController() }
                        </> :
                        <>
                            { renderController() }
                            { renderSettings() }
                        </>
                }
                <View style={ styles.blackView }></View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Controller;