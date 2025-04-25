import { ClipLoader } from "react-spinners";

export default function LoadingScreen() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%", // Full screen height
        width:"100%"
      }}
    >
      <ClipLoader color="#36d7b7" size={60} />
    </div>
  );
}
