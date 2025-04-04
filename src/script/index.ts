import { saveHistory, clearHistory, displayHistory, setupHistoryToggle } from './history.js';
import { handleMC, handleMR, handleMS, handleMplusAndMinus } from './memory.js';
import { Calculator } from './calculator.js';
import { handleKeyPress } from './keyboardevents.js';

// Assuming the 'screen' element is of type HTMLElement, we can define this type explicitly
const calculator = new Calculator('screen');

// Define the types for the target argument in buttonActions functions
type ButtonAction = (target: HTMLElement) => void;

const buttonActions: { [key: string]: ButtonAction } = {
    'num': (target: HTMLElement) => calculator.appendValue(target.textContent?.trim() || ''),
    'add-btn': () => calculator.add(),
    'subtract-btn': () => calculator.subtract(),
    'multiply-btn': () => calculator.multiply(),
    'divide-btn': () => calculator.divide(),
    'open-paren-btn': () => calculator.addOpenParenthesis(),
    'close-paren-btn': () => calculator.addCloseParenthesis(),
    'equals': () => calculator.result(),
    'backspace': () => calculator.backspace(),
    'clear-btn': () => calculator.clearDisplay(),
    'pi-btn': () => calculator.appendPi(),
    'clear-history-btn': () => clearHistory(),
    'modulus-btn': () => calculator.appendValue('%'),
    'exponent-btn': () => calculator.appendValue('^'),
    'factorial-btn': () => calculator.appendValue('!'),
    'power-btn': () => calculator.xpowery(),
    'ten-power-btn': () => calculator.tenPowerX(),
    'toggle-sign-btn': () => calculator.toggleSign(),
    'reciprocal-btn': () => calculator.reciprocal(),
    'log-btn': () => calculator.log(),
    'eulars-btn': () => calculator.eulersFormula(),
    'logn-btn': () => calculator.ln(),
    'abs-btn': () => calculator.absoluteValue(),
    'square-btn': () => calculator.square(),
    'sqrt-btn': () => calculator.sqrt(),
    'second-btn': (target: HTMLElement) => calculator.toggleSecond(target),
    'fe-btn': () => calculator.Femode(),
    'deg-btn': () => {
        if (typeof calculator !== 'undefined' && calculator.setDegMode) {
            calculator.setDegMode();
        }
    },
    // Math functions
    'sin-btn': () => calculator.appendValue('sin('),
    'cos-btn': () => calculator.appendValue('cos('),
    'tan-btn': () => calculator.appendValue('tan(')
};

const initializeButtons = (): void => {
    const calculatorContainer = document.querySelector('.calculator') as HTMLElement;

    // General event listener for all buttons
    calculatorContainer.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        // Handle button actions dynamically based on class or id
        Object.keys(buttonActions).forEach(actionKey => {
            if (target.classList.contains(actionKey) || target.id === actionKey) {
                buttonActions[actionKey](target);
            }
        });
    });
    // Keyboard input
    document.addEventListener('keydown', handleKeyPress.bind(calculator));

    // Floor and ceil
     document
       .querySelector(".floor-btn")
       ?.addEventListener("click", () => calculator.floor());
    document
       .querySelector(".ceil-btn")
       ?.addEventListener("click", () => calculator.ceil());
};

// Initialize buttons
initializeButtons();

// Dropdown setup
calculator.setupDropdown("dropdownBtn", "dropdownMenu");
calculator.setupDropdown("dropdownBtn1", "dropdownMenu1");
setupHistoryToggle();
calculator.initializeMemoryFunctions();