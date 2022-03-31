function Announcement() {
  return (
    <div className="px-4 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-10">
      <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
        <div>
          <p className="inline-block px-3 py-px mb-4 text-md lg:text-2xl font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
            About the drawing session | 抽選会について
          </p>
        </div>
      </div>
      <div className="border flex flex-col p-4">
        <div className="flex flex-col self-center">
          <p className="inline-block px-3 mb-4 text-xs md:text-md font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
            The drawing session will start from 14:00 (4/1)
          </p>
          <p className="self-center inline-block px-3  mb-4 text-xs md:text-md font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
            抽選会が14:00時から始まる。
          </p>
        </div>
        <div className="self-center">
          <a
            href="https://zoom.us/j/96849972505?pwd=a0c2ZzRES21nMUVvZERlWUJyRjdnZz09"
            className="btn btn-primary text-white"
          >
            Join zoom call now
            <br />
            Zoomに参加する
          </a>
        </div>
      </div>
    </div>
  );
}

export default Announcement;
