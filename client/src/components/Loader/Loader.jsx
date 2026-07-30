import "./Loader.css";

function Loader({ message = "Loading..." }) {
    return (
        <div className="loader-container">
            <div className="loader-card">

                <div className="spinner"></div>

                <h2>InterviewIQ</h2>

                <p>{message}</p>

            </div>
        </div>
    );
}

export default Loader;