# Open-Pit-Mining-Problem

Still ToDo:

-Add edge capacity labels to graph

-Add Pit diagram to visualize the problem

-Make the pit diagram interactive

-Add slider bar to change how quickly the animation runs

This project implements an animation demonstrating how network flows can be utilized to solve the Open Pit Mining problem, a type of project scheduling problem.

From Kleinberg and Tardos, “Algorithm Design”:

“Open-pit mining is a surface mining operation in which blocks of earth are extracted from the surface to retrieve the ore contained in them. Before the mining operation begins, the entire area is divided into a set P of blocks, and the net value pi of each block is estimated: This is the value of the ore minus the processing costs, for this block considered in isolation. Some of these net values will be positive, others negative. The full set of blocks has precedence constraints that essentially prevent blocks from being extracted before others on top of them are extracted. The Open-Pit Mining Problem is to determine the most profitable set of blocks to extract, subject to the precedence constraints.”

Essentially, I wish to create an animation like this one to demonstrate how an animation like this one is solved. In other words my JavaScript demo will have to visual components on the same screen, an animation of the procedure (probably the harder part) and an animation of the result (hopefully the easier part).

These type of scheduling problems utilize carefully constructed graphs, along with the Ford-Fulkerson or Edmonds-Karp algorithms, to find the optimal set of projects to carry out. Descriptions of the procedure can be found here, and some pseudo code examples of the algorithm here.

Technologies include vanilla JS, CSS, and HTML (at least I think that’s all I’ll need)

Some mvps:

The Backend
- Implement “backend” logic, code algorithm in javascript and create 2 or 3 seed cases
Basic graph
- Render the initial graph G from the algorithm, include arrows + node edge capacity labels
Dynamic graph
- Add motion to the graph in sync with the algo being solved. Ideally the flows will crawl up the length of the edge, rather than having the edge simply change colors like in the example above
Dynamic graph + static and dynamic pit animation
- Wrap up the dynamic graph stuff and render the pit (which will hopefully not be too challenging once I’ve gotten a handle on how to get the graph working)
