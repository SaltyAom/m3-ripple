// src/Ripple.bun.test.tsx

// --- CORE IMPORTS ---
import { test, expect } from 'bun:test';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import React from 'react'; 
import { Ripple } from '.'; // Adjust path if needed

// --- LOGGER IMPORT (Updated to ESM) ---
// Using the modern 'import' syntax for better compatibility and cleaner code.
import logger from 'ernest-logger'; 

// --- WRAPPER COMPONENT ---
// The Ripple component relies on its parent having 'position: relative' for correct rendering.
function TestWrapper() {
    return (
        <div data-testid="container" style={{ position: 'relative' }}>
            <Ripple />
        </div>
    );
}

// --- ESSENTIAL MOCK FOR VIRTUAL DOM ---
// Mocks the Web Animations API (element.animate) which is missing in Happy DOM (Bun's virtual environment).
// This prevents a critical 'TypeError: surface.animate is not a function.'
if (typeof Element.prototype.animate !== 'function') {
    // @ts-ignore: We are intentionally adding a mock function to the prototype
    Element.prototype.animate = function() {
        return {
            cancel: () => {},      // Required by the component's internal logic
            currentTime: 0,        // Required for press duration checks
            finished: Promise.resolve(),
        };
    };
}

// Global log to show testing has started
logger.start("Logging of tests started"); 

// --------------------------------------------------------------------------------------------------

// --- TEST 1: MOUNTING ---
test('1. Component mounts and contains the ripple surface', () => {
    logger.info("Test 1 started: Checking component mount.");
    
    // 1. Arrange & Act: Render the component and query the DOM
    render(<TestWrapper />);
    const container = screen.getByTestId('container');
    const surface = container.querySelector('.salty-ripple-surface');
    
    // 2. Assert: Check that the element exists in the DOM
    expect(surface).toBeInTheDocument();

    logger.success("Test 1 complete.");
});

// --------------------------------------------------------------------------------------------------

// --- TEST 2: HOVER STATE ---
test('2. Hover applies the --hover class', async () => { 
    logger.info("Test 2 started: Checking hover state.");

    render(<TestWrapper />);
    const container = screen.getByTestId('container');
    const surface = container.querySelector('.salty-ripple-surface');
    const rippleRoot = container.querySelector('.salty-ripple'); 
    
    // 1. ACT: Simulate pointer enter with required properties
    // We must explicitly set 'pointerType: mouse', 'isPrimary: true', and mock coordinates 
    // to satisfy the component's internal event validation and geometry calculations.
    fireEvent.pointerEnter(rippleRoot!, { 
        pointerType: 'mouse', 
        isPrimary: true,
        pageX: 100,
        pageY: 100,
    }); 

    // 2. ASSERT: Wait for the state to update (setHovered(true))
    await waitFor(() => {
        expect(surface).toHaveClass('--hover');
    });

    // 3. ACT: Simulate pointer leave
    fireEvent.pointerLeave(rippleRoot!, { 
        pointerType: 'mouse', 
        isPrimary: true 
    }); 

    // 4. ASSERT: Wait for the hover class to be removed
    await waitFor(() => {
        expect(surface).not.toHaveClass('--hover');
    });

    logger.success("Test 2 complete.");
});

// --------------------------------------------------------------------------------------------------

// --- TEST 3: PRESS STATE ---
test('3. Press applies and releases the --press class for mouse/pen', async () => {
    logger.info("Test 3 started: Checking press state.");
    
    render(<TestWrapper />);
    const container = screen.getByTestId('container');
    const surface = container.querySelector('.salty-ripple-surface');
    const rippleRoot = container.querySelector('.salty-ripple'); 

    // 1. ACT: Simulate pointer down (press)
    // The explicit button/buttons properties ensure it's treated as a primary mouse press,
    // which bypasses the component's slow 'touch-delay' logic.
    fireEvent.pointerDown(rippleRoot!, { 
        pointerType: 'mouse', 
        button: 0, 
        buttons: 1, 
        isPrimary: true,
        pageX: 100,
        pageY: 100,
    }); 

    // 2. ASSERT: Wait for the press class to be applied (setPressed(true))
    await waitFor(() => {
        expect(surface).toHaveClass('--press');
    });

    // 3. ACT: Simulate pointer up
    fireEvent.pointerUp(rippleRoot!, { pointerType: 'mouse' });

    // 4. ACT: Simulate the click event 
    // This is the event that triggers the endPressAnimation() and sets setPressed(false).
    fireEvent.click(rippleRoot!);

    // 5. ASSERT: Wait for the press class to be removed
    await waitFor(() => {
        expect(surface).not.toHaveClass('--press');
    });

    logger.success("Test 3 complete.");
});

// Final log after all tests have been run successfully by Bun
logger.success("All test assertions completed successfully! 🎉");