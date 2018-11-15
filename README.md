This is a final project for Computational Media 146, Game AI, instructors Daniel Shapiro and Nick Junius.

This repo is currently private. Perhaps this is subject to change in the future, but it's easier to start private and go public than vice versa.

This project implements the infinite axis utility system, a system for actors to make decisions probabilistically based on their relative utility, based on a guest lecture by Dave Mark. A version of this talk given at GDC may be found at https://www.gdcvault.com/play/1012410/Improving-AI-Decision-Modeling-Through

Authors:
Gabe Hartman (ghartman@ucsc.edu)
Tyler Liddicoat (tliddico@ucsc.edu)
Naum Markenzon (nmarkenz@ucsc.edu)
Mason Taylor (wimtaylo@ucsc.edu)

To run this software as a new developer:
1. Have the latest version of npm and node (https://www.npmjs.com/get-npm)
2. Clone this repo.
3. run 'npm install' in the root of the repo - this downloads requisite packages locally as described in package-lock.json
4. Run 'npm test' - this runs the current suite of tests. Take a look at the source in /test to find examples of use of the system in its current state. Continue running this frequently as you develop, because we are good, test-driven developers. Regressions are bad.
5. In the future, when we have a game demo to use with the system, it will likely be served locally with webpack-dev-server, but for now this the tests are the only output.

