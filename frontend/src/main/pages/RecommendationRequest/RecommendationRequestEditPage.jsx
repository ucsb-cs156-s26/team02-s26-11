import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { Navigate, useParams } from "react-router";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestEditPage({ storybook = false }) {
  const { id } = useParams();

  const {
    data: recommendationRequest,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : hard to test React Query caching key
    [`/api/recommendationrequest?id=${id}`],
    // Stryker disable next-line all : hard to test React Query method config
    { method: "GET", url: "/api/recommendationrequest", params: { id } },
    null,
  );

  const objectToAxiosParams = (recommendationRequest) => ({
    url: "/api/recommendationrequest",
    method: "PUT",
    params: {
      id,
    },
    data: {
      requesterEmail: recommendationRequest.requesterEmail,
      professorEmail: recommendationRequest.professorEmail,
      explanation: recommendationRequest.explanation,
      dateRequested: recommendationRequest.dateRequested,
      dateNeeded: recommendationRequest.dateNeeded,
      done: recommendationRequest.done,
    },
  });

  const onSuccess = (recommendationRequest) => {
    toast(
      `RecommendationRequest Updated - id: ${recommendationRequest.id} requesterEmail: ${recommendationRequest.requesterEmail}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to test React Query caching key
    ["/api/recommendationrequest/all"],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/recommendationrequest" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit RecommendationRequest</h1>
        {recommendationRequest && (
          <RecommendationRequestForm
            submitAction={onSubmit}
            buttonLabel="Update"
            initialContents={recommendationRequest}
          />
        )}
      </div>
    </BasicLayout>
  );
}
