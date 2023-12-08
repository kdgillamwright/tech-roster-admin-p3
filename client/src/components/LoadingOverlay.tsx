import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { LoadingOverlay } from "../tools/loadingOverlay";
import { SpinnerCircular } from "spinners-react";

export default function LoadingOverlay({ color, showSpinner, bgColor, showOverlay }: LoadingOverlay) {

  return (
    //add tailwind styling, conditionalclass and ternaray.
    <div className={`absolute w-full h-full m-auto p-0 bg-gray-900 inset-x-0 inset-y-0 justify-center items-center ${showOverlay ? "flex" : "hidden"}`} style={{ backgroundColor: bgColor }}>
      <SpinnerCircular
        color={color}
        enabled={showSpinner}
      />
    </div>
  )
}