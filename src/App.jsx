import Die from "./Die";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
    const [dice, setDice] = useState(() => generateAllNewDice());
    const [rollCount, setRollCount] = useState(0); // Roll counter
    const [timeElapsed, setTimeElapsed] = useState(0); // Timer
    const [isRunning, setIsRunning] = useState(false); // Timer state
    const buttonRef = useRef(null);

    const gameWon = dice.every((die) => die.isHeld) && dice.every((die) => die.value === dice[0].value);

    // Start/stop timer when game is won
    useEffect(() => {
        if (gameWon) {
            setIsRunning(false); // Stop the timer
            buttonRef.current.focus();
        }
    }, [gameWon]);

    // Timer logic
    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTimeElapsed((prevTime) => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(interval); // Cleanup interval
    }, [isRunning]);

    // Generate new dice
    function generateAllNewDice() {
        return new Array(10).fill(0).map(() => ({
            value:Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid(),
        }));
    }

    // Roll dice
    function rollDice() {
        if (!gameWon) {
            setDice((oldDice) =>
                oldDice.map((die) =>
                    die.isHeld
                        ? die
                        : {
                              ...die,
                              value: Math.ceil(Math.random() * 6),
                          }
                )
            );
            setRollCount((prevCount) => prevCount + 1); // Increment roll counter

            // Start the timer on the first roll
            if (!isRunning) {
                setIsRunning(true);
            }
        } else {
            // Reset game
            setDice(generateAllNewDice());
            setRollCount(0);
            setTimeElapsed(0);
            setIsRunning(false); // Reset timer state
        }
    }

    // Hold dice
    function Hold(id) {
        // Start the timer on the first hold
        if (!isRunning) {
            setIsRunning(true);
        }

        setDice((oldDice) =>
            oldDice.map((die) => (die.id === id ? { ...die, isHeld: !die.isHeld } : die))
        );
    }

    const diceEles = dice.map((dieObj) => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={() => Hold(dieObj.id)}
        />
    ));

    return (
        <main>
            {
                gameWon && 
                <Confetti
                    recycle={false}
                    numberOfPieces={1000}
                />
            }
            <div aria-live="polite" className="sr-only">
                {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
            </div>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">
                Roll until all dice are the same. Click each die to freeze it at its current value
                between rolls.
            </p>
            <div className="stats">
                <p>🎲 Rolls: {rollCount}</p>
                <p>⏱️ Timer: {timeElapsed} seconds</p>
            </div>
            <div className="dice-container">{diceEles}</div>
            <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
                {gameWon ? "New Game" : "Roll"}
            </button>
        </main>
    );
}