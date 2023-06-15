import React, { useState } from "react";
import { extractError, getCodeFromError } from "../lib";

export * from "./Layout";

export function Container({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("flex flex-col gap-4", className)} {...props}>
      {children}
    </div>
  );
}

export const Danger = React.forwardRef(function Danger<T>(
  { children, as: C = "span", className = "text-red-700", ...props }: React.HTMLAttributes<T>,
  ref,
) {
  return (
    <C className={className} {...props} ref={ref}>
      {children}
    </C>
  );
});

export const Button = React.forwardRef(function Button(
  {
    className = "",
    value = undefined,
    children = undefined,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>,
  ref,
) {
  return (
    <button
      className={clsx("align-middle border border-1 p-2 border-gray-300 bg-gray-200", className)}
      {...props}
      ref={ref}
    >
      {children ? children : value}
    </button>
  );
});

export const Input = React.forwardRef(function Input(
  {
    className = "",
    ...props
  }:
    | ({
        type: "textarea";
        label?: React.ReactNode;
      } & React.TextareaHTMLAttributes<HTMLTextAreaElement>)
    | ({
        type: React.HTMLInputTypeAttribute;
        label?: React.ReactNode;
      } & React.InputHTMLAttributes<HTMLInputElement>),
  ref,
) {
  const C =
    props.type === "textarea" ? (
      <textarea
        className={clsx(
          "form-textarea align-middle border border-1 p-2 border-gray-300",
          className,
        )}
        {...props}
        ref={ref}
      >
        {props.value}
      </textarea>
    ) : (
      <input
        className={clsx("form-input align-middle border border-1 p-2 border-gray-300", className)}
        {...props}
        ref={ref}
      />
    );
  if (!props.label) return C;
  return (
    <label>
      {props.label}
      {C}
    </label>
  );
});

export function Fieldset({
  className = "",
  ...props
}: React.DetailedHTMLProps<
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
  HTMLFieldSetElement
>) {
  return (
    <fieldset className={clsx("border border-1 p-2 border-gray-300", className)} {...props}>
      {props.children}
    </fieldset>
  );
}

export function RenderErrors({
  errors,
}: {
  errors: null | string | ReadonlyArray<string>;
}): React.ReactElement {
  if (!errors) return null;
  return (
    <>
      {Array.from(new Set(Array.isArray(errors) ? errors : [errors])).map(e => {
        const err = typeof e === "string" ? e : e instanceof Error ? e.message : e;
        return (
          <Danger as="div" key={err}>
            {err}
          </Danger>
        );
      })}
    </>
  );
}

export const Form = React.forwardRef(function Form(
  {
    children,
    onSubmit,
    ...props
  }: {
    children: React.ReactNode | ((props: { error: string | null }) => React.ReactNode);
    onSubmit: (
      event: React.FormEvent<HTMLFormElement>,
      x: {
        setError: React.Dispatch<React.SetStateAction<string | null>>;
        values: Record<string, string>;
      },
    ) => Promise<void> | void;
  } & Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "children">,
  ref,
): React.ReactElement {
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      ref={ref}
      {...props}
      onSubmit={async ev => {
        ev.preventDefault();
        setError(null);
        const values = Object.fromEntries(new FormData(ev.currentTarget)) as Record<string, string>;
        try {
          await onSubmit(ev, { values, setError });
        } catch (err) {
          switch (getCodeFromError(err)) {
            case "CREDS":
              setError("Incorrect username or password");
              break;
            case "MODAT":
              setError("Email is required");
              break;
            case "WEAKP":
              setError("Password is too weak or too common, please make it stronger");
              break;
            case "EMTKN":
              setError(
                "An account with this email address has already been registered, consider using the 'Forgot passphrase' function.",
              );
              break;
            case "NUNIQ":
              setError(
                "An account with this username has already been registered, please try a different username.",
              );
              break;
            case "23514":
              setError(
                "This username is not allowed; usernames must be between 2 and 24 characters long (inclusive), must start with a letter, and must contain only alphanumeric characters and underscores.",
              );
              break;
            default:
              setError(extractError(err).message);
          }
        }
      }}
    >
      {typeof children === "function" ? children({ error }) : children}
    </form>
  );
});

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
