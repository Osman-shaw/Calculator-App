****Calculator App — Project Description / ****
**Overview**
This Calculator App is a small, browser-based calculator built as a learning/personal project. It provides basic and common arithmetic operations with a simple UI and modular JavaScript code. The app's main goal is to solve the everyday problem of quickly performing calculations in a focused, minimal interface without needing to open a heavier tool or application.
**Problem statement**
People often need a quick, reliable way to perform arithmetic (basic math, chained operations, decimal calculations) while working in the browser. The goal of this project was to:

Build a lightweight, fast, and responsive calculator UI.
Implement a clear separation between UI and calculation logic so the core functionality is reusable and testable.
Support typical user flows: single operations, sequences of operations (e.g., 5 + 3 * 2), correction(backspace/clear), and decimal input.
**Goals and success criteria**
Functional: handle addition, subtraction, multiplication, division, decimals, clear and delete operations, and support operator chaining.
Usability: a clean layout and keyboard/mouse support for inputs.
Code quality: modular JS with Calculations.js / Calculator.js separated from DOM code in main.js, so logic can be unit-tested.
Performance: instant UI feedback and no blocking operations.Extensibility: easy to add new features (percent, memory, parentheses) later.
**Success criteria:**

All basic operations work and chaining yields correct results.
Input edge cases (multiple decimal points, divide-by-zero) are handled gracefully.
The project can be run locally by opening index.html or via a simple static server.
Features
Basic arithmetic: +, -, ×, ÷
Decimal numbers
Clear/All Clear and backspace/delete
Chained operations (pressing operators sequentially)
Modular code: separation of calculation logic and DOM interaction

**Architecture / Design**
Presentation layer (UI): handled in index.html + style.css and any related UI scripts in main.js.
Business logic (calculator): implemented in Calculator.js and/or Calculations.js. These files contain the functions that perform parsing, compute operations, and maintain calculator state.
Entry/Glue: main.js wires UI events (button clicks, keypress) to the calculator logic and updates the display.

**Mini contract for the calculator logic (what the modules expose/assume):**
Inputs: strings or numeric values from the UI (digits, '.', operator symbols, commands like '=' or 'C').
Outputs: current display string and computed numeric results.
Error modes: invalid input (ignored or sanitized), divide-by-zero (display 'Error' or 'Infinity' with graceful handling).

Edge cases considered:

Multiple decimal points in a single number (prevent second dot).
Leading zeros (e.g., entering 0005 -> treat as 5).
Divide-by-zero (show user-friendly error).
Large numbers and formatting (if needed, limit precision or use scientific notation).
Rapid repeated user input and operator presses (the UI should debounce or handle gracefully).
**File structure (from your workspace)**
index.html — app container / markup
assets — static images or icons (if present)
style.css — styling for the calculator
Calculations.js — (existing) likely contains pure math functions and helpers
Calculator.js — (existing) likely encapsulates stateful calculator class or logic
main.js — DOM event wiring, display updates, and initialization
sass — SCSS source files for styling (optional in build pipeline)
(If you'd like, I can open any of these files to confirm the exact exports/function names and wire the README's usage section to them.)

**Tests & Validation ideas**
Unit tests for calculation functions:
add(2,3) => 5, subtract(5,2) => 3, 
multiply(4,0.5) => 2, divide(5,2) => 2.5
Chained scenarios and precedence: 2 + 3 * 4 => 14 (if precedence supported)
Edge cases: divide-by-zero handling, decimal input sanitization.
UI tests (manual):
Keyboard input, rapid click sequences, delete/backspace behavior.
If you want automated tests, we can add a minimal test harness using Jest (Node) or simple test scripts that import Calculations.js/Calculator.js.





Edge cases considered:


