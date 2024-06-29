/* eslint-disable no-console */
const logger = require('utils/logger');
// const ExpressError = require('utils/expressError');

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (char) {
        return '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );
  return JSON.parse(jsonPayload);
}

const oauth = (req, res) => {
  try {
    logger.info('Called OAuth home endpoint');
    res.send('oauth home');
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

const oauthRedirect = (req, res) => {
  try {
    logger.info('Called auth endpoint');

    const html_ = `
        <div id="output"> </div>
        <script>
        function sendTokenToParent(token) {
            /* window.opener.postMessage(token, window.location.origin); */
            /*window.opener.postMessage(token, "https://testingadfs-bhgjyz8fh-jehus-projects.vercel.app/"); */
            /* window.opener.postMessage(token, "https://dev-frplus.dtdc.com/"); */
            window.opener.postMessage(token, "http://localhost:1234");
            window.opener.postMessage(token, "https://frplus-uat.dtdc.com");
            window.opener.postMessage(token, "https://frplus-dev.dtdc.com");
            window.opener.postMessage(token, "https://dev-frplus.dtdc.com");
            /*window.close()*/;
            console.log("closing", token);
        }

        const url = new URL(window.location.href);
    
        // Get the query parameters
        const params = new URLSearchParams(url.search);
    
        // Get specific parameters
        const token = params.get('token');
        const message = params.get('message');
        console.log(JSON.parse(message));
        // Send the token to the parent window
        sendTokenToParent({token, message});
        console.log(token);
    
        // Output the parameters
        document.getElementById('output').innerHTML = \`
          <p>Token: \${token}</p>
          <p>Message: \${message}</p>
        \`;
        </script>
    `;
    res.send(html_);
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

const oauthAuth = async (req, res) => {
  try {
    logger.info('Called Redirect endpoint');
    const token = req.user;
    const Empcode = parseJwt(token).Empcode;
    console.log(Empcode);
    console.log(req.user);
    const fetchResponse = await fetch(
      'https://frplusnextgen.dtdc.com/apiuat/api/FrplusLoginAuths/getTokenkey',
      {
        method: 'POST',
        headers: {
          AuthToken: 'ac06f6806f86f96f5807b2606d194923',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empCode: Empcode,
          tokenKey: token,
        }),
      },
    );
    const response = await fetchResponse.json();
    if (
      response
      && response.authTokenDetails
      && response.authTokenDetails.authToken
    ) {
      console.log('Auth Token from DTDC backend');
      console.log(response.authTokenDetails.authToken);

      res.redirect('/redirect?token=' + req.user + '&message=' + JSON.stringify(response));
    } else {
      res.redirect(`/redirect?token=null&message=${JSON.stringify(response)}`);
    }
  } catch (error) {
    console.log(error);
    res.redirect(`/redirect?token=null&message=${JSON.stringify(error)}`);
  }
};

const oauthError = (req, res) => {
  try {
    logger.info('Called OAuth Error endpoint');

    const html_ = `
    <div id="output"> </div>
    <script>
    

    const url = new URL(window.location.href);

    // Get the query parameters
    const params = new URLSearchParams(url.search);

    // Get specific parameters
    const message = params.get('message');

    // Send the token to the parent window
    console.log(JSON.parse(message));

    // Output the parameters
    document.getElementById('output').innerHTML = \`
      <p>Token: \${JSON.parse(message})}</p>
    \`;
    </script>
`;
    res.send(html_);

  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};


module.exports = {
  oauth,
  oauthAuth,
  oauthRedirect,
  oauthError,
};
