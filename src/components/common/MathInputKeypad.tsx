import React from "react";
import { VisualMathEditor } from "./VisualMathEditor";

interface MathInputKeypadProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  showKeyboardByDefault?: boolean;
}

/**
 * MathInputKeypad wrapper component using VisualMathEditor
 */
export const MathInputKeypad: React.FC<MathInputKeypadProps> = ({
  value,
  onChange,
  placeholder = "Nhấn để nhập công thức Mathway...",
  className = "",
  label = "Nhập công thức toán học:",
  showKeyboardByDefault = false
}) => {
  return (
    <VisualMathEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      label={label}
      showKeyboardByDefault={showKeyboardByDefault}
    />
  );
};
