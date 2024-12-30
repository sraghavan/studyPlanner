import { Box, Paper, IconButton, Typography, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SubjectSelector from '../Subjects/SubjectSelector';

function DailyView({ date, subjects, onBackClick }) {
  return (
    <Paper sx={{ margin: 2, padding: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={onBackClick}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">
          Daily Schedule - {date.toLocaleDateString()}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <SubjectSelector subjects={subjects} />
        </Grid>
        <Grid item xs={12} md={8}>
          {/* Timeline will go here */}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default DailyView; 