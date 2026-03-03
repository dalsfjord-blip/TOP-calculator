//console.log("Hello World");


//Basic Math Functions
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => (b === 0 ? "Hell NO!" : a / b);

//Operate
function operate(operator, num1, num2) {
    // Convert strings to numbers just in case
    num1 = Number(num1);
    num2 = Number(num2);

    switch (operator) {
        case '+':
            return add(num1, num2);
        case '-':
            return subtract(num1, num2);
        case '×': // Make sure this matches the text on your button!
            return multiply(num1, num2);
        case '÷':
            return divide(num1, num2);
        default:
            return null;
    }
}

//Memory
let firstOperand = '';
let secondOperand = '';
let currentOperation = null;
let shouldResetScreen = false;

// Select elements
const display = document.getElementById('display');
const numberButtons = document.querySelectorAll('button:not(.operator):not(.special)');
// We'll handle operators and special buttons (AC, =) separately

//Update display
function appendNumber(number) {
    // If we just pressed an operator, clear the screen for the new number
    if (display.textContent === '0' || shouldResetScreen) {
        display.textContent = '';
        shouldResetScreen = false;
    }
    display.textContent += number;
}

//Event listener
numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
        appendNumber(button.textContent);
    });
});


// AC clear
const clearBtn = document.getElementById('clear');

clearBtn.addEventListener('click', () => {
    display.textContent = '0';
    firstOperand = '';
    secondOperand = '';
    currentOperation = null;
});

const operatorButtons = document.querySelectorAll('.operator');

function setOperation(operator) {
    // If we already have an operation pending, calculate it first! 
    // This allows for 5 + 5 + 5 to work without hitting '='
    if (currentOperation !== null) evaluate();

    firstOperand = display.textContent;
    currentOperation = operator;
    shouldResetScreen = true;
}

// Add the event listeners to your operator buttons
operatorButtons.forEach((button) => {
    button.addEventListener('click', () => {
        setOperation(button.textContent);
    });
});

function evaluate() {
    // We can't calculate if there's no operator or if the screen is waiting to reset
    if (currentOperation === null || shouldResetScreen) return;

    // Handle the "Divide by Zero" edge case
    if (currentOperation === '÷' && display.textContent === '0') {
        display.textContent = "Error: hell no!";
        return;
    }

    secondOperand = display.textContent;
    
    // Call our brain (operate function) and update the screen
    display.textContent = operate(currentOperation, firstOperand, secondOperand);
    
    // Reset the operation so we can start fresh
    currentOperation = null;
}

// Select the equals button and add the listener
const equalsBtn = document.getElementById('equal');
equalsBtn.addEventListener('click', evaluate);


const decimalBtn = document.getElementById('decimal');

function appendDecimal() {
    // 1. If we just finished a calculation or hit an operator,
    // start fresh with "0."
    if (shouldResetScreen) {
        display.textContent = '0.';
        shouldResetScreen = false;
        return;
    }

    // 2. The "Gatekeeper": If the display already has a dot, EXIT.
    if (display.textContent.includes('.')) return;

    // 3. If it's a fresh screen (just a 0), change it to "0."
    if (display.textContent === '0') {
        display.textContent = '0.';
    } else {
        // Otherwise, just tack the dot onto the end
        display.textContent += '.';
    }
}

decimalBtn.addEventListener('click', appendDecimal);

const backspaceBtn = document.getElementById('backspace');

function deleteNumber() {
    // If the screen only has one digit left, set it back to '0' 
    // instead of leaving it empty.
    if (display.textContent.length === 1) {
        display.textContent = '0';
    } else {
        // Remove the last character
        display.textContent = display.textContent.slice(0, -1);
    }
}

backspaceBtn.addEventListener('click', deleteNumber);

function deleteNumber() {
    // If we just hit '=', don't allow backspacing the result
    if (shouldResetScreen) return;

    if (display.textContent.length === 1) {
        display.textContent = '0';
    } else {
        display.textContent = display.textContent.slice(0, -1);
    }
}

window.addEventListener('keydown', (e) => {
    // 1. Numbers 0-9
    if (e.key >= 0 && e.key <= 9) appendNumber(e.key);

    // 2. Operators
    if (e.key === '+') setOperation('+');
    if (e.key === '-') setOperation('-');
    if (e.key === '*') setOperation('×'); // Match your button text
    if (e.key === '/') setOperation('÷');

    // 3. Specials
    if (e.key === '.') appendDecimal();
    if (e.key === '=' || e.key === 'Enter') evaluate();
    if (e.key === 'Backspace') deleteNumber();
    if (e.key === 'Escape') clearCalculator(); // Usually maps to AC
});