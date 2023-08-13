import Link from "next/link"

interface LogoProps {
  width?: number
  height?: number
}

const LogoSvg = ({ width, height }: LogoProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 100 89"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_516_99)">
      <rect width="99.3731" height="88.3731" fill="black" />
      <circle cx="49.6866" cy="44.149" r="11.6866" fill="#8759F2" />
      <circle cx="49.6866" cy="76.6866" r="11.6866" fill="#8759F2" />
      <circle cx="49.6866" cy="11.6866" r="11.6866" fill="white" />
      <circle cx="17.6866" cy="43.6866" r="11.6866" fill="#8759F2" />
      <circle cx="17.6866" cy="75.6866" r="11.6866" fill="white" />
      <circle cx="17.6866" cy="11.6866" r="11.6866" fill="#8759F2" />
      <circle cx="81.6866" cy="75.6866" r="11.6866" fill="white" />
      <circle cx="81.6866" cy="43.6866" r="11.6866" fill="#8759F2" />
      <circle cx="81.6866" cy="11.6866" r="11.6866" fill="#8759F2" />
    </g>
    <defs>
      <clipPath id="clip0_516_99">
        <rect width="99.3731" height="88.3731" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    hover: {
      color: "rgba(255, 255, 255, 0.7)",
    },
  },
}

const Logo = (props: LogoProps) => (
  <Link href="/" style={styles.container}>
    <LogoSvg {...props} />
  </Link>
)

export default Logo
