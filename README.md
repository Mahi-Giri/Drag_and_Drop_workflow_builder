<!-- @format -->

# Interactive Workflow Builder

This project was scaffolded using [Vite](https://vitejs.dev/) version 4.3.8.

### Development Environment

### Getting Started
1. Install dependencies with `npm install`.
2. Start the development server with `npm run dev`.

Access the development server at `http://localhost:9000/`. Any changes made to the source files will trigger an automatic reload of the application.

#### Steps to Create and Integrate a New Custom Node into the Workflow Builder

1. Begin by creating a new file within the `src/components/Nodes` directory, naming it after the desired node. For instance, `src/components/Nodes/MyNewNode.jsx`.
2. Include the node's Settings, Node, and NodeBlock components along with its factory function. Please consult existing nodes for reference on structure.
3. Incorporate the newly created node into the `nodeTypes` and its corresponding factory function into `nodeCreator` within `src/components/Flow.jsx`.

The guiding principle across this project is:

- Strive to keep components as simplistic as feasible and delegate logic to respective helper functions. This fosters component reuse across diverse contexts. For example, each node's settings are dynamically linked to the node object, thereby maintaining the Sidebar component's simplicity, which solely renders the settings component it receives.

- Adopt the practice of colocation, housing nodes and their associated components within the same file. For example, the `MessageNode` component and its auxiliary functions reside together within `src/components/Nodes/MessageNode.jsx`.
