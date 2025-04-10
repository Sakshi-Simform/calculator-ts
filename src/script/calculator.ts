import { saveHistory } from "./history";
import { handleMC, handleMR, handleMS, handleMplusAndMinus } from "./memory";
import { ExtendedMath } from "./utils"

export class Calculator {
    screen: HTMLElement;
    calculationDone: boolean = false;
    isDegreeMode: boolean = true;
    isPrimary: boolean = false;
    FEMode: boolean = false;
    FEButton: HTMLElement;
    sinBtn: HTMLElement;
    cosBtn: HTMLElement;
    tanBtn: HTMLElement;
    isSecondaryBtn: boolean = false;
    private math: ExtendedMath;


    constructor(screenId: string) {
        this.screen = document.getElementById(screenId) as HTMLElement;
        if (!this.screen) {
            throw new Error(`Screen element with id "${screenId}" not found.`);
        }
        this.screen.textContent = localStorage.getItem("calculationOutput") || "0";
        this.updateDegButton();
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.math = Math as ExtendedMath;


        // Constants for buttons
        const FEButton = document.getElementById("fe-btn") as HTMLButtonElement;

        if (!FEButton) {
            console.error("F-E Button not found!");
        }

        this.FEButton = FEButton;
        this.sinBtn = document.querySelector(".sin-btn") as HTMLButtonElement;
        this.cosBtn = document.querySelector(".cos-btn") as HTMLButtonElement;
        this.tanBtn = document.querySelector(".tan-btn") as HTMLButtonElement;
    }

    public handleKeyPress(this: Calculator, event: KeyboardEvent): void {
        const key: string = event.key;
        if (!key) return;
    
        switch (true) {
            case !isNaN(Number(key)):
                this.appendValue(key);
                break;
            case key === "+":
                this.add();
                break;
            case key === "-":
                this.subtract();
                break;
            case key === "*":
                this.multiply();
                break;
            case key === "/":
                this.divide();
                break;
            case key === "Enter":
                this.result();
                break;
            case key === "Backspace":
                this.backspace();
                break;
            case key === "Escape" || key.toLowerCase() === "c":
                this.clearDisplay();
                break;
            default:
                // Optionally handle unexpected keys here
                break;
        }
    }
    

    appendValue(value: string): void {
        const currentText = this.screen.textContent || "";
        const operators = ["+", "-", "×", "÷", ".", "!", "%"];
        const lastChar = currentText.slice(-1);

        if (this.calculationDone) {
            this.screen.textContent = "";
            this.calculationDone = false;
        }

        if (operators.includes(lastChar) && operators.includes(value)) {
            return;
        }

        if (this.screen.textContent === "0" && !operators.includes(value)) {
            this.screen.textContent = value;

        } else {
            this.screen.textContent += value;
            console.log(value);
        }
        this.screen.scrollTo(this.screen.offsetWidth, 0);
    }

    initializeMemoryFunctions(): void {
        // Constants for memory function buttons
        const memoryclear = document.querySelector(".mc-btn") as HTMLButtonElement;
        const memorysrecall = document.querySelector(".mr-btn") as HTMLButtonElement;
        const memorystore = document.querySelector(".ms-btn") as HTMLButtonElement;
        const memoryplusBtn = document.querySelector(".mplus-btn") as HTMLButtonElement;
        const memoryminusBtn = document.querySelector(".mminus-btn") as HTMLButtonElement;

        memoryclear.addEventListener("click", () => handleMC());
        memorysrecall.addEventListener("click", () => handleMR(this.screen));
        memorystore.addEventListener("click", () =>
            handleMS(this.screen, (input) => input.textContent)
        );
        memoryplusBtn.addEventListener("click", (event) =>
            handleMplusAndMinus(
                event.target as HTMLButtonElement,
                this.screen,
                (input) => input.textContent,
                'add'
            )
        );
        memoryminusBtn.addEventListener("click", (event) =>
            handleMplusAndMinus(
                event.target as HTMLButtonElement,
                this.screen,
                (input) => input.textContent,
                'subtract'
            )
        );
    }

    add(): void {
        this.appendValue("+");
    }

    subtract(): void {
        this.appendValue("-");
    }

    multiply(): void {
        this.appendValue("×");
    }

    divide(): void {
        this.appendValue("÷");
    }

    addOpenParenthesis(): void {
        this.appendValue("(");
    }

    addCloseParenthesis(): void {
        this.appendValue(")");
    }

    backspace(): void {
        const currentValue = this.screen.textContent || "";
        this.screen.textContent = currentValue.slice(0, -1) || "0";
    }

    clearDisplay(): void {
        this.screen.textContent = "0";
    }

    tenPowerX(): void {
        this.appendValue("10^");
    }

    xpowery(): void {
        if (!this.screen.textContent?.includes("^")) {
            this.appendValue("^");
        }
    }

