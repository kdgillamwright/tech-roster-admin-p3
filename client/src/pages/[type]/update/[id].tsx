import { createTechnology, getCourses, getData, getTechnologies, updateTechnology } from '@/tools/DataManager';
import { TechCourse, Technology } from "@/tools/technology.model";
// import { TechnologiesList } from "@/components/List";
import { Course } from '@/tools/course.model';
import router, { NextRouter, Router, useRouter } from 'next/router';
import { sendJSONData } from '@/tools/Toolkit';
import { ChangeEvent, useState } from 'react';
import LoadingOverlay from '@/components/LoadingOverlay';

export default function Update({ item, courses }: { item: Technology | Course, courses: Course[] }) {
  const router: NextRouter = useRouter();
  const { type, id } = router.query;

  // state vars
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  const [userInputName, setUserInputName] = useState<string>((item as Technology).name);
  const [userInputDescriptionBox, setUserInputDescriptionBox] = useState<string>((item as Technology).description);
  const [userInputDifficulty, setUserInputDifficulty] = useState<number>((item as Technology).difficulty);
  const [userSelectedCourses, setUserSelectedCourses] = useState<TechCourse[]>((item as Technology).courses);
  const [userInputCourseCode, setUserInputCourseCode] = useState<string>((item as Course).courseCode);
  const [userInputCourseName, setUserInputCourseName] = useState<string>((item as Course).courseName);

  // making a copy of the userSelectedCourses, checking if they were checked, and appending them.
  const handleCheckbox = (e: any, course: Course) => {
    let updatedCoursesChecked: TechCourse[] = userSelectedCourses;
    if (e.target.checked) {
      updatedCoursesChecked.push({
        code: course.courseCode,
        name: course.courseName
      })
    } else {
      // loop thorugh array and find the web Code and remove that element from the array (meaning its been unchecked)
      for (let i = 0; coursesChecked.length > i; i++) {
        if (course.courseCode === userSelectedCourses[i].code) {
          updatedCoursesChecked.splice(i, 1);
          break;
        }
      }
    }
    setUserSelectedCourses(updatedCoursesChecked);
  }

  // when you click okay - the loading overlay will show, i create my JSON object based on if its a technology or a course, i send the JSON data to the DB. turn off the loading overlay when this is complete and then return to the main page. 
  const onUpdate = async (e: any) => {
    setShowOverlay(true);

    let item: Course | Technology;

    if (type === "technologies") {
      item = {} as Technology;
      item.name = userInputName;
      item.description = userInputDescriptionBox;
      item.difficulty = userInputDifficulty;
      item.courses = userSelectedCourses;
    } else {
      item = {} as Course;
      item.courseCode = userInputCourseCode;
      item.courseName = userInputCourseName;
    }
    console.log(item);
    let sendURL = `/api/${type}/${id}`;
    await sendJSONData(sendURL, "PUT", item, () => console.log("success"), (error: Error) => console.log(`*** An error has occured: ${error.message}`), true);
    // set time out for 1 second to test and see overlay.
    setTimeout(() => {
      setShowOverlay(false);
      router.replace("/");
    }, 1000);
  }

  // checking to make sure the required fields are populated this will enable or disable the ok button.
  const fieldCheck = () => {
    if (type === "technologies") {
      return userInputName === "" || userInputDescriptionBox === "";
    }
    return userInputCourseCode === "" || userInputCourseName === "";
  }

  // looping over the checked off courses  and comparing them, if they match true if not false.
  const coursesChecked = (course: Course) => {
    for (let i = 0; i < userSelectedCourses.length; i++) {
      if (course.courseCode === userSelectedCourses[i].code) {
        return true;
      }
    }

    return false;
  }

  // if they click cancel they go back to the main page.
  const onUpdateCancel = () => {
    router.replace("/");
  }


  return (
    // ---------------------------------- render to the DOM
    <main>
      {/* loading underlay component. */}
      <LoadingOverlay
        color={"#FFFFFF"}
        showSpinner={true}
        bgColor={"#428BCA"}
        showOverlay={showOverlay}
      />

      {
        //turnary to handle the view for both technolgoies and courses.
        type === "technologies" ?

          <div className="pt-2" >
            <div className="font-bold" > Add New Technology: </div>

            <div className="pt-6" >
              <div className="font-bold pb-2">
                <label htmlFor="TechnologyName" > Name: </label>
              </div>
              <div>
                <input type="text" id="TechnologyName" placeholder="Technology Name" value={userInputName} onChange={(e: any) => { setUserInputName(e.target.value) }} className="p-1 border-0 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 w-72" />
              </div>
            </div>

            <div className="pt-4">
              <div className="font-bold pb-2">
                <label htmlFor="TechnologyDescription" id="TechnologyDescriptionLabel" className="pt3.5 pb-1" > Description: </label>
              </div>
              <div>
                <textarea id="TechnologyDescription-box" value={userInputDescriptionBox} onChange={(e: any) => { setUserInputDescriptionBox(e.target.value) }} className="TechnologyDescriptionBox border-0 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 w-72 h-48 mb-3.5 resize-none" placeholder="Enter Technology Description">
                </textarea>
              </div>
            </div>

            <div className="pt-4">
              <div className="pb-2 font-bold" >
                <label htmlFor="difficultySelect" > Difficulty: </label>
              </div>
              <select id="difficultySelect" className="p-1 border ring-1" value={userInputDifficulty} onChange={(e: any) => { setUserInputDifficulty(e.target.value) }}>
                <option value="1" > 1 </option>
                <option value="2" > 2 </option>
                <option value="3" > 3 </option>
                <option value="4" > 4 </option>
                <option value="5" > 5 </option>
              </select>
            </div>

            <div className="pt-6">
              <div className="pb-2 font-bold" > Used in Courses: </div>
            </div>
            {
              courses.map((course: Course, n: number) =>
                <div key={n} className="pl-2.5 py-0.5" >
                  <input type="checkbox" value={`${course.courseCode} ${course.courseName}`} onChange={(e: any) => { handleCheckbox(e, course) }} defaultChecked={coursesChecked(course)} />
                  <span className="pl-2">{`${course.courseCode} ${course.courseName}`}</span>
                </div>
              )
            }
          </div>

          :

          <div className="pt-2 pb-4" >
            <div className="font-bold" > Edit Course: </div>

            <div className="pt-2" >
              <label className="font-bold pb-2" htmlFor="CourseCode" > Course Code: </label>
              <div>
                <input type="text" id="CourseCode" placeholder="Course Code" value={userInputCourseCode} onChange={(e: any) => { setUserInputCourseCode(e.target.value) }} className="p-1 text-greyed-out border-0 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 w-72" disabled />
              </div>
            </div>

            <div className="pt-4" >
              <label className="font-bold pb-2" htmlFor="CourseName" > Name: </label>
              <div>
                <input type="text" id="CourseName" value={userInputCourseName} onChange={(e: any) => { setUserInputCourseName(e.target.value) }} className="p-1 border-0 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 w-72" />
              </div>
            </div>

          </div>
      }

      <div className="flex flex-row pt-6">
        <div className="pr-4" >
          <button id="btnOK" className="bg-lime-700 border-0 ring-1 rounded text-white cursor-pointer w-24 py-2 hover:bg-lime-500 disabled:bg-greyed-out disabled:cursor-not-allowed" onClick={onUpdate} disabled={fieldCheck()}> OK </button>
        </div>
        < div >
          <button className="bg-lime-700 border-0 ring-1 rounded text-white cursor-pointer w-24 py-2 hover:bg-lime-500" onClick={onUpdateCancel}> Cancel </button>
        </div>
      </div>
    </main >
  );
}


// pre rendering all known possible paths for updating technolgoies and courses
export async function getStaticPaths() {
  const data = await getData();
  const paths: Object[] = [];


  // loop over to add each specific id.
  data.technologies.forEach((technology: Technology) => {
    paths.push(
      {
        params: {
          id: technology._id,
          type: "technologies"
        }
      }
    );
  })
  // loop over to add each specific id.
  data.courses.forEach((course: Course) => {
    paths.push(
      {
        params: {
          id: course._id,
          type: "courses"
        }
      }
    );
  })
  // blocking makes it so it will try and render pages that are not prerendered.(so when i create a new course or technology the newly created id will work  in my url)
  return { paths, fallback: "blocking" };
}
//getting data for when page loads.
export async function getStaticProps({ params }: { params: { id: string, type: string } }) {
  let technologies: Technology[]
  let courses: Course[] = await getCourses();
  let item: Course | Technology | undefined

  if (params.type === "technologies") {
    technologies = await getTechnologies();
    item = technologies.find(item => item._id == params.id);
  } else {
    item = courses.find(item => item._id == params.id);
  }

  return {
    props: {
      item: item,
      courses: courses
    }
  }
}