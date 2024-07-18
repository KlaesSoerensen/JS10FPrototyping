import { createSignal, JSX, For } from "solid-js";
import Node from "./Node";
import Edge from "./Edge";
import { v4 as uuidv4 } from 'uuid';

// Define the NodeType interface to describe the structure of a node
interface NodeType {
  id: string; // Unique identifier for the node
  x: number; // x-coordinate of the node
  y: number; // y-coordinate of the node
  edges: string[]; // List of connected node IDs
}

// Initial list of nodes, empty to start with
const initialNodes: NodeType[] = [];

const Map = (): JSX.Element => {
  const [nodes, setNodes] = createSignal<NodeType[]>(initialNodes);
  const [activeNodeId, setActiveNodeId] = createSignal<string | null>(null);
  const [edgeStartNodeId, setEdgeStartNodeId] = createSignal<string | null>(null);

  const addNode = (x: number, y: number) => {
    const id = uuidv4();
    setNodes([...nodes(), { id, x, y, edges: [] }]);
  };

  const handleSvgClick = (event: MouseEvent) => {
    if (event.target instanceof SVGElement) {
      const rect = (event.currentTarget as SVGElement).getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      addNode(x, y);
    }
  };

  const handlePositionChange = (id: string, x: number, y: number) => {
    setNodes(nodes().map(node => (node.id === id ? { ...node, x, y } : node)));
  };

  const handleStartEdgeCreation = (id: string) => {
    setEdgeStartNodeId(id);
    setActiveNodeId(id);
  };

  const handleCompleteEdgeCreation = (id: string) => {
    const startNodeId = edgeStartNodeId();
    if (startNodeId && startNodeId !== id) {
      setNodes(
        nodes().map(node => {
          if (node.id === startNodeId) {
            return { ...node, edges: [...node.edges, id] };
          } else if (node.id === id) {
            return { ...node, edges: [...node.edges, startNodeId] };
          }
          return node;
        })
      );
    }
    setEdgeStartNodeId(null);
    setActiveNodeId(null);
  };

  return (
    <svg
      width="800"
      height="600"
      onClick={handleSvgClick}
      style={{ border: "1px solid black" }}
    >
      <For each={nodes()}>
        {node => (
          <>
            <For each={node.edges}>
              {edgeId => (
                <Edge from={node} to={nodes().find(n => n.id === edgeId)!} />
              )}
            </For>
            <Node
              id={node.id}
              x={node.x}
              y={node.y}
              onPositionChange={handlePositionChange}
              onStartEdgeCreation={handleStartEdgeCreation}
              onCompleteEdgeCreation={handleCompleteEdgeCreation}
              isActive={activeNodeId() === node.id}
              isEdgeStart={edgeStartNodeId() === node.id}
            />
          </>
        )}
      </For>
    </svg>
  );
};

export default Map;
