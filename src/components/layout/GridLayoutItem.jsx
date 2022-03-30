function GridLayoutItem({ children }) {
  return (
    <div className="relative grid gap-8 row-gap-5 mb-8 md:row-gap-8 lg:grid-cols-2 sm:grid-cols-1 ">
      {children}
    </div>
  );
}

export default GridLayoutItem;
