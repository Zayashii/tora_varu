import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { COLORS } from 'src/layouts/config-layout';
import Logo from 'src/components/logo';

// Simple card used for each step
function StepCard({ x, y, w = 300, h = 200, title, desc }) {
  return (
    <Box sx={{ position: 'absolute', left: x, top: y }}>
      <Paper
        elevation={3}
        sx={{
          width: w,
          height: h,
          borderRadius: 4,
          p: 2.5,
          border: '4px solid #1c1c1c',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1c1c1c' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          {desc}
        </Typography>
      </Paper>
    </Box>
  );
}

export default function ProjectDrawing({ projectRef }) {

  return (
    <Logo
      imageSrc={'/assets/page/project-diagram.svg'}
      size={'100%'}
      disabledLink
      cursor="context-menu"
      ref={projectRef}
    />
  );
}

