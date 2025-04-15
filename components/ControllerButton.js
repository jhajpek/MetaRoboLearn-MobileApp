import { StyleSheet, View } from "react-native";
import { Polygon, Svg } from "react-native-svg";

const getPolygonPoints = (direction, buttonSize) => {
    let left = buttonSize * 0.15;
    let center = buttonSize / 2;
    let right = buttonSize * 0.85;
    if(direction === "forward")
        return `${ center },${ left } ${ right },${ right } ${ left },${ right }`;
    else if(direction === "turnLeft")
        return `${ left },${ center } ${ right },${ left } ${ right },${ right }`;
    else if(direction === "backward")
        return `${ left },${ left } ${ right },${ left } ${ center },${ right }`;
    else
        return `${ left },${ left } ${ left },${ right } ${ right },${ center }`;
};

const ControllerButton = ({ direction, buttonSize, play, bg }) => {
    const styles = StyleSheet.create({
        button: {
            backgroundColor: bg,
            borderRadius: 10,
            height: buttonSize * 1.5,
            width: buttonSize * 1.5,
            alignItems: "center",
            justifyContent: "center",
        },
    });

    return (
        <View style={ styles.button }>
            <Svg height={ buttonSize } width={ buttonSize }>
                <Polygon points={ getPolygonPoints(direction, buttonSize) } fill={ play } />
            </Svg>
        </View>
    );
}

export default ControllerButton