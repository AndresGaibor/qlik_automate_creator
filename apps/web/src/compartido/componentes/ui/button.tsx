import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import { cloneElement, forwardRef, isValidElement } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "default",
      size = "default",
      className = "",
      asChild = false,
      children,
      ...props
    },
    ref,
  ) {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50";

    const variantStyles = {
      default:
        "bg-[var(--color-brand-600)] text-white hover:bg-[var(--color-brand-700)] shadow-sm",
      outline:
        "border border-[var(--color-line-200)] bg-[var(--color-surface)] text-[var(--color-ink-900)] hover:bg-[var(--color-hover)] hover:border-[var(--color-line-300)]",
      ghost:
        "text-[var(--color-ink-700)] hover:bg-[var(--color-hover)] hover:text-[var(--color-ink-900)]",
      destructive: "bg-[var(--color-danger-600)] text-white hover:opacity-90",
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
      const child = children as ReactElement<{
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
        ref={ref}
        className={composedClassName}
        {...Object.fromEntries(
          Object.entries(props).filter(([key]) => key !== "asChild"),
        )}
      >
        {children}
      </button>
    );
  },
);
