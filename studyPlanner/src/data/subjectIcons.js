import ScienceIcon from '@mui/icons-material/Science';
import CalculateIcon from '@mui/icons-material/Calculate';
import GroupsIcon from '@mui/icons-material/Groups';
import ArticleIcon from '@mui/icons-material/Article';
import TranslateIcon from '@mui/icons-material/Translate';
import LanguageIcon from '@mui/icons-material/Language';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';

export const subjectIcons = {
  'Science': {
    icon: ScienceIcon,
    color: '#2196f3' // blue
  },
  'Mathematics': {
    icon: CalculateIcon,
    color: '#f44336' // red
  },
  'Sociology': {
    icon: GroupsIcon,
    color: '#9c27b0' // purple
  },
  'GP': {
    icon: ArticleIcon,
    color: '#4caf50' // green
  },
  'English': {
    icon: TranslateIcon,
    color: '#ff9800' // orange
  },
  'Hindi': {
    icon: LanguageIcon,
    color: '#795548' // brown
  },
  'PE': {
    icon: SportsBasketballIcon,
    color: '#009688' // teal
  }
};

export const getSubjectIcon = (subjectName) => {
  return subjectIcons[subjectName] || {
    icon: ArticleIcon,
    color: '#757575'
  };
}; 