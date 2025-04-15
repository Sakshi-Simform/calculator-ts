export function handleKeyPress(this: any, event: KeyboardEvent): void {
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
            break;
    }
}