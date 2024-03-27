function ItemListRow({ id, data, status }) {
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
        {status === "pending" && (
          <>
            <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
              {data.popularity}
            </td>
            <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
              {data.wantedBy.join(",")}
            </td>
          </>
        )}

        {status === "done" && (
          <>
            <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
              {data.winningBy.map((user, index) => (
                <p key={index}>{user.name}</p>
              ))}
            </td>
            <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
              {data.winningBy.map((user, index) => (
                <p key={index}>{user.email}</p>
              ))}
            </td>
          </>
        )}
      </tr>
    </>
  );
}

export default ItemListRow;
