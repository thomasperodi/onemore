import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ToastContainerComponent = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={true} />
      {/* Il resto del tuo JSX */}
    </>
  );
};

export default ToastContainerComponent;
  