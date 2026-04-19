import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../page';
import { SessionProvider } from '@/contexts/SessionContext';
import { SettingsProvider } from '@/contexts/SettingsContext';

// Mock the sound manager
jest.mock('@/lib/sound-manager', () => ({
  soundManager: {
    play: jest.fn(),
  },
  SOUND_IDS: {
    BELL_SOFT: 'bell-soft',
  },
}));

describe('Home Page Integration', () => {
  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <SettingsProvider>
        <SessionProvider>
          {component}
        </SessionProvider>
      </SettingsProvider>
    );
  };

  it('renders the main page with header', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText('ClassMate.info')).toBeInTheDocument();
    expect(screen.getByText('AI-powered learning companion for curious minds')).toBeInTheDocument();
  });

  it('displays level selector initially', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText('Choose Your Learning Level')).toBeInTheDocument();
  });

  it('displays session history sidebar', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByRole('complementary', { name: 'Session history' })).toBeInTheDocument();
    expect(screen.getByText('📚 Your Learning Journey')).toBeInTheDocument();
  });

  it('shows empty state in session history when no topics', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText('Your recent topics will appear here')).toBeInTheDocument();
  });

  describe('Page Transition Animations', () => {
    it('applies page-transition class to level selector section', () => {
      renderWithProviders(<Home />);
      
      const levelSection = screen.getByText('Choose Your Learning Level').closest('section');
      expect(levelSection).toHaveClass('page-transition');
    });

    it('applies page-transition class to topic input section after level selection', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Home />);
      
      // Select a level
      const levelButton = screen.getByRole('button', { name: /Select level 1 for ages 9/i });
      await user.click(levelButton);
      
      // Check that topic input section has page-transition class
      const topicSection = screen.getByText('What would you like to learn about?').closest('section');
      expect(topicSection).toHaveClass('page-transition');
    });
  });

  describe('Start New Topic Button', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear();
      
      // Mock fetch for API calls
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            explanation: 'Test explanation',
            followUpQuestions: [
              { id: 'q1', question: 'Question 1?', isAnswered: false },
              { id: 'q2', question: 'Question 2?', isAnswered: false }
            ]
          })
        })
      ) as jest.Mock;
    });

    afterEach(() => {
      jest.restoreAllMocks();
      localStorage.clear();
    });

    it('displays "Start New Topic" button when explanation is shown', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Home />);
      
      // Select a level
      const levelButton = screen.getByRole('button', { name: /Select level 1 for ages 9/i });
      await user.click(levelButton);
      
      // Enter and submit a topic
      const textarea = screen.getByPlaceholderText(/What would you like to learn about today/i);
      await user.type(textarea, 'Why is the sky blue?');
      
      const submitButton = screen.getByRole('button', { name: /Submit topic/i });
      await user.click(submitButton);
      
      // Wait for explanation to appear
      await screen.findByText('Test explanation');
      
      // Check that "Start New Topic" button is present
      const startNewTopicButton = screen.getByRole('button', { name: /Start a new topic/i });
      expect(startNewTopicButton).toBeInTheDocument();
      expect(startNewTopicButton).toHaveTextContent('Start New Topic');
    });

    it('clears explanation view and returns to topic input when clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Home />);
      
      // Select a level
      const levelButton = screen.getByRole('button', { name: /Select level 1 for ages 9/i });
      await user.click(levelButton);
      
      // Enter and submit a topic
      const textarea = screen.getByPlaceholderText(/What would you like to learn about today/i);
      await user.type(textarea, 'Why is the sky blue?');
      
      const submitButton = screen.getByRole('button', { name: /Submit topic/i });
      await user.click(submitButton);
      
      // Wait for explanation to appear
      await screen.findByText('Test explanation');
      
      // Click "Start New Topic" button
      const startNewTopicButton = screen.getByRole('button', { name: /Start a new topic/i });
      await user.click(startNewTopicButton);
      
      // Verify we're back at topic input
      expect(screen.getByText('What would you like to learn about?')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/What would you like to learn about today/i)).toBeInTheDocument();
      
      // Verify explanation is no longer visible
      expect(screen.queryByText('Test explanation')).not.toBeInTheDocument();
    });

    it('maintains session history when starting a new topic', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Home />);
      
      // Select a level
      const levelButton = screen.getByRole('button', { name: /Select level 1 for ages 9/i });
      await user.click(levelButton);
      
      // Enter and submit a topic
      const textarea = screen.getByPlaceholderText(/What would you like to learn about today/i);
      await user.type(textarea, 'Why is the sky blue?');
      
      const submitButton = screen.getByRole('button', { name: /Submit topic/i });
      await user.click(submitButton);
      
      // Wait for explanation to appear
      await screen.findByText('Test explanation');
      
      // Verify topic appears in history
      const historySection = screen.getByRole('complementary', { name: 'Session history' });
      expect(historySection).toHaveTextContent('Why is the sky blue?');
      
      // Click "Start New Topic" button
      const startNewTopicButton = screen.getByRole('button', { name: /Start a new topic/i });
      await user.click(startNewTopicButton);
      
      // Verify history is still present
      expect(historySection).toHaveTextContent('Why is the sky blue?');
      expect(screen.queryByText('Your recent topics will appear here')).not.toBeInTheDocument();
    });
  });
});
