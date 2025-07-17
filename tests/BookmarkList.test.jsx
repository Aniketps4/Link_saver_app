
import { render, screen } from '@testing-library/react';
import BookmarkList from '../client/src/components/BookmarkList';

jest.mock('axios');

describe('BookmarkList', () => {
  test('renders bookmark list', () => {
    render(<BookmarkList />);
    expect(screen.getByText('My Bookmarks')).toBeInTheDocument();
  });
});