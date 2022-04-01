import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import OAuth from "./OAuth";
import WillBeOpen from "./WillBeOpen";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const key = searchParams.get("_user");

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (name === "" || email === "" || password === "") {
      toast.info("Please fill all the infomation");
      return;
    }
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      updateProfile(auth.currentUser, { displayName: name });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();
      formDataCopy.winningItems = [];
      formDataCopy.wantedItems = [];

      await setDoc(doc(db, "users", user.uid), formDataCopy);

      navigate("/");
    } catch (error) {
      toast.error("Something went wrong with the registration!");
    }
  };

  // if (process.env.REACT_APP_IS_OPENED && key !== "haha") {
  //   return <WillBeOpen />;
  // }

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
                Create account | アカウントの作成
              </h1>
              <form onSubmit={onSubmit}>
                <label className="block text-sm">
                  <span className="text-gray-700 ">
                    Name | 名前 (ロマン字のみ記入してください)
                  </span>
                  <input
                    className="block w-full mt- text-sm focus:border-primary focus:outline-none focus:shadow-outline-primary  border-2 p-2 form-input"
                    type="text"
                    id="name"
                    placeholder="Full name"
                    value={name}
                    onChange={onChange}
                  />
                </label>
                <label className="block text-sm mt-4">
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
                    placeholder="Your password (more than 6 characters)"
                    value={password}
                    onChange={onChange}
                  />
                </label>

                <button
                  type="submit"
                  className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-primary border border-transparent rounded-lg active:bg-secondary-focus hover:bg-primary-focus focus:outline-none focus:shadow-outline-primary"
                >
                  Create account <br />
                  登録
                </button>
              </form>

              <hr className="my-8" />

              <OAuth />

              <p className="mt-4"></p>
              <p className="mt-1">
                <Link
                  to="/sign-in"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  <span>Already had account?</span>　<br />
                  <span>アカウントがもう持っている?</span>
                </Link>
              </p>
              <p className="mt-10 text-xs">
                *The information provided above will be used for recycling
                events only. After the event, all of your data will be deleted.
              </p>
              <br />
              <p className="text-xs">
                *ご記入いただいた情報は、リサイクルイベントのみに使用します。イベント終了後、その情報はすべて削除されます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
