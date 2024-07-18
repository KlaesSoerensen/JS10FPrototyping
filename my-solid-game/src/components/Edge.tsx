import { JSX } from "solid-js";

interface NodeType {
  x: number;
  y: number;
}

interface EdgeProps {
  from: NodeType;
  to: NodeType;
}

const Edge = ({ from, to }: EdgeProps): JSX.Element => {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke="black"
      stroke-width="2"
    />
  );
};

export default Edge;
