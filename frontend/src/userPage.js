import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
// import Avatar from "react-avatar";

function UserPage() {
  const [isRunning, setIsRunning] = useState(false);

  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [meetingid, setmeetingid] = useState("");
  const [userData, setUserData] = useState(null);
  const { usn } = useParams();
  const navigate = useNavigate();

  const handleRunWebdriver = async () => {
    setIsRunning(true);
    try {
      const response = await axios.post("http://localhost:5000/run-webdriver", {
        email,
        password,
        meetingid,
        name,
        usn,
      });
      console.log(response.data); // Display response from the backend
    } catch (error) {
      console.error("Error running Python script:", error);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/user/${usn}`, {
          headers: {
            Authorization: token,
          },
        });
        setUserData(response.data);
        setName(response.data.name);
      } catch (error) {
        if (error.response.status === 401) {
          alert("Not authorized");
          navigate("/login");
        }
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [usn, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="bg-background text-primary min-h-screen flex flex-col relative">
      <Navbar />
      {/* User Information and Notes Section */}

      <section className="py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-1">
              <div className="m-6 bg-secondary p-4 rounded-lg shadow-md text-white">
                <h4 className="text-xl font-semibold mb-2">USN</h4>
                <p>{userData.usn}</p>
              </div>
              <div className="m-6 bg-secondary p-4 rounded-lg shadow-md text-white">
                <h4 className="text-xl font-semibold mb-2">Section</h4>
                <p>{userData.section}</p>
              </div>
              <div className="m-6 bg-secondary p-4 rounded-lg shadow-md text-white">
                <h4 className="text-xl font-semibold mb-2">Branch</h4>
                <p>{userData.branch}</p>
              </div>
              <div className="m-6 bg-secondary p-4 rounded-lg shadow-md text-white">
                <h4 className="text-xl font-semibold mb-2">Semester</h4>
                <p>{userData.sem}</p>
              </div>
              <div className="m-6 bg-secondary p-4 rounded-lg shadow-md text-white">
                <h4 className="text-xl font-semibold mb-2">Phone</h4>
                <p>{userData.phone}</p>
              </div>
            </div>
            <div className="md:col-span-1">
              <div className="m-5 bg-primary p-4 rounded-lg shadow-md">
                {/* <Avatar
                  color={Avatar.getRandomColor("sitebase", [
                    "red",
                    "green",
                    "blue",
                  ])}
                  size={150}
                  round="20px"
                  className="h-9/10 w-9/10 rounded-full mx-auto mb-2"
                /> */}
                <h2 className="text-3xl font-semibold text-white">
                  {userData.name}
                </h2>
                <p className="text-lg text-white">{userData.email}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Run Python Script Button */}
      <div className="flex justify-center">
        <section className="bg-gray-300 p-8 rounded-md shadow-md w-96 mt-12 mb-12 ">
          <h2 className="text-2xl font-semibold mb-4">Join Meeting</h2>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 mb-2"
            onChange={(e) => setemail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Password"
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 mb-2"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Meeting ID"
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 mb-2"
            onChange={(e) => setmeetingid(e.target.value)}
          />
          <button
            onClick={handleRunWebdriver}
            disabled={isRunning}
            className="bg-primary text-white px-4 py-2 rounded-md"
          >
            {isRunning ? "Running..." : "Join meeting"}
          </button>
        </section>
      </div>
      {/* User Notes Section */}
      <section className="py-8">
        <div className="container mx-auto px-8">
          <h3 className="text-2xl font-semibold mb-4">My Notes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userData.pdfLinks.map((note, index) => (
              <div
                key={index}
                className="bg-primary p-4 rounded-lg shadow-md h-40"
              >
                <a href={note} target="_blank" rel="noopener noreferrer">
                  <h4 className="text-xl text-white font-semibold mb-2">
                    {/* <FontAwesomeIcon icon={faFilePdf} /> */}
                    Note {index + 1}
                  </h4>
                  <p className="text-xl text-white font-semibold mb-2">
                    {note}
                  </p>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="flex justify-end pr-4">
        <button
          onClick={handleLogout}
          className="w-20 bg-primary text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 mb-2"
        >
          Logout
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default UserPage;
