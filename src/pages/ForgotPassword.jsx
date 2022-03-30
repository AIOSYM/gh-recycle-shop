import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const onChange = (e) => setEmail(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (email === "") {
      toast.info("Please fill the email");
      return;
    }
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email was sent");
    } catch (error) {
      toast.error("Could not send reset email");
    }
  };

  return (
    <div class="flex items-center min-h-screen p-6 bg-gray-50 ">
      <div class="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl ">
        <div class="flex flex-col overflow-y-auto md:flex-row">
          <div class="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              class="object-cover w-full h-full "
              src={require("../assets/img/gh-front.JPG")}
              alt="Office"
            />
          </div>
          <div class="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div class="w-full">
              <h1 class="mb-4 text-xl font-semibold text-gray-700 ">
                Forgot password
              </h1>
              <form onSubmit={onSubmit}>
                <label class="block text-sm">
                  <span class="text-gray-700 ">Email</span>
                  <input
                    class="block w-full mt-1 text-sm  focus:border-primary focus:outline-none focus:shadow-outline-purple border-2 p-2 form-input"
                    placeholder="xxx@gmail.com"
                    type="email"
                    id="email"
                    value={email}
                    onChange={onChange}
                  />
                </label>

                <button class="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-primary border border-transparent rounded-lg active:bg-primary-focus hover:bg-primary-focus focus:outline-none focus:shadow-outline-purple">
                  Recover password
                </button>
              </form>
              <p className="mt-1">
                <Link
                  to="/sign-in"
                  className=" text-sm font-medium text-primary hover:underline"
                >
                  <span>Back to sign in</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ForgotPassword;
