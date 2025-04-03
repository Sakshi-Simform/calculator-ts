// memory-clear-btn
export function handleMC(): void {
  localStorage.removeItem('calculationOutput');
}

// memory-recall-btn
export function handleMR(screen: HTMLElement): void {
  const memoryValue: string | null = localStorage.getItem('calculationOutput');
  if (memoryValue !== null) {
      screen.textContent = memoryValue;
  } else {
      screen.textContent = '0';
  }
}

// memory-store-btn
export function handleMS(screen: HTMLElement, getValueCallback: (screen: HTMLElement) => string | null): void {
  const valueToStore: string | null = getValueCallback(screen);
  if (valueToStore !== null && valueToStore !== undefined) {
      localStorage.setItem('calculationOutput', valueToStore);
      console.log(`Memory Stored: ${valueToStore}`);
  } else {
      console.error("Error storing memory: Invalid value.");
  }
}

// memory-add/minus-btn
export function handleMplusAndMinus(
  ref: HTMLElement, 
  screen: HTMLElement, 
  getValueCallback: (screen: HTMLElement) => string | null, 
  operation: 'add' | 'subtract'
): void {
  const memoryValue: number = parseFloat(localStorage.getItem('calculationOutput') || "0");
  const currentValue: number = parseFloat(getValueCallback(screen) || "0");

  let newMemoryValue: number;

  // Perform the add or subtract operation based on the passed operation
  if (operation === 'add') {
      newMemoryValue = memoryValue + currentValue;
  } else if (operation === 'subtract') {
      newMemoryValue = memoryValue - currentValue;
  } else {
      console.error("Invalid operation provided for memory modification");
      return;
  }

  // Store the updated memory value
  localStorage.setItem('calculationOutput', newMemoryValue.toString());
  console.log(`Memory updated: ${newMemoryValue}`);
}