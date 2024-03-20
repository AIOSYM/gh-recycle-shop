function GridLayoutItem({ children }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}

export default GridLayoutItem;
