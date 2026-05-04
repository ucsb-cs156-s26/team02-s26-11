import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import ArticleCreatePage from "main/pages/Article/ArticleCreatePage";

import { articlesFixtures } from "fixtures/articlesFixtures";

export default {
  title: "pages/Article/ArticleCreatePage",
  component: ArticleCreatePage,
};

const Template = () => <ArticleCreatePage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.post("/api/articles/post", () => {
      return HttpResponse.json(articlesFixtures.oneArticle, { status: 200 });
    }),
  ],
};
