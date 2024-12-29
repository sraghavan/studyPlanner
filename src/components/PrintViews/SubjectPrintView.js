import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { format } from 'date-fns';
import { getSubjectIcon } from '../../data/subjectIcons';

function SubjectPrintView({ schedule }) {
  // Reorganize data by subject
  const subjectData = Object.entries(schedule).reduce((acc, [month, subjects]) => {
    Object.entries(subjects).forEach(([subject, sessions]) => {
      if (!acc[subject]) {
        acc[subject] = [];
      }
      acc[subject].push(...sessions);
    });
    return acc;
  }, {});

  return (
    <Box sx={{ p: 2 }}>
      <Typography 
        variant="h4" 
        align="center" 
        sx={{ 
          mb: 3,
          pageBreakAfter: 'avoid'
        }}
      >
        Study Schedule - By Subject
      </Typography>
      
      {Object.entries(subjectData).map(([subject, sessions]) => {
        const subjectInfo = getSubjectIcon(subject);
        const IconComponent = subjectInfo.icon;
        
        return (
          <Box key={subject} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: `${subjectInfo.color}15`,
                  color: subjectInfo.color
                }}
              >
                <IconComponent sx={{ fontSize: 24 }} />
              </Box>
              <Typography variant="h5">
                {subject}
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {sessions
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((session, index) => (
                  <Grid item xs={6} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          {format(new Date(session.date), 'EEEE, MMMM d')}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                          {session.topic}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {session.startTime} - {session.endTime}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
}

export default SubjectPrintView; 