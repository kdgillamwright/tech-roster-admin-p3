import { MongoClient, Db, Collection, FindCursor, InsertOneResult, ObjectId, UpdateResult, DeleteResult } from "mongodb";
import { NextApiRequest, NextApiResponse } from 'next';
import sanitizeHtml from 'sanitize-html';
import { Technology, TechCourse } from "@/tools/technology.model";
import { Course } from "@/tools/course.model";

// MongoDB constants
const MONGO_URL: string = "mongodb://mongo:27017/";
const MONGO_DB_NAME: string = "dbTechs";
const MONGO_COLLECTION_TECHS: string = "technologies";
const MONGO_COLLECTION_COURSES: string = "courses";

export async function getTechnologies() {
  // construct a MongoClient object
  let mongoClient: MongoClient = new MongoClient(MONGO_URL);

  let techArray: Technology[];
  try {
    await mongoClient.connect();
    // get JSON data from mongoDB server (ASYNC task)
    techArray = await mongoClient.db(MONGO_DB_NAME).collection<Technology>(MONGO_COLLECTION_TECHS).find().toArray();
    // need to convert ObjectId objects to strings
    techArray.forEach((tech: Technology) => tech._id = tech._id.toString());
  } catch (error: any) {
    console.log(`>>> ERROR : ${error.message}`);
    throw error;
  } finally {
    mongoClient.close();
  }

  return techArray;
}

export async function getCourses() {
  // construct a MongoClient object
  let mongoClient: MongoClient = new MongoClient(MONGO_URL);

  let courseArray: Course[];
  try {
    await mongoClient.connect();
    // get JSON data from mongoDB server (ASYNC task)
    courseArray = await mongoClient.db(MONGO_DB_NAME).collection<Course>(MONGO_COLLECTION_COURSES).find().toArray();
    // need to convert ObjectId objects to strings
    courseArray.forEach((course: Course) => course._id = course._id.toString());
  } catch (error: any) {
    console.log(`>>> ERROR : ${error.message}`);
    throw error;
  } finally {
    mongoClient.close();
  }

  return courseArray;
}

export async function getData() {
  let technologies = await getTechnologies();
  let courses = await getCourses();

  return { technologies: technologies, courses: courses }
}


export async function createTechnology(request: NextApiRequest, response: NextApiResponse<any>) {
  let mongoClient: MongoClient = new MongoClient(MONGO_URL);
  try {
    await mongoClient.connect();

    // sanitizing input
    request.body.name = sanitizeHtml(request.body.name);
    request.body.description = sanitizeHtml(request.body.description);
    request.body.difficulty = sanitizeHtml(request.body.difficulty);
    request.body.courses.forEach((course: TechCourse) => {
      course.code = sanitizeHtml(course.code);
      course.name = sanitizeHtml(course.name);
    });

    // insert new document into DB
    let result: InsertOneResult = await mongoClient.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_TECHS).insertOne(request.body);

    // status code for created
    response.status(200);
    response.send(result);
  } catch (error: any) {
    response.status(500);
    response.send({ error: error.message });
    throw error;
  } finally {
    mongoClient.close();
  }
}


export async function createCourse(request: NextApiRequest, response: NextApiResponse<any>) {
  let mongoClient: MongoClient = new MongoClient(MONGO_URL);
  try {
    await mongoClient.connect();

    // sanitizing input
    request.body.courseCode = sanitizeHtml(request.body.courseCode);
    request.body.courseName = sanitizeHtml(request.body.courseName);

    // insert new document into DB
    let result: InsertOneResult = await mongoClient.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_COURSES).insertOne(request.body);

    // status code for created
    response.status(200);
    response.send(result);
  } catch (error: any) {
    response.status(500);
    response.send({ error: error.message });
    throw error;
  } finally {
    mongoClient.close();
  }
}

