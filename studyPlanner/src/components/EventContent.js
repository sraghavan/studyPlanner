import { getSubjectIcon } from '../data/subjectIcons';

const iconSvg = {
  'Science': 'M19.8 18.4L14 10.67V6.6l1.86-1.86c.078-.078.13-.17.13-.27 0-.1-.052-.19-.13-.26L14.93 3.3c-.15-.15-.4-.15-.55 0L12.5 5.17V4c0-.55-.45-1-1-1h-2c-.55 0-1 .45-1 1v4.17l-7.77 7.77c-.45.45-.45 1.17 0 1.62l1.62 1.62c.45.45 1.17.45 1.62 0L12 11.13l2.5 2.5-2.5 2.5c-.45.45-.45 1.17 0 1.62l1.62 1.62c.45.45 1.17.45 1.62 0l4.55-4.55c.45-.45.45-1.17 0-1.62zM14 20c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z',
  'Mathematics': 'M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5.44 3.53c.29-.29.77-.29 1.06 0l.88.88.88-.88c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-.88.88.88.88c.29.29.29.77 0 1.06-.29.29-.77.29-1.06 0l-.88-.88-.88.88c-.29.29-.77.29-1.06 0-.29-.29-.29-.77 0-1.06l.88-.88-.88-.88c-.29-.29-.29-.77 0-1.06zM7 7h3v3H7V7zm0 4h3v3H7v-3zm4 4h3v3h-3v-3zm0-4h3v3h-3v-3z',
  'Sociology': 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z',
  'GP': 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z',
  'English': 'M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z',
  'Hindi': 'M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z',
  'PE': 'M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z'
};

const defaultPath = 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z';

export const renderEventContent = (eventInfo) => {
  const isCompleted = eventInfo.event.completed || false;
  const subjectInfo = getSubjectIcon(eventInfo.event.extendedProps.subject);
  
  return {
    html: `
      <div class="event-container" style="
        font-size: 0.85em; 
        overflow: visible; 
        white-space: normal; 
        padding: 4px 8px 4px 32px;
        position: relative;
        min-height: 100%;
        display: flex;
        align-items: flex-start;
        gap: 8px;
      ">
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background-color: ${subjectInfo.color};
          color: white;
          flex-shrink: 0;
          position: absolute;
          left: -4px;
          top: -4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          z-index: 5;
        ">
          <svg viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: currentColor;">
            <path d="${iconSvg[eventInfo.event.extendedProps.subject] || defaultPath}"/>
          </svg>
        </div>
        <div class="event-title" style="
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-right: 40px;
          margin-top: 2px;
        ">
          ${eventInfo.event.title}
        </div>
        <div style="
          position: absolute;
          top: 0;
          right: 0;
          display: flex;
          gap: 2px;
          padding: 2px;
        ">
          <button style="
            cursor: pointer;
            background: ${isCompleted ? '#4caf50' : '#ffffff'};
            border: 1px solid ${isCompleted ? '#4caf50' : '#757575'};
            border-radius: 4px;
            padding: 2px;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${isCompleted ? '#ffffff' : '#757575'};
            font-size: 14px;
            position: relative;
            z-index: 10;
            pointer-events: auto;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          " class="complete-event" data-event-id="${eventInfo.event.id}" type="button">
            ✓
          </button>
          <button style="
            cursor: pointer;
            font-size: 14px;
            background: #ffffff;
            border: 1px solid #d32f2f;
            border-radius: 4px;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #d32f2f;
            padding: 0;
            margin: 0;
            position: relative;
            z-index: 10;
            pointer-events: auto;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          " class="delete-event" data-event-id="${eventInfo.event.id}" type="button">
            ×
          </button>
        </div>
      </div>
    `
  };
}; 