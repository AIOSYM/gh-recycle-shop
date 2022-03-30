function ItemListRow({ id, data }) {
  return (
    <>
      <tr>
        <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
          {id}
        </td>
        <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
          {data.name}
        </td>
        <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
          {data.quantity}
        </td>
        <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
          {data.popularity}
        </td>
        <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
          {data.wantedBy.join(",")}
        </td>
        <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
          {data.winningBy.join(",")}
        </td>
      </tr>
    </>
  );
}

export default ItemListRow;
