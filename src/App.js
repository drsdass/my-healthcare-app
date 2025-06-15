import React, { createContext, useState, useContext, useEffect } from 'react';

// --- Hardcoded User Data ---
// Updated user data structure to include roles and specific login fields
const users = [
  // Full Access Admins (can see Patient, Physician, Sales, Admin)
  {
    username: "SatishD",
    password: "password123",
    role: "admin",
    isFullAccessAdmin: true, // Special flag for specific admin privileges
    entities: {
      "First Bio Lab": "Yes",
      "First Bio Genetics LLC": "Yes",
      "First Bio Lab of Illinois": "Yes",
      "AIM Laboratories LLC": "Yes",
      "AMICO Dx LLC": "Yes",
      "Enviro Labs LLC": "Yes",
      "Stat Labs": "Yes",
    },
  },
  {
    username: "AshlieT",
    password: "password123",
    role: "admin",
    isFullAccessAdmin: true,
    entities: {
      "First Bio Lab": "Yes",
      "First Bio Genetics LLC": "Yes",
      "First Bio Lab of Illinois": "Yes",
      "AIM Laboratories LLC": "Yes",
      "AMICO Dx LLC": "Yes",
      "Enviro Labs LLC": "Yes",
      "Stat Labs": "Yes",
    },
  },
  {
    username: "Minak",
    password: "password123",
    role: "admin",
    isFullAccessAdmin: true,
    entities: {
      "First Bio Lab": "Yes",
      "First Bio Genetics LLC": "Yes",
      "First Bio Lab of Illinois": "Yes",
      "AIM Laboratories LLC": "Yes",
      "AMICO Dx LLC": "Yes",
      "Enviro Labs LLC": "Yes",
      "Stat Labs": "Yes",
    },
  },
  {
    username: "JayM",
    password: "password123",
    role: "admin",
    isFullAccessAdmin: true,
    entities: {
      "First Bio Lab": "Yes",
      "First Bio Genetics LLC": "Yes",
      "First Bio Lab of Illinois": "Yes",
      "AIM Laboratories LLC": "Yes",
      "AMICO Dx LLC": "Yes",
      "Enviro Labs LLC": "Yes",
      "Stat Labs": "Yes",
    },
  },
  {
    username: "AghaA",
    password: "password123",
    role: "admin",
    isFullAccessAdmin: true,
    entities: {
      "AIM Laboratories LLC": "Yes",
    },
  },

  // Regular Admins (Sales & Marketing, Admin portal only)
  // These users are 'admin' role but NOT 'isFullAccessAdmin'
  // They have entity access for Admin page reporting
  {
    username: "BobS",
    password: "password123",
    role: "admin",
    isFullAccessAdmin: false,
    entities: {
      "First Bio Lab": "Yes",
      "First Bio Genetics LLC": "Yes",
      "First Bio Lab of Illinois": "Yes",
      "AIM Laboratories LLC": "Yes",
      "AMICO Dx LLC": "Yes",
      "Enviro Labs LLC": "Yes",
      "Stat Labs": "Yes",
    },
  },
  {
    username: "Omar",
    password: "password123",
    role: "admin",
    isFullAccessAdmin: false,
    entities: {
      "First Bio Lab": "Yes",
      "First Bio Genetics LLC": "Yes",
      "First Bio Lab of Illinois": "Yes",
      "AIM Laboratories LLC": "Yes",
      "AMICO Dx LLC": "Yes",
      "Enviro Labs LLC": "Yes",
      "Stat Labs": "Yes",
    },
  },
  {
    username: "MelindaC",
    password: "password123",
    role: "admin",
    isFullAccessAdmin: false,
    entities: {
      "First Bio Lab": "Yes",
      "First Bio Genetics LLC": "Yes",
      "First Bio Lab of Illinois": "Yes",
      "AIM Laboratories LLC": "Yes",
      "AMICO Dx LLC": "Yes",
      "Enviro Labs LLC": "Yes",
      "Stat Labs": "Yes",
    },
  },
  {
    username: "Wenjun",
    password: "password123",
    role: "admin",
    isFullAccessAdmin: false,
    entities: {
      "AIM Laboratories LLC": "Yes",
    },
  },
  {
    username: "AndreaM",
    password: "password123",
    role: "admin",
    isFullAccessAdmin: false,
    entities: {
      "AIM Laboratories LLC": "Yes",
    },
  },
  // Corrected roles for these users - they are admins with limited entity access
  {
    username: "DarangT",
    password: "password123",
    role: "admin", // Corrected: Admin role
    isFullAccessAdmin: false, // Corrected: Not full access
    entities: { // Preserving their entity access
      "AIM Laboratories LLC": "Yes",
      "AMICO Dx LLC": "Yes",
      "Stat Labs": "Yes",
    },
  },
  {
    username: "ACG",
    password: "password123",
    role: "admin", // Corrected: Admin role
    isFullAccessAdmin: false, // Corrected: Not full access
    entities: { // Preserving their entity access
      "First Bio Lab": "Yes",
      "First Bio Genetics LLC": "Yes",
      "First Bio Lab of Illinois": "Yes",
      "AIM Laboratories LLC": "Yes",
      "AMICO Dx LLC": "Yes",
      "Enviro Labs LLC": "Yes",
      "Stat Labs": "Yes",
    },
  },
  {
    username: "BenM",
    password: "password123",
    role: "admin", // Corrected: Admin role
    isFullAccessAdmin: false, // Corrected: Not full access
    entities: { // Preserving their entity access
      "Enviro Labs LLC": "Yes",
    },
  },
  {
    username: "SonnyA",
    password: "password123",
    role: "admin", // Corrected: Admin role
    isFullAccessAdmin: false, // Corrected: Not full access
    entities: { // Preserving their entity access
      "AIM Laboratories LLC": "Yes",
    },
  },

  // Dedicated Sales User (only Sales & Marketing portal)
  // This user will have role: "sales"
  {
    username: "KeenanW",
    password: "password123",
    role: "sales", // New role for sales-only access
    isFullAccessAdmin: false, // Sales users are not full access admins
    entities: {}, // Sales users typically don't have entity access for admin reports
  },

  // Patient User
  {
    lastName: "Doe",
    ssnLast4: "1234",
    phoneNumber: "5551234567", // Can be with or without spaces/parentheses in input
    role: "patient",
    isFullAccessAdmin: false,
    entities: {},
  },
  // Physician/Provider User
  {
    email: "dr.smith@example.com",
    password: "securepassword",
    role: "physician",
    isFullAccessAdmin: false,
    entities: {},
  },
  {
    email: "dr.jones@example.com",
    password: "anotherpassword",
    role: "physician",
    isFullAccessAdmin: false,
    entities: {},
  },
];

