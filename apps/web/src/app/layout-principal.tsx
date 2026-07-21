import type { ReactNode } from "react";

interface LayoutPrincipalProps {
  children?: ReactNode;
}

export function LayoutPrincipal({ children }: LayoutPrincipalProps) {
  return (
    <div className="layout-principal">
      <header>
        <h1>Qlik Automatizaciones</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
