import { useState, useEffect } from 'react';
import {
  getVaccinations,
  getMedications,
  getVetVisits,
  createVaccination,
  createMedication,
  createVetVisit,
  deleteVaccination,
  deleteMedication,
  deleteVetVisit,
} from '../services/api';

/**
 * Pet Profile Component
 * Displays health records including vaccinations, medications, and vet visits
 */
function PetProfile({ petId, petName }) {
  const [vaccinations, setVaccinations] = useState([]);
  const [medications, setMedications] = useState([]);
  const [vetVisits, setVetVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vaccinations');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchHealthRecords();
  }, [petId]);

  const fetchHealthRecords = async () => {
    try {
      setLoading(true);
      const [vaccRes, medRes, vetRes] = await Promise.all([
        getVaccinations(petId),
        getMedications(petId),
        getVetVisits(petId),
      ]);

      setVaccinations(vaccRes.data || []);
      setMedications(medRes.data || []);
      setVetVisits(vetRes.data || []);
    } catch (error) {
      console.error('Error fetching health records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVaccination = async (formData) => {
    try {
      await createVaccination({
        petId,
        vaccinationName: formData.name,
        vaccinationDate: formData.date,
        nextDueDate: formData.nextDue,
      });
      fetchHealthRecords();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding vaccination:', error);
    }
  };

  const handleDeleteVaccination = async (id) => {
    if (window.confirm('Are you sure you want to delete this vaccination record?')) {
      try {
        await deleteVaccination(id);
        fetchHealthRecords();
      } catch (error) {
        console.error('Error deleting vaccination:', error);
      }
    }
  };

  const handleAddMedication = async (formData) => {
    try {
      await createMedication({
        petId,
        medicationName: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
      fetchHealthRecords();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  };

  const handleDeleteMedication = async (id) => {
    if (window.confirm('Are you sure you want to delete this medication record?')) {
      try {
        await deleteMedication(id);
        fetchHealthRecords();
      } catch (error) {
        console.error('Error deleting medication:', error);
      }
    }
  };

  const handleAddVetVisit = async (formData) => {
    try {
      await createVetVisit({
        petId,
        visitDate: formData.date,
        vetName: formData.vetName,
        reason: formData.reason,
        diagnosis: formData.diagnosis,
        notes: formData.notes,
      });
      fetchHealthRecords();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding vet visit:', error);
    }
  };

  const handleDeleteVetVisit = async (id) => {
    if (window.confirm('Are you sure you want to delete this vet visit record?')) {
      try {
        await deleteVetVisit(id);
        fetchHealthRecords();
      } catch (error) {
        console.error('Error deleting vet visit:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {petName}'s Health Records
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Manage vaccinations, medications, and vet visits
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {[
            { id: 'vaccinations', label: 'Vaccinations', count: vaccinations.length },
            { id: 'medications', label: 'Medications', count: medications.length },
            { id: 'vet-visits', label: 'Vet Visits', count: vetVisits.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowAddForm(false);
              }}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Vaccinations Tab */}
        {activeTab === 'vaccinations' && (
          <VaccinationsTab
            vaccinations={vaccinations}
            formatDate={formatDate}
            onAdd={handleAddVaccination}
            onDelete={handleDeleteVaccination}
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
          />
        )}

        {/* Medications Tab */}
        {activeTab === 'medications' && (
          <MedicationsTab
            medications={medications}
            formatDate={formatDate}
            onAdd={handleAddMedication}
            onDelete={handleDeleteMedication}
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
          />
        )}

        {/* Vet Visits Tab */}
        {activeTab === 'vet-visits' && (
          <VetVisitsTab
            vetVisits={vetVisits}
            formatDate={formatDate}
            onAdd={handleAddVetVisit}
            onDelete={handleDeleteVetVisit}
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
          />
        )}
      </div>
    </div>
  );
}

// Vaccinations Tab Component
function VaccinationsTab({ vaccinations, formatDate, onAdd, onDelete, showAddForm, setShowAddForm }) {
  const [formData, setFormData] = useState({ name: '', date: '', nextDue: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: '', date: '', nextDue: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Vaccination Records</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium"
        >
          {showAddForm ? 'Cancel' : '+ Add Vaccination'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Vaccination Name (e.g., Rabies)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="date"
              placeholder="Next Due Date"
              value={formData.nextDue}
              onChange={(e) => setFormData({ ...formData, nextDue: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Save Vaccination
            </button>
          </div>
        </form>
      )}

      {vaccinations.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No vaccination records yet</p>
      ) : (
        <div className="space-y-3">
          {vaccinations.map((vac) => (
            <div
              key={vac.id}
              className={`border rounded-lg p-4 ${
                vac.is_overdue
                  ? 'border-red-300 bg-red-50'
                  : vac.is_reminder
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{vac.vaccination_name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Given: {formatDate(vac.vaccination_date)}
                  </p>
                  {vac.next_due_date && (
                    <p className="text-sm text-gray-600">
                      Next Due: {formatDate(vac.next_due_date)}
                    </p>
                  )}
                  {vac.is_reminder && !vac.is_overdue && (
                    <span className="inline-block mt-2 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-medium rounded">
                      Due Soon (within 7 days)
                    </span>
                  )}
                  {vac.is_overdue && (
                    <span className="inline-block mt-2 px-2 py-1 bg-red-200 text-red-800 text-xs font-medium rounded">
                      Overdue
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onDelete(vac.id)}
                  className="text-red-600 hover:text-red-800 text-sm ml-4"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Medications Tab Component
function MedicationsTab({ medications, formatDate, onAdd, onDelete, showAddForm, setShowAddForm }) {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: '', dosage: '', frequency: '', startDate: '', endDate: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Medication Records</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium"
        >
          {showAddForm ? 'Cancel' : '+ Add Medication'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Medication Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder="Dosage (e.g., 10mg)"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              required
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder="Frequency (e.g., Twice daily)"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              required
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="date"
              placeholder="End Date (optional)"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Save Medication
            </button>
          </div>
        </form>
      )}

      {medications.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No medication records yet</p>
      ) : (
        <div className="space-y-3">
          {medications.map((med) => (
            <div
              key={med.id}
              className={`border rounded-lg p-4 ${
                med.is_active ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{med.medication_name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {med.dosage} • {med.frequency}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDate(med.start_date)} - {formatDate(med.end_date)}
                  </p>
                  {med.is_active && (
                    <span className="inline-block mt-2 px-2 py-1 bg-green-200 text-green-800 text-xs font-medium rounded">
                      Active
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onDelete(med.id)}
                  className="text-red-600 hover:text-red-800 text-sm ml-4"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Vet Visits Tab Component
function VetVisitsTab({ vetVisits, formatDate, onAdd, onDelete, showAddForm, setShowAddForm }) {
  const [formData, setFormData] = useState({
    date: '',
    vetName: '',
    reason: '',
    diagnosis: '',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ date: '', vetName: '', reason: '', diagnosis: '', notes: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Vet Visit Records</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium"
        >
          {showAddForm ? 'Cancel' : '+ Add Vet Visit'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 gap-4">
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder="Vet Name (optional)"
              value={formData.vetName}
              onChange={(e) => setFormData({ ...formData, vetName: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder="Reason for Visit"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <textarea
              placeholder="Diagnosis (optional)"
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              rows={2}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <textarea
              placeholder="Notes (optional)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Save Vet Visit
            </button>
          </div>
        </form>
      )}

      {vetVisits.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No vet visit records yet</p>
      ) : (
        <div className="space-y-3">
          {vetVisits.map((visit) => (
            <div key={visit.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{formatDate(visit.visit_date)}</h4>
                    {visit.vet_name && (
                      <span className="text-sm text-gray-600">• Dr. {visit.vet_name}</span>
                    )}
                  </div>
                  {visit.reason && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Reason:</span> {visit.reason}
                    </p>
                  )}
                  {visit.diagnosis && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Diagnosis:</span> {visit.diagnosis}
                    </p>
                  )}
                  {visit.notes && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Notes:</span> {visit.notes}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onDelete(visit.id)}
                  className="text-red-600 hover:text-red-800 text-sm ml-4"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PetProfile;
