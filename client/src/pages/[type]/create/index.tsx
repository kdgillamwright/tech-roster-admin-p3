import LoadingOverlay from '@/components/LoadingOverlay';
import { getCourses } from '@/tools/DataManager';
import { sendJSONData } from '@/tools/Toolkit';
import { Course } from '@/tools/course.model';
import { TechCourse, Technology } from '@/tools/technology.model';
import { NextRouter, useRouter } from 'next/router';
import { useState } from 'react';

export default function Create({ courses }: { courses: Course[] }) {
  const router: NextRouter = useRouter();
  const { type } = router.query;


  //useState vars
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [userInputName, setUserInputName] = useState<string>("");
  const [userInputDescriptionBox, setUserInputDescriptionBox] = useState<string>("");
  const [userInputDifficulty, setUserInputDifficulty] = useState<number>(1);
  const [userSelectedCourses, setUserSelectedCourses] = useState<TechCourse[]>([]);
  const [userInputCourseCode, setUserInputCourseCode] = useState<string>("");
  const [userInputCourseName, setUserInputCourseName] = useState<string>("");

  // handle when a checkbox is checked or umchecked. 
  const handleCheckbox = (e: any, course: Course) => {
    let coursesChecked: TechCourse[] = userSelectedCourses;
    //if checked push it to technologies  courses 
    if (e.target.checked) {
      coursesChecked.push({
        code: course.courseCode,
        name: course.courseName
      })
    } else {
      // loop thorugh array and find the web Code and remove that element fromt he array. (it changes from checked to not checked)
      for (let i = 0; coursesChecked.length > i; i++) {
        //if codes match remove item
        if (course.courseCode === userSelectedCourses[i].code) {
          coursesChecked.splice(i, 1);
          break;
        }

      }
    }
    setUserSelectedCourses(coursesChecked);
  }

  // when the okay button is clicked to creaste an item, sturns on loading overlay, creates JSON Object besed off if its a technolgoy or a course, and then send JSON to the DB turns off loading overlay and goes bacxk to the main page.
  const onCreate = async (e: any) => {
    setShowOverlay(true);
    let item: Course | Technology;
    // console.log(userInputName);
    // console.log(userInputDescriptionBox);
    // console.log(userInputDifficulty);
    // console.log(userSelectedCourses);
    // console.log(userInputCourseCode);
    // console.log(userInputCourseName);

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
    let sendURL = `/api/${type}`;
    await sendJSONData(sendURL, "POST", item, () => console.log("success"), (error: Error) => console.log(`*** An error has occured: ${error.message}`), true);
    // set time out for 1 second to test and see overlay.
    setTimeout(() => {
      setShowOverlay(false);
      router.replace("/")
    }, 1000);
  }

  // checks is required input exisits technologies name and discription are required, course code and name are required (used to toggle the ok button)
  const fieldCheck = () => {
    if (type === "technologies") {
      return userInputName === "" || userInputDescriptionBox === "";
    }

    // check exsisting course codes if the same one already exsists They cannot use the same one.
    for (let i = 0; i < courses.length; i++) {
      if (courses[i].courseCode === userInputCourseCode) {
        return true;
      }
    }
    return userInputCourseCode === "" || userInputCourseName === "";
  }

  // if the click cancel it take tthem bacxk to the main page.
  const onCreateCancel = (e: any) => {
    router.replace("/");
  }

  return (
    // ---------------------------------- render to the DOM
    <main>
      {/* loading underlay component. */}
      < LoadingOverlay
        color={"#FFFFFF"}
        showSpinner={true}
        bgColor={"#428BCA"}
        showOverlay={showOverlay}
      />

      {
        type === "technologies" ?
          <div className="pt-2" >
            <div className="font-bold" > Add New Technology: </div>

            <div className="pt-6 pb-4" >
              <div className="font-bold pb-1">
                <label htmlFor="technologyName" > Name: </label>
              </div>
              <div className="pt-1" >
                <input type="text" id="technologyName" placeholder="Technology Name" className="p-1 border-0 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 w-72" value={userInputName} onChange={(e: any) => { setUserInputName(e.target.value) }} />
              </div>
            </div>

            <div>
              <div className="font-bold pt-4">
                <label htmlFor="TechnologyDescription" className="pt3.5 pb-1" > Description: </label>
              </div>
              <div className="pt-1" >
                <textarea id="technologyDescription" className="p-1 border-0 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 w-72 h-48 mb-3.5 resize-none" placeholder="Enter Technology Description" value={userInputDescriptionBox} onChange={(e: any) => { setUserInputDescriptionBox(e.target.value) }}>
                </textarea>
              </div>
            </div>

            <div>
              <div className="font-bold pt-4 pb-1" >
                <label htmlFor="difficultySelect" > Difficulty: </label>
              </div>
              <select id="difficultySelect" className="border ring-1" value={userInputDifficulty} onChange={(e: any) => { setUserInputDifficulty(e.target.value) }} >
                <option value="1" > 1 </option>
                <option value="2" > 2 </option>
                <option value="3" > 3 </option>
                <option value="4" > 4 </option>
                <option value="5" > 5 </option>
              </select>
            </div>

            <div className="font-bold pt-6 pb-1" > Used in Courses: </div>
            {
              courses.map((course: Course, n: number) =>
                <div key={n} className="pl-2.5 py-0.5" >
                  <input type="checkbox" value={`${course.courseCode} ${course.courseName}`} onChange={(e: any) => { handleCheckbox(e, course) }} />
                  <span className="pl-2">{`${course.courseCode} ${course.courseName}`}</span>
                </div>
              )
            }
          </div>
          :
          <div className="pt-2 pb-4" >
            <div className="font-bold" > Add New Course: </div>

            <div className="pt-2" >
              <label htmlFor="CourseCode" > Course Code: </label>
              <div className="pt-1" >
                <input type="text" value={userInputCourseCode} id="CourseCode" placeholder="Course Code" className="p-1 border-0 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 w-72" onChange={(e: any) => { setUserInputCourseCode(e.target.value) }} />
              </div>
            </div>

            <div className="pt-2 pb-2" >
              <label htmlFor="CourseName" > Name: </label>
              <div className="pt-1" >
                <input type="text" value={userInputCourseName} id="CourseName" placeholder="Course Name" className="p-1 border-0 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 w-72" onChange={(e: any) => { setUserInputCourseName(e.target.value) }} />
              </div>
            </div>

          </div>
      }

      <div className="flex flex-row pt-6">
        <div className="pr-4" >
          <button id="btnOK" className="bg-lime-700 border-0 ring-1 rounded text-white cursor-pointer w-24 py-2 hover:bg-lime-500 disabled:bg-greyed-out disabled:cursor-not-allowed" onClick={onCreate} disabled={fieldCheck()}> OK </button>
        </div>
        < div >
          <button className="bg-lime-700 border-0 ring-1 rounded text-white cursor-pointer w-24 py-2 hover:bg-lime-500" onClick={onCreateCancel}> Cancel </button>
        </div>
      </div>
    </main >
  );
}

// gets all possibles paths at pre render
export async function getStaticPaths() {
  const paths: Object[] = [
    {
      params: {
        type: "technologies"
      }
    },
    {
      params: {
        type: "courses"
      }
    }
  ];


  return { paths, fallback: false };
}

// gets my data.
export async function getStaticProps({ params }: { params: { type: string } }) {
  let courses: Course[] = await getCourses();

  return {
    props: {
      courses: courses,
    }
  }
}