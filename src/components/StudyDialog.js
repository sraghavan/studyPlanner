import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel
} from '@mui/material';
import subjectsData from '../data/subjects.json';

function StudyDialog({ open, onClose, selectedSlot, onSave, editMode, editData }) {
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    start: null,
    end: null,
    completed: false,
    recurrence: {
      type: 'none',
      daysOfWeek: []
    }
  });

  const [availableTopics, setAvailableTopics] = useState([]);

  useEffect(() => {
    if (selectedSlot) {
      if (editMode && editData) {
        setFormData({
          subject: editData.subject || '',
          topic: editData.topic || '',
          start: editData.start,
          end: editData.end,
          completed: editData.completed || false,
          recurrence: editData.recurrence || {
            type: 'none',
            daysOfWeek: []
          }
        });
        // Set topics for the selected subject when editing
        const subjectData = subjectsData.subjects.find(s => s.name === editData.subject);
        if (subjectData) {
          setAvailableTopics(subjectData.topics);
        }
      } else {
        setFormData({
          subject: '',
          topic: '',
          start: selectedSlot.start,
          end: selectedSlot.end,
          completed: false,
          recurrence: {
            type: 'none',
            daysOfWeek: []
          }
        });
      }
    }
  }, [selectedSlot, editMode, editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'subject') {
      // Update available topics when subject changes
      const subjectData = subjectsData.subjects.find(s => s.name === value);
      setAvailableTopics(subjectData ? subjectData.topics : []);
      // Reset topic when subject changes
      setFormData(prev => ({
        ...prev,
        [name]: value,
        topic: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!selectedSlot) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editMode ? 'Edit Study Session' : 'Add Study Session'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                {subjectsData.subjects.map((subject) => (
                  <MenuItem key={subject.name} value={subject.name}>
                    {subject.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                required
                disabled={!formData.subject}
              >
                {availableTopics.map((topic) => (
                  <MenuItem key={topic} value={topic}>
                    {topic}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Time"
                value={selectedSlot.startTime}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Time"
                value={selectedSlot.endTime}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Recurrence</FormLabel>
                <RadioGroup
                  value={formData.recurrence.type}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      recurrence: {
                        ...prev.recurrence,
                        type: e.target.value,
                        daysOfWeek: e.target.value === 'specific-days' ? [] : []
                      }
                    }));
                  }}
                >
                  <FormControlLabel 
                    value="none" 
                    control={<Radio />} 
                    label="No recurrence" 
                  />
                  <FormControlLabel 
                    value="specific-days" 
                    control={<Radio />} 
                    label="Specific days of the week" 
                  />
                  <FormControlLabel 
                    value="whole-week" 
                    control={<Radio />} 
                    label="Repeat for whole week" 
                  />
                  <FormControlLabel 
                    value="whole-month" 
                    control={<Radio />} 
                    label="Repeat for whole month" 
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {formData.recurrence.type === 'specific-days' && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Days</InputLabel>
                  <Select
                    multiple
                    value={formData.recurrence.daysOfWeek}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        recurrence: {
                          ...prev.recurrence,
                          daysOfWeek: e.target.value
                        }
                      }));
                    }}
                    renderValue={(selected) => {
                      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                      return selected.map(day => days[day]).join(', ');
                    }}
                  >
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                      .map((day, index) => (
                        <MenuItem key={index} value={index}>
                          {day}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default StudyDialog; 