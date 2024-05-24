import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import jsPDF from "jspdf";
import "jspdf-autotable";

emailjs.init("_i-rvf-Vb-3NAy7sG");

const Invoice = ({ ThemeStyles }) => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [fees, setFees] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [drillingServices, setDrillingServices] = useState([]);
  const [pumpTypes, setPumpTypes] = useState([]);
  const [pipeTypes, setPipeTypes] = useState([]);
  const [categories, setCategories] = useState([]);

  const validationSchema = Yup.object({
    client_id: Yup.string().required("Required"),
    client_name: Yup.string().required("Required"),
    client_email: Yup.string()
      .email("Invalid email address")
      .required("Required"),
    client_category: Yup.string().required("Required"),
    invoice_number: Yup.string().required("Required"),
    date: Yup.date().required("Required"),
    project_status: Yup.string().required("Required"),
    drilling_id: Yup.array()
      .min(1, "At least one service is required")
      .required("Required"),
    pump_id: Yup.array()
      .min(1, "At least one service is required")
      .required("Required"),
    pipe_id: Yup.string().required("Required"),
    pipe_diameter: Yup.number()
      .min(0.5, "Minimum value is 0.5 inches")
      .max(48, "Maximum value is 48 inches")
      .required("Required"),
    pipe_length: Yup.number()
      .min(1, "Minimum value is 1 mm")
      .required("Required"),
    number_of_outlets: Yup.number()
      .min(1, "Minimum value is 1")
      .required("Required"),
    tank_capacity: Yup.number().required("Required"),
    total_cost_before_tax: Yup.number().required("Required"),
    tax_amount: Yup.number().required("Required"),
    total_cost_after_tax: Yup.number().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      client_id: "",
      client_name: "",
      client_email: "",
      client_category: "",
      invoice_number: "",
      date: "",
      project_status: "",
      drilling_id: [],
      pump_id: [],
      pipe_id: "",
      pipe_diameter: "",
      pipe_length: "",
      number_of_outlets: "",
      tank_capacity: "",
      total_cost_before_tax: 0,
      tax_amount: 0,
      total_cost_after_tax: 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      console.log(values);

      fetch("http://localhost:3000/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setSubmitting(false);
          setSuccessMessage("Invoice created successfully!");
          resetForm();
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        })
        .catch((error) => {
          console.error("Error:", error);
          setSubmitting(false);
        });
    },
  });

  const formatCurrency = (amount) => {
    return `Ksh ${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const generatePDF = () => {
    if (!fees) return;
    const doc = new jsPDF();

    doc.text("Invoice", 20, 20);
    doc.text("From: Uzuri Limited Accounts Department", 20, 30);
    doc.text(
      `To: ${formik.values.client_name} (${formik.values.client_email})`,
      20,
      40
    );
    doc.text(`Invoice #: ${formik.values.invoice_number}`, 20, 50);
    doc.text(`Date: ${formik.values.date}`, 20, 60);
    doc.text(`Project Status: ${formik.values.project_status}`, 20, 70);
    doc.text(`Description: ${formik.values.description}`, 20, 80);
    doc.text(`Client ID: ${formik.values.client_id}`, 20, 90);
    const category = categories.find(
      (category) => category.id === parseInt(formik.values.client_category)
    );
    doc.text(`Client Category: ${category?.category_name || ""}`, 20, 100);
    doc.text(
      `Survey Fee: ${formatCurrency(category?.cat_surveyfee || 0)}`,
      20,
      110
    );
    doc.text(
      `Local Authority Fee: ${formatCurrency(category?.cat_localfee || 0)}`,
      20,
      120
    );

    // Replacing IDs with names
    doc.autoTable({
      startY: 130,
      head: [["Service", "Cost"]],
      body: [
        ...formik.values.drilling_id.map((service) => [
          drillingServices.find((s) => s.id === service)?.name || service,
          formatCurrency(fees.drilling_costs?.[service] || 0),
        ]),
        ...formik.values.pump_id.map((pump) => [
          pumpTypes.find((p) => p.id === pump)?.name || pump,
          formatCurrency(fees.pump_costs?.[pump] || 0),
        ]), // Using pump names
        [
          "Pipe Type",
          formatCurrency(fees.pipe_costs?.[formik.values.pipe_id] || 0),
        ],
        [
          "Pipe Diameter",
          formatCurrency(
            formik.values.pipe_diameter *
              (fees.plumbing_costs?.pipe_diameter || 0)
          ),
        ],
        [
          "Pipe Length",
          formatCurrency(
            formik.values.pipe_length * (fees.plumbing_costs?.pipe_length || 0)
          ),
        ],
        [
          "Number Of Outlets",
          formatCurrency(
            formik.values.number_of_outlets *
              (fees.plumbing_costs?.number_of_outlets || 0)
          ),
        ],
        [
          "Tank Capacity",
          formatCurrency(
            formik.values.tank_capacity *
              (fees.tank_installation_cost_per_liter || 0)
          ),
        ],
      ],
    });

    doc.text(
      `Total Cost Before Tax: ${formatCurrency(
        formik.values.total_cost_before_tax
      )}`,
      20,
      doc.autoTable.previous.finalY + 10
    );
    doc.text(
      `Tax Amount (16%): ${formatCurrency(formik.values.tax_amount)}`,
      20,
      doc.autoTable.previous.finalY + 20
    );
    doc.text(
      `Total Cost After Tax: ${formatCurrency(
        formik.values.total_cost_after_tax
      )}`,
      20,
      doc.autoTable.previous.finalY + 30
    );

    return doc;
  };

  const handleSendEmail = () => {
    const doc = generatePDF();
    if (!doc) return;
    const pdfBase64 = doc.output("datauristring");

    const templateParams = {
      to_email: formik.values.client_email,
      to_name: formik.values.client_name,
      invoice_number: formik.values.invoice_number,
      invoice_date: formik.values.date,
      project_status: formik.values.project_status,
      description: formik.values.description,
      client_id: formik.values.client_id,
      client_category: categories.find(
        (category) => category.id === parseInt(formik.values.client_category)
        )?.category_name || "",
      survey_fee: formatCurrency( 
        categories.find(
          (category) => category.id === parseInt(formik.values.client_category)
        )?.cat_surveyfee || 0
      ),
      local_authority_fee: formatCurrency(
        categories.find(
          (category) => category.id === parseInt(formik.values.client_category)
        )?.cat_localfee || 0
      ),
      drilling_services: [
       ...formik.values.drilling_id.map(
          (service) => `${drillingServices.find((s) => s.id === service)?.name || service}`
        ), 
      ].join("\n"),
      pump_services: [
       ...formik.values.pump_id.map(
          (pump) => `${pumpTypes.find((p) => p.id === pump)?.name || pump}`
        ), 
      ].join("\n"),
      pipe_type: formik.values.pipe_id,
      pipe_diameter: formik.values.pipe_diameter,
      pipe_length: formik.values.pipe_length,
      number_of_outlets: formik.values.number_of_outlets,
      tank_capacity: formik.values.tank_capacity,
      total_cost_before_tax: formatCurrency(
        formik.values.total_cost_before_tax
      ),
      tax_amount: formatCurrency(formik.values.tax_amount),
      total_cost_after_tax: formatCurrency(
        formik.values.total_cost_after_tax
      ),
      services: [
     
        ``,
        `Drilling Services (${formik.values.drilling_id.join(", ")})`,
        `Pump Type (${formik.values.pump_id.join(", ")})`,
        `Pipe Type (${formik.values.pipe_id})`,
        `Pipe Diameter (${formik.values.pipe_diameter} inches)`,
        `Pipe Length (${formik.values.pipe_length} mm)`,
        `Pump Type (${formik.values.pump_id })`,
        `Pipe Type (${formik.values.pipe_id})`,
        `Pipe Diameter (${formik.values.pipe_diameter} inches)`,
        `Pipe Length (${formik.values.pipe_length} mm)`,
        `Number Of Outlets (${formik.values.number_of_outlets})`,
        `Tank Capacity (${formik.values.tank_capacity} liters)`,
        `Total Cost Before Tax: ${formatCurrency(formik.values.total_cost_before_tax)}`,
        `Tax Amount (16%): ${formatCurrency(formik.values.tax_amount)}`,
        `Total Cost After Tax: ${formatCurrency(formik.values.total_cost_after_tax)}`,
      ].join("\n"),
      
      pdf_base64: pdfBase64,
    };

    emailjs
      .send(
        "service_ubxhk3m",
        "template_s71zm2p",
        templateParams,
        "_i-rvf-Vb-3NAy7sG"
      )
      .then((response) => {
        console.log("Email sent successfully:", response);
        alert("Email sent successfully!");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        alert("Failed to send email.");
      });
  };

  const handlePrint = () => {
    const doc = generatePDF();
    if (doc) {
      doc.save("invoice.pdf");
    }
  };

  const handleReset = () => {
    formik.resetForm();
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/admin/routes/clients")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.toString());
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/admin/routes/fees")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setFees(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.toString());
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/admin/routes/drillingservices")
      .then((response) => response.json())
      .then((data) => setDrillingServices(data))
      .catch((error) => setError(error.toString()));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/admin/routes/pumpservices")
      .then((response) => response.json())
      .then((data) => setPumpTypes(data))
      .catch((error) => setError(error.toString()));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/admin/routes/tank")
      .then((response) => response.json())
      .then((data) => setPipeTypes(data))
      .catch((error) => setError(error.toString()));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/admin/routes/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => setError(error.toString()));
  }, []);

  const handleClientChange = (e) => {
    const selectedClientId = e.target.value;
    const selectedClient = clients.find(
      (client) => client.client_id === parseInt(selectedClientId)
    );
    if (selectedClient) {
      const clientFees = fees?.find(
        (fee) => fee.client_Id === selectedClient.client_id
      );
      setSelectedClient(clientFees);
      formik.setFieldValue("client_id", selectedClient.client_id);
      formik.setFieldValue(
        "client_name",
        `${selectedClient.first_name} ${selectedClient.last_name}`
      );
      formik.setFieldValue("client_email", selectedClient.email);
      formik.setFieldValue("client_category", selectedClient.category_id);
      if (clientFees) {
        formik.setFieldValue("drilling_id", [clientFees.drilling_id]);
        formik.setFieldValue("pump_id", [clientFees.pump_id]);
        formik.setFieldValue("pipe_id", clientFees.pipe_id);
        formik.setFieldValue("pipe_diameter", clientFees.pipe_diameter);
        formik.setFieldValue("pipe_length", clientFees.pipe_length);
        formik.setFieldValue("number_of_outlets", clientFees.number_of_outlets);
        formik.setFieldValue("tank_capacity", clientFees.tank_capacity);
        formik.setFieldValue("total_cost_before_tax", clientFees.total_cost);
        formik.setFieldValue("tax_amount", clientFees.tax_amount);
        formik.setFieldValue(
          "total_cost_after_tax",
          clientFees.total_cost + clientFees.tax_amount
        );
      }
    }
  };

  const background = {
    ...ThemeStyles,
    backgroundColor: "#FFFAFA",
  };

  return (
    <div
      className="pb-40 px-5 py-7 w-full h-screen overflow-y-auto"
      style={background}
    >
      <div className="max-w-4xl mx-auto bg-gray-100 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 relative">
        <div className="absolute top-0 right-0 p-4">
          <img
            src="src/assets/uzurilogo.png"
            alt="Logo"
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>
        <h1 className="text-gray-900 text-2xl font-bold text-center mb-6">
          Invoice
        </h1>
        {successMessage && (
          <p className="text-green-500 text-center">{successMessage}</p>
        )}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-wrap mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="from"
                >
                  From
                </label>
                <textarea
                  id="from"
                  name="from"
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  placeholder="Uzuri Limited Accounts Department"
                  readOnly
                />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="client_email"
                >
                  Bill To
                </label>
                <input
                  id="client_email"
                  name="client_email"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.client_email}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  placeholder="Your customer's billing address"
                  readOnly
                />
                {formik.touched.client_email && formik.errors.client_email ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.client_email}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex flex-wrap mb-6">
              <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="client_id"
                >
                  Client Id
                </label>
                <select
                  id="client_id"
                  name="client_id"
                  onChange={handleClientChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.client_id}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  style={{ color: "black" }}
                >
                  <option value="" label="Select client" />
                  {clients.map((client) => (
                    <option key={client.client_id} value={client.client_id}>
                      {client.client_id} - {client.first_name}{" "}
                      {client.last_name}
                    </option>
                  ))}
                </select>
                {formik.touched.client_id && formik.errors.client_id ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.client_id}
                  </p>
                ) : null}
              </div>
              <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="invoice_number"
                >
                  Invoice #
                </label>
                <input
                  id="invoice_number"
                  name="invoice_number"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.invoice_number}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  placeholder="Enter Invoice Number"
                />
                {formik.touched.invoice_number &&
                formik.errors.invoice_number ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.invoice_number}
                  </p>
                ) : null}
              </div>
              <div className="w-full md:w-2/4 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="date"
                >
                  Invoice Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.date}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                />
                {formik.touched.date && formik.errors.date ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.date}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex flex-wrap mb-6">
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <input
                  id="description"
                  name="description"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  placeholder="Description"
                />
                {formik.touched.description && formik.errors.description ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.description}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex flex-wrap mb-6">
              <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="project_status"
                >
                  Project Status
                </label>
                <select
                  id="project_status"
                  name="project_status"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.project_status}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="" label="Select status" />
                  <option value="Completed">Completed</option>
                  <option value="Incomplete">
                    Incomplete (Pending Downpayment)
                  </option>
                </select>
                {formik.touched.project_status &&
                formik.errors.project_status ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.project_status}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex flex-wrap mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="drilling_id"
                >
                  Drilling Services
                </label>
                <select
                  id="drilling_id"
                  name="drilling_id"
                  onChange={(e) => {
                    const selectedService = e.target.value;
                    if (
                      selectedService &&
                      !formik.values.drilling_id.includes(selectedService)
                    ) {
                      formik.setFieldValue("drilling_id", [
                        ...formik.values.drilling_id,
                        selectedService,
                      ]);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  value=""
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="" label="Select service" />
                  {drillingServices.map((service, index) => (
                    <option key={index} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
                {formik.touched.drilling_id && formik.errors.drilling_id ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.drilling_id}
                  </p>
                ) : null}
                <ul className="list-disc pl-5 text-gray-900 mb-4">
                  {formik.values.drilling_id.map((drillingService, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      {drillingServices.find((s) => s.id === drillingService)?.name ||
                        drillingService}
                      <button
                        type="button"
                        className="mt-2 bg-red-500 text-white font-bold gap-2 py-1 px-2 rounded focus:outline-none focus:shadow-outline hover:bg-red-900"
                        onClick={() =>
                          formik.setFieldValue(
                            "drilling_id",
                            formik.values.drilling_id.filter(
                              (_, i) => i !== index
                            )
                          )
                        }
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="pump_id"
                >
                  Pump Types
                </label>
                <select
                  id="pump_id"
                  name="pump_id"
                  onChange={(e) => {
                    const selectedPump = e.target.value;
                    if (
                      selectedPump &&
                      !formik.values.pump_id.includes(selectedPump)
                    ) {
                      formik.setFieldValue("pump_id", [
                        ...formik.values.pump_id,
                        selectedPump,
                      ]);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  value=""
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="" label="Select pump type" />
                  {pumpTypes.map((pump, index) => (
                    <option key={index} value={pump.id}>
                      {pump.name}
                    </option>
                  ))}
                </select>
                {formik.touched.pump_id && formik.errors.pump_id ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.pump_id}
                  </p>
                ) : null}
                <ul className="list-disc pl-5 text-gray-900 mb-4">
                  {formik.values.pump_id.map((pumpType, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      {pumpTypes.find((p) => p.id === pumpType)?.name || pumpType}
                      <button
                        type="button"
                        className="bg-red-500 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline hover:bg-red-900"
                        onClick={() =>
                          formik.setFieldValue(
                            "pump_id",
                            formik.values.pump_id.filter((_, i) => i !== index)
                          )
                        }
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-wrap mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="pipe_id"
                >
                  Pipe Type
                </label>
                <select
                  id="pipe_id"
                  name="pipe_id"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.pipe_id}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="" label="Select pipe type" />
                  {pipeTypes.map((pipe_type, index) => (
                    <option key={index} value={pipe_type.id}>
                      {pipe_type.name}
                    </option>
                  ))}
                </select>
                {formik.touched.pipe_id && formik.errors.pipe_id ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.pipe_id}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex flex-wrap mb-6">
              <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="pipe_diameter"
                >
                  Pipe Diameter (inches)
                </label>
                <input
                  id="pipe_diameter"
                  name="pipe_diameter"
                  type="number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.pipe_diameter}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  placeholder="Enter value between 0.5 to 48"
                />
                {formik.touched.pipe_diameter && formik.errors.pipe_diameter ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.pipe_diameter}
                  </p>
                ) : null}
              </div>
              <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="pipe_length"
                >
                  Pipe Length (mm)
                </label>
                <input
                  id="pipe_length"
                  name="pipe_length"
                  type="number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.pipe_length}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  placeholder="Enter value from 1"
                />
                {formik.touched.pipe_length && formik.errors.pipe_length ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.pipe_length}
                  </p>
                ) : null}
              </div>
              <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="number_of_outlets"
                >
                  Number Of Outlets
                </label>
                <input
                  id="number_of_outlets"
                  name="number_of_outlets"
                  type="number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.number_of_outlets}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  placeholder="Enter number from 1"
                />
                {formik.touched.number_of_outlets &&
                formik.errors.number_of_outlets ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.number_of_outlets}
                  </p>
                ) : null}
              </div>
              <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="tank_capacity"
                >
                  Tank Capacity (liters)
                </label>
                <input
                  id="tank_capacity"
                  name="tank_capacity"
                  type="number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.tank_capacity}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  placeholder="Enter value from 1"
                />
                {formik.touched.tank_capacity && formik.errors.tank_capacity ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.tank_capacity}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="justify-center flex flex-row gap-9 mt-3 mb-6">
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-semibold text-gray-900">Amount</h2>
                <p className="bg-gray-300 text-lg text-gray-900">
                  {formatCurrency(formik.values.total_cost_before_tax)}
                </p>
              </div>
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-semibold text-gray-900">
                  Tax (16%)
                </h2>
                <p className="bg-gray-300 text-lg text-gray-900">
                  {formatCurrency(formik.values.tax_amount)}
                </p>
              </div>
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-semibold text-gray-900">
                  TOTAL KES
                </h2>
                <p className="bg-gray-300 text-2xl text-gray-900">
                  {formatCurrency(formik.values.total_cost_after_tax)}
                </p>
              </div>
            </div>
            <div className="mb-6">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="terms"
              >
                Terms & Conditions
              </label>
              <textarea
                id="terms"
                name="terms"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                placeholder="Payment is due within 15 days"
              />
            </div>
            <div className="flex justify-between items-center mb-6">
              <button
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline italic"
                style={{ fontFamily: "Georgia, serif", fontSize: "1.25rem" }}
              >
                Thank You
              </button>
            </div>
            <div className="flex justify-between mb-6">
              <button
                type="submit"
                className="bg-green-500 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline hover:bg-green-700"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Creating..." : "Save Invoice"}
              </button>
              <button
                type="button"
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline hover:bg-blue-700"
                onClick={handlePreview}
              >
                Preview Invoice
              </button>
              <button
                type="button"
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline hover:bg-blue-700"
                onClick={handleSendEmail}
              >
                Send Email
              </button>
              <button
                type="button"
                className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline hover:bg-yellow-700"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </form>
        )}
      </div>
      <button
        className="flex items-center justify-center bg-gray-500 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline hover:bg-gray-900 mb-4"
        onClick={handleBackClick}
      >
        <ArrowBackIcon className="mr-2" /> Back
      </button>

      {showPreview && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-600 p-8 rounded shadow-md max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Invoice Preview</h2>
            <p>
              <strong>From:</strong> Uzuri Limited Accounts Department
            </p>
            <p>
              <strong>To:</strong>  (
              {formik.values.client_email})
            </p>
            <p>
              <strong>Invoice #:</strong> {formik.values.invoice_number}
            </p>
            <p>
              <strong>Date:</strong> {formik.values.date}
            </p>
            <p>
              <strong>Project Status:</strong> {formik.values.project_status}
            </p>
            <p>
              <strong>Description:</strong> {formik.values.description}
            </p>
            <p>
              <strong>Client ID:</strong> {formik.values.client_id}
            </p>
            <p>
              <strong>Client Category:</strong>{" "}
              {categories.find(
                (category) => category.id === parseInt(formik.values.client_category)
              )?.category_name || ""}
            </p>
            <p>
              <strong>Survey Fee:</strong>{" "}
              {formatCurrency(
                categories.find(
                  (category) => category.id === parseInt(formik.values.client_category)
                )?.cat_surveyfee || 0
              )}
            </p>
            <p>
              <strong>Local Authority Fee:</strong>{" "}
              {formatCurrency(
                categories.find(
                  (category) => category.id === parseInt(formik.values.client_category)
                )?.cat_localfee || 0
              )}
            </p>
            <h3 className="text-xl font-semibold mb-2">Cost Breakdown</h3>
            <ul className="mb-4">
              <li>Drilling Services ({formik.values.drilling_id})</li>
              <li>Pipe Type ({formik.values.pipe_id}) </li>
              <li>Pipe Diameter ({formik.values.pipe_diameter} inches)</li>
              <li>Pipe Length ({formik.values.pipe_length} mm)</li>
              <li>Number Of Outlets ({formik.values.number_of_outlets})</li>
              <li>Tank Capacity ({formik.values.tank_capacity} liters)</li>
            </ul>
            <p>
              <strong>Total Cost Before Tax:</strong>{" "}
              {formatCurrency(formik.values.total_cost_before_tax)}
            </p>
            <p>
              <strong>Tax Amount (16%):</strong>{" "}
              {formatCurrency(formik.values.tax_amount)}
            </p>
            <p>
              <strong>Total Cost After Tax:</strong>{" "}
              {formatCurrency(formik.values.total_cost_after_tax)}
            </p>
            <button
              className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline hover:bg-blue-700"
              onClick={() => setShowPreview(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;


