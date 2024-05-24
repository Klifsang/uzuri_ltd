import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ServicesList = ({ themeStyles }) => {
  const navigate = useNavigate();
  const [services, setServices] = useState([
    { category: "Drilling Services", name: "Symmetric drilling" },
    { category: "Drilling Services", name: "Core drilling" },
    { category: "Drilling Services", name: "Geo technical drilling" },
    { category: "Pumps Services", name: "Submersible electric pump" },
    { category: "Pumps Services", name: "Solar pump" },
    { category: "Pumps Services", name: "Hand pump" },
    {
      category: "Pumps Services",
      name: "Water Pump Installation - Borehole Depth",
    },
    {
      category: "Pumps Services",
      name: "Water Pump Installation - Height of Tank",
    },
    { category: "Client Category Services", name: "Industrial" },
    { category: "Client Category Services", name: "Commercial" },
    { category: "Client Category Services", name: "Domestic" },
    { category: "Tank Services", name: "Tank Capacity" },
    { category: "Plumbing Services", name: "PVC - Polyvinyl Chloride" },
    { category: "Plumbing Services", name: "PEX - Cross-linked Polyethylene" },
    {
      category: "Plumbing Services",
      name: "ABS - Acrylonitrile Butadiene Styrene",
    },
    { category: "Plumbing Services", name: "Copper" },
    { category: "Plumbing Services", name: "Cast Iron" },
    { category: "Plumbing Services", name: "Galvanized Steel" },
    { category: "Plumbing Services", name: "Pipe Diameter" },
    { category: "Plumbing Services", name: "Pipe Length" },
    { category: "Plumbing Services", name: "Number of Outlets" },
  ]);

  const [newService, setNewService] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editService, setEditService] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const handleAddService = () => {
    if (newService && newCategory) {
      setServices([...services, { category: newCategory, name: newService }]);
      setNewService("");
      setNewCategory("");
    }
  };

  const handleDeleteService = (serviceToDelete) => {
    const updatedServices = services.filter(
      (service) => service !== serviceToDelete
    );
    setServices(updatedServices);
  };

  const handleEditService = (service) => {
    setEditService(service);
    setEditName(service.name);
    setEditCategory(service.category);
  };

  const handleUpdateService = () => {
    const updatedServices = services.map((service) =>
      service === editService
        ? { ...service, name: editName, category: editCategory }
        : service
    );
    setServices(updatedServices);
    setEditService(null);
    setEditName("");
    setEditCategory("");
  };

  const background = {
    ...themeStyles,
    backgroundColor: "#FFFAFA",
  };

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [
    ...new Set(filteredServices.map((service) => service.category)),
  ];

  return (
    <div
      className="pb-40 px-5 py-7 w-full h-screen overflow-y-auto"
      style={background}
    >
      <div className="max-w-4xl mx-auto bg-gray-100 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-gray-800 text-2xl font-bold text-center mb-4">
          OUR SERVICES LIST
        </h2>

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-gray-800 border border-gray-300 rounded-md p-2 mb-4 w-half"
        />

        {categories.map((category) => (
          <div
            className="mb-6 bg-white shadow-md rounded-lg p-4"
            key={category}
          >
            <h3 className="text-gray-700 font-bold text-lg mb-2">{category}</h3>
            <ul className="text-black py-1 px-2">
              {filteredServices
                .filter((service) => service.category === category)
                .map((service, index) => (
                  <li
                    key={index}
                    className="bg-gray-100 shadow-md rounded-lg p-2 mb-2 flex justify-between items-center"
                  >
                    {service.name}
                    <div>
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded-full hover:bg-yellow-700 mr-2"
                        onClick={() => handleEditService(service)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-700"
                        onClick={() => handleDeleteService(service)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ))}

        <div className="mb-4">
          <h3 className="text-gray-700 font-bold text-lg">Add New Service</h3>
          <input
            type="text"
            placeholder="Service Name"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            className="text-gray-800 border border-gray-300 rounded-md p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="text-gray-800 border border-gray-300 rounded-md p-2 mb-2 w-full"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700"
            onClick={handleAddService}
          >
            Add Service
          </button>
        </div>

        {editService && (
          <div className="mb-4">
            <h3 className="text-gray-700 font-bold text-lg">Edit Service</h3>
            <input
              type="text"
              placeholder="Service Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="text-gray-800 border border-gray-300 rounded-md p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Category"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="text-gray-800 border border-gray-300 rounded-md p-2 mb-2 w-full"
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-700"
              onClick={handleUpdateService}
            >
              Update Service
            </button>
          </div>
        )}
      </div>
      <button
        className="bg-gray-900 text-gray-500 hover:text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
        onClick={handleBackClick}
      >
        <ArrowBackIcon /> Back
      </button>
    </div>
  );
};

export default ServicesList;


