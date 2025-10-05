'use client';

import { useState, FormEvent } from 'react';
import {
  Button,
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Grid,
  Paper,
  useTheme,
  ButtonProps,
  IconButton,
  Theme,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import CodeIcon from '@mui/icons-material/Code';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import LinkIcon from '@mui/icons-material/Link';

const KEYWORD_COLOR = '#FF79C6';
const STRING_COLOR = '#F1FA8C';
const COMMENT_COLOR = '#6272A4';
const NUMBER_COLOR = '#BD93F9';
const TEXT_COLOR = '#F8F8F2';

const codeRegex = new RegExp(
  `\\b(def|class|if|else|elif|while|for|return|import|from|in|is|not|and|or|pass|try|except|finally|with|as|break|continue|int|float|char|void|struct)\\b` + 
  `|(\\d+)` +
  `|(['"].*?['"])` +
  `|(#[^\\n]*|//[^\\n]*)`
, 'g');

const getSyntaxTokens = (code: string) => {
  const tokens = [];
  let lastIndex = 0;

  const matchIterator = code.matchAll(codeRegex);

  for (const m of matchIterator) {
      const value = m[0];
      const index = m.index!;

      if (index > lastIndex) {
          tokens.push({ type: 'text', value: code.substring(lastIndex, index), color: TEXT_COLOR });
      }

      let color = TEXT_COLOR;
      
      if (m[1]) {
          color = KEYWORD_COLOR;
      } else if (m[2]) {
          color = NUMBER_COLOR;
      } else if (m[3]) {
          color = STRING_COLOR;
      } else if (m[4]) {
          color = COMMENT_COLOR;
      }

      tokens.push({ type: 'token', value, color });
      lastIndex = index + value.length;
  }

  if (lastIndex < code.length) {
      tokens.push({ type: 'text', value: code.substring(lastIndex), color: TEXT_COLOR });
  }

  return tokens;
};

const GridItem = Grid as any;

interface SelectionButtonProps extends ButtonProps {
  selected: boolean;
}

const SelectionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<SelectionButtonProps>(({ theme, selected }) => ({
  flexGrow: 1,
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.shape.borderRadius,
  fontWeight: 'bold',
  transition: 'all 0.2s',
  ...(selected && {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    boxShadow: theme.shadows[5],
    '&:hover': {
      backgroundColor: theme.palette.grey[900],
    },
  }),
  ...(!selected && {
    backgroundColor: theme.palette.grey[200],
    color: theme.palette.grey[800],
    '&:hover': {
      backgroundColor: theme.palette.grey[300],
    },
  }),
}));

interface MarkdownToolbarProps { theme: Theme; }

const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ theme }) => (
    <Box sx={{ 
        display: 'flex', 
        p: 1, 
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
        bgcolor: theme.palette.grey[50] 
    }}>
        <IconButton size="small" title="Bold">
            <FormatBoldIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" title="Italic">
            <FormatItalicIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" title="Code Block">
            <CodeIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" title="Unordered List">
            <FormatListBulletedIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" title="Link">
            <LinkIcon fontSize="small" />
        </IconButton>
    </Box>
);

