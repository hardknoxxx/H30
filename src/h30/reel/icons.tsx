import React from "react";
import { colors } from "../brand";

// Íconos al estilo del manual: círculo naranja, glifo blanco plano y redondeado.
const Disc: React.FC<{ size: number; children: React.ReactNode; bg?: string }> = ({
  size,
  children,
  bg = colors.orange,
}) => (
  <svg width={size} height={size} viewBox="0 0 85 85">
    <circle cx="42.5" cy="42.5" r="42.5" fill={bg} />
    <g fill="#fff" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </g>
  </svg>
);

export const CartIcon: React.FC<{ size: number }> = ({ size }) => (
  <Disc size={size}>
    <path d="M17 24h8l6 26h28l5-18H28" fill="none" strokeWidth={5} />
    <circle cx="34" cy="60" r="4.5" stroke="none" />
    <circle cx="55" cy="60" r="4.5" stroke="none" />
  </Disc>
);

export const PayIcon: React.FC<{ size: number }> = ({ size }) => (
  <Disc size={size}>
    <rect x="17" y="26" width="51" height="34" rx="6" stroke="none" />
    <rect x="17" y="33" width="51" height="7" fill={colors.orange} stroke="none" />
    <rect x="23" y="47" width="14" height="5" rx="2.5" fill={colors.orange} stroke="none" />
  </Disc>
);

export const BagIcon: React.FC<{ size: number }> = ({ size }) => (
  <Disc size={size}>
    <path d="M20 32h45l-4 32a4 4 0 0 1-4 3.5H28a4 4 0 0 1-4-3.5z" stroke="none" />
    <path d="M33 37v-8a9.5 9.5 0 0 1 19 0v8" fill="none" strokeWidth={4.5} />
  </Disc>
);

export const PinIcon: React.FC<{ size: number }> = ({ size }) => (
  <Disc size={size}>
    <path
      d="M42.5 16c-10 0-18 7.6-18 17.5C24.5 46 42.5 69 42.5 69S60.5 46 60.5 33.5C60.5 23.6 52.5 16 42.5 16z"
      stroke="none"
    />
    <circle cx="42.5" cy="33" r="7" fill={colors.orange} stroke="none" />
  </Disc>
);

export const InstagramIcon: React.FC<{ size: number }> = ({ size }) => (
  <Disc size={size}>
    <rect x="20" y="20" width="45" height="45" rx="13" fill="none" strokeWidth={5} />
    <circle cx="42.5" cy="42.5" r="10.5" fill="none" strokeWidth={5} />
    <circle cx="55.5" cy="29.5" r="3.2" stroke="none" />
  </Disc>
);

export const WhatsAppIcon: React.FC<{ size: number }> = ({ size }) => (
  <Disc size={size}>
    <path
      d="M42.5 17a25 25 0 0 0-21.6 37.6L18 67l12.8-3a25 25 0 1 0 11.7-47z"
      fill="none"
      strokeWidth={4.5}
    />
    <path
      d="M33 31c1-1.5 3-1.6 3.8 0l2.6 5c.5 1 .2 2.2-.6 3l-1.8 1.6c1.8 3.8 4.6 6.6 8.4 8.4l1.6-1.8c.8-.8 2-1.1 3-.6l5 2.6c1.6.8 1.5 2.8 0 3.8-2.4 1.8-5.4 2.6-8.4 1.6-7.2-2.4-13-8.2-15.4-15.4-1-3 .2-6 1.8-8.2z"
      stroke="none"
    />
  </Disc>
);

export const HelpIcon: React.FC<{ size: number }> = ({ size }) => (
  <Disc size={size}>
    <path d="M18 24h49a5 5 0 0 1 5 5v22a5 5 0 0 1-5 5H38l-12 10v-10h-8a5 5 0 0 1-5-5V29a5 5 0 0 1 5-5z" stroke="none" />
    <circle cx="31" cy="40" r="3.6" fill={colors.orange} stroke="none" />
    <circle cx="42.5" cy="40" r="3.6" fill={colors.orange} stroke="none" />
    <circle cx="54" cy="40" r="3.6" fill={colors.orange} stroke="none" />
  </Disc>
);
