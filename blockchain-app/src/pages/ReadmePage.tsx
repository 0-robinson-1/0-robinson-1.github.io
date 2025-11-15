import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ReadmePage() {
  const [markdown, setMarkdown] = useState<string>('');

  useEffect(() => {
    // Fetch the raw Markdown from your repo (always up-to-date)
    fetch('https://raw.githubusercontent.com/0-robinson-1/0-robinson-1.github.io/main/docs/README-blockchain-app-v2.md')
      .then(response => response.text())
      .then(text => setMarkdown(text))
      .catch(error => console.error('Error fetching Markdown:', error));
  }, []);

  return (
    <div className="readme-container" style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      {markdown ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {markdown}
        </ReactMarkdown>
      ) : (
        <p>Loading README...</p>
      )}
    </div>
  );
}

export default ReadmePage;