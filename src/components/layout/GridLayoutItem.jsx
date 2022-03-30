function GridLayoutItem({ children }) {
  return (
    <div className="relative grid gap-8 row-gap-5 md:row-gap-8  mb-5 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 ">
      {children}
    </div>
  );
}

export default GridLayoutItem;
