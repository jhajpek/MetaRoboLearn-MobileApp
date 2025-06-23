import {
    View, Text,
    StyleSheet,
    Dimensions,
    Switch, Animated,
    TouchableOpacity,
    PanResponder,
    Alert, Image, TextInput
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect, useRef } from "react";
import { DeviceMotion, Accelerometer } from "expo-sensors";
import { io } from "socket.io-client";
import Constants from "expo-constants";
import axios from "axios";
import ControllerButton from "../components/ControllerButton";


const { height: HEIGHT, width: WIDTH } = Dimensions.get("screen");
const BUTTON_SIZE = 75;
const CAMERA_WIDTH = 320;
const CAMERA_HEIGHT = 240;
const TURN_THRESHOLD = 0.2;
const TURN_INTERVAL = 0.2;


const Controller = () => {
    const [gyroscopeOn, setGyroscopeOn] = useState(false);
    const [lastCommand, setLastCommand] = useState("");
    const [accelerometerOutput, setAccelerometerOutput] = useState({ x: 0, y: 0, z: 0 });
    const [duration, setDuration] = useState(1.);
    const [speed, setSpeed] = useState(30.);
    const [handSide, setHandSide] = useState(true);
    const [angle, setAngle] = useState(0);
    const [fromButton, setFromButton] = useState(false);
    const [cameraOn, setCameraOn] = useState(false);
    const [image, setImage] = useState("");
    const [url, setUrl] = useState(Constants.expoConfig.extra.BACKEND_URL);
    const [port, setPort] = useState(Constants.expoConfig.extra.BACKEND_PORT);
    const [inputPopupOn, setInputPopupOn] = useState(false);
    const [inputValue1, setInputValue1] = useState(Constants.expoConfig.extra.BACKEND_URL);
    const [inputValue2, setInputValue2] = useState(Constants.expoConfig.extra.BACKEND_PORT);
    const timeoutRef = useRef(null);
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const panResponderRef = useRef(new Animated.ValueXY({ x: 0, y: HEIGHT - CAMERA_HEIGHT})).current;
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,

            onPanResponderGrant: () => {
                panResponderRef.setOffset({
                    x: panResponderRef.x._value,
                    y: panResponderRef.y._value,
                });
                panResponderRef.setValue({ x: 0, y: 0 });
            },

            onPanResponderMove: (gestureEvent, gestureState) => {
                const newX = panResponderRef.x._offset + gestureState.dx;
                const newY = panResponderRef.y._offset + gestureState.dy;

                const clampedX = Math.max(0, Math.min(newX, WIDTH - CAMERA_WIDTH - 2 * insets.left));
                const clampedY = Math.max(0, Math.min(newY, HEIGHT - CAMERA_HEIGHT));

                panResponderRef.x.setValue(clampedX - panResponderRef.x._offset);
                panResponderRef.y.setValue(clampedY - panResponderRef.y._offset);
            },

            onPanResponderRelease: () => {
                panResponderRef.flattenOffset();
            }
        })
    ).current;
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 50,
            backgroundColor: "#FE7569",
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 10,
        },
        cameraButton: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 50,
            backgroundColor: "#FED857",
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 10,
        },
        toggleButton: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 50,
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
        cameraContainer: {
            position: "absolute",
            left: insets.left,
            top: insets.top,
            width: CAMERA_WIDTH,
            height: CAMERA_HEIGHT,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#000",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#FFF",
            transform: panResponderRef.getTranslateTransform(),
        },
        camera: {
            width: CAMERA_WIDTH,
            height: CAMERA_HEIGHT,
            borderRadius: 10,
        },
        inputContainer: {
            position: "absolute",
            top: 0,
            left: insets.left,
            width: WIDTH - 2 * insets.left,
            height: HEIGHT,
            zIndex: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#CCC",
        },
        input: {
            height: 40,
            width: "60%",
            borderColor: "#CCC",
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            marginBottom: 10,
            backgroundColor: "#FFF",
        },
        inputValidation: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "15%",
        },
        confirmButton: {
            backgroundColor: "#87FD5F",
            padding: 10,
            borderRadius: 5,
            width: "15%",
        },
        cancelButton: {
            backgroundColor: "#FE7569",
            padding: 10,
            borderRadius: 5,
            width: "15%",
        },
        textColour: {
            color: "#FFF",
            textAlign: "center",
            fontWeight: "bold",
        },
        image: {
            width: 44,
            height: 35,
        },
    });

    useEffect(() => {
        if(!cameraOn) return;

        const socket = io(`${ url }:${ port }`);

        socket.on("camera_frame", (data) => {
            if(data?.image) {
                setImage(data.image);
                //setImage(`data:image/jpeg;base64,${data.image}`);
            }
        });

        return () => {
            socket.disconnect();
        }
    }, [cameraOn, image]);

    const execute = async (command, duration, gyro) => {
        await axios.post(`${ url }:${ port }/execute`, {
            "code": `${ command }(${ duration }, ${ speed })`
        }, { timeout: 1000 }).then(() => {
            if(!gyro) setFromButton(true);
            setLastCommand(command);
            timeoutRef.current = setTimeout(() => {
                if(!gyro) {
                    setLastCommand("");
                    setFromButton(false);
                }
            }, duration * 1000);
        }).catch(() => fetchFail());
    };

    const abort = async () => {
        await axios.post(`${ url }:${ port }/abort`, {}, { timeout: 1000 })
            .then(() => {
                setLastCommand("");
                setFromButton(false);
                clearTimeout(timeoutRef.current);
            }).catch(() => fetchFail());
    };

    useEffect(() => {
        DeviceMotion.setUpdateInterval(TURN_INTERVAL * 1000);
        let motionIncome;
        if(gyroscopeOn) {
            motionIncome = DeviceMotion.addListener(async ({ rotation }) => {
                if(Math.abs(accelerometerOutput.x) >= 2 ||
                    Math.abs(accelerometerOutput.y) >= 2 ||
                    Math.abs(accelerometerOutput.z) >= 2) {
                    setAccelerometerOutput({ x: 0, y: 0, z: 0 });
                    setGyroscopeOn(false);
                    setLastCommand("");
                    return;
                }

                if(!rotation) return;

                setAngle(rotation.beta ?? 0);

                if(angle > TURN_THRESHOLD && lastCommand === "") await execute("turn_right", TURN_INTERVAL, true);
                else if(angle < -TURN_THRESHOLD && lastCommand === "") await execute("turn_left", TURN_INTERVAL, true);
                else if(angle >= -TURN_THRESHOLD && angle <= TURN_THRESHOLD && lastCommand !== "" && !fromButton) await abort();
                else if(lastCommand.startsWith("turn") && !fromButton) await execute(lastCommand, TURN_INTERVAL, true);
            });
        } else motionIncome?.remove();

        return () => motionIncome?.remove();
    }, [accelerometerOutput]);

    useEffect(() => {
        Accelerometer.setUpdateInterval(TURN_INTERVAL * 1000);
        let accelerometerIncome;
        if(gyroscopeOn) {
            accelerometerIncome = Accelerometer.addListener(
                ({ x, y, z }) => setAccelerometerOutput({ x: x, y: y, z: z }));
        } else accelerometerIncome?.remove();

        return () => accelerometerIncome?.remove();
    }, [gyroscopeOn, lastCommand]);

    const cameraClick = () => {
        if(!cameraOn) Alert.alert("UPALJENA KAMERA", "Prozor u kojem se prikazuje prijenos s kamere možete podesiti njegovim povlačenjem na drugi kraj ekrana.", [ { text: "Zatvori" } ])
        setCameraOn(prev => !prev);
    };

    const fetchFail = () => {
        Alert.alert("UPOZORENJE", "Niste spojeni na istu mrežu kao i robot ili robot nije upaljen.", [ { text: "Zatvori" } ]);
    };

    const handleConfirm = () => {
        setUrl(inputValue1);
        setPort(inputValue2);
        setInputPopupOn(false);
    };

    const handleCancel = () => {
        setInputValue1(url);
        setInputValue2(port);
        setInputPopupOn(false);
    };

    const renderSettings = () => (
        <View style={ styles.settings }>
            <View style={ styles.row }>
                <TouchableOpacity style={ styles.backButton } onPress={ () => navigation.navigate("Games") }>
                    <Image source={ require("../assets/exit.png") } style={ styles.image } />
                </TouchableOpacity>
                <TouchableOpacity style={ styles.cameraButton } onPress={ () => cameraClick() }>
                    <Image source={ require("../assets/camera.png") } style={ styles.image } />
                </TouchableOpacity>
                <TouchableOpacity style={ styles.toggleButton } onPress={ () => setHandSide(prev => !prev) }>
                    <Text style={ styles.backButtonText }>{ handSide ? "Dešnjak" : "Ljevak" }</Text>
                </TouchableOpacity>
                <TouchableOpacity style={ styles.toggleButton } onPress={ () => setInputPopupOn(prev => !prev) }>
                    <Text style={ styles.backButtonText }>SERVER</Text>
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
                                  onPress={ () => setSpeed(prev => Math.max(30, prev - 10)) }>
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
                    onValueChange={ () => {
                        setGyroscopeOn(prev => !prev);
                        if(lastCommand !== "") abort().then(() => {});
                    }}
                    value={ gyroscopeOn }
                    style={{ alignSelf: "center" }}
                />
            </View>
        </View>
    );

    const renderController = () => (
        <View style={ styles.controller }>
            <TouchableOpacity onPress={ () => { if(lastCommand === "") execute("forward", duration, false).then(() => {}); } }>
                <ControllerButton direction={ "forward" } buttonSize={ BUTTON_SIZE } play={ "#FED857" } bg={ "#33D3D6" } />
            </TouchableOpacity>
            <View style={ styles.controllerMidSection }>
                <TouchableOpacity onPress={ () => { if(lastCommand === "") execute("turn_left", duration, false).then(() => {}); } }>
                    <ControllerButton direction={ "turn_left" } buttonSize={ BUTTON_SIZE } play={ "#33D3D6" } bg={ "#FED857" } />
                </TouchableOpacity>
                <TouchableOpacity onPress={ () => { if(lastCommand !== "") abort().then(() => {}); } }>
                    <ControllerButton direction={ "abort" } buttonSize={ BUTTON_SIZE } play={ "#FE7569" } bg={ "#8AE6E8" } />
                </TouchableOpacity>
                <TouchableOpacity onPress={ () => { if(lastCommand === "") execute("turn_right", duration, false).then(() => {}); } }>
                    <ControllerButton direction={ "turn_right" } buttonSize={ BUTTON_SIZE } play={ "#33D3D6" } bg={ "#FED857" } />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={ () => { if(lastCommand === "") execute("back", duration, false).then(() => {}); } }>
                <ControllerButton direction={ "back" } buttonSize={ BUTTON_SIZE } play={ "#FED857" } bg={ "#33D3D6" } />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={ styles.container }>
            <View style={ styles.blackView }></View>
            { cameraOn && <Animated.View style={ styles.cameraContainer } { ...panResponder.panHandlers }>
                { image !== "" ?
                    <Image
                        key={image}
                        source={{ uri: image }}
                        style={ styles.camera }
                        resizeMode="cover"
                    /> :
                    <Text>Učitavanje kamere...</Text>
                }
            </Animated.View>
            }
            { inputPopupOn &&
                <View style={ styles.inputContainer }>
                    <TextInput style={ styles.input } value={ inputValue1 } onChangeText={ setInputValue1 } />
                    <TextInput style={ styles.input } value={ inputValue2 } onChangeText={ setInputValue2 } />
                    <View style={ styles.inputValidation }>
                        <TouchableOpacity style={ styles.confirmButton } onPress={ handleConfirm }>
                            <Text style={ styles.textColour }>Izmijeni</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={ styles.cancelButton } onPress={ handleCancel }>
                            <Text style={ styles.textColour }>Odustani</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            { handSide ?
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
