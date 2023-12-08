export interface Course {
  _id: string;
  courseCode: string;
  courseName: string;
}

export interface CourseProps {
  courses: Course[];
}