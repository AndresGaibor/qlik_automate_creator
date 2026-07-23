import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cloneElement, isValidElement } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "default",
  size = "default",
  className = "",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50";

  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-100",
    ghost: "hover:bg-gray-100",
  };

  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-6",
  };

  const composedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  // Si asChild es true, renderiza el hijo directamente con los estilos aplicados
  // sin pasar asChild al DOM
  if (asChild && isValidElement(children)) {
    const child = children as React.ReactElement<{
      className?: string;
      [key: string]: unknown;
    }>;
    return cloneElement(child, {
      className: `${child.props.className || ""} ${composedClassName}`.trim(),
      ...Object.fromEntries(
        Object.entries(props).filter(([key]) => key !== "asChild"),
      ),
    });
  }

  return (
    <button
      className={composedClassName}
      {...Object.fromEntries(
        Object.entries(props).filter(([key]) => key !== "asChild"),
      )}
    >
      {children}
    </button>
  );
}
