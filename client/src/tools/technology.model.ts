import { Course } from "./course.model";

export interface Technology {
  _id: string;
  name: string;
  description: string;
  difficulty: number;
  courses: TechCourse[];
}

export interface TechCourse {
  code: string;
  name: string;
}

export interface TechProps {
  technologies: Technology[];
}

export interface ListProps {
  type: string;
  items: Course[] | Technology[];
}