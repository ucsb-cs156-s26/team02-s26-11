package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.UCSBOrganization;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBOrganizationWebIT extends WebTestCase {

  @Autowired UCSBOrganizationRepository ucsborganizationRepository;

  @Test
  public void admin_user_can_create_edit_delete_ucsborganization() throws Exception {

    UCSBOrganization ucsborganization =
        UCSBOrganization.builder()
            .orgCode("SKY")
            .orgTranslationShort("SKYDIVING CLUB")
            .orgTranslation("SKYDIVING CLUB AT UCSB")
            .inactive(false)
            .build();

    ucsborganizationRepository.save(ucsborganization);

    setupUser(true);

    page.getByText("UCSBOrganizations").click();

    assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode")).hasText("SKY");

    // page.getByTestId("RestaurantTable-cell-row-0-col-Edit-button").click();
    // assertThat(page.getByText("Edit Restaurant")).isVisible();
    // page.getByTestId("RestaurantForm-description").fill("THE BEST");
    // page.getByTestId("RestaurantForm-submit").click();

    // assertThat(page.getByTestId("RestaurantTable-cell-row-0-col-description")).hasText("THE
    // BEST");

    page.getByTestId("UCSBOrganizationTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode")).not().isVisible();
  }

  @Test
  public void regular_user_cannot_create_ucsborganization() throws Exception {
    setupUser(false);

    page.getByText("UCSBOrganizations").click();

    assertThat(page.getByText("Create UCSB Organization")).not().isVisible();
  }

  @Test
  public void admin_user_can__see_create_ucsborganization_button() throws Exception {
    setupUser(true);

    page.getByText("UCSBOrganizations").click();

    assertThat(page.getByText("Create UCSB Organization")).isVisible();
  }
}
