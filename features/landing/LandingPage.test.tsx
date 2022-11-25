import { render, screen, waitFor } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { dashboardRoute } from "routes";
import wrapper from "test/hookWrapper";
import {
    t,
  } from "test/utils";

import LandingPage from "./LandingPage";

const View = () => {
  return <LandingPage />;
};


describe("LandingPage", () => {
  it("shows the signup form", async () => {
    render(<View />, { wrapper })
    expect(screen.getByText(t("landing:signup_header"))).toBeVisible();

  })
  it("redirects authenticated users to the dashboard", async () => {
    mockRouter.setCurrentUrl("/");
    window.localStorage.setItem("auth.authenticated", "true");
    render(<View />, { wrapper });
    await waitFor(() => expect(mockRouter.pathname).toBe(dashboardRoute));
  })
});
