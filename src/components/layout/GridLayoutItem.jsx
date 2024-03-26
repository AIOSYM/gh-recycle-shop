function GridLayoutItem({ children }) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}

export default GridLayoutItem;
