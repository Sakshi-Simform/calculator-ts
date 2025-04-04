// Constants for localStorage keys
const HISTORY_KEY = 'calculationHistory';

interface HistoryItem {
    operation: string;
    result: string;
}

// save-history
export const saveHistory = (historyEntry: string): void => {
    let history: HistoryItem[] = [];
    try {
        history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch (error) {
        console.error("Error parsing history from localStorage", error);
    }

    // Extract operation and result
    const [operation, result] = historyEntry.split('=');
    
    // Save both operation and result
    const historyItem: HistoryItem = { operation: operation.trim(), result: result.trim() };
    history.push(historyItem);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

// clear-history
export const clearHistory = (): void => {
    localStorage.removeItem(HISTORY_KEY);
    const historyList = document.getElementById('historyList') as HTMLElement;
    const historyContainer = document.getElementById('historyContainer') as HTMLElement;

    if (historyList) {
        historyList.innerHTML = '';
    }

    if (historyContainer) {
        // Show "No history available" message after clearing history
        const noHistoryMessage = document.createElement('p');
        noHistoryMessage.textContent = 'No history available';
        historyList.appendChild(noHistoryMessage);
    }
};

// display-history
export const displayHistory = (): void => {
    let history: HistoryItem[] = [];
    try {
        history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch (error) {
        console.error("Error parsing history from localStorage", error);
    }

    const historyList = document.getElementById('historyList') as HTMLElement;
    const historyContainer = document.getElementById('historyContainer') as HTMLElement;
    const toggleHistoryButton = document.getElementById('toggleHistoryButton') as HTMLElement;

    if (!historyList || !historyContainer) {
        console.error("History list or container element not found.");
        return;
    }

    // Display history content
    renderHistoryList(history, historyList);
    toggleHistoryDisplay(historyContainer, toggleHistoryButton);
};

// Render history list
const renderHistoryList = (history: HistoryItem[], historyList: HTMLElement): void => {
    historyList.innerHTML = ''; // Clear previous history list

    if (history.length === 0) {
        const noHistoryMessage = document.createElement('p');
        noHistoryMessage.textContent = 'No history available';
        historyList.appendChild(noHistoryMessage);
    } else {
        // Create list of history items
        const ul = document.createElement('ul');
        ul.classList.add('history-list');

        history.forEach((item) => {
            const li = document.createElement('li');
            const div = document.createElement('div');
            div.classList.add('history-item');
            div.textContent = `${item.operation} = ${item.result}`; // Show both operation and result
            div.addEventListener('click', () => {
                const screen = document.getElementById('screen') as HTMLElement;
                screen.textContent = item.operation;  // Only display the operation
            });
            li.appendChild(div);
            ul.appendChild(li);
        });

        historyList.appendChild(ul);
    }

    // Add Clear History button
    addClearHistoryButton(historyList);
};

// Toggle history display
const toggleHistoryDisplay = (historyContainer: HTMLElement, toggleHistoryButton: HTMLElement): void => {
    if (historyContainer.style.display === 'block') {
        historyContainer.style.display = 'none';
        toggleHistoryButton.innerHTML = '<span><i class="fa fa-history"></i></span>';
    } else {
        historyContainer.style.display = 'block';
        toggleHistoryButton.innerHTML = '<span><i class="fa fa-reply"></i></span>';
    }
};

// Add Clear History button
const addClearHistoryButton = (historyList: HTMLElement): void => {
    const clearHistoryBtn = document.createElement('button');
    clearHistoryBtn.classList.add('clear-history-btn');
    clearHistoryBtn.innerHTML = 'Clear History';
    clearHistoryBtn.addEventListener('click', clearHistory);
    historyList.appendChild(clearHistoryBtn);
};

// toggle-history-btn
export const setupHistoryToggle = (): void => {
    const toggleHistoryButton = document.getElementById('toggleHistoryButton') as HTMLElement;
    const historyContainer = document.getElementById('historyContainer') as HTMLElement;

    if (toggleHistoryButton) {
        toggleHistoryButton.addEventListener('click', displayHistory);
    }
};