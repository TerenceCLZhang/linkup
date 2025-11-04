import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import FormSubmitBtn from "../ui/FormSubmitBtn";

const verifyEmailFormSchema = z.object({
  code: z.array(z.string()).length(6),
});

type VerifyEmailFormType = z.infer<typeof verifyEmailFormSchema>;

const VerifyEmailForm = () => {
  const { control, handleSubmit, watch, setValue } =
    useForm<VerifyEmailFormType>({
      resolver: zodResolver(verifyEmailFormSchema),
      defaultValues: {
        code: ["", "", "", "", "", ""],
      },
    });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const code = watch("code");

  const { verifyEmail, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // Auto submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(onSubmit)();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, handleSubmit]);

  const onSubmit = async (data: VerifyEmailFormType) => {
    const verificationCode = data.code.join("");

    try {
      await verifyEmail(verificationCode);
      navigate("/messages");
    } catch (error) {
      console.error("Error verifying email", error);
    }
  };

  // Handle single digit input
  const handleChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value.slice(-1); // ensure only last character kept
    setValue("code", newCode, { shouldValidate: true });

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle pasted content
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (!paste) return;

    const pastedContent = paste.slice(0, 6).split("");
    const newCode = [...code];

    // Fill starting at the current index
    pastedContent.forEach((char, i) => {
      newCode[i] = char || "";
    });

    setValue("code", newCode, { shouldValidate: true });

    // Focus the next empty input (or the last)
    const nextEmpty = newCode.findIndex((c) => c === "");
    const focusIndex = Math.min(nextEmpty, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  // Move to previous input if digit deleted
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key == "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-center gap-3">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <Controller
              key={index}
              name={`code.${index}`}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  maxLength={1}
                  inputMode="numeric"
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={(e) => handlePaste(e)}
                  disabled={isLoading}
                  aria-disabled={isLoading}
                  className="w-15 h-15 text-center"
                />
              )}
            />
          ))}
      </div>

      <FormSubmitBtn
        loadingText="Verifying"
        notLoadingText="Verify"
        disabled={code.some((digit) => digit === "")}
      />
    </form>
  );
};

export default VerifyEmailForm;
