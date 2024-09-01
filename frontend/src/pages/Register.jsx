import { ErrorMessage, Field, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useRegisterUserMutation } from '../provider/queries/Auth.query';
import {toast} from 'sonner'
const Register = () => {
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const navigate = useNavigate();
  // Define initial values for the form
  const initialValues = {
    name: '', // Changed from username to name
    email: '',
    password: ''
  };
  // Define validation schema
  const validationSchema = yup.object({
    name: yup.string().required("Name is required"), // Changed from username to name
    email: yup.string().email("Email must be valid").required("Email is required"),
    password: yup.string().min(5, "Password must be greater than 5 characters").required("Password is required"),
  });
  // Handle form submission
  const OnSubmitHandler = async (values, { resetForm }) => {
    try {
      const { data, error } = await registerUser(values);
      if (error) {
        toast.error("Registration error ", error.data.message); // Error handling
        return;
      }
      localStorage.setItem("token", data.token);
      toast.success('User Registered Successfully')
      resetForm();
      navigate("/");
    } catch (error) {
      toast.error("Caught error:", error.message); // Error handling
    }
  };

  return (<div className='min-h-screen flex items-center justify-center w-full bg-blue-100'>
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={OnSubmitHandler}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className="wd-[95%] md:wd-[70%] lg:w-1/3 shadow-md rounded-md pt-7 pb-3 px-4 bg-white">
          <div className="mb-3 py-1">
            <label htmlFor="name">Name</label>
            <Field
              id='name'
              name='name'
              className='w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg'
              placeholder='Enter Your Name'
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
            />
            <ErrorMessage component={'p'} className='text-red-500 text-sm' name='email' />
          </div>
          <div className="mb-3 py-1">
            <label htmlFor="password">Password</label>
            <Field
              name='password'
              id='password'
              type='password'
              className='w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg'
              placeholder='********'
            />
            <ErrorMessage component={'p'} className='text-red-500 text-sm' name='password' />
          </div>
          <div className="mb-3 py-1">
            <Button
              type='submit' className='w-full bg-blue-900 text-white py-3 px-2 flex items-center justify-center'
              loading={isLoading}
              raised
            >
              Register
            </Button>
          </div>
          <div className="mb-3 py-1 flex items-center justify-end">
            <p className="inline-flex items-center gap-x-1">   Already Have An Account?<Link className='font-semibold text-blue-900' to={'/login'}>Login</Link>
              </p>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};
export default Register;