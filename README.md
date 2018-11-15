This is a final project for Computational Media 146, Game AI, instructors Daniel Shapiro and Nick Junius.

Authors:
Gabe Hartman (ghartman@ucsc.edu, github ghartman1620)
Tyler Liddicoat (tliddico@ucsc.edu, github TLidd)
Naum Markenzon (nmarkenz@ucsc.edu, github boomitsnoom)
Mason Taylor (wimtaylo@ucsc.edu, github MTayLatte)

Notes to devs -

To run this software as a new developer:
1. Have the latest version of npm and node (https://www.npmjs.com/get-npm)
2. Clone this repo.
3. run 'npm install' in the root of the repo - this downloads requisite packages locally as described in package-lock.json
4. Run 'npm test' - this runs the current suite of tests. Take a look at the source in /test to find examples of use of the system in its current state. Continue running this frequently as you develop, because we are good, test-driven developers. Regressions are bad.
5. In the future, when we have a game demo to use with the system, it will likely be served locally with webpack-dev-server, but for now this the tests are the only output.

I highly, highly 10/10 recommend using Visual Studio Code, especially for this project. It's got fantastic typescript support (get the typescript and tslint extensions) so it'll have syntax highlighing and linting. Please install both of these extensions.

For a few resources on JS/TS:
https://nodejs.org/en/docs/ for node js documentation
https://developer.mozilla.org/en-US/docs/Web/JavaScript for browser js documentation
https://www.typescriptlang.org/docs/ for typescript documentation
Of course, google yields all of these results, but if you're just starting out with JS or TS might be worth a few minutes of your time to browse these

Notes to readers - 

This repo is currently private. Perhaps this is subject to change in the future, but it's easier to start private and go public than vice versa. This does, naturally, make having a "Notes to readers" section kind of moot. 

This project implements the infinite axis utility system, a system for actors to make decisions probabilistically based on their relative utility, based on a guest lecture by Dave Mark. A version of this talk given at GDC may be found at https://www.gdcvault.com/play/1012410/Improving-AI-Decision-Modeling-Through
