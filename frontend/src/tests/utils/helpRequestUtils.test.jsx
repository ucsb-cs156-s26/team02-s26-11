import { onDeleteSuccess, cellToAxiosParamsDelete } from "../../main/utils/helpRequestUtils";
import { toast } from "react-toastify";

jest.mock("react-toastify");

describe("helpRequestUtils tests", () => {
    describe("onDeleteSuccess", () => {
        it("logs the message to console and shows a toast", () => {
            const consoleSpy = jest.spyOn(console, "log").mockImplementation();
            const message = "HelpRequest with id 1 was deleted";

            onDeleteSuccess(message);

            expect(consoleSpy).toHaveBeenCalledWith(message);
            expect(toast).toHaveBeenCalledWith(message);
            consoleSpy.mockRestore();
        });
    });

    describe("cellToAxiosParamsDelete", () => {
        it("returns the correct parameters", () => {
            const cell = { row: { original: { id: 17 } } };
            const result = cellToAxiosParamsDelete(cell);

            expect(result).toEqual({
                url: "/api/helprequests",
                method: "DELETE",
                params: { id: 17 }
            });
        });
    });
});