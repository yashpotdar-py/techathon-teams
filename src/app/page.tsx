import Image from "next/image";
import Cell from "./components/Cell";

export default function Home() {
  return (
    <div>
    <div className="heading-container">
      <h1 className="heading">
        Techathon <span className="highlight">&apos;25</span>
      </h1>
    </div>
      <Cell />
    </div>
  );
}
