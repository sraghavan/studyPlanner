import { useState } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Collapse, 
  Paper,
  Typography 
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

function SubjectSelector({ subjects }) {
  const [open, setOpen] = useState({
    Science: false,
    Mathematics: false,
    Biology: false,
    Chemistry: false,
    Physics: false
  });

  const handleClick = (section) => {
    setOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <Paper sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
      <List component="nav">
        {/* Science Section */}
        <ListItem button onClick={() => handleClick('Science')}>
          <ListItemText primary="Science" />
          {open.Science ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open.Science} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* Biology */}
            <ListItem button sx={{ pl: 4 }} onClick={() => handleClick('Biology')}>
              <ListItemText primary="Biology" />
              {open.Biology ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open.Biology} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {subjects.Science.Biology.map((topic, index) => (
                  <ListItem button sx={{ pl: 6 }} key={index}>
                    <ListItemText primary={topic} />
                  </ListItem>
                ))}
              </List>
            </Collapse>

            {/* Chemistry */}
            <ListItem button sx={{ pl: 4 }} onClick={() => handleClick('Chemistry')}>
              <ListItemText primary="Chemistry" />
              {open.Chemistry ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open.Chemistry} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {subjects.Science.Chemistry.map((topic, index) => (
                  <ListItem button sx={{ pl: 6 }} key={index}>
                    <ListItemText primary={topic} />
                  </ListItem>
                ))}
              </List>
            </Collapse>

            {/* Physics */}
            <ListItem button sx={{ pl: 4 }} onClick={() => handleClick('Physics')}>
              <ListItemText primary="Physics" />
              {open.Physics ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open.Physics} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {subjects.Science.Physics.map((topic, index) => (
                  <ListItem button sx={{ pl: 6 }} key={index}>
                    <ListItemText primary={topic} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </List>
        </Collapse>

        {/* Mathematics Section */}
        <ListItem button onClick={() => handleClick('Mathematics')}>
          <ListItemText primary="Mathematics" />
          {open.Mathematics ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open.Mathematics} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {subjects.Mathematics.map((topic, index) => (
              <ListItem button sx={{ pl: 4 }} key={index}>
                <ListItemText primary={topic} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </Paper>
  );
}

export default SubjectSelector; 