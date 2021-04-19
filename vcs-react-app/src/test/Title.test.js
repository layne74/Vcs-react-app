import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import App from '../App'

// Returns true if the title has rendered
test('Checks if the title is rendered.', () => {
    render(<App />);
    screen.getAllByText(/VCS Search engine/);
});

// Returns true if the title has rendered
test('Checks credits has rendered.', () => {
    render(<App />);
    screen.getAllByText(/Created by/);
});