export async function updateTechnology(request: NextApiRequest, response: NextApiResponse<any>) {
  let mongoClient: MongoClient = new MongoClient(MONGO_URL);
  try {
    await mongoClient.connect();

    let id: any = request.query.id;
    // sanitize it and convert to ObjectId
    id = new ObjectId(sanitizeHtml(id));

    // sanitizing input
    request.body.name = sanitizeHtml(request.body.name);
    request.body.description = sanitizeHtml(request.body.description);
    request.body.difficulty = sanitizeHtml(request.body.difficulty);
    request.body.courses.forEach((course: TechCourse) => {
      course.code = sanitizeHtml(course.code);
      course.name = sanitizeHtml(course.name);
    });

    // update document
    let techCollection: Collection = mongoClient.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_TECHS);
    let selector: Object = { "_id": id };
    let newValues: Object = { $set: request.body };
    let result: UpdateResult = await techCollection.updateOne(selector, newValues);

    if (result.matchedCount <= 0) {
      response.status(404);
      response.send({ error: "No technology documents found with ID" });
    } else {
      // status code for updated
      response.status(200);
      response.send(result);
    }

  } catch (error: any) {
    response.status(500);
    response.send({ error: error.message });
    throw error;
  } finally {
    mongoClient.close();
  }
}

export async function updateCourse(request: NextApiRequest, response: NextApiResponse<any>) {
  let mongoClient: MongoClient = new MongoClient(MONGO_URL);
  try {
    await mongoClient.connect();

    let id: any = request.query.id;
    // sanitize it and convert to ObjectId
    id = new ObjectId(sanitizeHtml(id));

    // sanitizing input
    request.body.courseCode = sanitizeHtml(request.body.courseCode);
    request.body.courseName = sanitizeHtml(request.body.courseName);

    // update document
    let courseCollection: Collection = mongoClient.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_COURSES);
    let selector: Object = { "_id": id };
    let newValues: Object = { $set: request.body };
    let result: UpdateResult = await courseCollection.updateOne(selector, newValues);

    if (result.matchedCount <= 0) {
      response.status(404);
      response.send({ error: "No course documents found with ID" });
    } else {
      // status code for updated
      response.status(200);
      response.send(result);
    }

  } catch (error: any) {
    response.status(500);
    response.send({ error: error.message });
    throw error;
  } finally {
    mongoClient.close();
  }
}

export async function deleteTechnology(request: NextApiRequest, response: NextApiResponse<any>) {
  let mongoClient: MongoClient = new MongoClient(MONGO_URL);
  try {
    await mongoClient.connect();

    // isolate the route parameter
    let id: any = request.query.id;
    // sanitize it and convert to ObjectId
    id = new ObjectId(sanitizeHtml(id));

    // delete document
    let techCollection: Collection = mongoClient.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_TECHS);
    let selector: Object = { "_id": id };
    let result: DeleteResult = await techCollection.deleteOne(selector);

    // check if deleted correctly
    if (result.deletedCount <= 0) {
      response.status(404);
      response.send({ error: "No technology documents found with ID" });
    } else {
      // status code for deleted
      response.status(200);
      response.send(result);
    }
  } catch (error: any) {
    response.status(500);
    response.send({ error: error.message });
    throw error;
  } finally {
    mongoClient.close();
  }
}

export async function deleteCourse(request: NextApiRequest, response: NextApiResponse<any>) {
  let mongoClient: MongoClient = new MongoClient(MONGO_URL);
  try {
    await mongoClient.connect();

    // isolate the route parameter
    let id: any = request.query.id;
    // sanitize it and convert to ObjectId
    id = new ObjectId(sanitizeHtml(id));

    // delete document
    let courseCollection: Collection = mongoClient.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_COURSES);
    let selector: Object = { "_id": id };
    let result: DeleteResult = await courseCollection.deleteOne(selector);

    // check if deleted correctly
    if (result.deletedCount <= 0) {
      response.status(404);
      response.send({ error: "No course documents found with ID" });
    } else {
      // status code for deleted
      response.status(200);
      response.send(result);
    }
  } catch (error: any) {
    response.status(500);
    response.send({ error: error.message });
    throw error;
  } finally {
    mongoClient.close();
  }
}