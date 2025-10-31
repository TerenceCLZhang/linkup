import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useAuthStore } from "../../store/useAuthStore";
import { Mail, User } from "lucide-react";
import FormSubmitBtn from "../auth/FormSubmitBtn";

const profileFormSchema = z.object({
  name: z.string().trim().min(1, "Full name is required.").trim(),
  email: z.email("Invalid email address."),
});

type profileFormType = z.infer<typeof profileFormSchema>;

const ProfileForm = () => {
  const { authUser, isLoading, updateName } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<profileFormType>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: authUser?.name,
      email: authUser?.email,
    },
  });

  const onSubmit = async (data: profileFormType) => {
    try {
      await updateName(data.name);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Full Name */}
      <fieldset>
        <label htmlFor="name">Full Name</label>
        <div className="relative">
          <User className="form-icon" />

          <input
            id="name"
            type="text"
            className="form-input"
            disabled={isLoading}
            aria-disabled={isLoading}
            {...register("name")}
          />
        </div>

        {errors.name && <p className="input-error">{errors.name.message}</p>}
      </fieldset>

      {/* Email Address */}
      <fieldset>
        <label htmlFor="email">Email</label>
        <div className="relative">
          <Mail className="form-icon opacity-50" />
          <input
            id="email"
            type="text"
            className="form-input"
            inputMode="email"
            disabled={true}
            aria-disabled={isLoading}
            {...register("email")}
          />
        </div>

        {errors.email && <p className="input-error">{errors.email.message}</p>}
      </fieldset>

      <FormSubmitBtn loadingText="Updating" notLoadingText="Update" />
    </form>
  );
};

export default ProfileForm;
