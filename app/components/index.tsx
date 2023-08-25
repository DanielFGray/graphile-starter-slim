import React from "react";
import { ensureArray } from "~/lib";
import { FromMarkdown } from "./postformatter";

export * from "./Layout";
export * from "./Post";
export * from "./Editor";

type ElementType<P> = string | ((a: P) => React.ReactNode);

export function Card<T>({
  children,
  className,
  as: As = "div",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  as?: ElementType<T>;
} & React.ComponentPropsWithoutRef<T>) {
  return (
    <As
      className={clsx("bg-gray-100 p-4 shadow-md dark:bg-gray-700 dark:text-primary-50", className)}
      {...props}
    >
      {children}
    </As>
  );
}

export function Container({
  children,
  className,
  as: As = "div",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <As className={clsx("flex flex-col gap-4", className)} {...props}>
      {children}
    </As>
  );
}

export function Danger({
  children,
  as: As = "span",
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <As className={clsx("text-red-700", className)} {...props}>
      {children}
    </As>
  );
}

export function Button({
  className,
  variant = "default",
  children,
  ...props
}: { variant?: "danger" | "primary" | "default" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        variant === "primary"
          ? "bg-primary-600 text-primary-100 hover:bg-primary-500"
          : variant === "danger"
          ? "bg-red-100 text-red-900 hover:bg-red-200"
          : "bg-primary-200 text-primary-900 hover:bg-primary-100",
        `
          rounded
          border-0
          p-2
          font-semibold
          shadow-sm
          transition-all
          hover:-translate-y-px
          hover:shadow-lg
          focus:translate-x-0
          focus:outline-primary-700
          focus:ring-1
          focus:ring-primary-700
        `
          .trim()
          .replace(/\s+/g, " "),
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Input({
  className,
  ...props
}:
  | React.InputHTMLAttributes<HTMLInputElement>
  | ({
      type: "textarea";
    } & React.TextareaHTMLAttributes<HTMLTextAreaElement>)) {
  const commonClasses = clsx(
    `
    w-full
    rounded
    border-0
    bg-primary-50
    text-sm
    shadow-md
    outline
    outline-1
    outline-primary-300
    hover:outline-primary-400
    focus:shadow-none
    focus:ring-2
    focus:ring-inset
    focus:ring-primary-400
    dark:bg-primary-600
    dark:text-primary-100
    dark:outline-primary-500
    dark:placeholder:text-primary-400
    dark:hover:outline-primary-400
  `.replace(/\s+/g, " "),
  );
  return props.type ===
    "textarea" /* @ts-expect-error polymorphism is a pain to type properly */ ? (
    <textarea {...props} className={clsx("form-textarea", commonClasses, className)} />
  ) : (
    /* @ts-expect-error polymorphism is a pain to type properly */
    <input {...props} className={clsx("form-input block", commonClasses, className)} />
  );
}

export function Legend<T>({
  className = "",
  as: As = "legend",
  ...props
}: {
  as?: ElementType<T>;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>) {
  return (
    /* @ts-expect-error polymorphism is a pain to type properly */
    <As
      className={clsx(
        "-rotate-1 -skew-y-1 p-2 font-medium italic shadow-md",
        !/\btext-/.test(className) && "text-primary-800",
        !/\bbg-/.test(className) && "bg-primary-100",
        className,
      )}
      {...props}
    >
      {props.children}
    </As>
  );
}

export function FormErrors(props: {
  errors?: null | React.ReactNode | string | Error | Array<string | Error>;
}) {
  if (!props.errors) return null;
  const errs = ensureArray(props.errors);
  return (
    <Container>
      {errs.map(err => {
        const msg = err instanceof Error ? err.message : err;
        return (
          <Danger as="div" key={msg}>
            {msg}
          </Danger>
        );
      })}
    </Container>
  );
}

export function FormRow({
  label,
  children,
  className,
  as: As = "label",
}: {
  label?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  as?: ElementType<T>;
} & React.ComponentPropsWithoutRef<T>) {
  return (
    <As className={clsx("flex flex-col sm:flex-row sm:items-center", className)}>
      {label && <span className="sm:w-5/12">{label}</span>}
      <span className={clsx(label && "sm:w-7/12")}>{children}</span>
    </As>
  );
}

/**
 * Sort of like the
 `classnames` module, but a bit simpler
 * @param {...Array<any>} args
 * @returns {string} string
 */
export function clsx(...args: Array<any>): string {
  const classes: Array<string> = [];

  for (const arg of args) {
    if (!arg) continue;

    if (typeof arg === "string" || typeof arg === "number") {
      classes.push(arg.toString());
    } else if (Array.isArray(arg) && arg.length) {
      const inner = clsx(...arg);

      if (inner) {
        classes.push(inner);
      }
    } else if (typeof arg === "object") {
      for (const key in arg) {
        if ({}.hasOwnProperty.call(arg, key) && arg[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(" ");
}

export function Stringify<T>(props: T) {
  return <pre>{JSON.stringify(props, null, 2)}</pre>;
}

const SocialLoginServices = ["GitHub"];
export function SocialLogin({
  label,
  redirectTo,
}: {
  redirectTo?: string;
  label: string | ((service: string) => string);
}) {
  if (SocialLoginServices.length < 1) return null;
  return (
    <div className="flex flex-col gap-4 items-center">
      {SocialLoginServices.map(service => (
        <Button variant="primary" key={service}>
          <a
            href={`/auth/${service.toLowerCase()}${
              redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""
            }`}
          >
            {typeof label === "function" ? label(service) : `${label} with ${service}`}
          </a>
        </Button>
      ))}
    </div>
  );
}

export function UserContent(props: {
  editable: true;
  onClick: () => void;
  text: string;
} | {
  text: string;
}) {
  if ("editable" in props && props.editable) {
    return (
      <button className="group background-transparent text-left" onClick={props.onClick}>
        <div className="cursor-pointer group-hover:outline-2 prose dark:prose-invert group-hover:outline group-hover:outline-primary-300 dark:group-hover:outline-primary-500 rounded p-2">
          <FromMarkdown source={props.text} />
        </div>
        <div className="group-hover:visible invisible relative -top-3 left-2">
          <span className="px-1 rounded dark:text-primary-900 text-primary-800 z-10 dark:bg-primary-500 bg-primary-300 text-xs">
            edit
          </span>
        </div>
      </button>
    );
  }
  return (
    <div className={clsx("prose dark:prose-invert max-w-max max-h-[70vh] overflow-auto")}>
      <FromMarkdown source={props.text} />
    </div>
  );
}
