import "./Loader.css";

function Loader() {
  return (
    <div className="loader" role="status" aria-label="Loading">
      <div className="loader__spinner" />
    </div>
  );
}

export default Loader;
