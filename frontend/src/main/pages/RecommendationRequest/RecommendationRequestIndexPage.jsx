import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestTable from "main/components/RecommendationRequest/RecommendationRequestTable";
import { useBackend } from "main/utils/useBackend";
import { hasRole, useCurrentUser } from "main/utils/useCurrentUser";
import { Button } from "react-bootstrap";
import { Link } from "react-router";

export default function RecommendationRequestIndexPage() {
  const currentUser = useCurrentUser();

  const {
    data: recommendationRequests,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : hard to test React Query caching key
    ["/api/recommendationrequests/all"],
    // Stryker disable next-line all : hard to test React Query method config
    { method: "GET", url: "/api/recommendationrequests/all" },
    [],
  );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>RecommendationRequests</h1>
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <Button as={Link} to="/recommendationrequest/create">
            Create RecommendationRequest
          </Button>
        )}
        <RecommendationRequestTable
          recommendationRequests={recommendationRequests}
          currentUser={currentUser}
        />
      </div>
    </BasicLayout>
  );
}
