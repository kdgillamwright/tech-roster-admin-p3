import { Technology } from "./../tools/data.model";
import { getTechnologies } from "../tools/DataManager";

export default function Home({technologies}:{technologies: Technology[]}) {
  
  return (
    <div className="font-bold text-sm p-4">
      <pre>
        {JSON.stringify(technologies, null, "\t")}
      </pre>
    </div>
  )
}

export async function getStaticProps() {
  return {
    props: {
      technologies: await getTechnologies()
    }
  } 
}
