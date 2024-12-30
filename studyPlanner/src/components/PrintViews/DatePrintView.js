import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { format } from 'date-fns';
import { getSubjectIcon } from '../../data/subjectIcons';

function DatePrintView({ schedule }) {
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
          subject
        });
      });
    });
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(dateData).sort((a, b) => new Date(a) - new Date(b));

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Study Schedule - By Date
      </Typography>
      
      {sortedDates.map(date => (
        <Box key={date} sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {format(new Date(date), 'EEEE, MMMM d, yyyy')}
          </Typography>
          <Grid container spacing={2}>
            {dateData[date]
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((session, index) => {
                const subjectInfo = getSubjectIcon(session.subject);
                const IconComponent = subjectInfo.icon;
                
                return (
                  <Grid item xs={6} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 32,
                              height: 32,
                              borderRadius: 1,
                              bgcolor: `${subjectInfo.color}15`,
                              color: subjectInfo.color,
                              flexShrink: 0
                            }}
                          >
                            <IconComponent sx={{ fontSize: 20 }} />
                          </Box>
                          <Typography variant="h6">
                            {session.subject}
                          </Typography>
                        </Box>
                        <Typography variant="body1">
                          {session.topic}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {session.startTime} - {session.endTime}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}

export default DatePrintView; 