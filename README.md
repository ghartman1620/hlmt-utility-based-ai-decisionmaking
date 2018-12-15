This is a final project for Computational Media 146, Game AI, instructor: Daniel Shapiro, TA: Nick Junius.

Check out a web demo at https://ghartman1620.github.io/hlmt-utility-based-ai-decisionmaking/

For response curve visualizations for use in developing software using the system, check out https://ghartman1620.github.io/quick-response-curves/.

Authors:
Gabe Hartman (ghartman@ucsc.edu, https://github.com/ghartman1620)
Tyler Liddicoat (tliddico@ucsc.edu, https://github.com/TLidd)
Naum Markenzon (nmarkenz@ucsc.edu, https://github.com/boomitsnoom)
Mason Taylor (wimtaylo@ucsc.edu, https://github.com/MTayLatte)

Project proposal: https://docs.google.com/document/d/1NTo5ZZ4PjkuDcKHY03-F2TksJ7kiJx01hLWXHTVWCX0/edit?usp=sharing

Project proposal slide:
https://docs.google.com/presentation/d/1BHjaPnGs3KhQFIwac4AyyVObyA5GWYT3aGt-ySMofcg/edit?usp=sharing

Final Writeup:

This project implements a utility-based action decider based on the architecture of the infinite axis utility system, a system for actors to make decisions probabilistically based on their relative utility, based on a guest lecture by Dave Mark. A version of this talk given at GDC may be found at https://www.gdcvault.com/play/1012410/Improving-AI-Decision-Modeling-Through

To run this software as a new developer:
1. Have the latest version of npm and node (https://www.npmjs.com/get-npm)
2. Clone this repo.
3. run 'npm install' in the root of the repo - this downloads requisite packages locally as described in package-lock.json
4. Run 'npm test' 
5. To use the action decider in a non-node project, you can use a bundler if you like, or simply compile it with tsc. We've done the latter for our small, web-based demo for legibility of page source. It needs files src/action-decider.ts and src/response-curve.ts. 

