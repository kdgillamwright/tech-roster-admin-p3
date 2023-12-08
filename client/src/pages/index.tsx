import { Technology } from "../tools/technology.model";
import { getData } from "../tools/DataManager";
import { Course } from "@/tools/course.model";
import Link from "next/link";
import { List } from "@/components/List";
import { useEffect } from "react";
import { NextRouter, useRouter } from "next/router";

export default function Home({ technologies, courses }: { technologies: Technology[], courses: Course[] }) {
  return (
    <>
      <div className="flex flex-row flex-wrap">
        {
          //handling no technologies.
          (technologies.length > 0) ?
            <List type="technologies" items={technologies} />
            :
            <>There are currently no technologies in the database :(</>
        }

        {
          // handling no courses
          (courses.length > 0) ?
            <List type="courses" items={courses} />
            :
            <>There are currently no courses in the database :(</>
        }
      </div>
    </>
  )
}

//getting data
export async function getStaticProps() {
  const data = await getData()
  return {
    props: {
      technologies: data.technologies,
      courses: data.courses
    }
  }
}
