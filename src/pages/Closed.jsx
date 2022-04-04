function Closed() {
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
                The event had been finished!!
              </h1>
              <hr className="my-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Closed;
