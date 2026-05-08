import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/recommendationRequestUtils";
import mockConsole from "tests/testutils/mockConsole";

describe("recommendationRequestUtils", () => {
  describe("onDeleteSuccess", () => {
    test("It puts the message on console.log", () => {
      const restoreConsole = mockConsole();

      onDeleteSuccess("RecommendationRequest deleted");

      expect(console.log).toHaveBeenCalled();
      const message = console.log.mock.calls[0][0];
      expect(message).toMatch("RecommendationRequest deleted");

      restoreConsole();
    });
  });

  describe("cellToAxiosParamsDelete", () => {
    test("It returns the correct params", () => {
      const cell = { row: { original: { id: 17 } } };

      const result = cellToAxiosParamsDelete(cell);

      expect(result).toEqual({
        url: "/api/recommendationrequest",
        method: "DELETE",
        params: { id: 17 },
      });
    });
  });
});
