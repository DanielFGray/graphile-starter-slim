import React, { useState, useCallback, useContext, HTMLInputTypeAttribute } from "react";
import { extractError, getCodeFromError, uniq } from "../lib";

export * from "./Layout";

export function Container({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("flex flex-col gap-4", className)} {...props}>
      {children}
    </div>
  );
}

export const Danger = React.forwardRef(function Danger(
  { children, as: C = "span", className, ...props },
  ref,
) {
  return (
    <C className={clsx("text-red-700", className)} {...props} ref={ref}>
      {children}
    </C>
  );
});

type ButtonProps = {
  variant?: "danger" | "primary" | "default";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "default", ...props }: ButtonProps,
  ref,
) {
  return (
    <button
      {...props}
      className={clsx(
        variant === "primary" ? "bg-primary-600 text-primary-50 shadow-md hover:bg-primary-700 hover:shadow-sm"
        : variant === "danger" ? "bg-red-100 text-red-900 border border-red-300 hover:bg-red-200"
        : "bg-primary-100 border text-primary-900 border-primary-600 hover:bg-primary-50",
        "p-2",
        className,
      )}
      ref={ref}
    >
      {props.children}
    </button>
  );
});

type InputProps =
  | ({
      type: HTMLInputTypeAttribute;
    } & React.InputHTMLAttributes<HTMLInputElement>)
  | ({
      type: "textarea";
    } & React.TextareaHTMLAttributes<HTMLTextAreaElement>);
export const Input = React.forwardRef<
  React.InputHTMLAttributes<HTMLInputElement> | React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  InputProps
>(function Input({ className, ...props }: InputProps, ref) {
  return props.type === "textarea" ? (
    <textarea
      {...props}
      ref={ref}
      className={clsx("form-textarea w-full border border-1 shadow border-primary-600", className)}
    >
      {props.value}
    </textarea>
  ) : (
    <input
      {...props}
      ref={ref}
      className={clsx(
        "form-input block w-full border border-1 shadow border-primary-600",
        className,
      )}
    />
  );
});

export function Legend({
  className = "",
  ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>) {
  return (
    <legend className={clsx("p-2 -rotate-3 text-primary-900 bg-gray-200", className)} {...props}>
      {props.children}
    </legend>
  );
}

export function Fieldset({
  className = "",
  ...props
}: React.DetailedHTMLProps<
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
  HTMLFieldSetElement
>) {
  return (
    <fieldset className={clsx("bg-gray-100 dark:bg-gray-700 mx-4 p-4", className)} {...props}>
      {props.children}
    </fieldset>
  );
}

const formCtx = React.createContext<{
  errors: null | Array<string>;
}>({ errors: null });

type FormProps = {
  children: React.ReactNode | ((props: { errors: Array<string> | null }) => React.ReactNode);
  onSubmit: (args: {
    event: React.FormEvent<HTMLFormElement>;
    setErrors: (err: Error | null | string | Array<string>) => void;
    values: Record<keyof T, string>;
  }) => Promise<void> | void;
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "children">;
export const Form = React.forwardRef<HTMLFormElement, FormProps>(function Form(
  { children, onSubmit, ...props }: FormProps,
  ref,
): React.ReactElement {
  const [errors, setErrors] = useState<null | Array<string>>();
  const concatErrors = useCallback((str: Error | null | string | Array<string>) => {
    setErrors(s => {
      if (str == null) return null;
      return (s || []).concat(str instanceof Error ? str.message : str);
    });
  }, []);

  return (
    <formCtx.Provider value={{ setErrors: concatErrors, errors }}>
      <form
        ref={ref}
        {...props}
        onSubmit={async event => {
          event.preventDefault();
          concatErrors(null);
          const values = Object.fromEntries(new FormData(event.currentTarget)) as Record<
            keyof T,
            string
          >;
          try {
            await onSubmit({ event, values, setErrors: concatErrors });
          } catch (err) {
            const code = getCodeFromError(err);
            switch (code) {
              case "CREDS":
                concatErrors("Incorrect username or password");
                break;
              case "MODAT":
                concatErrors("Email is required");
                break;
              case "WEAKP":
                concatErrors("Password is too weak or too common, please make it stronger");
                break;
              case "EMTKN":
                concatErrors(
                  "An account with this email address has already been registered, consider using the 'Forgot passphrase' function.",
                );
                break;
              case "NUNIQ":
                concatErrors(
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
});

export function FormErrors(props: { errors?: Array<null | undefined | string> }) {
  const ctx = useContext(formCtx);
  if (!ctx.errors) return null;
  return (
    <>
      {uniq(ctx.errors.concat(props.errors ? props.errors : [])).map(err => {
        return (
          <Danger as="div" key={err} className="mt-4">
            {err}
          </Danger>
        );
      })}
    </>
  );
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
 * Sort of like the `classnames` module, but a bit simpler
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
