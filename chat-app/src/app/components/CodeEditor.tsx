// CodeEditor.tsx (or define it outside the Home component)

import { Box, TextField, useTheme } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (newCode: string) => void;
  rows: number;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, language, onChange, rows }) => {
  const theme = useTheme();

  return (
    <Box sx={{ position: 'relative' }}>
      
      {/* 1. Visible, Highlighted Code */}
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers={true}
        customStyle={{ 
          margin: 0, 
          padding: 0, 
          overflow: 'auto',
          minHeight: `${rows * 1.45 + 2}rem`, // Dynamic height based on rows
          backgroundColor: '#282c34', 
          color: '#fff',
        }}
        lineNumberStyle={{ 
          padding: '0 12px 0 10px',
          borderRight: '1px solid #3d424b',
          backgroundColor: '#20232a',
          userSelect: 'none',
        }}
        codeTagProps={{
          style: { 
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            lineHeight: '1.45', // Critical for alignment
            padding: '16px 0', 
            display: 'block',
            marginLeft: 'unset'
          }
        }}
      >
        {code}
      </SyntaxHighlighter>

      {/* 2. Invisible, Editable Textarea Overlay (Cursor Fixes applied here) */}
      <TextField
        fullWidth
        multiline
        rows={rows}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        variant="standard"
        spellCheck="false"
        InputProps={{
          style: { 
            whiteSpace: 'pre-wrap', 
            fontFamily: 'monospace', 
            fontSize: '0.875rem',
            lineHeight: '1.45', // CRITICAL FIX: Match the lineHeight of the highlighter
            color: 'transparent',
            caretColor: '#f8f8f2', 
          },
        }}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          '& .MuiInputBase-root': { 
            height: '100%',
            alignItems: 'flex-start',
            overflow: 'hidden'
          },
          '& textarea': {
            // CRITICAL FIX: Match padding and offset for line numbers
            padding: '16px 12px 16px 70px !important', 
            boxSizing: 'border-box',
            width: '100%',
            height: '100%',
            overflowY: 'auto !important',
          },
          '& .MuiInputBase-root:before, & .MuiInputBase-root:after': {
            borderBottom: 'none !important',
          },
        }}
      />
    </Box>
  );
};

export default CodeEditor;