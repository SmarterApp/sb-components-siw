import * as React from "react";
import { IframeModal } from "@src/index";

const privacyUrl = "https://smarterbalanced.org/website-privacy-policy";

export interface FooterProps {
  appNameCode?: string;
  appVersion?: string;
}

// tslint:disable-next-line:variable-name
export class Footer extends React.Component<FooterProps, {}> {
  render() {
    return (
      <footer className="footer-container" role="contentinfo">
        <div className="footer-content container">
          <a
            className="footer-sbLink footer-practiceTests"
            href="http://practice.smarterbalanced.org/"
          >
            Practice and training tests are available here.
          </a>
          <div className="footer-copyright">
            <p>&copy;2020 The Regents of the University of California</p>
            <a className="footer-sbLink" href="//www.smarterbalanced.org">
              www.SmarterBalanced.org
            </a>
            <div>
              <IframeModal
                url={privacyUrl}
                title="Website Privacy Policy"
                btnText="Website Privacy Policy"
                btnClass="btn btn-link btn-sm footer-sbLink"
              />
            </div>
          </div>
          <div>
            {this.props.appNameCode} {this.props.appVersion}
          </div>
        </div>
      </footer>
    );
  }
}
