export function onDeleteSuccess(message) {
  console.log(message);
}

export function cellToAxiosParamsDelete(cell) {
  return {
    url: "/api/recommendationrequest",
    method: "DELETE",
    params: { id: cell.row.original.id },
  };
}
