export const organizeSubjects = (data) => {
  const subjects = {
    Science: {
      Biology: [],
      Chemistry: [],
      Physics: []
    },
    Mathematics: []
  };

  data.forEach(item => {
    if (item["Science Syllabus"]) {
      const topic = item["Science Syllabus"];
      if (topic === "Biology") {
        subjects.Science.Biology = [];
      } else if (topic === "Chemistry") {
        subjects.Science.Chemistry = [];
      } else if (topic === "Physics") {
        subjects.Science.Physics = [];
      } else if (topic.startsWith('B')) {
        subjects.Science.Biology.push(topic);
      } else if (topic.startsWith('C')) {
        subjects.Science.Chemistry.push(topic);
      } else if (topic.startsWith('P')) {
        subjects.Science.Physics.push(topic);
      }
    } else if (item["Maths syllabus"]) {
      subjects.Mathematics.push(item["Maths syllabus"]);
    }
  });

  return subjects;
}; 