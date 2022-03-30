import Card from "./shared/Card";
import stepData from "../data/StepData";
import GridLayout from "./layout/GridLayout";

function Step() {
  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
        <div>
          <p className="inline-block px-3 py-px mb-4 text-md font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
            イベントの流れ | Drawing Flow
          </p>
        </div>
      </div>
      <GridLayout>
        <div className="absolute inset-0 flex items-center justify-center sm:hidden lg:flex">
          <div className="w-px h-full bg-gray-300 lg:w-full lg:h-px" />
        </div>

        {stepData.map((data) => {
          return (
            <Card
              key={data.id}
              no={data.id}
              title={data.title}
              description={data.description}
            />
          );
        })}
      </GridLayout>
    </div>
  );
}

export default Step;