interface CodeEditorProps {
  code: string;
  language: string; 
  onChange: (newCode: string) => void;
  rows: number;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, rows }) => {
  const theme = useTheme();
  
  const lineCount = code.split('\n').length;
  const minHeight = Math.max(rows, lineCount) * 1.45 + 2; 

  const tokens = getSyntaxTokens(code);

  const verticalPadding = '16px'; 
  const codeLineHeight = '1.45'; 
  const textareaPaddingTopOffset = '15px'; 


  return (
    <Box sx={{ position: 'relative' }}>
      
      <Box
        sx={{
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          minHeight: `${minHeight}rem`,
          backgroundColor: '#282c34',
          display: 'flex',
          fontSize: '0.875rem',
          lineHeight: codeLineHeight,
          fontFamily: 'monospace',
          pointerEvents: 'none',
          verticalAlign: 'top',
        }}
      >
        <Box
          sx={{
            padding: `${verticalPadding} 0`,
            paddingLeft: '10px',
            paddingRight: '12px',
            borderRight: '1px solid #3d424b',
            backgroundColor: '#20232a',
            userSelect: 'none',
            color: '#657080',
            width: '70px',
            flexShrink: 0,
            textAlign: 'right',
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
            verticalAlign: 'top',
          }}
        >
          {Array(lineCount > rows ? lineCount : rows).fill(0).map((_, i) => (
            <div key={i} style={{ paddingBottom: i < lineCount - 1 ? '0' : '0' }}>{i + 1}</div>
          ))}
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            padding: `${verticalPadding} 12px ${verticalPadding} 0`,
            overflowY: 'auto', 
            color: TEXT_COLOR,
            whiteSpace: 'pre-wrap', 
            overflowX: 'auto',
            verticalAlign: 'top',
          }}
        >
          {tokens.map((token, index) => (
            <span key={index} style={{ color: token.color }}>
                {token.value}
            </span>
          ))}
        </Box>
      </Box>

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
            lineHeight: codeLineHeight,
            color: 'transparent',
            caretColor: '#f8f8f2',
          },
        }}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          zIndex: 1, 
          '& .MuiInputBase-root': { 
            height: '100%',
            alignItems: 'flex-start',
            overflow: 'hidden'
          },
          '& textarea': {
            padding: `${textareaPaddingTopOffset} 12px ${verticalPadding} 70px !important`, 
            boxSizing: 'border-box',
            width: '100%',
            height: '100%',
            overflowY: 'auto !important',
            background: 'transparent !important',
            verticalAlign: 'top',
          },
          '& .MuiInputBase-root:before, & .MuiInputBase-root:after': {
            borderBottom: 'none !important',
          },
        }}
      />
    </Box>
  );
};


