export interface Response {
  status: number;
  body: any;
}

export interface IStudent {
  name: string;
  studentID: string;
  paternalSurname: string;
  maternalSurname: string;
  email: string;
  telephone: string;
  password: string;
  schedule: Array<ILessonDay>;
}

export interface Student extends IStudent, Document {}

export interface ILesson {
  group: String;
  subject: String;
  days: ILessonDay[];
}

interface ILessonDay {
  dayIndex: number;
  time: String;
}

export interface Lesson extends ILesson, Document {}

export interface IReport {
  date: Date;
  studentID: string;
  hasTestPhoto: boolean;
  testPhoto: string;
  sinceDay: Date;
  symptoms: string[];
  attendedSchool: boolean;
  lessonsAttended: lessonReference[];
  approved: boolean;
}

interface lessonReference {
  lesson: string;
  days: Date[];
}

export interface Report extends IReport, Document {}
