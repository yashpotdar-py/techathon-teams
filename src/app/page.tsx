import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="heading-container">
        <h1 className="heading">
          Techathon <span className="highlight">2.0</span>
        </h1>
      </div>
      <div className="description-container">
        <p className="description">Welcome to Techathon 2.0</p>
        <p className="description">
          <span className="highlight">Join us</span> for a series of intense
          coding challenges where{" "}
          <span className="highlight">only the best will prevail</span>. Will
          you be the one to <span className="highlight">claim victory</span> and
          emerge as the <span className="highlight">ultimate team</span>?
        </p>
      </div>
      <div className="link-container">
        <Link href="/grid" className="grid-link">
          Enter the Grid
        </Link>
      </div>
    </div>
  );
}
