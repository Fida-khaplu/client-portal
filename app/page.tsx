'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import AddClientModal from "@/component/AddClientModal";
import Loading from "./loading";


type Client = {
  id: string;
  name: string;
  email: string;
  business_name: string;
  created_at: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
   const [loading, setLoading] = useState(true); 

  // const fetchClients = async () => {
  //   try {
  //     const res = await axios.get("/api/clients");
  //     setClients(res.data || []);
  //   } catch (err) {
  //     console.error("Failed to fetch clients:", err);
  //   }
  // };
  const fetchClients = async () => {
    try {
      setLoading(true);              
      const res = await axios.get("/api/clients");
      setClients(res.data || []);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    } finally {
      setLoading(false);        
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl text-black font-semibold mb-4">Client Portal</h1>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Client
          </button>
        </div>
        <div className="mt-8 w-full">
          {
          loading ? (
           <Loading/>
          ) :
          clients.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No clients found.</p>
          ) : (
            <div className="w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {/* Header */}
              <div className="grid grid-cols-3 bg-gray-400 text-white font-semibold py-3 px-4 text-sm uppercase tracking-wide">
                <p>Client Name</p>
                <p>Email</p>
                <p>Business Name</p>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-200 bg-white">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="grid grid-cols-3 items-center py-3 px-4 hover:bg-gray-50 transition"
                  >
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-gray-600">{client.email}</p>
                    <p className="text-gray-600">
                      {client.business_name || "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>



      {showModal && (
        <AddClientModal
          onClose={() => setShowModal(false)}
          onAdded={fetchClients}
        />
      )}
    </div>
  );
}
