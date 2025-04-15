import { Animated, Dimensions, Easing, Image, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useRef } from "react";

const HEIGHT = Dimensions.get("screen").height;
const ANIMATION_DURATION = 0.5;


const JumpingRobot = () => {
    const translateY = useRef(new Animated.Value(0)).current;
    const jump = () => {
        Animated.sequence([
            Animated.timing(translateY, {
                toValue: -20,
                duration: ANIMATION_DURATION * 1000,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: ANIMATION_DURATION * 1000,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <TouchableWithoutFeedback onPress={ jump }>
            <Animated.View style={{ transform: [{ translateY: translateY }]}}>
                <Image source={ require("../assets/robot.png") } style={ styles.image } />
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    image: {
        width: HEIGHT * 0.6,
        height: HEIGHT * 0.6,
    },
});

export default JumpingRobot;