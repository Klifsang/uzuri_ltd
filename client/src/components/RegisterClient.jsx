import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const RegisterClient = ({ ThemeStyles }) => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const [successMessage, setSuccessMessage] = useState("");

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    address: Yup.string().required("Required"),
    phone_number: Yup.string().required("Required"),
    category_id: Yup.string().required("Required"),
    location: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      phone_number: "",
      category_id: "",
      location: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      console.log(values);

      fetch("http://127.0.0.1:8080/api/admin/routes/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setSubmitting(false);
          setSuccessMessage("Client registered successfully!");
          setTimeout(() => {
            window.location.reload();
          },1000);
        })
        .catch((error) => {
          console.error("Error:", error);
          setSubmitting(false);
        });
    },
  });

  const background = {
    ...ThemeStyles,
    backgroundColor: '#FFFAFA',
  };

  return (
    <div
      className="pb-40 px-5 py-7 p-6 w-full h-screen overflow-y-auto"
      style={background}
    >
      <div className="max-w-md mx-auto bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-gray-800 fond-bold text-2xl text-center mb-4">
          Register Client
        </h2>
        {successMessage && (
          <div
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
            role="alert"
          >
            <p>{successMessage}</p>
          </div>
        )}
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-800 text-sm font-bold mb-2"
              htmlFor="firstName"
            >
              First Name:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <div className="text-red-500 text-sm">
                {formik.errors.firstName}
              </div>
            ) : null}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-800 text-sm font-bold mb-2"
              htmlFor="lastName"
            >
              Last Name:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.lastName && formik.errors.lastName ? (
              <div className="text-red-500 text-sm">
                {formik.errors.lastName}
              </div>
            ) : null}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-800 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-800 text-sm font-bold mb-2"
              htmlFor="phone_number"
            >
              Phone Number:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              type="tel"
              name="phone_number"
              value={formik.values.phone_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.phone_number && formik.errors.phone_number ? (
              <div className="text-red-500 text-sm">
                {formik.errors.phone_number}
              </div>
            ) : null}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-800 text-sm font-bold mb-2"
              htmlFor="address"
            >
              Address:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.address && formik.errors.address ? (
              <div className="text-red-500 text-sm">
                {formik.errors.address}
              </div>
            ) : null}
          </div>
          <div className="mb-4 relative">
            <label
              className="block text-gray-800 text-sm font-bold mb-2"
              htmlFor="category_id"
            >
              Category:
            </label>
            <div className="relative">
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                name="category_id"
                value={formik.values.category_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              >
                <option value="" hidden>
                  Choose category
                </option>
                <option value="1">Industrial</option>
                <option value="2">Commercial</option>
                <option value="3">Domestic</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 pr-2 flex items-center">
                <svg
                  className="fill-current h-4 w-4 text-gray-800"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M10 12l6-6H4l6 6z" />
                </svg>
              </div>
            </div>
            {formik.touched.category_id && formik.errors.category_id ? (
              <div className="text-red-500 text-sm">
                {formik.errors.category_id}
              </div>
            ) : null}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-800 text-sm font-bold mb-2"
              htmlFor="location"
            >
              Location:
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.location && formik.errors.location ? (
              <div className="text-red-500 text-sm">
                {formik.errors.location}
              </div>
            ) : null}
          </div>
          <button
            className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={formik.isSubmitting}
          >
            Submit
          </button>
        </form>
      </div>
      <button
        className="bg-gray-900 text-gray-500 hover:text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
        onClick={handleBackClick}
      >
        <ArrowBackIcon /> Back
      </button>
    </div>
  );
};

export default RegisterClient;
