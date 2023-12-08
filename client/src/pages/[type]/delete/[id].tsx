import LoadingOverlay from '@/components/LoadingOverlay';
import { getCourses, getData, getTechnologies } from '@/tools/DataManager';
import { deleteJSONData } from '@/tools/Toolkit';
import { Course } from '@/tools/course.model';
import { Technology } from '@/tools/technology.model';
import { NextRouter, useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Delete({ item }: { item: Course | Technology }) {
  const router: NextRouter = useRouter();
  const { type, id } = router.query;

  // state vars
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  // when you click okay ont the delete the loading overlay is shown, 
  const onDelete = (e: any) => {
    setShowOverlay(true);
    deleteJSONData(`/api/${type}/${id}`);
    // set time out for 1 second to test and see overlay.
    setTimeout(() => {
      setShowOverlay(false);
      router.replace("/");
    }, 1000);
  }


  // if they click cancel trhey go back to the main page.
  const onDeleteCancel = (e: any) => {
    router.replace("/");
  }

  // DYNAMICALLY CHANGING course or technology for delete warning confrimation.
  const getTypeDisplay = () => {
    if (type === "technologies") return "technology"

    return "course"
  }


  // displaying selected item name and or course code and course namme dynamically for delete warning conmfirmation
  const getNameDisplay = () => {
    if (type === "technologies") {
      return (item as Technology).name
    }

    return `${(item as Course).courseCode} ${(item as Course).courseName}`;
  }

  return (
    <main>
      {/* loading underlay component. */}
      <LoadingOverlay
        color={"#FFFFFF"}
        showSpinner={true}
        bgColor={"#428BCA"}
        showOverlay={showOverlay}
      />
      <div>
        <div>Are you sure you want to delete the following {getTypeDisplay()}?</div>
        <div>{getNameDisplay()}</div>
        <div className="flex flex-row mt-4">
          <div>
            <button className="bg-lime-700 border-0 ring-1 rounded text-white cursor-pointer w-24 py-2 hover:bg-lime-500" onClick={onDelete}>OK</button>
          </div>
          <div className="ml-4">
            <button className="bg-lime-700 border-0 ring-1 rounded text-white cursor-pointer w-24 py-2 hover:bg-lime-500" onClick={onDeleteCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </main>
  )
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

export async function getStaticProps({ params }: { params: { id: string, type: string } }) {
  let data: Technology[] | Course[]
  let item: Technology | Course | undefined;

  if (params.type === "technologies") {
    data = await getTechnologies();
    item = data.find(item => item._id == params.id);
  } else {
    data = await getCourses();
    item = data.find(item => item._id == params.id);
  }

  return {
    props: {
      item: item,
    }
  }
}