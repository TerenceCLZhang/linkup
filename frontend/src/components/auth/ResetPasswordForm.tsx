import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useAuthStore } from "../../store/useAuthStore";
import FormSubmitBtn from "./FormSubmitBtn";

const resetPasswordFormSchema = z
  .object({
    password: z.string().min(6, "Password must be at least six characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type resetPasswordFormType = z.infer<typeof resetPasswordFormSchema>;

const ResetPasswordForm = ({
  setSubmitted,
  token,
}: {
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  token: string;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<resetPasswordFormType>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { resetPassword, isLoading } = useAuthStore();

  const onSubmit = async (data: resetPasswordFormType) => {
    try {
      await resetPassword(data.password, token);
      setSubmitted(true);
    } catch (error) {
      console.error("Error resetting password", error);
    }
  };

  return (
    <form className="text-left" onSubmit={handleSubmit(onSubmit)}>
      {/* Password */}
      <fieldset>
        <label htmlFor="password">Password</label>
        <div className="relative">
          <Lock className="form-icon" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="form-input"
            disabled={isLoading}
            aria-disabled={isLoading}
            {...register("password")}
          />
          <button
            type="button"
            className="bg-transparent p-0 absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide Password" : "Show Password"}
          >
            {showPassword ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="input-error">{errors.password.message}</p>
        )}
      </fieldset>

      {/* Confirm Password */}
      <fieldset>
        <label htmlFor="confirm-password">Confirm Password</label>
        <div className="relative">
          <Lock className="form-icon" />
          <input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            className="form-input"
            disabled={isLoading}
            aria-disabled={isLoading}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            className="bg-transparent p-0 absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={
              showConfirmPassword
                ? "Hide Confrim Password"
                : "Show Confrim Password"
            }
          >
            {showConfirmPassword ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="input-error">{errors.confirmPassword.message}</p>
        )}
      </fieldset>

      <FormSubmitBtn
        loadingText="Updating..."
        notLoadingText="Update Password"
      />
    </form>
  );
};

export default ResetPasswordForm;
