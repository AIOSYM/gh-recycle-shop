import { Children } from "react";

function GridLayout({ children }) {
  return (
    <div className="relative grid gap-8 row-gap-5 mb-8 md:row-gap-8 lg:grid-cols-4 sm:grid-cols-2 ">
      {children}
    </div>
  );
}

export default GridLayout;
