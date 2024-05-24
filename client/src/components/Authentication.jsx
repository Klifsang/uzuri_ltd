import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";

function Login({ switchForm, ThemeStyles }) {
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useUser();
 
  const navigate = useNavigate();
  
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(8, "Must be at least 8 characters")
        .required("Required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      console.log(values);
      fetch("http://127.0.0.1:8080/api/auth/admin_login", {
        method: "POST",
                headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(values),

      })
        .then((res) => res.json())
        .then(() => {
          navigate("/dashboard");
        //   console.log(users);
        //   if(Array.isArray(users)) {
        //   const user = users.find(
        //     (u) => u.email === values.email && u.password === values.password
        //   );
        //   if (user) {
        //     console.log("Login successful");
        //     setUser(user);
        //     navigate("/dashboard");
        //   } else {
        //     console.log("Invalid credentials");
        //   }
        //   setSubmitting(false);
         });
    },
  });

  return (
    <div
      className="flex flex-col items-center justify-center h-screen"
      style={{
        ...ThemeStyles,
      }}
    >
      <div className="max-w-md w-full bg-gray-500 shadow-lg rounded-lg mb-9">
        <form onSubmit={formik.handleSubmit} className="m-3">
          <h2 className="text-2xl font-medium py-2 border-b border-gray-500 text-gray-700 mb-4">
            Login Form
          </h2>
          <div className="flex flex-col items-center gap-y-4 mt-2 w-full">
            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-lg font-medium leading-6"
              >
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500">{formik.errors.email}</div>
              ) : null}
            </div>
            <div className="w-full">
              <label
                htmlFor="password"
                className="block text-lg font-medium leading-6"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500">{formik.errors.password}</div>
              ) : null}
            </div>
            <div className="w-full mt-2 flex items-center">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword" className="ml-2 text-lg">
                Show Password
              </label>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-1 text-lg font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
            <p
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={switchForm}
            >
              Register
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function Register({ switchForm, ThemeStyles }) {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(8, "Must be at least 8 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      console.log(values);
      fetch("http://127.0.0.1:8080/api/auth/admin_signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setSubmitting(false);
           setSuccessMessage("Staff registered successfully!");
          switchForm(); // Switch to login form
        });
    },
  });

  return (
    <div
      className="flex flex-col items-center justify-center h-screen"
      style={ThemeStyles}
    >
      <div className="max-w-md w-full bg-gray-500 shadow-lg rounded-lg p-2 mb-9">
        <form onSubmit={formik.handleSubmit} className="m-3">
          <h2 className="text-2xl font-medium py-2 border-b border-gray-300 text-gray-700 mb-4">
            Registration Form
          </h2>
          <div className="grid grid-cols-1 gap-4 mt-2">
            {["username", "email", "password", "confirmPassword"].map(
              (field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-lg font-medium leading-6"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={field}
                    name={field}
                    type={
                      field === "email"
                        ? "email"
                        : field === "password" || field === "confirmPassword"
                        ? showPassword
                          ? "text"
                          : "password"
                        : "text"
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values[field]}
                    required
                    className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formik.touched[field] && formik.errors[field] ? (
                    <div className="text-red-500">{formik.errors[field]}</div>
                  ) : null}
                </div>
              )
            )}
            <div className="w-full mt-2 flex items-center">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword" className="ml-2 text-lg">
                Show Password
              </label>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-1 text-lg font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Register
            </button>
            <p
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={switchForm}
            >
              Login
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function Form() {
  const [isLoginForm, setIsLoginForm] = useState(true);

  const switchForm = () => {
    setIsLoginForm((prev) => !prev);
  };

  return (
    <div>
      {isLoginForm ? (
        <Login switchForm={switchForm} />
      ) : (
        <Register switchForm={switchForm} />
      )}
    </div>
  );
}

export default Form;
