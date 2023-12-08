import Link from "next/link";
import { ListProps, Technology, TechProps } from "@/tools/technology.model";
import { Course, CourseProps } from "@/tools/course.model";
import { getDisplayName } from "next/dist/shared/lib/utils";
import { useEffect } from "react";

export function List({ type, items }: ListProps) {

  // for display headers above list.
  const getDisplayHeader = () => {
    if (type === "technologies") {
      return "Technologies";
    }

    return "Courses"
  }

  // for each item it returns the name, or code and name depending if its atechnology or a course. 
  const getDisplayName = (item: Course | Technology) => {
    if (type === "technologies") {
      return (item as Technology).name
    }

    return `${(item as Course).courseCode} ${(item as Course).courseName}`;
  }

  return (
    <div className="flex flex-wrap">
      <div className="flex flex-col flex-nowrap pr-5">
        <div className="py-4 font-bold">
          {getDisplayHeader()}:
        </div>

        <div className="ml-4 pl-2.5 py-0.5 border-l-4 border-solid border-accent">
          {/* adding the plus icon and its url for the create for, doing this outside the map cause each only needs one */}
          <Link
            href={`/${type}/create`}>
            <i className="ml-2 fa-solid fa-plus"></i>
          </Link>

          {/* maping over courses or technologies and adding the pencil and delete icons and their urls. */}
          {items.map((item: Course | Technology, n: number) => {
            return (
              <div key={n} className="ml-2">

                <Link
                  href={`/${type}/update/${item._id}`}>
                  <i className="pr-4 fa-solid fa-pencil"></i>
                </Link>

                <Link
                  href={`/${type}/delete/${item._id}`}>
                  <i className="pr-4 fa-solid fa-trash"></i>
                </Link>

                {/* displays name or course code and course name  */}
                {getDisplayName(item)}

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}