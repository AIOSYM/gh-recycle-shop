import { useEffect, useState } from "react";
import { db } from "../firebase.config";
import { getDoc, doc } from "firebase/firestore";
import moment from "moment";

function Announcement({eventID}) {
  const dataDocument = `${eventID}/announcement`;
  const [announcement, SetAnnouncement] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAnnoucementDocument = async () => {
      try {
        setIsLoading(true);
        const docRef = doc(db, dataDocument);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          SetAnnouncement(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getAnnoucementDocument();
  }, []);

  if (isLoading) return <>Loading</>;

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
            The drawing session will start from{" "}
            {moment(announcement.date).format("LT")} (
            {moment(announcement.date).format("MM/D")})
          </p>
          <p className="self-center inline-block px-3  mb-4 text-xs md:text-md font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
            抽選会が{moment(announcement.date).format("LT")}
            時から始まる。
          </p>
        </div>
        <div className="self-center">
          <a href={announcement.url} className="btn btn-primary text-white">
            Join {announcement.platform} now
            <br />
            {announcement.platform}に参加する
          </a>
        </div>
        <div className="p-4">
          <div className="text-xs">
            If you encounter any problem, please contact:
            <span className="text-xs underline text-primary">
              {announcement.email}
            </span>
          </div>
          <div className="text-xs">
            お問い合わせ先：{" "}
            <span className="text-xs underline text-primary">
              {announcement.email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Announcement;
