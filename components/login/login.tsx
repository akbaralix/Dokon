import React, { useState, useRef } from "react";
import "./login.css";

function Login() {
  const OTP_LENGTH = 6;
  const [values, setValues] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  // Input o‘zgarishi
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const val = e.target.value;

    // Faqat raqamga ruxsat
    if (!/^\d?$/.test(val)) return;

    const newValues = [...values];
    newValues[index] = val;
    setValues(newValues);

    // Keyingi inputga o'tish
    if (val && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  // Backspace
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && values[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  // Clipboarddan paste qilish
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("Text").slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(pasteData)) return;

    const newValues = [...values];
    for (let i = 0; i < pasteData.length; i++) {
      newValues[i] = pasteData[i];
      if (inputs.current[i]) inputs.current[i]!.value = pasteData[i]; // DOM ni update qilish
    }
    setValues(newValues);

    // Oxirgi raqamga fokus
    const lastIndex = pasteData.length - 1;
    if (lastIndex >= 0 && lastIndex < OTP_LENGTH) {
      inputs.current[lastIndex]?.focus();
    }
  };

  return (
    <div className="login-container">
      <h2>Telegram botga kiring va 1 daqiqalik kodingizni oling</h2>
      <div className="input-group">
        {values.map((val, index) => (
          <input
            key={index}
            type="tel"
            maxLength={1}
            ref={(el) => {
              inputs.current[index] = el;
            }}
            value={val}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
          />
        ))}
      </div>
      <div className="otp-values">
        <p>Current OTP value: {values.join("")}</p>
      </div>
    </div>
  );
}

export default Login;
