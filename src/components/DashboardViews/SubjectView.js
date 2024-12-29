/* eslint-disable no-unused-vars */
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { format, parseISO } from 'date-fns';
/* eslint-enable no-unused-vars */

function SubjectView({ schedule }) {
  // Reorganize data by subject and then by month
  const subjectData = Object.entries(schedule).reduce((acc, [month, subjects]) => {
    Object.entries(subjects).forEach(([subject, sessions]) => {
      if (!acc[subject]) {
        acc[subject] = {};
      }
      if (!acc[subject][month]) {
        acc[subject][month] = [];
      }
      acc[subject][month].push(...sessions);
    });
    return acc;
  }, {});

  // Regular table view for screen
  const TableView = ({ sessions }) => (
    <Box className="screen-only">
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Topic</TableCell>
              <TableCell align="center" className="no-print">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions
              .sort((a, b) => {
                const dateA = new Date(`${a.date} ${a.startTime}`);
                const dateB = new Date(`${b.date} ${b.startTime}`);
                return dateA - dateB;
              })
              .map((session, index) => (
                <TableRow key={index}>
                  <TableCell>{session.date}</TableCell>
                  <TableCell>
                    {session.startTime} - {session.endTime}
                  </TableCell>
                  <TableCell>{session.topic}</TableCell>
                  <TableCell align="center" className="no-print">
                    <Chip
                      icon={session.completed ? <CheckCircleIcon /> : <PendingIcon />}
                      label={session.completed ? "Completed" : "Pending"}
                      color={session.completed ? "success" : "warning"}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Card view for print
  const CardView = ({ sessions }) => (
    <Box className="print-only">
      <Grid container spacing={2}>
        {sessions
          .sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.startTime}`);
            const dateB = new Date(`${b.date} ${b.startTime}`);
            return dateA - dateB;
          })
          .map((session, index) => (
            <Grid item xs={6} key={index}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {format(new Date(session.date), 'EEEE, MMMM d, yyyy')}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {session.topic}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {session.startTime} - {session.endTime}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );

  return (
    <Box>
      {Object.entries(subjectData).map(([subject, monthData]) => (
        <Box key={subject} className="subject-section" sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 2, 
              bgcolor: 'primary.main', 
              color: 'primary.contrastText',
              p: 2,
              '@media print': {
                bgcolor: 'transparent',
                color: 'text.primary',
                p: 1
              }
            }}
          >
            {subject}
          </Typography>
          {Object.entries(monthData).map(([month, sessions]) => (
            <Box key={month} sx={{ mb: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  bgcolor: 'grey.100',
                  p: 1,
                  '@media print': {
                    bgcolor: 'transparent'
                  }
                }}
              >
                {month}
              </Typography>
              <Box className="screen-only">
                <TableView sessions={sessions} />
              </Box>
              <Box className="print-only">
                <CardView sessions={sessions} />
              </Box>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}

export default SubjectView; 