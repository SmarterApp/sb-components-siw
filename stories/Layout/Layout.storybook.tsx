import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Layout } from "@src/index";
import { routerDecorator } from "../RouterDecorator";
import { mockSiteLinks } from "@mocks/Layout/mocks";

const style: React.CSSProperties = {
  width: "100%",
  height: "70vh"
};

const body = (
  <div className="container test-container">
    <h2 className="page-title">Page Title</h2>
    <div className="section section-light" style={style}>
      <p>Test Body...</p>
    </div>
  </div>
);

const bodyNoHeader = (
  <div className="container test-container">
    <div className="section section-light" style={style}>
      <p>Test Body...</p>
    </div>
  </div>
);

storiesOf("Layout", module)
  .addDecorator(routerDecorator)
  .add("name no links no body", () => <Layout siteName="Test" />)
  .add("name links header and body", () => (
    <Layout
      children={body}
      siteName="SB-Components"
      links={mockSiteLinks}
      isInterimSite={false}
      // userName="xyz"
      signinLink="https://smarterbalanced.oktapreview.com/home/smarterbalanced_siwdev_1/0oaqpsj0nhzFufP1G0h7/alnqptcba9kPYvTVf0h7?fromHome=true"
    />
  ))
  .add("name links body", () => (
    <Layout
      children={bodyNoHeader}
      siteName="SB-Components"
      links={mockSiteLinks}
    />
  ));
