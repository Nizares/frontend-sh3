import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function PasswordInput({
  label,
  id,
  required = false,
  className = "",
  name,
  value,
  onChange,
  placeholder = "",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={className}>
      <label>
        <span
          className={`font-medium text-xl ${
            required ? "after:ml-0.5 after:text-red-500 after:content-['*']" : ""
          }`}
          htmlFor={id}
        >
          {label}
        </span>
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
          className="outline-2 p-2 bg-white outline-tertiary-normal rounded-md w-full pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? (
            <EyeSlashIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}