import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <h2>Other pages :</h2>
      <ul>
        <li>
          <Link href="/about">
            <p>About</p>
          </Link>
        </li>
        <li>
          <Link href="/contact">
            <p>Contact</p>
          </Link>
        </li>
        <li>
          <Link href="/blog">
            <p>Blog</p>
          </Link>
        </li>
        <li>
          <Link href="/portfolio">
            <p>Portfolio</p>
          </Link>
        </li>
      </ul>
    </div>
  );
}
