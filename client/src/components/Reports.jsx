import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import { pdf, Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';

const Report = ({ theme_styles }) => {
  const navigate = useNavigate();
  const [clients, set_clients] = useState([]);
  const [invoices, set_invoices] = useState([]);
  const [search_query, set_search_query] = useState("");
  const [filtered_clients, set_filtered_clients] = useState([]);
  const [filtered_invoices, set_filtered_invoices] = useState([]);

  useEffect(() => {
    const fetch_clients = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/api/admin/routes/clients');
        const data = await response.json();
        set_clients(data);
        set_filtered_clients(data);
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    const fetch_invoices = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/api/admin/routes/fees');
        const data = await response.json();
        set_invoices(data);
        set_filtered_invoices(data);
      } catch (error) {
        console.error('Error fetching FeeCalcuted data:', error);
      }
    };

    fetch_clients();
    fetch_invoices();
  }, []);

  const handle_back_click = () => {
    navigate('/dashboard');
  };

  const handle_search_change = (e) => {
    set_search_query(e.target.value);
  };

  const handle_search = () => {
    if (search_query.trim() === "") {
      set_filtered_clients(clients);
      set_filtered_invoices(invoices);
    } else {
      const query = search_query.toLowerCase();
      set_filtered_clients(
        clients.filter(client =>
          client.first_name.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query) ||
          client.phone_number.toLowerCase().includes(query) ||
          client.address.toLowerCase().includes(query) ||
          client.location.toLowerCase().includes(query)
        )
      );
      set_filtered_invoices(
        invoices.filter(FeeCalcuted =>
          FeeCalcuted.client_id.toString().includes(query) ||
          FeeCalcuted.drilling_id.toString().includes(query) ||
          FeeCalcuted.pump_id.toString().includes(query) ||
          FeeCalcuted.pump_depth.toString().includes(query) ||
          FeeCalcuted.pump_height.toString().includes(query) ||
          FeeCalcuted.pipe_id.toString().includes(query) ||
          FeeCalcuted.pipe_diameter.toString().includes(query) ||
          FeeCalcuted.pipe_length.toString().includes(query) ||
          FeeCalcuted.number_of_outlets.toString().includes(query) ||
          FeeCalcuted.tank_capacity.toString().includes(query) ||
          FeeCalcuted.pump_cost.toString().includes(query) ||
          FeeCalcuted.plumbing_cost.toString().includes(query) ||
          FeeCalcuted.tank_cost.toString().includes(query) ||
          FeeCalcuted.total_cost.toString().includes(query) ||
          FeeCalcuted.tax_amount.toString().includes(query)
        )
      );
    }
  };

  const styles = StyleSheet.create({
    page: {
      padding: 30,
    },
    table: {
      display: "table",
      width: "auto",
      borderStyle: "solid",
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    table_row: {
      flexDirection: "row",
    },
    table_col: {
      width: "10%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    table_cell: {
      margin: 5,
      fontSize: 10,
    },
    heading: {
      fontSize: 20,
      marginBottom: 10,
    },
  });

  const handle_download_client_report = () => {
    const ClientDocument = () => (
      <Document>
        <Page style={styles.page}>
          <Text style={styles.heading}>Client List Report</Text>
          <View style={styles.table}>
            <View style={styles.table_row}>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>Client ID</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>Category ID</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>First Name</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>Email</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>Phone Number</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>Address</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>Location</Text>
              </View>
            </View>
            {filtered_clients.map((client) => (
              <View style={styles.table_row} key={client.client_id}>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{client.client_id}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{client.category_id}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{client.first_name}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{client.email}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{client.phone_number}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{client.address}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{client.location}</Text>
                </View>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    );

    pdf(ClientDocument())
      .toBlob()
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'ClientListReport.pdf';
        link.click();
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  };

  const handle_download_invoice_report = () => {
    const InvoiceDocument = () => (
      <Document>
        <Page style={styles.page}>
          <Text style={styles.heading}>FeeCalcuted Report</Text>
          <View style={styles.table}>
            <View style={styles.table_row}>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>FeeCalcuted ID</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>Client ID</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>Drilling ID</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>Pump ID</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>Pump Depth</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>Pump Height</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>Pipe ID</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>Pipe Diameter</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>Pipe Length</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>No. of Outlets</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>Tank Capacity</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>Pump Cost</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>Plumbing Cost</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>Tank Cost</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>Total Cost</Text>
              </View>
              <View style={styles.table_col}>
                <Text style={styles.table_cell}>Tax Amount</Text>
              </View>
            </View>
            {filtered_invoices.map((FeeCalcuted) => (
              <View style={styles.table_row} key={FeeCalcuted.invoice_id}>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{FeeCalcuted.invoice_id}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{FeeCalcuted.client_id}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{FeeCalcuted.drilling_id}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{FeeCalcuted.pump_id}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{FeeCalcuted.pump_depth}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{FeeCalcuted.pump_height}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{FeeCalcuted.pipe_id}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{FeeCalcuted.pipe_diameter}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{FeeCalcuted.pipe_length}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{FeeCalcuted.number_of_outlets}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{FeeCalcuted.tank_capacity}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{FeeCalcuted.pump_cost}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{FeeCalcuted.plumbing_cost}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{FeeCalcuted.tank_cost}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{FeeCalcuted.total_cost}</Text>
                </View>
                <View style={styles.table_col}>
                  <Text style={styles.table_cell}>{FeeCalcuted.tax_amount}</Text>
                </View>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    );

    pdf(InvoiceDocument())
      .toBlob()
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'InvoiceReport.pdf';
        link.click();
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  };

  const background = {
    ...theme_styles,
    backgroundColor: '#FFFAFA'
  };

  return (
    <div className="pb-40 px-5 py-7 w-full h-screen overflow-y-auto" style={background}>
      <div className="max-w-3xl mx-auto bg-gray-100 dark:bg-gray-100 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            className="block w-full bg-gray-600 border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search clients or invoices..."
            value={search_query}
            onChange={handle_search_change}
          />
          <button
            className="bg-blue-500 text-white font-bold py-2 px-2 rounded-full focus:outline-none focus:shadow-outline hover:bg-blue-900 ml-4"
            onClick={handle_search}
          >
            Search
          </button>
        </div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-600">Registered Client List</h1>
          <div className="flex justify-end mb-2">
            <button
              className="bg-gray-200 text-gray-500 font-bold py-2 px-2 rounded-full focus:outline-none focus:shadow-outline hover:bg-gray-900"
              onClick={handle_download_client_report}
            >
              Download Client PDF
            </button>
          </div>
          <div className="overflow-x-auto">
            <div className="bg-#16182F dark:bg-gray-100 p-4 rounded-lg">
              <table className="w-full bg-#16182F dark:bg-gray-100">
                <thead>
                  <tr className="text-gray-900 dark:text-gray-700">
                    <th className="py-2 px-2 border-b dark:border-gray-600">Client ID</th>
                    <th className="py-2 px-2 border-b dark:border-gray-600">Category ID</th>
                    <th className="py-2 px-2 border-b dark:border-gray-600">First Name</th>
                    <th className="py-2 px-2 border-b dark:border-gray-600">Email</th>
                    <th className="py-2 px-2 border-b dark:border-gray-600">Phone Number</th>
                    <th className="py-2 px-2 border-b dark:border-gray-600">Address</th>
                    <th className="py-2 px-2 border-b dark:border-gray-600">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered_clients.map((client) => (
                    <tr key={client.client_id} className="text-gray-900 dark:text-gray-700">
                      <td className="py-2 px-2 border-b dark:border-gray-600">{client.client_id}</td>
                      <td className="py-2 px-2 border-b dark:border-gray-600">{client.category_id}</td>
                      <td className="py-2 px-2 border-b dark:border-gray-600">{client.first_name}</td>
                      <td className="py-2 px-2 border-b dark.border-gray-600">{client.email}</td>
                      <td className="py-2 px-2 border-b dark.border-gray-600">{client.phone_number}</td>
                      <td className="py-2 px-2 border-b dark:border-gray-600">{client.address}</td>
                      <td className="py-2 px-2 border-b dark.border-gray-600">{client.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="p-2">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-600">FeeCalcuted Report</h1>
  <div className="flex justify-end mb-2">
    <button
      className="bg-gray-200 text-gray-500 font-bold py-2 px-2 rounded-full focus:outline-none focus:shadow-outline hover:bg-gray-900"
      onClick={handle_download_invoice_report}
    >
      Download FeeCalcuted PDF
    </button>
  </div>
  <div className="overflow-x-auto">
    <div className="bg-#16182F dark:bg-gray-100 p-4 rounded-lg">
      <table className="w-full bg-#16182F dark:bg-gray-100">
        <thead>
          <tr className="text-gray-900 dark:text-gray-700">
            <th className="py-2 px-2 border-b dark:border-gray-600">Client ID</th>
            <th className="py-2 px-2 border-b dark:border-gray-600">Drilling ID</th>
            <th className="py-2 px-2 border-b dark.border-gray-600">Pump ID</th>
            <th className="py-2 px-2 border-b dark.border-gray-600">Pump Depth</th>
            <th className="py-2 px-2 border-b dark.border-gray-600">Pump Height</th>
            <th className="py-2 px-2 border-b dark.border-gray-600">Pipe ID</th>
            <th className="py-2 px-2 border-b dark.border-gray-600">Pipe Diameter</th>
            <th className="py-2 px-2 border-b dark.border-gray-600">Pipe Length</th>
            <th className="py-2 px-2 border-b dark.border-gray-600">No. of Outlets</th>
            <th className="py-2 px-2 border-b dark.border-gray-600">Tank Capacity</th>
            <th className="py-2 px-2 border-b dark.border-gray-600">Pump Cost</th>
            <th className="py-2 px-2 border-b dark.border-gray-600">Plumbing Cost</th>
            <th className="py-2 px-2 border-b dark.border-gray-600">Tank Cost</th>
            <th className="py-2 px-2 border-b dark.border-gray-600">Total Cost</th>
            <th className="py-2 px-2 border-b dark.border-gray-600">Tax Amount</th>
          </tr>
        </thead>
        <tbody>
          {filtered_invoices.map((FeeCalcuted) => (
            <tr key={FeeCalcuted.invoice_id} className="text-gray-900 dark:text-gray-700">
              <td className="py-2 px-2 border-b dark.border-gray-600">{FeeCalcuted.client_id}</td>
              <td className="py-2 px-2 border-b dark.border-gray-600">{FeeCalcuted.drilling_id}</td>
              <td className="py-2 px-2 border-b dark.border-gray-600">{FeeCalcuted.pump_id}</td>
              <td className="py-2 px-2 border-b dark.border-gray-600">{FeeCalcuted.pump_depth}</td>
              <td className="py-2 px-2 border-b dark.border-gray-600">{FeeCalcuted.pump_height}</td>
              <td className="py-2 px-2 border-b dark.border-gray-600">{FeeCalcuted.pipe_id}</td>
              <td className="py-2 px-2 border-b dark.border-gray-600">{FeeCalcuted.pipe_diameter}</td>
              <td className="py-2 px-2 border-b dark.border-gray-600">{FeeCalcuted.pipe_length}</td>
              <td className="py-2 px-2 border-b dark.border-gray-600">{FeeCalcuted.number_of_outlets}</td>
              <td className="py-2 px-2 border-b dark.border-gray-600">{FeeCalcuted.tank_capacity}</td>
              <td className="py-2 px-2 border-b dark.border-gray-600">{FeeCalcuted.pump_cost}</td>
              <td className="py-2 px-2 border-b dark.border-gray-600">{FeeCalcuted.plumbing_cost}</td>
              <td className="py-2 px-2 border-b dark.border-gray-600">{FeeCalcuted.tank_cost}</td>
              <td className="py-2 px-2 border-b dark.border-gray-600">{FeeCalcuted.total_cost}</td>
              <td className="py-2 px-2 border-b dark.border-gray-600">{FeeCalcuted.tax_amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
        </div>
      </div>
      <button
        className="flex items-center justify-center bg-gray-500 text-white font-bold py-2 px-2 rounded-full focus:outline-none focus:shadow-outline hover:bg-gray-900"
        onClick={handle_back_click}
      >
        <ArrowBackIcon className="mr-2" /> Back
      </button>
    </div>
  );
};

export default Report;
