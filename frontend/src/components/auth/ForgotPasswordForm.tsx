import { Mail } from "lucide-react";
import z from "zod";
import { useAuthStore } from "../../store/useAuthStore";
import FormSubmitBtn from "./FormSubmitBtn";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const forgotPasswordFormSchema = z.object({
  email: z.email("Invalid email address."),
});

type forgotPasswordFormType = z.infer<typeof forgotPasswordFormSchema>;

const ForgotPasswordForm = ({
  setSubmitted,
}: {
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const { forgotPassword, isLoading } = useAuthStore();

  const onSubmit = async (data: forgotPasswordFormType) => {
    try {
      await forgotPassword(data.email);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting email for forgot password form", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Email Address */}
      <fieldset className="fieldset">
        <div className="relative">
          <Mail className="form-icon" />
          <input
            id="email"
            type="text"
            className="form-input"
            inputMode="email"
            disabled={isLoading}
            aria-disabled={isLoading}
            {...register("email")}
          />
        </div>

        {errors.email && (
          <p className="input-error text-left">{errors.email.message}</p>
        )}
      </fieldset>

      <FormSubmitBtn
        loadingText="Sending..."
        notLoadingText="Send Reset Link"
      />
    </form>
  );
};

export default ForgotPasswordForm;
