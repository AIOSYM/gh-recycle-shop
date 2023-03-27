import TableRow from "./TableRow";

function Table({tableData, deleteItem, setUpdateCount}) {

  tableData.sort((a, b) => {
    return b.popularity - a.popularity;
  });

  return (
    <div className="flex flex-col w-full">
      <h3 className="text-3xl font-bold sm:text-4xl pb-4">Items List</h3>
      <div className="overflow-hidden overflow-x-auto border border-gray-100 rounded">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                No
              </th>
              <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                Item Name
              </th>
              <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                Description
              </th>
              <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                Price
              </th>
              <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
               Quantity
              </th>

              <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
               Action
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {tableData.map((rowData, index) => {
              return <TableRow key={index} id={index} data={rowData} deleteItem={deleteItem} setUpdateCount={setUpdateCount}/>;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
