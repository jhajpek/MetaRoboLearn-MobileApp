import { render, fireEvent } from "@testing-library/react-native";
import Game from "../components/Game";
import Games from "../pages/Games";


jest.mock("react-native-safe-area-context", () => ({
    SafeAreaProvider: ({ children }) => children,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}));

describe("Game component and Games page", () => {
    const sampleProps = {
        name: "Made up name for a game",
        description: "Blank.",
    };

    beforeEach(() => {
        mockNavigate.mockClear();
        jest.spyOn(console, "warn").mockImplementation(() => {});
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    it("Rendering of Game component is successful.", () => {
        const { getByText } = render(<Game { ...sampleProps } />);
        expect(getByText(sampleProps.name)).toBeTruthy();
        expect(getByText(sampleProps.description)).toBeTruthy();
        expect(getByText("Zaigraj!")).toBeTruthy();
    });

    it("Press on 'Zaigraj!' button navigates to Controller page.", () => {
        const { getByText } = render(<Game { ...sampleProps } />);
        fireEvent.press(getByText("Zaigraj!"));
        expect(mockNavigate).toHaveBeenCalled();
    });

    it("There are exactly 2 games in the menu.", () => {
        const { getAllByText } = render(<Games />);
        const playButtons = getAllByText("Zaigraj!");
        expect(playButtons).toHaveLength(2);
    });
});
