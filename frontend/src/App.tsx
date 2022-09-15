import { test } from "@shadowrun/common/build/index.js";
import { ExampleSchema } from "@shadowrun/common/build/types.js";
import type { Example } from "@shadowrun/common/build/types.js";
import Forum from "./components/Forum.js";
console.log(test);

function App() {
  fetch("/api/example")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const typeCheckedExample = ExampleSchema.safeParse(data);
      if (typeCheckedExample.success) {
        const exampleVar: Example = typeCheckedExample.data;
        console.log(exampleVar.example);
      } else console.error("Res failed typecheck: " + JSON.stringify(data));
    })
    .catch((error) => {
      console.log(error);
    });

  return <Forum />;
}

export default App;
