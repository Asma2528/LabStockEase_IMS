import { ErrorMessage, Field, Formik } from 'formik';
import { Button } from 'primereact/button';
// import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup';
import { useLoginUserMutation } from '../provider/queries/Auth.query'
import { toast} from 'sonner'
const Login = () => {
// Initial values for the form
const initialValues = {
  email: '',
  password: '',
};
const [LoginUser,LoginUserResponse] = useLoginUserMutation()
const navigate = useNavigate()
// Validation schema for form validation
const validationSchema = yup.object({
  email: yup.string().email('Email must be valid').required('Email is required'),
  password: yup.string().min(5, 'Password must be at least 5 characters').required('Password is required'),
});
const OnSubmitHandler = async (e, { resetForm }) => {
  try {
    const { data, error } = await LoginUser(e);
    if (error) {
      toast.error(error?.data?.message || 'An error occurred');
      return;
    }
    localStorage.setItem("token", data.token);
    toast.success('User Login Successful')
    resetForm();
    navigate("/");
  } catch (error) {
    toast.error(error.message);
  }
};

  return (
    <>
     <div className='min-h-screen flex items-center justify-center w-full bg-blue-100'>
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={OnSubmitHandler}>
          {({  handleSubmit }) => (
            <>
          <form  onSubmit={handleSubmit} className="wd-[95%] md:wd-[70%] lg:w-1/3 shadow-md rounded-md pt-10 pb-3 px-4 bg-white">
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
               loading={LoginUserResponse.isLoading} 
                type='submit'
                className='w-full bg-blue-900 text-white py-3 px-2 flex items-center justify-center'
              >
                Login
              </Button>
            </div>
            <div className="mb-3 py-1 flex items-center justify-end">
              <p className="inline-flex items-center gap-x-1"> Dont Have An Account?<Link className='font-semibold text-blue-900' to={'/register'}>Register</Link>
              </p>
            </div>
            <div className="mb-3 py-1 flex items-center justify-end">
              <p className="inline-flex items-center gap-x-1"><Link className='font-semibold text-blue-900' to={'#'}>Forget Password?</Link>
              </p>
            </div>
          </form>
          </>
        )}
      </Formik>
    </div>
    </>
  );
};
export default Login;
