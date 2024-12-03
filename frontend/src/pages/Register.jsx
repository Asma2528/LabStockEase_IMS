import { ErrorMessage, Field, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useRegisterUserMutation } from '../provider/queries/Auth.query';
import { toast } from 'sonner';
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from 'react';

const Register = () => {
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const navigate = useNavigate();
  const RecaptchaRef = useRef();

  const initialValues = {
    token: '',
    name: '',
    email: '',
    password: '',
    role: '', // Added role field
  };

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Email must be valid").required("Email is required"),
    password: yup.string().min(5, "Password must be greater than 5 characters").required("Password is required"),
    role: yup.string().required("Role is required"), // Validate role field
  });

  const OnSubmitHandler = async (values, { resetForm }) => {
    try {

      const { data, error } = await registerUser(values);

      if (error) {
        const errorMessage = error.data?.message || "Registration failed";
        toast.error(`Registration error: ${errorMessage}`);
        return;
      }
      localStorage.setItem("token", data.token);
      toast.success('User Registered Successfully');
      resetForm();
      navigate("/");
    } catch (error) {
      toast.error(`Caught error: ${error.message || "Unknown error"}`);
    } finally {
      RecaptchaRef.current.reset();
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center w-full bg-blue-100'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={OnSubmitHandler}
      >
        {({ handleSubmit, setFieldValue, values }) => (
          <form onSubmit={handleSubmit} className="wd-[95%] md:wd-[70%] lg:w-1/3 shadow-md rounded-md pt-7 pb-3 px-4 bg-white">
            <div className="mb-3 py-1">
              <label htmlFor="name">Name</label>
              <Field
                id='name'
                name='name'
                className='w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg'
                placeholder='Enter Your Name'
                autoComplete='username'
              />
              <ErrorMessage component={'p'} className='text-red-500 text-sm' name='name' />
            </div>
            <div className="mb-3 py-1">
              <label htmlFor="email">Email</label>
              <Field
                id='email'
                name='email'
                type='email'
                className='w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg'
                placeholder='Enter Email Address'
                autoComplete='email'
              />
              <ErrorMessage component={'p'} className='text-red-500 text-sm' name='email' />
            </div>
            <div className="mb-3 py-1">
              <label htmlFor="password">Password</label>
              <Field
                id='password'
                name='password'
                type='password'
                className='w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg'
                placeholder='********'
                autoComplete='new-password'
              />
              <ErrorMessage component={'p'} className='text-red-500 text-sm' name='password' />
            </div>
            <div className="mb-3 py-1">
  <label htmlFor="role">Role</label>
  <Field
    id='role'
    name='role'
    as='select'
    className='w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg'
    placeholder='Select Your Role'
  >
    <option value=''>Select Role</option>
    <option value='admin'>Admin</option>
    <option value='chemistry'>Chemistry</option>
    <option value='physics'>Physics</option>
    <option value='biology'>Biology</option>
    <option value='botany'>Botany</option>
    <option value='microbiology'>Microbiology</option>
    <option value='lifescience'>Life Science</option>
    <option value='chemistry-faculty'>Chemistry Faculty</option>
  </Field>
  <ErrorMessage component={'p'} className='text-red-500 text-sm' name='role' />
</div>

            <div className="mb-3 py-1">
              <ReCAPTCHA
                ref={RecaptchaRef}
                sitekey={import.meta.env.VITE_SITE_KEY}
                onChange={(token) => {
                  setFieldValue('token', token);
                }}
              />
            </div>
            <div className="mb-3 py-1 flex items-center justify-center">
              <Button
                disabled={!values.token}
                loading={isLoading}
                className='w-full bg-blue-900 text-white py-3 px-2 flex items-center justify-center'
                type="submit"
              >
                Register
              </Button>
            </div>
            <div className="mb-3 py-1 flex items-center justify-end">
              <p className="inline-flex items-center gap-x-1">Already Have An Account?<Link className='font-semibold text-blue-900' to={'/login'}>Login</Link></p>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