// --- AuthContext ---
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const login = (credentials, loginType) => {
    let userFound = null;

    if (loginType === 'admin') {
      const { username, password } = credentials;
      userFound = users.find(u => u.role === 'admin' && u.username === username && u.password === password);
    } else if (loginType === 'sales') {
        const { username, password } = credentials;
        userFound = users.find(u => u.role === 'sales' && u.username === username && u.password === password);
    }
    else if (loginType === 'patient') {
      const { lastName, ssnLast4, phoneNumber } = credentials;
      // Normalize phone number for comparison (remove non-digits)
      const normalizedPhoneNumber = phoneNumber.replace(/\D/g, '');
      userFound = users.find(u =>
        u.role === 'patient' &&
        u.lastName.toLowerCase() === lastName.toLowerCase() &&
        u.ssnLast4 === ssnLast4 &&
        u.phoneNumber === normalizedPhoneNumber
      );
    } else if (loginType === 'physician') {
      const { email, password } = credentials;
      userFound = users.find(u => u.role === 'physician' && u.email === email && u.password === password);
    }

    if (userFound) {
      setCurrentUser(userFound);
      setErrorMessage("");
    } else {
      setErrorMessage("Invalid credentials. Please try again.");
      setShowModal(true);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setErrorMessage("");
  };

  const closeModal = () => {
    setShowModal(false);
    setErrorMessage("");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, errorMessage, showModal, closeModal }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

// --- LoginPage ---
const LoginPage = () => {
  const [loginType, setLoginType] = useState('admin'); // Default login type to 'admin'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [lastName, setLastName] = useState('');
  const [ssnLast4, setSsnLast4] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const { login, errorMessage, showModal, closeModal } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginType === 'admin') {
      login({ username, password }, loginType);
    } else if (loginType === 'sales') {
      login({ username, password }, loginType);
    } else if (loginType === 'patient') {
      login({ lastName, ssnLast4, phoneNumber }, loginType);
    } else if (loginType === 'physician') {
      login({ email, password }, loginType);
    }
  };

  // Function to clear input fields when login type changes
  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setUsername('');
    setPassword('');
    setLastName('');
    setSsnLast4('');
    setPhoneNumber('');
    setEmail('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Login to Healthcare Portal</h2>

        {/* Login Type Selection */}
        <div className="mb-6 flex justify-center space-x-4 flex-wrap gap-2">
          <button
            onClick={() => handleLoginTypeChange('admin')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              loginType === 'admin' ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Admin Login
          </button>
          <button
            onClick={() => handleLoginTypeChange('sales')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              loginType === 'sales' ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Sales Login
          </button>
          <button
            onClick={() => handleLoginTypeChange('patient')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              loginType === 'patient' ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Patient Login
          </button>
          <button
            onClick={() => handleLoginTypeChange('physician')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              loginType === 'physician' ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Physician Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {(loginType === 'admin' || loginType === 'sales') && (
            <>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {loginType === 'patient' && (
            <>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="ssnLast4" className="block text-sm font-medium text-gray-700">
                  Last 4 of SSN
                </label>
                <input
                  type="text"
                  id="ssnLast4"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={ssnLast4}
                  onChange={(e) => setSsnLast4(e.target.value)}
                  maxLength="4"
                  required
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {loginType === 'physician' && (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-transform hover:scale-105"
          >
            Login
          </button>
        </form>

        {/* Error Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-auto text-center">
              <h3 className="text-xl font-semibold text-red-600 mb-4">Login Failed</h3>
              <p className="text-gray-700 mb-6">{errorMessage}</p>
              <button
                onClick={closeModal}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- PatientPortal ---
const PatientPortal = () => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Patient Portal</h2>
      <p className="text-gray-700 text-lg">
        Welcome to the Patient Portal. Here you can view your appointments, test results, and communicate with your healthcare providers.
      </p>
      <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Upcoming Appointments:</h3>
        <ul className="list-disc list-inside text-gray-600">
          <li>July 15, 2025 - Dr. Smith (Annual Check-up)</li>
          <li>August 10, 2025 - Lab Test (Blood Work)</li>
        </ul>
      </div>
      <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Recent Test Results:</h3>
        <p className="text-gray-600">No new results available.</p>
      </div>
      <button className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
        Schedule New Appointment
      </button>
    </div>
  );
};

// --- PhysicianProvider ---
const PhysicianProvider = () => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Physician/Provider Dashboard</h2>
      <p className="text-gray-700 text-lg">
        This portal provides tools and resources for physicians and healthcare providers.
      </p>
      <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Patient Records:</h3>
        <p className="text-gray-600">Access and manage patient health records securely.</p>
        <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md">
          View Patient List
        </button>
      </div>
      <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Appointment Schedule:</h3>
        <p className="text-gray-600">View and manage your daily and weekly appointments.</p>
        <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md">
          Open Calendar
        </button>
      </div>
      <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Prescription Management:</h3>
        <p className="text-gray-600">Digitally prescribe and track medications.</p>
        <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md">
          E-Prescribe
        </button>
      </div>
    </div>
  );
};

// --- SalesMarketing ---
const SalesMarketing = () => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Sales & Marketing Dashboard</h2>
      <p className="text-gray-700 text-lg">
        Access tools and insights for sales and marketing initiatives.
      </p>
      <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Sales Performance:</h3>
        <p className="text-gray-600">View sales metrics, lead conversions, and revenue reports.</p>
        <button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md">
          View Sales Reports
        </button>
      </div>
      <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Marketing Campaigns:</h3>
        <p className="text-gray-600">Manage and analyze your ongoing marketing campaigns.</p>
        <button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md">
          Campaign Management
        </button>
      </div>
      <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Customer Relationship Management (CRM):</h3>
        <p className="text-gray-600">Access customer data and communication history.</p>
        <button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md">
          Open CRM
        </button>
      </div>
    </div>
  );
};

// --- FinancialsReport ---
const FinancialsReport = ({ entity }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-inner mt-4">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Financials for {entity}</h3>
      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-md bg-blue-50">
          <h4 className="text-xl font-semibold text-gray-700">2023 Full Report</h4>
          <p className="text-gray-600">Placeholder content for 2023 financial summary.</p>
          <ul className="list-disc list-inside text-gray-600 ml-4 mt-2">
            <li>Revenue: \$X,XXX,XXX</li>
            <li>Expenses: \$Y,YYY,YYY</li>
            <li>Net Profit: \$Z,ZZZ,ZZZ</li>
          </ul>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
            Download 2023 Report (PDF)
          </button>
        </div>
        <div className="p-4 border border-gray-200 rounded-md bg-blue-50">
          <h4 className="text-xl font-semibold text-gray-700">2024 Full Report</h4>
          <p className="text-gray-600">Placeholder content for 2024 financial summary.</p>
          <ul className="list-disc list-inside text-gray-600 ml-4 mt-2">
            <li>Revenue: \$A,AAA,AAA</li>
            <li>Expenses: \$B,BBB,BBB</li>
            <li>Net Profit: \$C,CCC,CCC</li>
          </ul>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
            Download 2024 Report (PDF)
          </button>
        </div>
        <div className="p-4 border border-gray-200 rounded-md bg-blue-50">
          <h4 className="text-xl font-semibold text-gray-700">2025 Financials</h4>
          <ul className="list-disc list-inside text-gray-600 ml-4">
            <li className="mt-2">
              <span className="font-medium">YTD Financials:</span> Placeholder for Year-to-Date data.
            </li>
            <li className="mt-2">
              <span className="font-medium">Last Month Financials:</span> Placeholder for Last Month's data.
            </li>
          </ul>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
            View Live Data
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-6">
        *Note: Detailed reports require specific data parsing. This is placeholder content.*
      </p>
    </div>
  );
};

// --- MonthlyBonusReport ---
const MonthlyBonusReport = ({ entity }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-inner mt-4">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Monthly Bonus for {entity}</h3>
      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-md bg-green-50">
          <h4 className="text-xl font-semibold text-gray-700">2024 Bonus</h4>
          <p className="text-gray-600">Placeholder content for 2024 annual bonus summary.</p>
          <ul className="list-disc list-inside text-gray-600 ml-4 mt-2">
            <li>Total Bonus Pool: \$P,PPP,PPP</li>
            <li>Individual Allocations: See detailed report</li>
          </ul>
          <button className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md">
            View 2024 Bonus Details
          </button>
        </div>
        <div className="p-4 border border-gray-200 rounded-md bg-green-50">
          <h4 className="text-xl font-semibold text-gray-700">2025 Bonus</h4>
          <ul className="list-disc list-inside text-gray-600 ml-4">
            <li className="mt-2">January Bonus: Placeholder data.</li>
            <li className="mt-2">February Bonus: Placeholder data.</li>
            <li className="mt-2">March Bonus: Placeholder data.</li>
            <li className="mt-2">April Bonus: Placeholder data.</li>
            <li className="mt-2">May Bonus: Placeholder data.</li>
          </ul>
          <p className="text-gray-500 text-sm mt-4">
            Details for each month's bonus payouts will appear here.
          </p>
          <button className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md">
            Generate Current Month's Bonus
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-6">
        *Note: Specific bonus calculations would be integrated here based on available data.*
      </p>
    </div>
  );
};

// --- AdminPage ---
const AdminPage = () => {
  const { currentUser } = useAuth();
  const [selectedEntity, setSelectedEntity] = useState('');
  const [adminSubPage, setAdminSubPage] = useState('');

  // Access check: Only users with role 'admin' can view this page
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="p-8 bg-white rounded-lg shadow-md text-center text-red-600 text-xl font-semibold">
        Access Denied: You must be an administrator to view this page.
      </div>
    );
  }

  // Filter accessible entities based on the current admin user's entities
  const accessibleEntities = Object.entries(currentUser.entities || {})
    .filter(([, value]) => value === "Yes")
    .map(([key]) => key);

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

      {accessibleEntities.length > 0 ? (
        <div className="mb-6">
          <label htmlFor="entity-select" className="block text-xl font-medium text-gray-700 mb-2">
            Select Entity:
          </label>
          <select
            id="entity-select"
            className="mt-1 block w-full md:w-1/2 lg:w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            value={selectedEntity}
            onChange={(e) => {
              setSelectedEntity(e.target.value);
              setAdminSubPage(''); // Reset sub-page when entity changes
            }}
          >
            <option value="">-- Please select an entity --</option>
            {accessibleEntities.map((entity) => (
              <option key={entity} value={entity}>
                {entity}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p className="text-gray-600 text-lg mb-6">
          No entities assigned to your admin account. Please contact support.
        </p>
      )}

      {selectedEntity && (
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Reports for {selectedEntity}</h3>
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setAdminSubPage('financials')}
              className={`px-6 py-3 rounded-md text-lg font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 ${
                adminSubPage === 'financials' ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              Financials
            </button>
            <button
              onClick={() => setAdminSubPage('monthly-bonus')}
              className={`px-6 py-3 rounded-md text-lg font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 ${
                adminSubPage === 'monthly-bonus' ? 'bg-green-600 text-white shadow-lg' : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Monthly Bonus
            </button>
          </div>

          {adminSubPage === 'financials' && <FinancialsReport entity={selectedEntity} />}
          {adminSubPage === 'monthly-bonus' && <MonthlyBonusReport entity={selectedEntity} />}
        </div>
      )}
    </div>
  );
};

// --- Dashboard ---
const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  // Initialize currentPage based on currentUser role for correct default navigation
  const [currentPage, setCurrentPage] = useState('patient-portal'); // Initial placeholder, will be set by useEffect

  // Define admin users with full access to patient and physician portals
  const fullAccessAdminsUsernames = ["SatishD", "AshlieT", "Minak", "JayM", "AghaA"];

  // Determine if the current user is a full access admin
  const isFullAccessAdmin = currentUser?.role === 'admin' && fullAccessAdminsUsernames.includes(currentUser.username);

  // Set default page on initial load or user change
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'patient') {
        setCurrentPage('patient-portal');
      } else if (currentUser.role === 'physician') {
        setCurrentPage('physician-provider');
      } else if (currentUser.role === 'admin') {
        if (isFullAccessAdmin) {
          setCurrentPage('patient-portal'); // Full access admins can view patient/physician
        } else {
          setCurrentPage('sales-marketing'); // Other admins (incl. DarangT, ACG, BenM, SonnyA)
        }
      } else if (currentUser.role === 'sales') {
        setCurrentPage('sales-marketing'); // Dedicated sales user like KeenanW
      } else {
        setCurrentPage('patient-portal'); // Fallback for any unexpected role
      }
    }
  }, [currentUser, isFullAccessAdmin]); // Depend on currentUser and its full access status


  const renderContent = () => {
    switch (currentPage) {
      case 'patient-portal':
        return <PatientPortal />;
      case 'physician-provider':
        return <PhysicianProvider />;
      case 'sales-marketing':
        return <SalesMarketing />;
      case 'admin':
        return <AdminPage />;
      default:
        // This default should ideally be caught by useEffect, but as a safeguard
        return (
          <div className="p-8 bg-white rounded-lg shadow-md text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome!</h2>
            <p className="text-lg text-gray-700">Please select an option from the navigation.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg p-6 flex flex-col md:flex-row justify-between items-center rounded-b-xl">
        <h1 className="text-4xl font-extrabold text-white mb-4 md:mb-0">
          Healthcare Portal
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-white text-lg font-medium">
            Welcome, {currentUser?.username || currentUser?.lastName || currentUser?.email || 'Guest'}!
          </span>
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row p-6 space-y-6 lg:space-y-0 lg:space-x-6">
        <nav className="bg-white p-6 rounded-lg shadow-xl w-full lg:w-64 flex flex-col space-y-4">
          {/* Patient Portal button: Visible to actual patients and full access admins */}
          {(currentUser?.role === 'patient' || isFullAccessAdmin) && (
            <button
              onClick={() => setCurrentPage('patient-portal')}
              className={`px-4 py-3 text-left text-lg font-medium rounded-md transition-colors duration-200 ${
                currentPage === 'patient-portal' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Patient Portal
            </button>
          )}

          {/* Physician/Provider button: Visible to actual physicians and full access admins */}
          {(currentUser?.role === 'physician' || isFullAccessAdmin) && (
            <button
              onClick={() => setCurrentPage('physician-provider')}
              className={`px-4 py-3 text-left text-lg font-medium rounded-md transition-colors duration-200 ${
                currentPage === 'physician-provider' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Physician/Provider
            </button>
          )}

          {/* Sales & Marketing button: Visible to all admins and sales users */}
          {(currentUser?.role === 'admin' || currentUser?.role === 'sales') && (
            <button
              onClick={() => setCurrentPage('sales-marketing')}
              className={`px-4 py-3 text-left text-lg font-medium rounded-md transition-colors duration-200 ${
                currentPage === 'sales-marketing' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Sales & Marketing
            </button>
          )}

          {/* Admin button: Visible only to admin users */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setCurrentPage('admin')}
              className={`px-4 py-3 text-left text-lg font-medium rounded-md transition-colors duration-200 ${
                currentPage === 'admin' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Admin
            </button>
          )}
        </nav>

        <main className="flex-1 bg-white p-6 rounded-lg shadow-xl">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Main App component
export default function App() {
  return (
    <AuthProvider>
      <AuthContent />
    </AuthProvider>
  );
}

function AuthContent() {
  const { currentUser } = useAuth();

  return (
    <div className="App">
      {currentUser ? <Dashboard /> : <LoginPage />}
    </div>
  );
}
