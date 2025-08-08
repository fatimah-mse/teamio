import { Link } from 'react-router-dom'
import img from '../assets/imgs/auth.webp'
import logo from '../assets/imgs/logo.png'
import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'

interface Tauth {
    register: string,
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    inputRefs?: React.MutableRefObject<HTMLInputElement[]>
}

export default function AuthComponent({ register, inputRefs, handleSubmit }: Tauth) {

    const inputPassRef = useRef(null)
    const [showPassword, setShowPassword] = useState(false)

    const toggleShow = () => {
        setShowPassword(!showPassword)
    }

    return (
        <section className='flex max-992:flex-col max-992:h-screen max-992:items-center max-992:justify-center max-992:px-10 max-768:px-5 max-992:py-10 max-768:py-4 max-992:gap-y-5 relative'>
            <img className='w-1/2 h-screen object-cover max-992:w-full max-992:absolute -z-10 top-0 max-992:opacity-80' src={img} alt="auth-img" />
            {
                <div data-aos="zoom-in" className='flex flex-col justify-center items-center w-1/2 h-screen max-992:w-full max-992:!h-max gap-y-5 px-5 py-3 max-992:py-6 max-992:bg-[#ffffffdc] max-992:rounded-xl'>
                    <div className='flex justify-between items-center gap-x-5 mb-5 max-768:gap-x-2'>
                        <img className='w-16 max-768:w-10' src={logo} alt="logo" />
                        <h1 className='font-winky-rough text-myPrimary font-extrabold text-4xl uppercase max-768:!text-2xl'>Teamio</h1>
                    </div>
                    <h2 className='font-winky-rough text-myPrimary font-extrabold text-2xl uppercase max-768:!text-lg'>
                        {register == 'sign up' && "Sign up"}
                        {register == 'login' && "Sign in"}
                        {(register == 'forget password' || register == 'otp') && "Forget Password ?"}
                        {register == 'reset password' && "Enter New Password"}
                    </h2>
                    <p className='mb-5 text-gray-800 font-semibold max-768:text-sm text-center'>
                        {register == 'sign up' && "Fill in the following fields to create an account"}
                        {register == 'login' && "Enter your credentials to access your account"}
                        {register == 'forget password' && "We are sorry to hear that happen. Don’t be sad we coud hep you get back to productivity in no time."}
                        {register == 'otp' && "We've just emailed you a code! Check your inbox and enter it below to continue"}
                        {register == 'reset password' && "Your account has been recovered. Enteryour new password to gain full control of your account."}
                    </p>
                    {(register == 'sign up' || register == 'login') &&
                        <>
                            <form className='w-2/3 max-992:w-full flex flex-col gap-y-5' onSubmit={handleSubmit} method='post'>
                                {register == 'sign up' &&
                                    <input type="text" name="name" placeholder='Enter Your Name' className='w-full border-2 border-myPrimary rounded-lg px-4 py-2 outline-mySecondary' />
                                }
                                <input type="email" name="email" placeholder='Enter Your Email' className='w-full border-2 border-myPrimary rounded-lg px-4 py-2 outline-mySecondary' />
                                <div className='relative w-full'>
                                    <FontAwesomeIcon
                                        onClick={toggleShow}
                                        className='text-xl w-6 text-myPrimary absolute top-3 right-3 z-10 cursor-pointer'
                                        icon={showPassword ? faEyeSlash : faEye}
                                    />
                                    <input
                                        ref={inputPassRef}
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder='Enter Your Password'
                                        className='w-full border-2 border-myPrimary rounded-lg ps-4 pe-10 py-2 outline-mySecondary'
                                    />
                                </div>
                                {register == 'login' && <Link to={'forget-password'} className='text-sm text text-red-600 font-extrabold'>Forget Password ?</Link>}
                                <input type="submit" value={register == 'sign up' ? "SIGN UP" : "LOGIN"} className='w-full py-3 px-4 bg-myPrimary text-white rounded-lg hover:opacity-70 transition duration-900 ease-in-out' />
                            </form>
                            <p className='mb-5 text-gray-800 font-semibold max-768:text-sm max-768:text-center'>{register == 'sign up' ? "Do you have an account?" : "Don’t have an account?"} <Link to={register == 'sign up' ? '/' : '/sign-up'} className='text-red-600 font-extrabold'>{register == 'sign up' ? 'Login' : 'Create one'}</Link></p>
                        </>
                    }
                    {register == 'forget password' &&
                        <form className='w-2/3 max-992:w-full' onSubmit={handleSubmit} method='post'>
                            <input type="email" name="email" placeholder='Enter Your Email' className='w-full border-2 border-myPrimary rounded-lg px-4 py-2 outline-mySecondary' />
                            <input type="submit" value={'Next'} className='w-max mx-auto block mt-5 py-3 px-6 bg-myPrimary text-white rounded-lg hover:opacity-70 transition duration-900 ease-in-out' />
                        </form>
                    }
                    {register === 'otp' && (
                        <>
                            <form onSubmit={handleSubmit} method='post'>
                                <div className='flex justify-center items-center max-768:gap-2 gap-3'>
                                    {[...Array(6)].map((_, index) => (
                                        <input
                                            ref={(el) => {
                                                if (el && inputRefs) inputRefs.current[index] = el;
                                            }}
                                            key={index}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            onChange={(e) => {
                                                if (e.target.value && inputRefs && inputRefs.current[index + 1]) {
                                                    inputRefs.current[index + 1].focus();
                                                }
                                            }}
                                            className="otp-input max-768:w-8 max-768:h-8 w-10 h-10 border-2 border-myPrimary rounded-md text-center outline-mySecondary"
                                        />
                                    ))}
                                </div>
                                <input type="submit" value='Recover Account' className='mx-auto block mt-10 py-3 px-10 bg-myPrimary text-white rounded-lg hover:opacity-70 transition duration-900 ease-in-out' />
                            </form>
                            <form onSubmit={handleSubmit} method='post'>
                                <button className='text-sm text text-red-600 font-extrabold' type="submit">Didn't get the code? Resend</button>
                            </form>
                        </>
                    )}
                    {register == 'reset password' &&
                        <form className='w-2/3 max-992:w-full flex flex-col gap-y-5' onSubmit={handleSubmit} method='post'>
                            <div className='relative w-full'>
                                <FontAwesomeIcon
                                    onClick={toggleShow}
                                    className='text-xl w-6 text-myPrimary absolute top-3 right-3 z-10 cursor-pointer'
                                    icon={showPassword ? faEyeSlash : faEye}
                                />
                                <input
                                    ref={inputPassRef}
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder='Enter Your Password'
                                    className='w-full border-2 border-myPrimary rounded-lg ps-4 pe-10 py-2 outline-mySecondary'
                                />
                            </div>
                            <input type="submit" value='Save' className='mx-auto py-3 px-10 bg-myPrimary text-white rounded-lg hover:opacity-70 transition duration-900 ease-in-out' />
                        </form>
                    }
                </div>
            }
        </section>
    )
}