export default function Home() {
  const theme = useTheme();
  
  const [problemLanguage, setProblemLanguage] = useState<'en' | 'th'>('en');
  const [programLanguage, setProgramLanguage] = useState<'C' | 'Python'>('Python');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [generatedResponse, setGeneratedResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [savedExerciseName, setSavedExerciseName] = useState('');
  const [savedDescription, setSavedDescription] = useState('');
  const [savedSourceCode, setSavedSourceCode] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const MOCK_PROBLEM_NAME = 'Unnamed Exercise';
  const MOCK_DESCRIPTION = `The generated response did not follow the expected format (Problem Name:, Description:, Example Source Code:). Please try again or refine the API response logic.`;
  const MOCK_SOURCE_CODE = `# This is a default example code.
def calculate_sum(a, b):
    return a + b

print(calculate_sum(5, 10))
`;

  const topics = [
    'Introduction', 'Variables Expression Statement',
    'Conditional Execution', 'While Loop',
    'Definite Loop', 'List',
    'String', 'Function',
    'Dictionary', 'Files',
  ];

  const handleCheckboxChange = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const fetchProblem = async (isAnotherProblem = false) => {
    if (selectedTopics.length === 0) return;
    
    setLoading(true);
    setGeneratedResponse('');
    setIsSaved(false);

    try {
        const response = await fetch('/api/problems', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                language: problemLanguage,
                programLanguage,
                difficulty,
                topics: selectedTopics,
                isAnotherProblem,
            }),
        });

        if (!response.ok) {
            let errorText = `Server responded with status ${response.status} (${response.statusText})`;
            try {
                const errorData = await response.json();
                errorText = errorData.error || errorText;
            } catch (e) {
                errorText += `. Received non-JSON response. Check API route path: /api/problems`;
            }
            throw new Error(errorText);
        }

        const data = await response.json();
        setGeneratedResponse(data.response);

    } catch (error) {
        console.error('Error fetching problem:', error);
        setGeneratedResponse(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    } finally {
        setLoading(false);
    }
  };


  const handleGenerateProblem = (e: FormEvent) => {
    e.preventDefault();
    fetchProblem();
  };

  const parseAndSetProblem = (rawResponse: string) => {
    const nameMatch = rawResponse.match(/Problem Name:\s*(.+?)(?:\n|$)/i);
    const name = nameMatch ? nameMatch[1].trim() : MOCK_PROBLEM_NAME;
    setSavedExerciseName(name);

    const descriptionMarker = 'description:';
    const sourceCodeMarker = 'example source code:';

    const descriptionStart = rawResponse.search(new RegExp(descriptionMarker, 'i'));
    const sourceCodeStart = rawResponse.search(new RegExp(sourceCodeMarker, 'i'));

    let description = MOCK_DESCRIPTION.trim();
    let sourceCode = MOCK_SOURCE_CODE;

    if (descriptionStart !== -1 && sourceCodeStart !== -1) {
        let rawDescription = rawResponse.substring(descriptionStart + descriptionMarker.length);
        rawDescription = rawDescription.substring(0, rawDescription.search(new RegExp(sourceCodeMarker, 'i'))).trim();
        description = rawDescription;
        
        let rawSourceCode = rawResponse.substring(sourceCodeStart + sourceCodeMarker.length).trim();
        
        sourceCode = rawSourceCode.replace(/```[a-z]*\n|```/gi, '').trim();
    } 
    else {
        description = rawResponse;
        sourceCode = MOCK_SOURCE_CODE;
    }

    setSavedDescription(description);
    setSavedSourceCode(sourceCode);
    setIsSaved(true);
    
    document.getElementById('saved-exercise-preview')?.scrollIntoView({ behavior: 'smooth' });
  };


  const handleSaveProblem = () => {
    if (!generatedResponse || generatedResponse.startsWith('Error:')) return;
    parseAndSetProblem(generatedResponse);
  };
  
  const ExerciseActions = () => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
      <Button variant="outlined" color="inherit" onClick={() => setGeneratedResponse('')}>
        Cancel
      </Button>
      <Button 
        variant="contained" 
        onClick={handleSaveProblem}
        disabled={loading || generatedResponse.startsWith('Error:')}
        sx={{ 
          backgroundColor: 'black',
          '&:hover': { backgroundColor: 'grey.900' }
        }}
      >
        Save
      </Button>
    </Box>
  );

  const getHighlighterLanguage = () => {
    return programLanguage.toLowerCase() === 'c' ? 'clike' : 'python';
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 8 }, fontFamily: 'sans-serif' }}>
      
      <Typography
        variant="h4"
        component="h1"
        align="left"
        fontWeight="bold"
        gutterBottom
        sx={{ color: 'text.primary', mb: 4 }}
      >
        <span role="img" aria-label="lightbulb">💡</span> Generate Problem by KANUT
      </Typography>

      <Paper elevation={6} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3, mb: 4 }}>
        
        <Grid container spacing={4} sx={{ mb: 4 }}>
            <GridItem item xs={12} md={6}>
                <Typography variant="h6" fontWeight="semibold" gutterBottom>Select Problem Language:</Typography>
                <Grid container spacing={2}>
                    <GridItem item xs={6}>
                        <SelectionButton
                            onClick={() => setProblemLanguage('en')}
                            selected={problemLanguage === 'en'}
                        >English</SelectionButton>
                    </GridItem>
                    <GridItem item xs={6}>
                        <SelectionButton
                            onClick={() => setProblemLanguage('th')}
                            selected={problemLanguage === 'th'}
                        >Thai</SelectionButton>
                    </GridItem>
                </Grid>
            </GridItem>
            <GridItem item xs={12} md={6}>
                <Typography variant="h6" fontWeight="semibold" gutterBottom>Select Program Language:</Typography>
                <Grid container spacing={2}>
                    <GridItem item xs={6}>
                        <SelectionButton
                            onClick={() => setProgramLanguage('C')}
                            selected={programLanguage === 'C'}
                        >C</SelectionButton>
                    </GridItem>
                    <GridItem item xs={6}>
                        <SelectionButton
                            onClick={() => setProgramLanguage('Python')}
                            selected={programLanguage === 'Python'}
                        >Python</SelectionButton>
                    </GridItem>
                </Grid>
            </GridItem>
        </Grid>

        <Grid container spacing={4} sx={{ mb: 4 }}>
            <GridItem item xs={12} md={4}>
                <Typography variant="h6" fontWeight="semibold" gutterBottom>Select Difficulty:</Typography>
                <Grid container spacing={2}>
                    {['Easy', 'Medium', 'Hard'].map((d) => (
                        <GridItem item xs={4} key={d}>
                            <SelectionButton
                                onClick={() => setDifficulty(d as 'Easy' | 'Medium' | 'Hard' )}
                                selected={difficulty === d}
                            >
                                {d}
                            </SelectionButton>
                        </GridItem>
                    ))}
                </Grid>
            </GridItem>
            <GridItem item xs={12} md={8}>
                <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">
                        <Typography variant="h6" fontWeight="semibold">Select Topics:</Typography>
                    </FormLabel>
                    <Grid container spacing={1}>
                        {topics.map((topic) => (
                            <GridItem item xs={6} sm={4} key={topic}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedTopics.includes(topic)}
                                            onChange={() => handleCheckboxChange(topic)}
                                            name={topic}
                                            sx={{ '&.Mui-checked': { color: theme.palette.common.black } }}
                                        />
                                    }
                                    label={<Typography variant="body2">{topic.split(' ')[0]}</Typography>}
                                />
                            </GridItem>
                        ))}
                    </Grid>
                </FormControl>
            </GridItem>
        </Grid>

        <Box sx={{ textAlign: 'center', my: 4 }}>
            <Button
              onClick={handleGenerateProblem}
              variant="contained"
              size="large"
              disabled={selectedTopics.length === 0 || loading}
              sx={{
                backgroundColor: 'black',
                '&:hover': { backgroundColor: 'grey.900' },
                py: 1.5,
                fontWeight: 'bold',
                minWidth: 200,
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Generate Problem'}
            </Button>
        </Box>

        {(loading || generatedResponse) && (
            <Box sx={{ mt: 5 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Exercise Preview
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.warning.main, mb: 2 }}>
                    This will automatically appear at the Add Exercise page. So you can edit there or <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>copy and paste testing on compiler.</span>
                </Typography>

                <Paper variant="outlined" sx={{ p: 2, border: `1px solid ${theme.palette.grey[300]}` }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={15}
                        value={loading ? 'Generating problem...' : generatedResponse}
                        placeholder="Generated problem content will appear here..."
                        InputProps={{
                            readOnly: true,
                            style: { 
                              whiteSpace: 'pre-wrap', 
                              fontFamily: 'monospace',
                              color: generatedResponse.startsWith('Error:') ? theme.palette.error.main : 'inherit'
                            }
                        }}
                        variant="standard"
                        sx={{
                            '& .MuiInputBase-input': {
                                overflowY: 'auto',
                                padding: 0,
                            },
                            '& .MuiInputBase-root:before': {
                                borderBottom: 'none !important',
                            }
                        }}
                    />
                    <ExerciseActions />
                </Paper>
            </Box>
        )}
      </Paper>
      
      <hr/>
      
      {isSaved && (
        <Paper id="saved-exercise-preview" elevation={6} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3, mt: 6 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
                Simulated Add Exercise Page
            </Typography>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight="semibold" gutterBottom>
                    Exercise name <span style={{fontSize: '0.8em', color: theme.palette.grey[600]}}>(This is one of the most important of the exercise.)</span>
                </Typography>
                <TextField
                    fullWidth
                    value={savedExerciseName}
                    onChange={(e) => setSavedExerciseName(e.target.value)}
                    variant="outlined"
                    placeholder="Sum of Two Numbers"
                />
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight="semibold" gutterBottom>
                    Description
                </Typography>
                <Box sx={{ border: `1px solid ${theme.palette.grey[300]}`, borderRadius: 1, overflow: 'hidden' }}>
                    
                    <MarkdownToolbar theme={theme} />
                    
                    <TextField
                        fullWidth
                        multiline
                        rows={10}
                        value={savedDescription}
                        onChange={(e) => setSavedDescription(e.target.value)}
                        variant="standard"
                        placeholder="Description text, test cases, and outputs..."
                        InputProps={{
                            style: { fontFamily: 'monospace' }
                        }}
                        sx={{
                            '& .MuiInputBase-root:before, & .MuiInputBase-root:after': {
                                borderBottom: 'none !important',
                            },
                            '& .MuiInputBase-input': {
                                padding: '12px !important',
                            }
                        }}
                    />
                </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight="semibold" gutterBottom>
                    Source Code
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: theme.palette.grey[600] }}>
                    Main code that will input goes here. Note that you have to click the **analyze test-case** button after paste the code.
                </Typography>
                
                <Box sx={{ border: `1px solid ${theme.palette.grey[300]}`, borderRadius: 1, overflow: 'hidden' }}>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: theme.palette.grey[100] }}>
                        <Typography variant="caption" fontWeight="bold">main.{programLanguage.toLowerCase() === 'c' ? 'c' : 'py'}</Typography>
                        <Button variant="contained" size="small" sx={{ 
                            bgcolor: theme.palette.warning.dark,
                            '&:hover': { bgcolor: theme.palette.warning.main } 
                        }}>
                            Analyze and Save test case
                        </Button>
                    </Box>
                    
                    <CodeEditor
                      code={savedSourceCode}
                      language={getHighlighterLanguage()}
                      onChange={setSavedSourceCode}
                      rows={10}
                    />

                </Box>
            </Box>
        </Paper>
      )}
    </Container>
  );
}