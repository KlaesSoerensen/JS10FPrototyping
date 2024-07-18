import { render } from "solid-js/web";
import Map from "./components/Map";

const App = () => {
  return (
    <div>
      <Map />
    </div>
  );
};

const rootElement = document.getElementById("root");

if (rootElement) {
  render(() => <App />, rootElement);
} else {
  console.error("Root element not found. Make sure there is an element with the id 'root' in your HTML.");
}
