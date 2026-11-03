"use client";

import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

export default function PasswordInput({
  id = "password",
  label = "Password",
  ...inputProps
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          className="input w-full pr-11"
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="btn btn-ghost btn-square btn-xs absolute right-2 top-1/2 -translate-y-1/2"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
