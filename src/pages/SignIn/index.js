import React from "react";
import { useHistory, Link } from "react-router-dom";
import BreadCrumb from "components/BreadCrumb";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

import { auth } from "firebase.js";

import "styles/auth.css";
const breadCrumb = [
  { title: "Home", page: "/" },
  { title: "Signin", page: "/" },
];

function SignIn() {
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Must be at least 6 characters")
        .max(100, "Must be 100 characters or less")
        .required("Required"),
    }),
    onSubmit: (values) => {
      auth
        .signInWithEmailAndPassword(values.email, values.password)
        .then((res) => {
          if (!res.user.emailVerified) {
            toast.error(
              "Email does not verified yet. please verify your email"
            );
          } else {
            history.push("/connect-wallet");
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    },
  });
  return (
    <main className="main">
      <div className="container">
        <div className="row row--grid">
          {/* breadcrumb */}
          <BreadCrumb data={breadCrumb} />
          {/* end breadcrumb */}

          {/* sign in */}
          <div className="col-12">
            <div className="sign">
              <div className="sign__content">
                {/* authorization form */}
                <form className="sign__form" onSubmit={formik.handleSubmit}>
                  <a href="/" className="sign__logo">
                    <img src="assets/img/logo.svg" alt="" />
                  </a>

                  <div className="sign__group">
                    <input
                      type="text"
                      className="sign__input"
                      placeholder="Email"
                      {...formik.getFieldProps("email")}
                    />
                  </div>

                  <div className="sign__group">
                    <input
                      type="password"
                      className="sign__input"
                      placeholder="Password"
                      {...formik.getFieldProps("password")}
                    />
                  </div>

                  <div className="sign__group sign__group--checkbox">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      defaultChecked
                    />
                    <label htmlFor="remember">Remember Me</label>
                  </div>

                  <button className="sign__btn" type="submit">
                    Sign in
                  </button>

                  <span className="sign__text">
                    Don't have an account? <Link to="/signup">Sign up!</Link>
                  </span>

                  <span className="sign__text">
                    <Link to="/forgot">Forgot password?</Link>
                  </span>
                </form>
                {/* end authorization form */}
              </div>
            </div>
          </div>
          {/* end sign in */}
        </div>
      </div>
    </main>
  );
}
export default SignIn;
