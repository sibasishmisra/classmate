'use client';

interface ExampleQuestion {
  emoji: string;
  question: string;
  category: string;
}

const EXAMPLE_QUESTIONS: ExampleQuestion[] = [
  {
    emoji: '🌌',
    question: 'Why is the sky blue?',
    category: 'Science'
  },
  {
    emoji: '🦕',
    question: 'How did dinosaurs become extinct?',
    category: 'History'
  },
  {
    emoji: '🧠',
    question: 'Why do we dream?',
    category: 'Biology'
  },
  {
    emoji: '⚡',
    question: 'How does electricity work?',
    category: 'Physics'
  },
  {
    emoji: '🌍',
    question: 'Why do we have seasons?',
    category: 'Science'
  },
  {
    emoji: '🎵',
    question: 'How does music make us feel emotions?',
    category: 'Psychology'
  },
  {
    emoji: '🚀',
    question: 'How do rockets work in space?',
    category: 'Space'
  },
  {
    emoji: '🌈',
    question: 'How are rainbows formed?',
    category: 'Science'
  },
  {
    emoji: '🧬',
    question: 'What is DNA?',
    category: 'Biology'
  },
  {
    emoji: '🌊',
    question: 'Why is the ocean salty?',
    category: 'Nature'
  },
  {
    emoji: '🎨',
    question: 'Why do colors look different in light and dark?',
    category: 'Physics'
  },
  {
    emoji: '🦋',
    question: 'How do butterflies transform from caterpillars?',
    category: 'Biology'
  },
];

interface ExampleQuestionsFooterProps {
  onQuestionClick?: (question: string) => void;
}

export default function ExampleQuestionsFooter({ onQuestionClick }: ExampleQuestionsFooterProps) {
  const handleQuestionClick = (question: string) => {
    if (onQuestionClick) {
      onQuestionClick(question);
    }
  };

  return (
    <footer className="bg-paper-cream border-t-2 border-ruled-line py-8 sm:py-12 px-4 mt-12">
      <div className="max-w-7xl mx-auto">
        {/* Example Questions Section */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-ink-black text-center mb-2 font-ui">
            Try asking about...
          </h2>
          <p className="text-sm sm:text-base text-chalk-gray text-center mb-6 font-body">
            Click any question to get it explained in simple terms!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {EXAMPLE_QUESTIONS.map((item, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(item.question)}
                className="group bg-white border-2 border-ruled-line rounded-lg p-4 text-left hover:border-accent-blue hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                type="button"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-black group-hover:text-accent-blue transition-colors font-ui">
                      {item.question}
                    </p>
                    <span className="text-xs text-chalk-gray font-body mt-1 inline-block">
                      {item.category}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="border-t border-ruled-line pt-6 mt-8">
          <div className="text-center space-y-3">
            <p className="text-sm text-chalk-gray font-body">
              <strong className="text-ink-black font-ui">ClassMate.info</strong> - Making learning simple and fun for everyone
            </p>
            <p className="text-xs text-chalk-gray font-body">
              Powered by AI • Explained at 5th grade level • Free forever
            </p>
            <div className="flex justify-center gap-4 text-xs text-chalk-gray">
              <a href="/faq" className="hover:text-accent-blue transition-colors">
                FAQ
              </a>
              <span>•</span>
              <a href="https://github.com/sibasishmisra/classmate" target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors">
                GitHub
              </a>
              <span>•</span>
              <span>© 2026 ClassMate.info</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
