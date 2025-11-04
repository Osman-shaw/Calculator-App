// We wrap the entire code in an Immediately Invoked Function Expression (IIFE).
// This creates a private scope for our variables and functions, preventing them
// from polluting the global namespace. It's a common pattern for creating modules.
(() => {

  // ==========================================================================
  // 1. HELPER LOGIC (Mathematical Operations)
  // ==========================================================================
  
  // This object maps operator names to their respective calculation functions and symbols.
  // This is a clean, declarative way to manage operations, avoiding long switch/if statements.
  const Calculations = {
    plus:     { symbol: '+', func: (a, b) => a + b },
    minus:    { symbol: '−', func: (a, b) => a - b },
    multiply: { symbol: '×', func: (a, b) => a * b },
    divide:   { symbol: '÷', func: (a, b) => a / b },
  };

  // ==========================================================================
  // 2. STATE MANAGEMENT
  // ==========================================================================

  // A single object to hold the entire "state" of the calculator.
  // Instead of using 'this' properties, all dynamic data is stored here.
  // This makes the calculator's status clear and easy to manage.
  const state = {
    currentValue: '0',     // The value currently shown in the main display.
    previousValue: null,     // The first operand in a binary operation (e.g., the '5' in 5 + 3).
    operator: null,        // The active operator (e.g., 'plus').
    history: '',           // The string shown in the secondary display.
    isNewEntry: true,      // Flag to check if the next number should start a new entry or append.
  };

  // ==========================================================================
  // 3. UI ELEMENT REFERENCES
  // ==========================================================================
  
  // A single object to hold references to all the DOM elements we need to interact with.
  // This keeps all DOM queries in one place for easy management.
  const ui = {
    result: document.querySelector('.calculator__result-primary'),
    subRes: document.querySelector('.calculator__result-secondary'),
    numbers: document.querySelectorAll('[data-number]'),
    options: document.querySelectorAll('[data-option]'),
    operators: document.querySelectorAll('[data-operator]'),
  };

  // ==========================================================================
  // 4. CORE LOGIC & ACTIONS
  // ==========================================================================

  /**
   * Updates the primary and secondary displays based on the current state.
   * This is the only function that should directly write to the DOM.
   */
  const updateDisplay = () => {
    // Update the main result display with the current value.
    ui.result.value = state.currentValue;
    // Update the secondary display (history) with the calculation history.
    ui.subRes.value = state.history;
    // Make the history visible only if it contains something.
    ui.subRes.style.visibility = state.history ? 'visible' : 'hidden';
  };

  /**
   * Resets the calculator to its initial default state.
   */
  const clearAll = () => {
    state.currentValue = '0';
    state.previousValue = null;
    state.operator = null;
    state.history = '';
    state.isNewEntry = true;
    updateDisplay(); // Refresh the display after clearing.
  };

  /**
   * Handles appending a digit to the current value.
   * @param {string} number - The digit ('0'-'9') that was clicked.
   */
  const appendNumber = (number) => {
    // If we just finished a calculation (=), start fresh.
    if (state.isNewEntry) {
      state.currentValue = number;
      state.isNewEntry = false;
    } else {
      // Prevent starting a number with multiple zeros.
      if (state.currentValue === '0') {
        state.currentValue = number;
      } else {
        // Append the new digit to the existing number string.
        state.currentValue += number;
      }
    }
    updateDisplay();
  };

  /**
   * Handles adding a decimal point to the current value.
   */
  const appendDot = () => {
    // If the current value doesn't already include a '.', add one.
    if (!state.currentValue.includes('.')) {
      state.currentValue += '.';
      state.isNewEntry = false; // You can append numbers after a dot.
      updateDisplay();
    }
  };

  /**
   * Handles the backspace/undo functionality.
   */
  const undoLast = () => {
    // If the current value is more than one digit long, remove the last digit.
    if (state.currentValue.length > 1) {
      state.currentValue = state.currentValue.slice(0, -1);
    } else {
      // If it's only one digit, just reset it to '0'.
      state.currentValue = '0';
    }
    updateDisplay();
  };
  
  /**
   * Executes the pending binary calculation (e.g., 5 + 3).
   */
  const performCalculation = () => {
    // Only proceed if we have a previous value, a current value, and an operator.
    if (state.previousValue !== null && state.operator !== null) {
      // Convert string values to floating-point numbers for calculation.
      const prev = parseFloat(state.previousValue);
      const curr = parseFloat(state.currentValue);
      
      // Look up the correct math function from our Calculations object.
      const calculationFunc = Calculations[state.operator].func;
      
      // Perform the calculation and convert the result back to a string.
      // Use toPrecision to handle floating point inaccuracies.
      const result = parseFloat(calculationFunc(prev, curr).toPrecision(14));
      state.currentValue = String(result);

      // Reset previous value and operator after calculation.
      state.previousValue = null;
      state.operator = null;
    }
  };

  /**
   * Handles actions from operator buttons (+, -, *, /, =, etc.).
   * @param {string} nextOperator - The operator name from the clicked button's data attribute.
   */
  const handleOperator = (nextOperator) => {
    // Convert the current display value to a number.
    const currentValueAsNumber = parseFloat(state.currentValue);

    // If the operator is 'equal', perform the final calculation.
    if (nextOperator === 'equal') {
      // Update history before the final calculation.
      state.history += ` ${state.currentValue} =`;
      performCalculation();
    } else {
      // If there's already an operator pending, calculate the intermediate result first.
      if (state.operator) {
        performCalculation();
      }
      // Set the new state for the next part of the calculation.
      state.previousValue = state.currentValue;
      state.operator = nextOperator;
      // Update the history display.
      const symbol = Calculations[nextOperator].symbol;
      state.history = `${state.currentValue} ${symbol}`;
    }
    
    // Set the flag to true so the next number input starts a new entry.
    state.isNewEntry = true;
    updateDisplay();
  };

  /**
   * Handles actions from the non-numeric "option" buttons (C, CE, ., etc.).
   * @param {string} option - The option name from the button's data attribute.
   */
  const handleOption = (option) => {
    // A simple switch to call the correct function based on the option clicked.
    switch (option) {
      case 'clear':
        clearAll();
        break;
      case 'clearEntry':
        state.currentValue = '0'; // Only clear the current entry, not the whole state.
        state.isNewEntry = true;
        updateDisplay();
        break;
      case 'undo':
        undoLast();
        break;
      case 'dot':
        appendDot();
        break;
      case 'reverse':
        state.currentValue = String(parseFloat(state.currentValue) * -1);
        updateDisplay();
        break;
    }
  };

  /**
   * Handles actions from unary operator buttons (sqrt, sqr, etc.).
   * These operations are performed instantly on the current value.
   * @param {string} operator - The unary operator name.
   */
  const handleUnaryOperator = (operator) => {
    const value = parseFloat(state.currentValue);
    let result = 0;
    
    // A switch to handle the different unary operations.
    switch (operator) {
      case 'pow':
        state.history = `sqr(${value})`;
        result = Math.pow(value, 2);
        break;
      case 'sqrt':
        state.history = `√(${value})`;
        result = Math.sqrt(value);
        break;
      case 'fraction':
        state.history = `1/(${value})`;
        result = 1 / value;
        break;
      case 'percent':
        // Percent calculation depends on the previous value if it exists.
        const base = state.previousValue ? parseFloat(state.previousValue) : 1;
        result = (base * value) / 100;
        break;
    }
    // Update the current value with the result and refresh the display.
    state.currentValue = String(parseFloat(result.toPrecision(14)));
    state.isNewEntry = true;
    updateDisplay();
  };

  // ==========================================================================
  // 5. EVENT LISTENERS & INITIALIZATION
  // ==========================================================================

  /**
   * Sets up all the event listeners for the calculator buttons.
   */
  const bindEvents = () => {
    // Add a click listener to each number button.
    ui.numbers.forEach(button => {
      button.addEventListener('click', (e) => appendNumber(e.target.textContent));
    });

    // Add a click listener to each option button.
    ui.options.forEach(button => {
      button.addEventListener('click', (e) => handleOption(e.target.dataset.option));
    });
    
    // Add a click listener to each operator button.
    ui.operators.forEach(button => {
      button.addEventListener('click', (e) => {
        const operator = e.target.dataset.operator;
        // Differentiate between binary operators (+, -, =) and unary operators (sqrt, pow).
        if (Calculations[operator] || operator === 'equal') {
          handleOperator(operator);
        } else {
          handleUnaryOperator(operator);
        }
      });
    });
  };

  /**
   * The main function to initialize the calculator.
   */
  const init = () => {
    console.log('Calculator Initialized! 🚀');
    bindEvents(); // Set up all the button clicks.
    clearAll();   // Set the calculator to its default state.
  };
  
  // Start the calculator application.
  init();

})();