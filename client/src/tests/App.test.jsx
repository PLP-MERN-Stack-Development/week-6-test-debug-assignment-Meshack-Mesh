import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Bug Tracker title', () => {
  render(<App />);
  const title = screen.getByText(/Bug Tracker/i);
  expect(title).toBeInTheDocument();
});
