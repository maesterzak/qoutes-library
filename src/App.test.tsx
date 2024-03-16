import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

jest.setTimeout(10000);
// Mocking fetch function
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ results: [], totalPages: 100 })
}) as jest.Mock<Promise<Response>>;


describe('App Component', () => {
  test('renders loading text initially', async () => {
    const { getByText } = render(<App />);
    expect(getByText('Loading...')).toBeInTheDocument();
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  
});
