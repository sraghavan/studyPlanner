import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { parseISO, format } from 'date-fns';

function DateView({ schedule }) {
  // Reorganize data by date
  const dateData = Object.entries(schedule).reduce((acc, [month, subjects]) => {
    Object.entries(subjects).forEach(([subject, sessions]) => {
      sessions.forEach(session => {
        const date = session.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push({
          ...session,
          subject,
          month
        });
      });
    });
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(dateData).sort((a, b) => {
    return new Date(a) - new Date(b);
  });

  // Group dates by month
  const groupedByMonth = sortedDates.reduce((acc, date) => {
    const month = format(new Date(date), 'MMMM yyyy');
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(date);
    return acc;
  }, {});

  // Regular view for screen
  const TableView = ({ date, sessions }) => (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Subject</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Topic</TableCell>
            <TableCell align="center" className="no-print">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sessions
            .sort((a, b) => {
              const timeA = parseISO(`2000-01-01 ${a.startTime}`);
              const timeB = parseISO(`2000-01-01 ${b.startTime}`);
              return timeA - timeB;
            })
            .map((session, index) => (
              <TableRow key={index}>
                <TableCell>{session.subject}</TableCell>
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
  );

  // Card view for print
  const CardView = ({ date, sessions }) => (
    <Grid container spacing={2} sx={{ 
      display: 'none', 
      '@media print': { 
        display: 'flex',
        width: '100%',
        margin: 0
      }
    }}>
      {sessions
        .sort((a, b) => {
          const timeA = parseISO(`2000-01-01 ${a.startTime}`);
          const timeB = parseISO(`2000-01-01 ${b.startTime}`);
          return timeA - timeB;
        })
        .map((session, index) => (
          <Grid item xs={6} key={index}>
            <Card variant="outlined" sx={{ 
              height: '100%',
              boxShadow: 'none',
              border: '1px solid #ddd'
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {session.subject}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {session.startTime} - {session.endTime}
                </Typography>
                <Typography variant="body1">
                  {session.topic}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
    </Grid>
  );

  return (
    <Box>
      {Object.entries(groupedByMonth).map(([month, dates]) => (
        <Box key={month} sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
            {month}
          </Typography>
          {dates.map(date => (
            <Accordion key={date} defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  bgcolor: 'grey.100',
                  '@media print': { bgcolor: 'transparent' }
                }}
              >
                <Typography variant="h6">
                  {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* Show table view on screen */}
                <Box className="no-print">
                  <TableView date={date} sessions={dateData[date]} />
                </Box>
                {/* Show card view when printing */}
                <CardView date={date} sessions={dateData[date]} />
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ))}
    </Box>
  );
}

export default DateView; 