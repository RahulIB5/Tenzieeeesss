export default function Die(props) {
    // Map dice values to Unicode dice faces
    const diceFaces = {
        1: "⚀",
        2: "⚁",
        3: "⚂",
        4: "⚃",
        5: "⚄",
        6: "⚅",
    };

    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white",
        fontSize: "3rem", // Increase font size for better visibility
    };

    return (
        <button
            className="dice-logo"
            style={styles}
            onClick={props.hold}
            aria-pressed={props.isHeld}
            aria-label={`Die with value ${props.value}, ${props.isHeld ? "held" : "not held"}`}
        >
            {diceFaces[props.value]} {/* Display Unicode dice face */}
        </button>
    );
}