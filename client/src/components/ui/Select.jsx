// src/components/ui/Select.jsx
import React from "react";

export function Select({ children, ...props }) {
  return <select {...props}>{children}</select>;
}

export function SelectTrigger({ children, ...props }) {
  return (
    <button className="select-trigger" {...props}>
      {children}
    </button>
  );
}

export function SelectContent({ children, ...props }) {
  return (
    <div className="select-content" {...props}>
      {children}
    </div>
  );
}

export function SelectItem({ children, ...props }) {
  return (
    <div className="select-item" {...props}>
      {children}
    </div>
  );
}

export function SelectValue({ children, placeholder }) {
  return (
    <span className="select-value">
      {children || placeholder || "Sélectionner..."}
    </span>
  );
}