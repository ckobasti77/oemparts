import type { SVGProps } from "react";

/**
 * Tri Phosphor ikone (MIT) samo u težini „regular“, za primitive koje koristi i klijentski kod
 * (polja forme, dugme-link). Phosphor komponenta nosi svih šest težina, pa bi forma upita bila
 * iznad budžeta početnog JS-a (ODLUKA K05). Putanje su iste kao u paketu, izgled se ne menja.
 */
type IkonaProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: number | string };

function Ikona({ size = "1em", d, ...rest }: IkonaProps & { d: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256" {...rest}>
      <path d={d} />
    </svg>
  );
}

export function CaretDownIcon(props: IkonaProps) {
  return (
    <Ikona
      d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"
      {...props}
    />
  );
}

export function WarningCircleIcon(props: IkonaProps) {
  return (
    <Ikona
      d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"
      {...props}
    />
  );
}

export function ArrowUpRightIcon(props: IkonaProps) {
  return (
    <Ikona
      d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"
      {...props}
    />
  );
}
