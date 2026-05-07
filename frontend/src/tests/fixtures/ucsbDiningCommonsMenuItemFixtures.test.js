import { ucsbDiningCommonsMenuItemFixtures } from "main/fixtures/ucsbDiningCommonsMenuItemFixtures";

describe("ucsbDiningCommonsMenuItemFixtures", () => {
  test("has expected oneUCSBDiningCommonsMenuItem", () => {
    expect(
      ucsbDiningCommonsMenuItemFixtures.oneUCSBDiningCommonsMenuItem,
    ).toEqual({
      id: 1,
      diningCommonsCode: "dlg",
      name: "Spaghetti",
      station: "Entree",
    });
  });

  test("has expected threeUCSBDiningCommonsMenuItems", () => {
    expect(
      ucsbDiningCommonsMenuItemFixtures.threeUCSBDiningCommonsMenuItems,
    ).toEqual([
      {
        id: 1,
        diningCommonsCode: "dlg",
        name: "Spaghetti",
        station: "Entree",
      },
      {
        id: 2,
        diningCommonsCode: "ortega",
        name: "Chicken Tacos",
        station: "Grill",
      },
      {
        id: 3,
        diningCommonsCode: "carrillo",
        name: "Caesar Salad",
        station: "Salad Bar",
      },
    ]);
  });
});
