function Banner({ user }) {
  return (
    <section className="relative bg-white">
      <img
        className="absolute inset-0 object-[75%] sm:object-[25%] object-cover w-full h-full opacity-25 sm:opacity-100"
        src={require("../assets/img/cover-min.png")}
        alt="Couple on a bed with a dog"
      />

      <div className="hidden sm:block sm:inset-0 sm:absolute sm:bg-gradient-to-r sm:from-white sm:to-transparent"></div>

      <div className="relative max-w-screen-xl px-4 py-32 mx-auto lg:h-screen lg:items-center lg:flex">
        <div className="max-w-xl text-center sm:text-left">
          <h1 className="text-3xl italic font-light pb-1">
            {`Hello${user.displayName ? ", " : " "}`}
            <span className="underline decoration-secondary">
              {user.displayName ? `${user.displayName}` : ""}
            </span>
            👋
          </h1>
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Global House
            <strong className="font-extrabold text-secondary sm:block">
              Recyling Event
            </strong>
          </h1>

          <p className="max-w-lg mt-4 sm:leading-relaxed sm:text-xl">
            2024年度グローバルハウスのリサイクルイベント
          </p>
        </div>
      </div>
    </section>
  );
}

export default Banner;
