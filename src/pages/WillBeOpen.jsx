function WillBeOpen() {
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
              <hr className="my-8" />
              <h1 className="mb-4 text-lg font-semibold text-gray-700 ">
                About Recycling Event
              </h1>

              <p className="mt-10 text-xs">
                <span className="text-primary uppercase font-bold">
                  Eligible for:{" "}
                </span>
                All Global House Residents
              </p>
              <p className="mt-10 text-xs">
                <span className="text-primary uppercase font-bold">
                  Event date:{" "}
                </span>
              </p>
              <ul className="text-xs">
                <li>4/2 (Sunday)</li>
                <li>9:00~15:00 GH recycle shop opening</li>
                <li>
                  15:00-15:30 Online drawing session (
                  <a
                    href="https://meet.google.com/dxy-ewyo-ofc"
                    className="text-primary underline"
                  >
                    Join here - Google Meet Link
                  </a>
                  )
                </li>
                <li>15:30-16:30 Distribution session (At Assembly Room)</li>
              </ul>
              <br />
              <p className="text-xs">
                *For more infomation or question, please contact the organizer (
                <a
                  href="mailto:rexy.alvian.nerchan.ib@tut.jp"
                  className="text-primary underline"
                >
                  Send email
                </a>
                )
              </p>

              <button
                type="submit"
                className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-primary border border-transparent rounded-lg active:bg-secondary-focus hover:bg-primary-focus focus:outline-none focus:shadow-outline-primary"
              >
                This shop will be open on Sunday (4/2) at 9:00
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WillBeOpen;
