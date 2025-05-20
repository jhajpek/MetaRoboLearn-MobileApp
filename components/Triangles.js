import { View, StyleSheet, Dimensions, Animated, Easing } from "react-native";
import { Svg, Polygon } from "react-native-svg";
import { useEffect, useRef } from "react";

const WIDTH = Dimensions.get("screen").width;
const SHADES = [
    ["#FFAFA9", "#FE7569", "#E74B3E"],
    ["#8AE6E8", "#33D3D6", "#00B6BA"],
    ["#FFE89E", "#FED857", "#E7BB29"],
    ["#FFAFA9", "#FE7569", "#E74B3E"],
    ["#8AE6E8", "#33D3D6", "#00B6BA"],
    ["#FFE89E", "#FED857", "#E7BB29"],
];
const ANIMATION_DURATION = 10;
const styles = StyleSheet.create({
    container: {
        position: "absolute",
        height: "100%",
        width: "100%",
        zIndex: -1
    },
});

const Animation = ({ children, startingRight }) => {
    const translateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(translateX, {
                    toValue: startingRight ? WIDTH * 0.75: -WIDTH * 0.75,
                    duration: ANIMATION_DURATION * 1000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(translateX, {
                    toValue: 0,
                    duration: ANIMATION_DURATION * 1000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [translateX]);

    return (
        <Animated.View style={{ transform: [{ translateX }] }}>
            { children }
        </Animated.View>
    );
};

const renderTiles = (colourArray, index, tileSize) => {
    let tiles = [];

    for(let j = 0; j <= 5 * WIDTH / tileSize; j++) {
        let x = j * tileSize;
        let colour1 = colourArray[j * 2 % 3];
        let colour2 = colourArray[(j * 2 % 3 + 1) % 3];

        tiles.push(
            <Polygon
                key={ `triangle-${index}-${j}-1` }
                points={ `${x},0 ${x},${tileSize} ${x + tileSize},${tileSize}` }
                fill={ colour1 }

            />
        );

        tiles.push(
            <Polygon
                key={ `triangle-${index}-${j}-2` }
                points={ `${x},0 ${x + tileSize},0 ${x + tileSize},${tileSize}` }
                fill={ colour2 }
            />
        );
    }

    return tiles;
};

const Triangles = ({ trianglesHeight }) => {

    return (
        <View style={ styles.container }>
            { SHADES.map((colours, index) => (
                <Animation key={ `row-${index}` } startingRight={ index % 2 }>
                    <Svg key={ index }
                         height={ trianglesHeight / SHADES.length + 1 }
                         width="300%"
                         style={{ alignSelf: "center", margin: 0, padding: 0 }}>
                        { renderTiles(colours, index, trianglesHeight / SHADES.length) }
                    </Svg>
                </Animation>)) }
        </View>
    );
};

export default Triangles;
