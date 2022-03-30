function Card({ title, no, description }) {
  return (
    <div className="p-5 duration-300 transform bg-white border rounded shadow-sm hover:-translate-y-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-lg font-bold leading-5">{title}</p>
        <p className="flex items-center justify-center w-6 h-6 font-bold rounded text-deep-purple-accent-400 bg-indigo-50">
          {no}
        </p>
      </div>
      <p className="text-sm text-gray-900">{description}</p>
    </div>
  );
}

export default Card;
