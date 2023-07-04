import React, { useState, useCallback, useContext } from "react";
import { ensureArray, extractError, getCodeFromError, uniq } from "../lib";

export * from "./Layout";

type ElementType<P> = string | ((a: P) => React.ReactNode);

export function Card<T = "div">({
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
      className={clsx("bg-gray-100 rounded p-4 shadow-md dark:bg-gray-700 dark:text-primary-50", className)}
      {...props}
    >
      {children}
    </As>
  );
}

export function Container<T>({
  children,
  className,
  as: As = "div",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  as?: ElementType<T>;
}) {
  return (
    <As className={clsx("flex flex-col gap-4 px-4", className)} {...props}>
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

const buttonVariants = {
  primary: "bg-primary-600 text-primary-100 hover:bg-primary-500",
  danger: "bg-red-100 text-red-900 border border-red-300 hover:bg-red-200",
  default: "bg-primary-200 text-primary-900 hover:bg-primary-100",
} as const;

export function Button({
  className,
  variant = "default",
  ...props
}: { variant?: keyof typeof buttonVariants } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        buttonVariants[variant],
        `
          rounded
          border-0
          p-2
          font-semibold
          shadow
          hover:-translate-y-px
          hover:shadow-lg
          focus:translate-x-0
          focus:outline-primary-700
          focus:ring-1
          focus:ring-primary-700
          dark:bg-primary-500
          dark:text-primary-50
        `.replace(/\s+/g, " "),
        className,
      )}
    >
      {props.children}
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
  const commonClasses = `
    bg-primary-50
    border-0
    dark:bg-primary-600
    dark:hover:outline-primary-400
    dark:outline-primary-500
    dark:placeholder:text-primary-400
    dark:text-primary-100
    focus:ring-2
    focus:ring-inset
    focus:ring-primary-400
    focus:shadow-none
    hover:outline-primary-400
    outline
    outline-1
    outline-primary-300
    rounded
    shadow-md
    text-sm
    w-full
  `.replace(/\s+/g, " ");
  return props.type ===
    "textarea" /* @ts-expect-error polymorphism is a pain to type properly */ ? (
    <textarea {...props} className={clsx("form-textarea", commonClasses, className)}>
      {props.value}
    </textarea>
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
    <As
      className={clsx(
        "-rotate-1 -skew-y-1 p-2 font-medium italic shadow-md",
        !/\btext-/.test(className) && "text-primary-800",
        !/\bbg-/.test(className) && "bg-primary-50",
        "dark:bg-primary-600 dark:text-primary-100",

        className,
      )}
      {...props}
    >
      {props.children}
    </As>
  );
}

const formCtx = React.createContext<
  | {
      setErrors(a: Array<string> | null): void;
      errors: Array<string> | null | undefined;
    }
  | undefined
>(undefined);

export function Form({
  children,
  onSubmit,
  ...props
}: {
  children: React.ReactNode | ((props: { errors: Array<string> | null }) => React.ReactNode);
  onSubmit: (args: {
    event: React.FormEvent<HTMLFormElement>;
    setErrors: (err: Error | null | string | Array<string>) => void;
    values: Record<string, any>;
  }) => Promise<void> | void;
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "children">) {
  const [errors, _setErrors] = useState<null | Array<string>>();
  const setErrors = useCallback((str: Error | null | string | Array<string>) => {
    _setErrors(s => {
      if (str == null) return null;
      return (s || []).concat(str instanceof Error ? str.message : str);
    });
  }, []);

  return (
    <formCtx.Provider value={{ setErrors, errors }}>
      <form
        {...props}
        onSubmit={async event => {
          event.preventDefault();
          setErrors(null);
          const values: Record<string, string | File> = {};
          for (const [k, x] of new FormData(event.currentTarget)) {
            values[k] = values[k] ? [].concat(values[k], x) : x;
          }
          try {
            await onSubmit({ event, values, setErrors });
          } catch (err) {
            const code = getCodeFromError(err);
            switch (code) {
              case "CREDS":
                setErrors("Incorrect username or password");
                break;
              case "MODAT":
                setErrors("Email is required");
                break;
              case "WEAKP":
                setErrors("Password is too weak or too common, please make it stronger");
                break;
              case "EMTKN":
                setErrors(
                  "An account with this email address has already been registered, consider using the 'Forgot passphrase' function.",
                );
                break;
              case "NUNIQ":
                setErrors(
                  "An account with this username has already been registered, please try a different username.",
                );
                break;
              default:
                throw extractError(err);
            }
          }
        }}
      >
        {typeof children === "function" ? children({ errors }) : children}
      </form>
    </formCtx.Provider>
  );
}

export function FormErrors(props: { errors?: null | string | Array<string> }) {
  const ctx = useContext(formCtx);
  if (!(ctx?.errors || props.errors)) return null;
  const errs = uniq(ensureArray(ctx?.errors).concat(ensureArray(props.errors)));
  return errs.map(err => (
    <Danger as="div" key={err}>
      {err}
    </Danger>
  ));
}

export function FormRow({
  label,
  children,
}: {
  label?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col sm:flex-row sm:items-center">
      {label && <span className="sm:w-5/12">{label}</span>}
      <span className={clsx(label && "sm:w-7/12")}>{children}</span>
    </label>
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

export function Stringify(data) {
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

const SocialLoginServices = ["GitHub"];
export function SocialLogin({
  label,
  next = "/",
}: {
  next?: string;
  label: string | ((service: string) => string);
}) {
  return (
    <div className="text-center">
      {SocialLoginServices.map(service => (
        <Button variant="primary" key={service}>
          <a href={`/auth/${service}?next=${encodeURIComponent(next)}`}>
            {typeof label === "function" ? label(service) : `${label} with ${service}`}
          </a>
        </Button>
      ))}
    </div>
  );
}

export function Spinner() {
  return 'Loading...'
}
