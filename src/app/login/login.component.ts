import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth, Tokens } from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';
import appConfig from '../app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // authClient: OktaAuth;

  widget = new OktaSignIn({
    el: '#okta-sign-in-widget',
    // baseUrl: 'https://dev-62087076.okta.com',
    baseUrl: appConfig.oidc.issuer.split('/oauth2')[0],
    clientId: appConfig.oidc.clientId,
    redirectUri: appConfig.oidc.redirectUri,
    authParams: {
      pkce: true,
      issuer: appConfig.oidc.issuer,
      scopes: appConfig.oidc.scopes,
    },
    logo: 'assets/okta-widget/angular.svg',
    features: {
      registration: true,
    },
    colors: {
      brand: '#673AB7' //'#008000'
    },
    i18n: {
      en: {
        'primaryauth.title': 'Sign in to Dev Class App',
      },
    },
    useInteractionCodeFlow: appConfig.widget.useInteractionCodeFlow,
  });

  constructor(@Inject(OKTA_AUTH) private _oktaAuth: OktaAuth, private _router: Router) {

    // this.authClient = _oktaAuth;
    // Show the widget when prompted, otherwise remove it from the DOM.
    // router.events.forEach(event => {
    //   if (event instanceof NavigationStart) {
    //     switch(event.url) {
    //       case '/login':
    //         break;
    //       case '/products':
    //         break;
    //       default:
    //         this.widget.remove();
    //         break;
    //     }
    //   }
    // });

  }

  ngOnInit() {
    // When navigating to a protected route, the route path is saved as the `originalUri`
    // If no `originalUri` has been saved, then redirect back to the app root
    const originalUri = this._oktaAuth.getOriginalUri();
    if (!originalUri) {
      this._oktaAuth.setOriginalUri('/');
    }

    // const tokens: Tokens = await this.widget.showSignInToGetTokens({
    //   el: '#okta-sign-in-widget',
    // });
    // this.authClient.handleLoginRedirect(tokens);
    // this.widget.hide();

    this.widget.showSignInToGetTokens({
      el: '#okta-sign-in-widget',
      scopes: appConfig.oidc.scopes
    }).then(
      (tokens: Tokens) => {
        this._oktaAuth.handleLoginRedirect(tokens);
        this.widget.hide();
      }).catch((err: any) => {
        throw err;
      });
  }

}
