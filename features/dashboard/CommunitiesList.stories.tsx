import { Meta, Story } from "@storybook/react";
import { mockedService } from "stories/serviceMocks";
import community from "test/fixtures/community_v2.json";

import CommunitiesList from "./CommunitiesList";

export default {
  component: CommunitiesList,
  title: "Dashboard/CommunitiesList",
} as Meta;

interface CommunitiesListArgs {
  shouldSucceed?: boolean;
  hasMore?: boolean;
}

const Template: Story<CommunitiesListArgs> = ({
  shouldSucceed = true,
  hasMore = false,
} = {}) => {
  setMocks({ shouldSucceed, hasMore });
  return <CommunitiesList />;
};

export const myCommunities = Template.bind({});

export const withMore = Template.bind({});
withMore.args = { hasMore: true };

export const error = Template.bind({});
error.args = { shouldSucceed: false };

function setMocks({ shouldSucceed, hasMore }: Required<CommunitiesListArgs>) {
  const mock = async () =>
    shouldSucceed
      ? {
          count: 1,
          next: hasMore ? "https://example.com/?page=2" : null,
          previous: null,
          results: [community],
        }
      : Promise.reject({
          error_messages: ["Error listing communities"],
          status_code: 500,
        });

  mockedService.communities.listUserCommunities = mock;
  mockedService.communities.listCommunities = () =>
    Promise.reject({
      error_messages: ["Error listing communities"],
      status_code: 500,
    });
}
