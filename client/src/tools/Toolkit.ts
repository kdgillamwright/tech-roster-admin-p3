// randomly generates a number between the range of low and high
function getRandom(low: number = 1, high: number = 10) {
  let randomNumber: number;
  // calculate random number
  randomNumber = Math.round(Math.random() * (high - low)) + low;
  // returning value
  return randomNumber;
}

function addKey(functionToCall: Function, myKeyCode: string = "Enter") {
  // this example exposes issue with scoping and event handlers and how it is solved with arrow function

  // wire up event listener
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    // is the key released the provided key? Check keyCode via Event object
    if (e.code === myKeyCode) {
      // pressing the enter key will force some browsers to refresh
      // this command stops the event from going further
      e.preventDefault();
      // call provided callback to do everything else that needs to be done
      functionToCall();
      // this also helps the event from propagating in some browsers
      return false;
    }
  });
}

// ------------------------------------ challenge solution
async function getJSONData(retrieveScript: string, success?: Function, failure?: Function) {
  if (success !== undefined && failure !== undefined) {
    fetch(retrieveScript)
      .then((response: Response) => response.json())
      .then((data: any) => success(data))
      .catch((error: Error) => failure(error.message));
  } else {
    try {
      const response: Response = await fetch(retrieveScript);
      const data: any = await response.json();
      return data;
    } catch (error: any) {
      console.log(`>>> FETCH ERROR: ${error.message}`);
      return null;
    }
  }
}
// -------------------------------------------------------

function sendJSONData(sendURL: string, sendMethod: string, sendJSON: any, success: Function, failure: Function, debug: boolean = false) {
  fetch(sendURL,
    {
      method: sendMethod,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(sendJSON)
    })
    .then((response: Response) => response.text())
    .then((responseText: string) => success(responseText))
    .catch((error: Error) => {
      failure(error);
      if (debug) throw error;
    });
}


function deleteJSONData(deleteURL: string) {
  fetch(deleteURL,
    {
      method: "DELETE",
    })
}

export { getRandom, addKey, getJSONData, sendJSONData, deleteJSONData };