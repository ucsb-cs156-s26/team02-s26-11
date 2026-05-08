export function onDeleteSuccess(message) {
  console.log(message);
}

export function cellToAxiosParamsDelete(cell) {
  return {
    url: "/api/recommendationrequests",
    method: "DELETE",
    params: { id: cell.row.original.id },
  };
}
