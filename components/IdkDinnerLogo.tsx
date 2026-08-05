interface IdkDinnerLogoProps {
  className?: string;
}

export default function IdkDinnerLogo({ className = "" }: IdkDinnerLogoProps) {
  return (
    <svg
      viewBox="0 0 900 520"
      role="img"
      aria-labelledby="idk-dinner-logo-title idk-dinner-logo-description"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="idk-dinner-logo-title">IDK Dinner</title>
      <desc id="idk-dinner-logo-description">
        IDK Dinner logo with a fork inside the letter D and the tagline What
        should we eat tonight?
      </desc>

      <g fill="#082B5C" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900">
        <text x="54" y="255" fontSize="250">
          I
        </text>
        <text x="205" y="255" fontSize="250">
          D
        </text>
        <text x="490" y="255" fontSize="250">
          K
        </text>
      </g>

      <g fill="#FFFFFF" aria-hidden="true">
        <rect x="306" y="83" width="15" height="96" rx="7.5" />
        <rect x="331" y="83" width="15" height="96" rx="7.5" />
        <rect x="356" y="83" width="15" height="96" rx="7.5" />
        <rect x="381" y="83" width="15" height="96" rx="7.5" />
        <path d="M306 150H396V177C396 209 378 229 359 240V273H343V240C324 229 306 209 306 177V150Z" />
      </g>

      <text
        x="694"
        y="255"
        fill="#FF6500"
        fontFamily="Arial Black, Arial, sans-serif"
        fontSize="230"
        fontWeight="900"
      >
        ?
      </text>

      <text
        x="62"
        y="402"
        fill="#FF6500"
        fontFamily="Arial Black, Arial, sans-serif"
        fontSize="128"
        fontWeight="900"
        letterSpacing="16"
      >
        DINNER
      </text>

      <g fill="#082B5C" aria-hidden="true">
        <rect x="56" y="462" width="70" height="9" rx="4.5" />
        <rect x="774" y="462" width="70" height="9" rx="4.5" />
      </g>

      <text
        x="450"
        y="478"
        textAnchor="middle"
        fill="#082B5C"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="31"
        fontWeight="800"
        letterSpacing="1.5"
      >
        WHAT SHOULD WE EAT TONIGHT?
      </text>
    </svg>
  );
}
