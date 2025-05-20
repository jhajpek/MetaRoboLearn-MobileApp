import { StyleSheet, View } from "react-native";
import { Polygon, Svg, Text as SvgText } from "react-native-svg";

const getPolygonPoints = (direction, buttonSize) => {
    let left = buttonSize * 0.25;
    let center = buttonSize * 0.5;
    let right = buttonSize * 0.75;

    if(direction === "forward")
        return `${ center },${ left } ${ right },${ right } ${ left },${ right }`;
    else if(direction === "turn_left")
        return `${ left },${ center } ${ right },${ left } ${ right },${ right }`;
    else if(direction === "back")
        return `${ left },${ left } ${ right },${ left } ${ center },${ right }`;
    else if(direction === "turn_right")
        return `${ left },${ left } ${ left },${ right } ${ right },${ center }`;
    else {
        let points = [];
        for(let i = 0; i < 8; i++) {
            let alpha = i * Math.PI / 4 + Math.PI / 8;
            let x = center + center * Math.cos(alpha);
            let y = center + center * Math.sin(alpha);
            points.push(`${ x },${ y }`);
        }
        return points.join(" ");
    }
};

const ControllerButton = ({ direction, buttonSize, play, bg }) => {
    const styles = StyleSheet.create({
        button: {
            backgroundColor: bg,
            alignItems: "center",
            justifyContent: "center",
        },
    });

    return (
        <View style={[ styles.button, (direction !== "abort" && { borderRadius: buttonSize * 0.5 }) ]}>
            <Svg height={ buttonSize } width={ buttonSize }>
                { direction === "abort" ?
                    <>
                        <Polygon points={ getPolygonPoints("abort", buttonSize) } fill={ play } stroke="#FFF" strokeWidth={ 3 } />
                        <SvgText x={ buttonSize * 0.5 } y={ buttonSize * 0.5 }
                                 fontSize={ buttonSize * 0.3 }
                                 fontWeight="bold"
                                 fill="#FFF" textAnchor="middle"
                                 alignmentBaseline="middle">
                            STOP
                        </SvgText>
                    </> :
                    <Polygon points={ getPolygonPoints(direction, buttonSize) } fill={ play } />
                }
            </Svg>
        </View>
    );
}

export default ControllerButton;
