import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

export default function Dropdown({
  children,
  icon = faEllipsisVertical,
  position = "down",
  textButton = "",
  iconSize = "lg",
}) {
  const [show, setShow] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    // Function to handle clicks outside of the dropdown
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow(false);
      }
    }

    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button className="appearance-none" onClick={() => setShow(!show)}>
        <FontAwesomeIcon icon={icon} size={iconSize} />{" "}
        <span className="hidden md:block">{textButton}</span>
      </button>

      <div className={`dropdown-list ${position} ${show ? "show" : ""}`}>
        {children}
      </div>
    </div>
  );
}
