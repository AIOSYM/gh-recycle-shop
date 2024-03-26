import Modal from "./Modal";

function TableRow({ id, data, deleteItem, setUpdateCount }) {
  const eventID = process.env.REACT_APP_EVENT_ID;
  const itemCollectionName = `${eventID}/items/items`;

  return (
    <>
      <tr>
        <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
          {id}
        </td>
        <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
          <div className="flex items-center gap-4">
            <img className="w-8 h-8" src={data.imageUrls[0]} />
            <div>{data.name}</div>
          </div>
        </td>
        <td className="px-4 py-2 text-gray-700 whitespace-nowrap overflow-hidden max-w-xs text-ellipsis">
          {data.catRef}
        </td>
        <td className="px-4 py-2 text-gray-700 whitespace-nowrap overflow-hidden max-w-xs text-ellipsis">
          {data.description}
        </td>

        <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
          {data.price}
        </td>
        <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
          {data.quantity}
        </td>
        <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
          <div className="flex gap-2">
            <Modal
              btnName="Edit"
              id={data.id}
              setUpdateCount={setUpdateCount}
            />
            <button
              className="text-white bg-red-500 hover:bg-red-700 p-2 rounded-sm"
              onClick={() => deleteItem(data.id)}
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}

export default TableRow;
