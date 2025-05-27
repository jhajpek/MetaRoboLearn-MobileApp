import { View, Text, StyleSheet, Dimensions, Switch, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect, useRef } from "react";
import { Gyroscope, Accelerometer } from "expo-sensors";
import Constants from "expo-constants";
import axios from "axios";
import ControllerButton from "../components/ControllerButton";


const { height: HEIGHT, width: WIDTH } = Dimensions.get("screen");
const url = Constants.expoConfig.extra.BACKEND_URL;
const port = Constants.expoConfig.extra.BACKEND_PORT;
const BUTTON_SIZE = 75;
const GYROSCOPE_INTERVAL = 1.0;
const TURN_THRESHOLD = 0.75;
const STOP_THRESHOLD = 0.25;


const Controller = () => {
    const [gyroscopeOn, setGyroscopeOn] = useState(false);
    const [lastCommand, setLastCommand] = useState("");
    const [accelerometerOutput, setAccelerometerOutput] = useState({ x: 0, y: 0, z: 0 });
    const [duration, setDuration] = useState(1.);
    const [speed, setSpeed] = useState(0.);
    const timeoutRef = useRef(null);
    const [handSide, setHandSide] = useState(true);
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

    const execute = async (command, duration, gyro) => {
        if(!gyro && gyroscopeOn && command.startsWith("turn")) return;
        await axios.post(`${ url }:${ port }/execute`, {
            "code": `${ command }(${ duration }, ${ speed })`
        }).then((res) => {
            if(res.status === 200) {
                setLastCommand(command);
                timeoutRef.current = setTimeout(() => {
                    if(!gyro) setLastCommand("");
                }, duration * 1000);
            }
        }).catch(err => console.log(err));
    };

    const abort = async () => {
        await axios.post(`${ url }:${ port }/abort`, {})
            .then(() => {
                clearTimeout(timeoutRef.current);
                setLastCommand("");
            }).catch(err => console.log(err));
    };

    useEffect(() => {
        Gyroscope.setUpdateInterval(GYROSCOPE_INTERVAL * 1000);
        let gyroscopeIncome;
        if(gyroscopeOn) {
            gyroscopeIncome = Gyroscope.addListener(async ({x, y, z}) => {
                if(Math.abs(accelerometerOutput.x) >= 2 ||
                    Math.abs(accelerometerOutput.y) >= 2 ||
                    Math.abs(accelerometerOutput.z) >= 2) {
                    setAccelerometerOutput({x: 0, y: 0, z: 0});
                    setGyroscopeOn(false);
                    setLastCommand("");
                    return;
                }

                if(Math.abs(x) > 0.75 || Math.abs(y) > 0.75) return;

                if(z > TURN_THRESHOLD && lastCommand === "") await execute("turn_left", GYROSCOPE_INTERVAL, true);
                else if(z < -TURN_THRESHOLD && lastCommand === "") await execute("turn_right", GYROSCOPE_INTERVAL, true);
                else if(z > STOP_THRESHOLD && lastCommand === "turn_right" || z < -STOP_THRESHOLD && lastCommand === "turn_left") await abort();
                else if(lastCommand === "turn_left" || lastCommand === "turn_right") await execute(lastCommand, GYROSCOPE_INTERVAL, true);
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
    }, [gyroscopeOn, lastCommand]);

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
                <Text style={ styles.label }>Brzina kretanja:</Text>
                <TouchableOpacity style={ styles.adjustValuesButton }
                                  onPress={ () => setSpeed(prev => Math.max(0, prev - 10)) }>
                    <View style={ styles.adjustValuesButton }>
                        <Text style={ styles.adjustValuesText }>-</Text>
                    </View>
                </TouchableOpacity>
                <Text style={ styles.currentValueText }>{ speed }</Text>
                <TouchableOpacity style={ styles.adjustValuesButton }
                                  onPress={ () => setSpeed(prev => prev + 10) }>
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
            <Text style={{ alignSelf: "center", fontSize: 30 }}>{`CURRENT COMMAND:\n${ lastCommand }` }</Text>
        </View>
    );

    const renderController = () => (
        <View style={ styles.controller }>
            <TouchableOpacity onPress={ () => { if(lastCommand === "") execute("forward", duration).then(() => {}); } }>
                <ControllerButton direction={ "forward" } buttonSize={ BUTTON_SIZE } play={ "#FED857" } bg={ "#33D3D6" } />
            </TouchableOpacity>
            <View style={ styles.controllerMidSection }>
                <TouchableOpacity onPress={ () => { if(lastCommand === "") execute("turn_left", duration).then(() => {}); } }>
                    <ControllerButton direction={ "turn_left" } buttonSize={ BUTTON_SIZE } play={ "#33D3D6" } bg={ "#FED857" } />
                </TouchableOpacity>
                <TouchableOpacity onPress={ () => { if(lastCommand !== "") abort().then(() => {}); } }>
                    <ControllerButton direction={ "abort" } buttonSize={ BUTTON_SIZE } play={ "#FE7569" } bg={ "#8AE6E8" } />
                </TouchableOpacity>
                <TouchableOpacity onPress={ () => { if(lastCommand === "") execute("turn_right", duration).then(() => {}); } }>
                    <ControllerButton direction={ "turn_right" } buttonSize={ BUTTON_SIZE } play={ "#33D3D6" } bg={ "#FED857" } />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={ () => { if(lastCommand === "") execute("back", duration).then(() => {}); } }>
                <ControllerButton direction={ "back" } buttonSize={ BUTTON_SIZE } play={ "#FED857" } bg={ "#33D3D6" } />
            </TouchableOpacity>
        </View>
    );


    return (
        <View style={ styles.container }>
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
        </View>
    );
};

export default Controller;
