import { render, fireEvent } from "@testing-library/react-native";
import Controller from "../pages/Controller";


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

jest.mock("expo-constants", () => ({
    expoConfig: {
        extra: {
            BACKEND_URL: "http://localhost",
            BACKEND_PORT: "8008",
        },
    },
}));

describe("Controller page", () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        jest.spyOn(console, "warn").mockImplementation(() => {});
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    it("There are exactly 5 Controller buttons.", () => {
        const { getAllByTestId } = render(<Controller />);
        const buttons = getAllByTestId("controllerButton");
        expect(buttons).toHaveLength(5);
    });

    it("Changing controller depending on user's hand preference is working OK.", () => {
        const { getAllByText, getByText } = render(<Controller />);
        const rightButtons = getAllByText("Dešnjak");
        expect(rightButtons).toHaveLength(1);

        fireEvent.press(getByText("Dešnjak"));

        const leftButtons = getAllByText("Ljevak");
        expect(leftButtons).toHaveLength(1);

        fireEvent.press(getByText("Ljevak"));

        const newRightButtons = getAllByText("Dešnjak");
        expect(newRightButtons).toHaveLength(1);
    });
});