    square(): void {
        if (!this.screen.textContent?.includes("^")) {
            this.appendValue("^2");
        }
    }

    sqrt(): void {
        this.appendValue("sqrt(");
    }

    log(): void {
        this.screen.textContent = "log(";
    }

    ln(): void {
        this.screen.textContent = "ln(";
    }

    absoluteValue(): void {
        this.appendValue("abs(");
    }

    factorial(n: number): number {
        if (n === 0 || n === 1) return 1;
        return n * this.factorial(n - 1);
    }

    result(): void {
        let expression = this.screen.textContent || "";
        expression = expression
            .replace("×", "*")
            .replace("÷", "/")
            .replace("%", "%")
            .replace(/π/g, "Math.PI")
            .replace("10^", "10**")
            .replace("^", "**")
            .replace("log", "Math.log10")
            .replace("ln", "Math.log")
            .replace("abs", "Math.abs")
            .replace(/\be\b/g, "Math.E")
            .replace("sqrt", "Math.sqrt")
            .replace(/\bfloor\(/g, "Math.floor(")
            .replace(/(\d+)!/g, "this.factorial($1)")
            .replace(/\bceil\(/g, "Math.ceil(");

        if (!this.isDegreeMode) {
            expression = expression
                .replace("sin", "Math.sin")
                .replace("cos", "Math.cos")
                .replace("tan", "Math.tan")
                .replace("asin", "Math.asin")
                .replace("acos", "Math.acos")
                .replace("atan", "Math.atan");
        } else {
            this.math.sindeg = (x: number) => Math.sin((Math.PI / 180) * x);
            this.math.cosdeg = (x: number) => Math.cos((Math.PI / 180) * x);
            this.math.tandeg = (x: number) => Math.tan((Math.PI / 180) * x);
            expression = expression.replace(/\bsin\(/g, "Math.sindeg(");
            expression = expression.replace(/\bcos\(/g, "Math.cosdeg(");
            expression = expression.replace(/\btan\(/g, "Math.tandeg(");

            this.math.asindeg = (x: number) => (180 / Math.PI) * Math.asin(x);
            this.math.acosdeg = (x: number) => (180 / Math.PI) * Math.acos(x);
            this.math.atandeg = (x: number) => (180 / Math.PI) * Math.atan(x);
            expression = expression.replace(/\basin\(/g, "Math.asindeg(");
            expression = expression.replace(/\bacos\(/g, "Math.acosdeg(");
            expression = expression.replace(/\batan\(/g, "Math.atandeg(");
        }

        try {
            const evaluatedResult = eval(expression);
            this.screen.textContent = evaluatedResult.toString();
            this.calculationDone = true;
            saveHistory(`${expression} = ${evaluatedResult}`);
        } catch (error) {
            alert("Error");
            console.error(error)
        }
    }

    appendPi(): void {
        const piSymbol = "π";
        if (this.screen.textContent === "0") {
            this.appendValue(piSymbol);
        } else {
            this.appendValue(`${piSymbol}`);
        }
    }

    eulersFormula(): void{
        const esymbol = "e";
        if (this.screen.textContent === "0") {
            this.appendValue(esymbol);
        } else {
            this.appendValue(`${esymbol}`);
        }
    }

    reciprocal(): void {
        const currentInput = this.screen.textContent || "";
        if (currentInput === "0") {
            this.screen.textContent = "1/";
            return;
        }
        this.screen.textContent = currentInput.concat("1/");
    }

    setupDropdown(btnId: string, menuId: string): void {
        const dropdownBtn = document.getElementById(btnId) as HTMLButtonElement;
        const dropdownMenu = document.getElementById(menuId) as HTMLElement;

        if (!dropdownBtn || !dropdownMenu) {
            console.error("Dropdown button or menu not found!");
            return;
        }

        dropdownBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            dropdownMenu.style.display =
                dropdownMenu.style.display === "block" ? "none" : "block"; // Toggle visibility
        });

        // Hide dropdown
        document.addEventListener("click", () => {
            dropdownMenu.style.display = "none";
        });

        // Prevent closing the dropdown when clicking inside the menu
        dropdownMenu.addEventListener("click", (event) => {
            event.stopPropagation();
        });
    }

    Femode(): void {
        const isFeMode = this.FEMode;
        this.FEButton = document.getElementById("fe-btn") as HTMLButtonElement;
        this.FEMode = !isFeMode;
        this.FEButton.ariaLabel = this.FEMode
            ? "Scientific Notation Mode"
            : "Default Notation Mode";
        if (this.FEButton) {
            this.FEButton.textContent = this.FEMode ? "ex" : "f-e";
        }
        this.FEButton.textContent = this.FEMode ? "E" : "F-E";
        this.updateDisplay();
    }

    updateDisplay(): void {
        const currentValue = parseFloat(this.screen.textContent || "0");
        if (isNaN(currentValue)) {
            return;
        }

        if (this.FEMode) {
            this.screen.textContent = this.convertToEngineeringNotation(currentValue);
        } else {
            this.screen.textContent = this.convertToScientificNotation(currentValue);
        }
    }

    convertToEngineeringNotation(value: number): string {
        const exponent = Math.floor(Math.log10(Math.abs(value)) / 3) * 3;
        const exponentValue = value / Math.pow(10, exponent);
        return exponentValue.toFixed(3) + " × 10^" + exponent;
    }

    convertToScientificNotation(value: number): string {
        const exponent = Math.floor(Math.log10(Math.abs(value)));
        const exponentValue = value / Math.pow(10, exponent);
        return exponentValue.toFixed(3) + " × 10^" + exponent;
    }

    toggleSign(): void {
        const currentValue = parseFloat(this.screen.textContent || "0");
        if (isNaN(currentValue)) {
            this.screen.textContent = "Error";
        } else {
            this.screen.textContent = (currentValue * -1).toString();
        }
    }

    toggleSecondary(button: HTMLElement) {
        this.isSecondaryBtn = !this.isSecondaryBtn;

        // Toggle the button text
        button.textContent = this.isSecondaryBtn ? "Primary" : "2nd";

        // Define primary and secondary functions
        const trigFunctions = [
            { btn: this.sinBtn, primary: "sin(", secondary: "asin(" },
            { btn: this.cosBtn, primary: "cos(", secondary: "acos(" },
            { btn: this.tanBtn, primary: "tan(", secondary: "atan(" },
        ];

        // Update button text and event listeners
        trigFunctions.forEach(({ btn, primary, secondary }) => {
            if (btn) {
                const functionText = this.isSecondaryBtn ? secondary : primary;

                // Update button text
                btn.textContent = functionText.replace("(", ""); // Display without parentheses

                // Remove all previous event listeners
                const newBtn = btn.cloneNode(true) as HTMLElement;
                btn.parentNode?.replaceChild(newBtn, btn);

                // Set the new button reference
                if (btn.classList.contains("sin-btn")) this.sinBtn = newBtn;
                if (btn.classList.contains("cos-btn")) this.cosBtn = newBtn;
                if (btn.classList.contains("tan-btn")) this.tanBtn = newBtn;

                // Add new event listener
                newBtn.addEventListener("click", () => {
                    this.appendValue(functionText);
                });
            }
        });
    }

    trigonometry(func: string) {
        const inputText = this.screen.textContent?.trim() || "";
        // Extract numeric value
        const inputMatch = inputText.match(/-?\d+(\.\d+)?/);
        const inputValue = inputMatch ? parseFloat(inputMatch[0]) : NaN; // Extract number safely

        if (isNaN(inputValue)) {
            this.screen.textContent = "Error";
            return;
        }

        let result: number;

        switch (func) {
            case "asin":
                if (inputValue < -1 || inputValue > 1) {
                    this.screen.textContent = "Error"; // asin is only defined for -1 ≤ x ≤ 1
                    return;
                }
                result = Math.asin(inputValue);
                break;
            case "acos":
                if (inputValue < -1 || inputValue > 1) {
                    this.screen.textContent = "Error"; // acos is only defined for -1 ≤ x ≤ 1
                    return;
                }
                result = Math.acos(inputValue);
                break;
            case "atan":
                result = Math.atan(inputValue);
                break;
            case "sin":
                result = Math.sin(
                    this.isDegreeMode ? inputValue * (Math.PI / 180) : inputValue
                );
                break;
            case "cos":
                result = Math.cos(
                    this.isDegreeMode ? inputValue * (Math.PI / 180) : inputValue
                );
                break;
            case "tan":
                result = Math.tan(
                    this.isDegreeMode ? inputValue * (Math.PI / 180) : inputValue
                );
                break;
            default:
                this.screen.textContent = "Error";
                return;
        }

        // Convert radians to degrees if DEG mode is active
        if (this.isDegreeMode && ["asin", "acos", "atan"].includes(func)) {
            result = result * (180 / Math.PI);
        }

        // Display the result with up to 6 decimal places
        this.screen.textContent = result.toFixed(6);
        saveHistory(
            `${func}(${inputValue}${this.isDegreeMode ? "°" : " rad"}) = ${result.toFixed(6)}`
        );
    }

    setDegMode() {
        this.isDegreeMode = !this.isDegreeMode;
        this.updateDegButton();
    }

    updateDegButton() {
        const degButton = document.getElementById("deg-btn");
        if (degButton) {
            degButton.innerText = this.isDegreeMode ? "DEG" : "RAD";
        }
    }

    floor() {
        this.screen.textContent = "floor(";
    }

    ceil() {
        this.screen.textContent = "ceil(";
    }
}