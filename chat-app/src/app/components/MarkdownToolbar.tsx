// MarkdownToolbar.tsx (or define it outside the Home component)

import { Box, IconButton, Theme } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import CodeIcon from '@mui/icons-material/Code';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import LinkIcon from '@mui/icons-material/Link';

interface MarkdownToolbarProps {
    theme: Theme;
}

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

export default MarkdownToolbar;