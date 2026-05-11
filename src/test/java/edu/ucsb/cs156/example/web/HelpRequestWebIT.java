package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_helprequest() throws Exception {
    setupUser(true);

    page.getByText("HelpRequest").click();

    page.getByText("Create Help Request").click();
    assertThat(page.getByText("Create New Help Request")).isVisible();
    page.getByTestId("HelpRequestForm-requestTime").fill("2026-05-06T10:10");
    page.getByTestId("HelpRequestForm-requesterEmail").fill("test@ucsb.edu");
    page.getByTestId("HelpRequestForm-teamId").fill("TeamTest");
    page.getByTestId("HelpRequestForm-tableOrBreakoutRoom").fill("TableTest");
    page.getByTestId("HelpRequestForm-explanation").fill("TestExplanation");
    page.getByTestId("HelpRequestForm-solved").selectOption("true");
    page.getByTestId("HelpRequestForm-submit").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
        .hasText("test@ucsb.edu");
    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-teamId")).hasText("TeamTest");
    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-tableOrBreakoutRoom"))
        .hasText("TableTest");
    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requestTime"))
        .hasText("2026-05-06T10:10:00");
    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-explanation"))
        .hasText("TestExplanation");
    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-solved")).hasText("true");

    page.getByTestId("HelpRequestTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit Help Request")).isVisible();
    page.getByTestId("HelpRequestForm-requesterEmail").fill("test2@ucsb.edu");
    page.getByTestId("HelpRequestForm-requestTime").fill("2026-06-06T10:10");
    page.getByTestId("HelpRequestForm-teamId").fill("TeamTest2");
    page.getByTestId("HelpRequestForm-tableOrBreakoutRoom").fill("TableTest2");
    page.getByTestId("HelpRequestForm-explanation").fill("TestExplanation2");
    page.getByTestId("HelpRequestForm-solved").selectOption("false");

    page.getByTestId("HelpRequestForm-submit").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
        .hasText("test2@ucsb.edu");
    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-teamId")).hasText("TeamTest2");
    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-tableOrBreakoutRoom"))
        .hasText("TableTest2");
    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requestTime"))
        .hasText("2026-06-06T10:10:00");
    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-explanation"))
        .hasText("TestExplanation2");
    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-solved")).hasText("false");
    page.getByTestId("HelpRequestTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
        .not()
        .isVisible();
  }

  @Test
  public void regular_user_cannot_create_helprequest() throws Exception {
    setupUser(false);

    page.getByText("HelpRequest").click();

    assertThat(page.getByText("Create Help Request")).not().isVisible();
    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
        .not()
        .isVisible();
  }
}
