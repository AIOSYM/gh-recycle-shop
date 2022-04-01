import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import OAuth from "./OAuth";

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      toast.info("Please input all the login infomation");
      return;
    }
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential) {
        navigate("/");
      }
    } catch (error) {
      toast.error("Incorrect email or password");
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl ">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full"
              src={require("../assets/img/gh-cover-min.JPG")}
              alt="GH"
            />
          </div>
          <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl sm:text-2xl font-semibold text-gray-700 ">
                Welcome to Global House
              </h1>
              <h1 className="mb-4 text-xl font-semibold text-gray-700 ">
                Sign in | ログイン
              </h1>
              <form onSubmit={onSubmit}>
                <label className="block text-sm">
                  <span className="text-gray-700 ">Email | Eメール</span>
                  <input
                    className="block w-full mt-1 text-sm focus:border-primary focus:outline-none focus:shadow-outline-primary  border-2 p-2 form-input"
                    type="email"
                    id="email"
                    placeholder="Your email"
                    value={email}
                    onChange={onChange}
                  />
                </label>
                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 ">Password | パスワード</span>
                  <input
                    className="block w-full mt-1 text-sm  focus:border-primary focus:outline-none focus:shadow-outline-primary border-2 p-2  form-input"
                    type="password"
                    id="password"
                    placeholder="Your password"
                    value={password}
                    onChange={onChange}
                  />
                </label>

                <button
                  type="submit"
                  className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-primary border border-transparent rounded-lg active:bg-primary-focus hover:bg-primary-focus focus:outline-none focus:shadow-outline-primary"
                >
                  Sign in <br />
                  ログイン
                </button>
              </form>

              <hr className="my-8" />

              <OAuth />

              <p className="mt-4">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot Your Password?
                </Link>
              </p>
              <p className="mt-1">
                <Link
                  to="/sign-up"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  <span>Create new account | アカウントの作成</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
