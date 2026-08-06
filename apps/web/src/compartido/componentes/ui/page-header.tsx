import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-line-200 pb-5 sm:flex-row sm:gap-6">
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-3xl text-sm leading-6 text-ink-500">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div
          data-page-actions
          className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end"
        >
          {actions}
        </div>
      )}
    </header>
  );
}
